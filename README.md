# 📚 Book Loan API

REST API untuk manajemen **peminjaman buku perpustakaan** yang dibangun menggunakan **Node.js**, **Express.js**, dan **Supabase** sebagai database.

---

## 📖 Deskripsi Umum & Tujuan

API ini dirancang untuk mengelola data peminjaman buku oleh anggota perpustakaan. Fitur utama meliputi:

- **CRUD lengkap** — Create, Read, Update, Delete data peminjaman
- **Filter query** — Memfilter data berdasarkan `status`, `member_name`, atau `book_title`
- **Deployment serverless** — Di-deploy ke Vercel agar bisa diakses publik

---

## 🗄️ Struktur Data / Schema

### Tabel: `loans`

| Kolom         | Tipe           | Keterangan                                      |
| ------------- | -------------- | ----------------------------------------------- |
| `id`          | `BIGINT` (PK)  | Primary key, auto-increment                     |
| `member_name` | `TEXT`          | Nama anggota peminjam (**wajib**)                |
| `book_title`  | `TEXT`          | Judul buku yang dipinjam (**wajib**)             |
| `loan_date`   | `DATE`          | Tanggal peminjaman (**wajib**)                   |
| `return_date`  | `DATE`          | Tanggal pengembalian (opsional, bisa `null`)     |
| `status`      | `TEXT`          | Status peminjaman: `Dipinjam`, `Dikembalikan`, `Terlambat` |
| `created_at`  | `TIMESTAMPTZ`   | Timestamp record dibuat (otomatis)               |

---

## 🔗 Daftar Endpoint

| Method   | Endpoint       | Deskripsi                                    |
| -------- | -------------- | -------------------------------------------- |
| `GET`    | `/`            | Informasi API & daftar endpoint              |
| `GET`    | `/loans`       | Ambil semua data peminjaman (+ filter query) |
| `GET`    | `/loans/:id`   | Ambil data peminjaman berdasarkan ID         |
| `POST`   | `/loans`       | Tambah data peminjaman baru                  |
| `PUT`    | `/loans/:id`   | Update data peminjaman                       |
| `DELETE` | `/loans/:id`   | Hapus data peminjaman                        |

### Query Parameter Filter (GET /loans)

| Parameter     | Contoh                          | Keterangan                       |
| ------------- | ------------------------------- | -------------------------------- |
| `status`      | `?status=Terlambat`             | Filter berdasarkan status (exact match) |
| `member_name` | `?member_name=Andi`             | Filter berdasarkan nama anggota (partial match) |
| `book_title`  | `?book_title=Laskar`            | Filter berdasarkan judul buku (partial match) |

---

## 📋 Contoh Request & Response

### 1. GET /loans — Ambil Semua Peminjaman

**Request:**
```
GET /loans
```

**Response (200):**
```json
{
  "success": true,
  "message": "Data peminjaman berhasil diambil",
  "data": [
    {
      "id": 1,
      "member_name": "Andi Pratama",
      "book_title": "Laskar Pelangi",
      "loan_date": "2024-10-01",
      "return_date": "2024-10-15",
      "status": "Dikembalikan",
      "created_at": "2024-10-01T00:00:00.000Z"
    }
  ]
}
```

### 2. GET /loans?status=Terlambat — Filter Berdasarkan Status

**Request:**
```
GET /loans?status=Terlambat
```

**Response (200):**
```json
{
  "success": true,
  "message": "Data peminjaman berhasil diambil",
  "data": [
    {
      "id": 4,
      "member_name": "Dian Saputra",
      "book_title": "Atomic Habits",
      "loan_date": "2024-10-10",
      "return_date": null,
      "status": "Terlambat",
      "created_at": "2024-10-10T00:00:00.000Z"
    }
  ]
}
```

### 3. GET /loans/:id — Ambil Berdasarkan ID

**Request:**
```
GET /loans/1
```

**Response (200):**
```json
{
  "success": true,
  "message": "Data peminjaman ditemukan",
  "data": {
    "id": 1,
    "member_name": "Andi Pratama",
    "book_title": "Laskar Pelangi",
    "loan_date": "2024-10-01",
    "return_date": "2024-10-15",
    "status": "Dikembalikan",
    "created_at": "2024-10-01T00:00:00.000Z"
  }
}
```

**Response (404):**
```json
{
  "success": false,
  "message": "Peminjaman dengan ID 999 tidak ditemukan"
}
```

### 4. POST /loans — Tambah Peminjaman Baru

**Request:**
```
POST /loans
Content-Type: application/json

{
  "member_name": "Fajar Nugroho",
  "book_title": "Clean Code",
  "loan_date": "2024-10-15",
  "status": "Dipinjam"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Data peminjaman berhasil ditambahkan",
  "data": {
    "id": 6,
    "member_name": "Fajar Nugroho",
    "book_title": "Clean Code",
    "loan_date": "2024-10-15",
    "return_date": null,
    "status": "Dipinjam",
    "created_at": "2024-10-15T00:00:00.000Z"
  }
}
```

**Response (400) — Validasi gagal:**
```json
{
  "success": false,
  "message": "Field member_name, book_title, dan loan_date wajib diisi"
}
```

### 5. PUT /loans/:id — Update Peminjaman

**Request:**
```
PUT /loans/2
Content-Type: application/json

{
  "return_date": "2024-10-20",
  "status": "Dikembalikan"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Data peminjaman berhasil diperbarui",
  "data": {
    "id": 2,
    "member_name": "Budi Santoso",
    "book_title": "Bumi Manusia",
    "loan_date": "2024-10-05",
    "return_date": "2024-10-20",
    "status": "Dikembalikan",
    "created_at": "2024-10-05T00:00:00.000Z"
  }
}
```

### 6. DELETE /loans/:id — Hapus Peminjaman

**Request:**
```
DELETE /loans/3
```

**Response (200):**
```json
{
  "success": true,
  "message": "Data peminjaman berhasil dihapus",
  "data": {
    "id": 3,
    "member_name": "Citra Dewi",
    "book_title": "Filosofi Teras",
    "loan_date": "2024-09-20",
    "return_date": "2024-10-01",
    "status": "Dikembalikan",
    "created_at": "2024-09-20T00:00:00.000Z"
  }
}
```

---

## 🛠️ Panduan Instalasi & Cara Menjalankan Lokal

### Prasyarat

- [Node.js](https://nodejs.org/) v18 atau lebih baru
- Akun [Supabase](https://supabase.com/) (gratis)
- [Git](https://git-scm.com/)

### Langkah 1: Clone Repository

```bash
git clone https://github.com/USERNAME/book-loan-api.git
cd book-loan-api
```

### Langkah 2: Install Dependencies

```bash
npm install
```

### Langkah 3: Setup Database Supabase

1. Buka [Supabase Dashboard](https://supabase.com/dashboard)
2. Buat project baru (atau gunakan yang sudah ada)
3. Buka **SQL Editor**
4. Copy-paste isi file `supabase_migration.sql` ke SQL Editor
5. Klik **Run** untuk membuat tabel dan data sampel

### Langkah 4: Konfigurasi Environment Variables

```bash
# Salin template
cp .env.example .env
```

Edit file `.env` dan isi dengan kredensial dari Supabase Dashboard:
- **SUPABASE_URL** → Settings > API > Project URL
- **SUPABASE_KEY** → Settings > API > `anon` `public` key

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJI...
PORT=3000
```

### Langkah 5: Jalankan Server

```bash
npm run dev
```

Server akan berjalan di `http://localhost:3000`.

### Test dengan cURL

```bash
# Ambil semua peminjaman
curl http://localhost:3000/loans

# Filter berdasarkan status
curl http://localhost:3000/loans?status=Terlambat

# Tambah peminjaman baru
curl -X POST http://localhost:3000/loans \
  -H "Content-Type: application/json" \
  -d '{"member_name":"Test User","book_title":"Test Book","loan_date":"2024-10-15"}'
```

---

## 🚀 Deployment ke Vercel

### Langkah 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Langkah 2: Login & Deploy

```bash
vercel login
vercel --prod
```

### Langkah 3: Set Environment Variables di Vercel

Melalui Vercel Dashboard atau CLI:

```bash
vercel env add SUPABASE_URL
vercel env add SUPABASE_KEY
```

Atau via Vercel Dashboard: **Project Settings > Environment Variables**.

---

## 🌐 Link Deployment

| Item            | URL                                             |
| --------------- | ----------------------------------------------- |
| Base URL Vercel | `https://book-loan-api.vercel.app` *(ganti sesuai URL deployment Anda)* |
| Repository      | `https://github.com/USERNAME/book-loan-api` *(ganti sesuai repo Anda)* |

---

## 📁 Struktur Proyek

```
book-loan-api/
├── lib/
│   └── supabase.js          # Konfigurasi client Supabase
├── routes/
│   └── loans.js             # Route handler CRUD peminjaman
├── .env.example             # Template environment variables
├── .gitignore               # File yang diabaikan Git
├── index.js                 # Entry point Express app
├── package.json             # Dependencies & scripts
├── supabase_migration.sql   # SQL script untuk setup tabel
├── vercel.json              # Konfigurasi deployment Vercel
└── README.md                # Dokumentasi proyek
```

---

## 📄 Lisensi

ISC
