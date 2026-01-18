# Ringkasan Pekerjaan — Wedding Marketplace

Tujuan: file ini dibuat untuk memberi konteks cepat ke AI/kolaborator baru tentang apa yang sudah dikerjakan.

- File tambahan yang saya buat: `.github/copilot-instructions.md` (panduan agen AI singkat).
- File inti yang telah diperiksa dan menjadi konteks:
  - `package.json` — skrip `dev`, `build`, `start`, `lint`.
  - `README.md` — bootstrap Next.js default.
  - `next.config.ts`, `tsconfig.json` — konfigurasi Next/TS.
  - `middleware.ts` — middleware global untuk sinkronisasi cookie Supabase dan refresh session.
  - `lib/supabase/client.ts`, `lib/supabase/server.ts`, `lib/supabase/middleware.ts` — pola penggunaan Supabase (client vs server) dan helper `requireAuth()` / `requireAdmin()`.
  - `components/providers/auth-provider.tsx` — `"use client"` component yang meng-subscribe auth state dan meng-handle signOut.
  - `app/page.tsx` — contoh penggunaan `components/ui/*`, Tailwind utilities, dan pola layout.

Catatan singkat:
- Arsitektur menggunakan Next App Router (server components default). Client-only code harus memakai `"use client"`.
- Auth memakai Supabase v2; ada pola server/client yang harus konsisten (lihat `lib/supabase/*` dan `middleware.ts`).

Jika perlu, saya bisa memperluas ringkasan ini menjadi changelog per-commit atau buat checklist PR.
