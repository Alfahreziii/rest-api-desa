const { v4: uuidv4 } = require("uuid");
const Iuran = require("../models/iuran");
const Pembayaran = require("../models/pembayaran");
const User = require("../models/user"); // pastikan ada model ini

/**
 * GET /aduan
 */
exports.index = async (req, res) => {
  try {
    const pembayarans = await Pembayaran.query().withGraphFetched('[user, iuran]');

    const formatted = pembayarans.map(p => ({
      id: p.id,
      order_id: p.order_id,
      status: p.status,
      paid_at: p.paid_at,
      nama_user: p.user?.name || "Tidak diketahui",
      user_id: p.user?.id || "Tidak diketahui",
      email_user: p.user?.email || "-",
      bulan_iuran: p.iuran?.bulan || "-",
      iuran_id: p.iuran?.id || "-",
      harga_iuran: p.iuran?.harga || 0,
    }));

    return res.send({
      message: "Success",
      data: formatted,
    });
  } catch (err) {
    return res.status(500).send({
      message: "Error retrieving Pembayaran",
      error: err.message,
    });
  }
};

exports.getMyPayments = async (req, res) => {
  const userId = req.user.id; // dari token

  try {
    const pembayarans = await Pembayaran.query()
      .where('user_id', userId)
      .withGraphFetched('[user, iuran]')
      .orderBy('paid_at', 'desc');

    const formatted = pembayarans.map(p => ({
      id: p.id,
      order_id: p.order_id,
      status: p.status,
      paid_at: p.paid_at,
      nama_user: p.user?.name || "Tidak diketahui",
      user_id: p.user?.id || "Tidak diketahui",
      email_user: p.user?.email || "-",
      bulan_iuran: p.iuran?.bulan || "-",
      iuran_id: p.iuran?.id || "-",
      harga_iuran: p.iuran?.harga || 0,
    }));

    return res.json({
      message: "Success",
      data: formatted,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Gagal mengambil data pembayaran Anda",
      error: err.message,
    });
  }
};




exports.createPayment = async (req, res) => {
  const { user_id, iuran_id, status, paid_at } = req.body;

  try {
    const iuran = await Iuran.query().findById(iuran_id);
    if (!iuran) return res.status(404).json({ error: "Iuran tidak ditemukan" });

    const user = await User.query().findById(user_id);
    if (!user) return res.status(404).json({ error: "User tidak ditemukan" });

    // ✅ Cek apakah kombinasi user_id dan iuran_id sudah ada
    const existing = await Pembayaran.query().findOne({ user_id, iuran_id });
    if (existing) {
      return res.status(400).json({
        error: "User sudah melakukan pembayaran untuk iuran ini",
      });
    }

    const orderId = `iuran-${uuidv4()}`;
    const formattedPaidAt = paid_at || new Date().toISOString().slice(0, 19).replace("T", " ");

    const pembayaran = await Pembayaran.query().insert({
      user_id,
      iuran_id,
      order_id: orderId,
      status: status || "manual",
      paid_at: formattedPaidAt,
    });

    res.status(201).json({
      message: "Pembayaran manual berhasil ditambahkan",
      data: pembayaran,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal menambahkan pembayaran manual" });
  }
};


/**
 * DELETE /pembayaran/:id
 */
  exports.destroy = async (req, res) => {
  const { id } = req.params;

  try {
    const existing = await Pembayaran.query().findById(id);
    if (!existing) {
      return res.status(404).json({ message: "Pembayaran not found" });
    }

    await Pembayaran.query().deleteById(id);
    return res.json({ message: "Pembayaran deleted successfully" });

  } catch (err) {
    return res.status(500).json({
      message: "Error deleting Pembayaran",
      error: err.message,
    });
  }
};