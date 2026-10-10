const express = require("express");
const supabase = require("../lib/supabase");

const router = express.Router();

// ============================================================
// GET /loans — Ambil semua data peminjaman (dengan filter opsional)
// Query params: status, member_name, book_title
// ============================================================
router.get("/", async (req, res) => {
  try {
    let query = supabase.from("loans").select("*");

    // Filter berdasarkan status (contoh: ?status=Terlambat)
    if (req.query.status) {
      query = query.eq("status", req.query.status);
    }

    // Filter berdasarkan nama anggota
    if (req.query.member_name) {
      query = query.ilike("member_name", `%${req.query.member_name}%`);
    }

    // Filter berdasarkan judul buku
    if (req.query.book_title) {
      query = query.ilike("book_title", `%${req.query.book_title}%`);
    }

    // Urutkan berdasarkan tanggal peminjaman terbaru
    query = query.order("loan_date", { ascending: false });

    const { data, error } = await query;

    if (error) throw error;

    res.json({
      success: true,
      message: "Data peminjaman berhasil diambil",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data peminjaman",
      error: error.message,
    });
  }
});

// ============================================================
// GET /loans/:id — Ambil data peminjaman berdasarkan ID
// ============================================================
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("loans")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({
          success: false,
          message: `Peminjaman dengan ID ${id} tidak ditemukan`,
        });
      }
      throw error;
    }

    res.json({
      success: true,
      message: "Data peminjaman ditemukan",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data peminjaman",
      error: error.message,
    });
  }
});

// ============================================================
// POST /loans — Tambah data peminjaman baru
// ============================================================
router.post("/", async (req, res) => {
  try {
    const { member_name, book_title, loan_date, return_date, status } =
      req.body;

    // Validasi field wajib
    if (!member_name || !book_title || !loan_date) {
      return res.status(400).json({
        success: false,
        message:
          "Field member_name, book_title, dan loan_date wajib diisi",
      });
    }

    const newLoan = {
      member_name,
      book_title,
      loan_date,
      return_date: return_date || null,
      status: status || "Dipinjam",
    };

    const { data, error } = await supabase
      .from("loans")
      .insert([newLoan])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: "Data peminjaman berhasil ditambahkan",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal menambahkan data peminjaman",
      error: error.message,
    });
  }
});

// ============================================================
// PUT /loans/:id — Update data peminjaman
// ============================================================
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { member_name, book_title, loan_date, return_date, status } =
      req.body;

    // Pastikan minimal satu field dikirim untuk diupdate
    if (!member_name && !book_title && !loan_date && !return_date && !status) {
      return res.status(400).json({
        success: false,
        message: "Minimal satu field harus diisi untuk update",
      });
    }

    const updates = {};
    if (member_name) updates.member_name = member_name;
    if (book_title) updates.book_title = book_title;
    if (loan_date) updates.loan_date = loan_date;
    if (return_date !== undefined) updates.return_date = return_date;
    if (status) updates.status = status;

    const { data, error } = await supabase
      .from("loans")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({
          success: false,
          message: `Peminjaman dengan ID ${id} tidak ditemukan`,
        });
      }
      throw error;
    }

    res.json({
      success: true,
      message: "Data peminjaman berhasil diperbarui",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal memperbarui data peminjaman",
      error: error.message,
    });
  }
});

// ============================================================
// DELETE /loans/:id — Hapus data peminjaman
// ============================================================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Cek apakah data ada sebelum dihapus
    const { data: existing, error: findError } = await supabase
      .from("loans")
      .select("*")
      .eq("id", id)
      .single();

    if (findError) {
      if (findError.code === "PGRST116") {
        return res.status(404).json({
          success: false,
          message: `Peminjaman dengan ID ${id} tidak ditemukan`,
        });
      }
      throw findError;
    }

    const { error } = await supabase.from("loans").delete().eq("id", id);

    if (error) throw error;

    res.json({
      success: true,
      message: "Data peminjaman berhasil dihapus",
      data: existing,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal menghapus data peminjaman",
      error: error.message,
    });
  }
});

module.exports = router;
