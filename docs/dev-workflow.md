# Ringkasan Developer Workflow

Tujuan: daftar perintah dan langkah debug yang relevan untuk kontributor baru atau agen AI.

Perintah utama (lihat `package.json`):

```bash
npm run dev    # next dev
npm run build  # next build
npm start      # next start (prod)
npm run lint   # eslint
```

Tips lingkungan dan debug:
- Pastikan `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` tersedia saat menjalankan development.
- Middleware melakukan session refresh; jika mengalami masalah auth di dev, periksa cookie yang dikirim dan console network requests di browser.
- Tidak ada test suite terdeteksi — tambahkan `__tests__` jika perlu.

Linting:
- `eslint` dipasang (config `eslint-config-next`). Jalankan `npm run lint` untuk periksa masalah TS/JS.

Build & deploy:
- Standard Next.js build flow; project siap dideploy ke Vercel atau host Next.js yang mendukung App Router.
