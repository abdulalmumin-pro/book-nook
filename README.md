# 📚 BookNook

**BookNook** is an online book library where readers can browse books, add their own, and borrow titles with a single click. Enjoy a book at your own pace and return it when you're done. No queues, no fuss.

## 🔗 Live Site

**Client:** https://book-nook-frontend-seven.vercel.app

> Replace the URL above with your deployed client-side link.

## ✨ Key Features

- **Borrowing made simple:** reserve a book in one click and track it from the My Borrows page.
- **Browse all books:** explore the full library from the All Books page, starting from the Browse Books button on the home page.
- **Add your own books:** logged-in users can contribute new books to the library through the Add Book page.
- **Personal dashboards:** My Books shows the books you have added, and My Borrows shows the books you have borrowed.
- **Secure authentication:** email and password sign-up and sign-in powered by Better Auth, with session cookies and JWT support.
- **Protected routes:** pages such as Add Book, My Books, My Borrows and book details are only available to signed-in users, and everyone else is redirected to the sign-in page.
- **Responsive design:** a clean navbar, an image slider on the home page, and a layout that works on mobile, tablet and desktop.

## 🛠️ Tech Stack

| Area | Technology |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Authentication | Better Auth (session cookie cache and JWT plugin) |
| Database | MongoDB |
| UI | Base UI components with Tailwind CSS |

## 🚀 Getting Started

1. Clone the repository:

   ```bash
   git clone <your-repository-url>
   cd book-nook
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   BETTER_AUTH_SECRET=your_secret_key
   BETTER_AUTH_URL=http://localhost:3000
   NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📄 Pages

| Route | Description | Access |
|---|---|---|
| `/` | Home with hero slider | Public |
| `/books` | All Books | Public |
| `/add-books` | Add a new book | Signed-in users |
| `/my-books` | Books you added | Signed-in users |
| `/my-borrows` | Books you borrowed | Signed-in users |
| `/books/[id]` | Book details | Signed-in users |
| `/sign-in` | Sign in | Public |

## 📝 License

This project was built as an assignment (Assignment 8: Online Book Library).