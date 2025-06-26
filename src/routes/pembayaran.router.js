const express = require("express");
const router = express.Router();
const pembayaranController = require("../controllers/pembayaran.controller");
const { verifyToken } = require("../middlewares/auth");

router.get("/", verifyToken, pembayaranController.index);
router.post("/", verifyToken, pembayaranController.createPayment);
router.delete('/:id', verifyToken, pembayaranController.destroy);

module.exports = router;
