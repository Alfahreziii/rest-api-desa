const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const express = require("express");
const { Model } = require("objection");
const Knex = require("knex");
const fs = require("fs");
const dayjs = require('dayjs');

const knexConfig = require("../knexfile"); // Pastikan file ini ada
const knex = Knex(knexConfig.development); // Gunakan environment yang sesuai
const { verifyToken } = require("./middlewares/auth");
const cron = require('node-cron');
const { createMonthlyLaporan } = require('./controllers/laporan.controller');

// Bind all Models to knex instance
Model.knex(knex);

const { cors } = require("./middlewares/app");
const authRouter = require("./routes/auth.router");
const userRouter = require("./routes/user.router");
const beritaRouter = require("./routes/berita.router");
const aduanRouter = require("./routes/aduan.router");
const pengajianRouter = require("./routes/pengajian.router");
const kerjabaktiRouter = require("./routes/kerjabakti.router");
const tahlilRouter = require("./routes/tahlil.router");
const rapatRouter = require("./routes/rapat.router");
const suratRouter = require("./routes/surat.router");
const jenissuratRouter = require("./routes/jenissurat.router");
const pendudukRouter = require("./routes/penduduk.router");
const laporanRouter = require("./routes/laporan.router");
const laporanmanualRouter = require("./routes/laporanmanual.router");
const pengurusRouter = require("./routes/pengurus.router");
const pembayaranRoutes = require("./routes/pembayaran.router");
const iuranRoutes = require("./routes/iuran.router");
const jabatanRoutes = require("./routes/jabatan.router");
const geografisRoutes = require("./routes/geografis.router");
const tokoRoutes = require("./routes/toko.router");
const productRoutes = require("./routes/product.router");

const app = express();

app.get("/file/:hash", (req, res) => {
  const fileName = req.params.hash;
  const filePath = path.join(__dirname, "../hidden_folder_xyz", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "File not found" });
  }

  // 🟡 Tambahkan header CORS di sini
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  res.sendFile(filePath);
});



app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors);

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/berita", beritaRouter);
app.use("/api/aduan", aduanRouter);
app.use("/api/pengajian", pengajianRouter);
app.use("/api/kerjabakti", kerjabaktiRouter);
app.use("/api/tahlil", tahlilRouter);
app.use("/api/rapat", rapatRouter);
app.use("/api/surat", suratRouter);
app.use("/api/jenissurat", jenissuratRouter);
app.use("/api/penduduk", pendudukRouter);
app.use('/api/laporan', laporanRouter);
app.use('/api/laporanmanual', laporanmanualRouter);
app.use('/api/pengurus', pengurusRouter);
app.use("/api/pembayaran", pembayaranRoutes);
app.use("/api/iuran", iuranRoutes);
app.use("/api/jabatan", jabatanRoutes);
app.use("/api/geografis", geografisRoutes);
app.use("/api/toko", tokoRoutes);
app.use("/api/product", productRoutes);

cron.schedule('59 23 * * *', async () => {
  console.log(`[Cron] Cek akhir bulan: ${dayjs().format('YYYY-MM-DD HH:mm')}`);
  
  const today = dayjs();
  const isLastDay = today.date() === today.endOf('month').date();

  if (isLastDay) {
    console.log("🔄 Akhir bulan: simpan laporan...");
    await createMonthlyLaporan();
  } else {
    console.log("⏭️ Bukan akhir bulan, lewati.");
  }
});


// // Ubah cron ke tiap menit:
// cron.schedule('* * * * *', async () => {
//   const today = dayjs();
//   const isLastDay = true; // paksa true untuk testing

//   if (isLastDay) {
//     console.log("🔄 Test simpan laporan tiap menit...");
//     await createMonthlyLaporan();
//   }
// });


const PORT = process.env.SERVER_PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
