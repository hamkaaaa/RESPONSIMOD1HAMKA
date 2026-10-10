require("dotenv").config();

const express = require("express");
const cors = require("cors");
const loanRoutes = require("./routes/loans");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "📚 Book Loan API — Sistem Peminjaman Buku Perpustakaan",
    version: "1.0.0",
    endpoints: {
      "GET /loans": "Ambil semua data peminjaman (filter: ?status=, ?member_name=, ?book_title=)",
      "GET /loans/:id": "Ambil data peminjaman berdasarkan ID",
      "POST /loans": "Tambah data peminjaman baru",
      "PUT /loans/:id": "Update data peminjaman",
      "DELETE /loans/:id": "Hapus data peminjaman",
    },
  });
});

// Routes
app.use("/loans", loanRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint tidak ditemukan",
  });
});

// Jalankan server hanya saat bukan di Vercel (serverless)
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
  });
}

// Export untuk Vercel serverless
module.exports = app;
