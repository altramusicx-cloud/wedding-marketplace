# Ringkasan Auth & Supabase

Tujuan: menjelaskan pola authentication dan bagaimana Supabase dipakai di project.

1) Klien vs Server
- `lib/supabase/client.ts`: buat instance Supabase untuk kode yang berjalan di browser. Dipakai hanya dalam komponen dengan `"use client"` (contoh: `components/providers/auth-provider.tsx`).
- `lib/supabase/server.ts`: buat server client yang membaca/menulis cookie dari `cookies()` (Next server components). Gunakan untuk fetch data di server components dan helper auth.

2) Middleware & session
- `middleware.ts` menjalankan `createServerClient` untuk menyinkronkan cookie request/response dan memanggil `supabase.auth.getUser()` untuk refresh session.
- Jika mengubah alur auth, update `middleware.ts` dan `lib/supabase/server.ts` agar cookie handling konsisten.

3) Helper auth
- `lib/supabase/middleware.ts` menyediakan:
  - `requireAuth()` — redirect ke `/login` jika tidak ada user.
  - `requireAdmin()` — contoh role-check sederhana (mencari row `profiles` dan cek email `admin@weddingmarket.com`).

4) Client subscription
- `components/providers/auth-provider.tsx`:
  - Memakai `createClient()` (browser) untuk `onAuthStateChange` subscription.
  - Mengambil initial session via `supabase.auth.getSession()`.
  - Pada `SIGNED_IN` memanggil `router.refresh()`.

Env penting:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
