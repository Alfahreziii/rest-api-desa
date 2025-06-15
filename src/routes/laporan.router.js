const express = require("express");
const router = express.Router();
const { createMonthlyLaporan } = require("../controllers/laporan.controller");
const laporanController = require('../controllers/laporan.controller');

// Route untuk generate laporan secara manual
router.get('/', laporanController.getAllLaporan);
router.post("/generate", createMonthlyLaporan);

module.exports = router;
