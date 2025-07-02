const express = require("express");
const router = express.Router();
const pembayaranController = require("../controllers/pembayaran.controller");
const authorizeRole = require("../middlewares/authorizeRole");
const { verifyToken } = require("../middlewares/auth");

router.get("/", verifyToken, pembayaranController.index);
router.get("/me", verifyToken, pembayaranController.getMyPayments);
router.post("/", verifyToken,  authorizeRole("admin"), pembayaranController.createPayment);
router.delete('/:id', verifyToken,  authorizeRole("admin"), pembayaranController.destroy);

module.exports = router;
