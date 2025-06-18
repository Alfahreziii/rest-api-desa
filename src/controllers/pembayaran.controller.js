const midtrans = require("../config/midtransConfig");
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
      snap_token: p.snap_token,
      nama_user: p.user?.name || "Tidak diketahui",
      email_user: p.user?.email || "-",
      bulan_iuran: p.iuran?.bulan || "-",
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



exports.createPayment = async (req, res) => {
  const { user_id, iuran_id } = req.body;

  try {
    const iuran = await Iuran.query().findById(iuran_id);
    if (!iuran) return res.status(404).json({ error: "Iuran tidak ditemukan" });

    const user = await User.query().findById(user_id);
    if (!user) return res.status(404).json({ error: "User tidak ditemukan" });

    const orderId = `iuran-${uuidv4()}`;
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: iuran.harga,
      },
      customer_details: {
        first_name: user.name,
        email: user.email,
      },
      item_details: [
        {
          id: `${iuran.id}`,
          name: `Iuran Bulan ${iuran.bulan}`,
          quantity: 1,
          price: iuran.harga,
        },
      ],
    };

    const snapResponse = await midtrans.createTransaction(parameter);

    await Pembayaran.query().insert({
      user_id,
      iuran_id,
      order_id: orderId,
      snap_token: snapResponse.token,
      status: "pending",
    });

    res.json({ snapToken: snapResponse.token, orderId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal membuat transaksi Midtrans" });
  }
};

exports.handleNotification = async (req, res) => {
  try {
    const { order_id, transaction_status } = req.body;

    const pembayaran = await Pembayaran.query().findOne({ order_id });
    if (!pembayaran) return res.status(404).json({ error: "Pembayaran tidak ditemukan" });

    await Pembayaran.query()
      .patch({
        status: transaction_status,
        paid_at: transaction_status === "settlement" ? new Date().toISOString() : null,
      })
      .where({ order_id });

    res.status(200).json({ message: "Notifikasi berhasil diproses" });
  } catch (err) {
    console.error("Gagal proses notifikasi:", err);
    res.status(500).json({ error: "Gagal proses notifikasi" });
  }
};
