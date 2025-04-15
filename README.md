# Dokumentasi Website

Repositori ini berisi kode untuk aplikasi web dengan komponen backend dan frontend yang terpisah.

## Memulai

Ikuti langkah-langkah berikut untuk menyiapkan dan menjalankan aplikasi secara lokal:

### Pengaturan Backend

1. Masuk ke folder backend:
   ```
   cd backend
   ```

2. Instal dependensi:
   ```
   npm install
   ```

3. Generate Prisma client:
   ```
   npx prisma generate
   ```

4. Jalankan server pengembangan:
   ```
   npm run dev
   ```

### Pengaturan Frontend

Frontend terdiri dari file HTML yang terletak di folder `views`. Untuk menjalankannya:

1. Buka file HTML menggunakan Live Server.
   - Jika Anda menggunakan Visual Studio Code, Anda bisa menginstal ekstensi "Live Server"
   - Klik kanan pada file HTML di folder `views` dan pilih "Open with Live Server"

## Struktur Proyek

- `backend/`: Berisi kode sisi server dan endpoint API
- `views/`: Berisi file HTML untuk antarmuka frontend

## Persyaratan

- Node.js dan npm
- Editor kode (Visual Studio Code direkomendasikan dengan ekstensi Live Server)
