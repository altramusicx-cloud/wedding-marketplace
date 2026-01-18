# Copilot instructions — Wedding Marketplace

This file gives concise, actionable guidance for AI coding agents working in this repository.

Key facts
- Tech stack: Next.js (App Router, Next 16), React 19, TypeScript (strict), Tailwind CSS, Supabase (v2) for auth and DB.
- Entry scripts: use `npm run dev`, `npm run build`, `npm start`, `npm run lint` (see `package.json`).

Architecture & important patterns
- App router: UI lives under `app/` (server components by default). Edit `app/page.tsx` for the home page.
- Client vs Server: server components can import `lib/supabase/server.ts` (uses `next/headers` cookies). Client components must include `"use client"` (see `components/providers/auth-provider.tsx`).
- Auth & sessions: Supabase is used for authentication. Use `lib/supabase/client.ts` in client components and `lib/supabase/server.ts` in server components and middleware. Middleware refreshes session in `middleware.ts` and `lib/supabase/middleware.ts` exposes `requireAuth()`/`requireAdmin()` helpers.
- Cookies: server code uses Next's `cookies()` store; middleware mirrors cookie propagation (see `middleware.ts`). When changing auth flows, update both `lib/supabase/*` and `middleware.ts` to keep behavior consistent.
- UI components: primitives live in `components/ui/` (button, card, input, etc.). Layout pieces are in `components/layout/` (header, footer). Follow existing prop patterns and className merging conventions.

Conventions & patterns to follow
- Prefer server components for data fetching where possible and return plain JSX. Use `lib/supabase/server.ts` to get a server-side supabase client and preserve cookie handling.
- Use `createClient()` from `lib/supabase/client.ts` only inside `"use client"` components or hooks (e.g., `AuthProvider`).
- Authorization helpers: call `requireAuth()` or `requireAdmin()` in server components for route-level guards (examples in `lib/supabase/middleware.ts`).
- Routing: use the Next App Router conventions (`app/(auth)/login`, `app/register`, etc.). When adding pages, mirror directory structure under `app/`.
- Styling: utility-first Tailwind classes are used widely; shared container size utility is `container-custom` (used in `app/page.tsx`).

Env & secrets
- Required env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Add other server-side secrets to your environment (e.g., in `.env.local`) when needed.

Developer workflows & commands
- Start dev server: `npm run dev` (runs `next dev`).
- Build for production: `npm run build` then `npm start`.
- Lint: `npm run lint` (eslint configured via `eslint-config-next`).
- No test suite detected: add tests under `__tests__` or integrate your preferred runner if required.

When editing or adding features — checklist for AI agents
- If you fetch data on the server: use `lib/supabase/server.ts`, and ensure cookie handling and `requireAuth()` usage when needed.
- If you interact with Supabase from the browser: use `lib/supabase/client.ts` inside `"use client"` components only.
- For auth flows, update both client (subscriptions in `AuthProvider`) and server middleware (`middleware.ts`) to keep session refresh consistent.
- Keep TypeScript strictness intact — update types in `types/` when adding domain types.
- Follow existing UI component props and avoid changing public APIs of `components/ui/*` unless also updating all consumers.

Examples (where to look)
- Home and UI usage: `app/page.tsx` — shows pattern for `components/ui/*` and Tailwind utilities.
- Client auth: `components/providers/auth-provider.tsx` — subscribes to Supabase auth state and uses `createClient()`.
- Server auth helpers: `lib/supabase/middleware.ts` — `requireAuth()` / `requireAdmin()` examples.
- Middleware cookie sync: `middleware.ts` — how server cookies are passed through Supabase.

If anything in this document is unclear or you want expanded examples (e.g., how to add a protected API route or how to integrate a new Supabase table), tell me which area and I'll add a targeted snippet.
