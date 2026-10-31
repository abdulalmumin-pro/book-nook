<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project

"book-nook" — an online book library. Currently a fresh `create-next-app` scaffold: the starter page in `src/app/page.tsx` has not been replaced yet. Single package (npm, `package-lock.json`); not a monorepo.

- Entrypoint: App Router under `src/app/` (`layout.tsx`, `page.tsx`). All app code lives in `src/`.
- Stack: Next.js **16.4.3**, React 19.3, TypeScript strict, Tailwind CSS **v4**, shadcn components.

## Commands

- Dev: `npm run dev` (Turbopack)
- Lint: `npm run lint` (eslint only — there is no test or typecheck script)
- Typecheck: `npx tsc --noEmit` (or rely on `npm run build`, which typechecks)

## Framework quirks that will bite you

- `next.config.ts` enables `cacheComponents: true` and `partialPrefetching: true`. These change data-fetching/caching conventions (no `export const dynamic`, "use cache" directives, etc.). Read `node_modules/next/dist/docs/01-app/01-getting-started/08-caching.md` and the `*-with-cache-components` guides before writing any data fetching or route segment config.
- `reactCompiler: true` (React Compiler) is enabled — do not add manual `memo`/`useMemo`/`useCallback` optimization.
- Tailwind v4 with **no `tailwind.config`**: theme is CSS-first in `src/app/globals.css` (`@theme inline` + shadcn CSS variables). The CSS pipeline is wired via the `@tailwindcss/turbopack` loader rule in `next.config.ts`; don't re-add a Tailwind config file.
- shadcn style is `base-nova`, which is built on **`@base-ui/react`, not Radix**. `src/components/ui/` already contains ~60 generated components; prefer those and add more with `npx shadcn add <component>` (config in `components.json`) rather than hand-writing primitives.
- Path alias `@/*` → `src/*` (see `tsconfig.json` and `components.json`).

## Keeping the tree clean

Do not delete or edit the `<!-- BEGIN/END:nextjs-agent-rules -->` block above: `next dev` regenerates it, so removing it only produces churn. Commit it as-is.
