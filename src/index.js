const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const express = require("express");
const { Model } = require("objection");
const Knex = require("knex");
const fs = require("fs");

const knexConfig = require("../knexfile"); // Pastikan file ini ada
const knex = Knex(knexConfig.development); // Gunakan environment yang sesuai
const { verifyToken } = require("./middlewares/auth");

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

const PORT = process.env.SERVER_PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
