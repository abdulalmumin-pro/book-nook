import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from './lib/auth'

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  })

  const user = session?.user
  console.log('user:', user)

  if (!user) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/add-books',
    '/my-books',
    '/my-borrows',
    '/books/:path*', // :path এর বদলে :path*
  ],
}