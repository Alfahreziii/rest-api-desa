const express = require("express");
const router = express.Router();
const pembayaranController = require("../controllers/pembayaran.controller");
const { verifyToken } = require("../middlewares/auth");

router.get("/", verifyToken, pembayaranController.index);
router.post("/create", verifyToken, pembayaranController.createPayment);
router.post("/midtrans-notif", verifyToken, pembayaranController.handleNotification);

module.exports = router;
