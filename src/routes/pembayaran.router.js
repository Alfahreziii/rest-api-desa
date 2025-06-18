const express = require("express");
const router = express.Router();
const pembayaranController = require("../controllers/pembayaran.controller");

router.post("/create", pembayaranController.createPayment);
router.post("/midtrans-notif", pembayaranController.handleNotification);

module.exports = router;
