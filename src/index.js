const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const express = require("express");
const { Model } = require("objection");
const Knex = require("knex");

const knexConfig = require("../knexfile"); // Pastikan file ini ada
const knex = Knex(knexConfig.development); // Gunakan environment yang sesuai

// Bind all Models to knex instance
Model.knex(knex);

const { cors } = require("./middlewares/app");
const authRouter = require("./routes/auth.router");
const userRouter = require("./routes/user.router");
const beritaRouter = require("./routes/berita.router");
const aduanRouter = require("./routes/aduan.router");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors);

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/berita", beritaRouter);
app.use("/api/aduan", aduanRouter);

const PORT = process.env.SERVER_PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
