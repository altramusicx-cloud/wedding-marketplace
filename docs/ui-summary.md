# Ringkasan UI & Komponen

Tujuan: cepat memahami struktur UI dan pola styling.

- Lokasi komponen UI primitives: `components/ui/` (mis. `button.tsx`, `card.tsx`, `input.tsx`, `textarea.tsx`).
- Layout: `components/layout/` memiliki `header.tsx` dan `footer.tsx`.
- Hal-hal penting:
  - Tailwind CSS digunakan secara luas; utilitas custom seperti `container-custom` dipakai di `app/page.tsx`.
  - Ikon menggunakan `lucide-react`.
  - Komponen client-only harus menandai `"use client"` saat menggunakan browser APIs atau Supabase client.

Contoh pola: di `app/page.tsx` elemen UI menyusun `Card` dan `Button` dengan Tailwind kelas langsung — ikuti pola ini ketika menambahkan komponen baru.
