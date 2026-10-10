-- ==========================================================
-- SQL Script untuk membuat tabel "loans" di Supabase
-- Jalankan di Supabase SQL Editor (Dashboard > SQL Editor)
-- ==========================================================

-- Buat tabel loans
CREATE TABLE IF NOT EXISTS loans (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  member_name TEXT NOT NULL,
  book_title  TEXT NOT NULL,
  loan_date   DATE NOT NULL,
  return_date DATE,
  status      TEXT NOT NULL DEFAULT 'Dipinjam',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Aktifkan Row Level Security (RLS)
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;

-- Policy: izinkan semua operasi untuk anon key (untuk keperluan demo)
CREATE POLICY "Allow all operations for anon"
  ON loans
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Insert data sampel
INSERT INTO loans (member_name, book_title, loan_date, return_date, status)
VALUES
  ('Andi Pratama',  'Laskar Pelangi',             '2024-10-01', '2024-10-15', 'Dikembalikan'),
  ('Budi Santoso',  'Bumi Manusia',               '2024-10-05', NULL,         'Dipinjam'),
  ('Citra Dewi',    'Filosofi Teras',             '2024-09-20', '2024-10-01', 'Dikembalikan'),
  ('Dian Saputra',  'Atomic Habits',              '2024-10-10', NULL,         'Terlambat'),
  ('Eka Rahma',     'Sapiens: A Brief History',   '2024-10-12', NULL,         'Dipinjam');
