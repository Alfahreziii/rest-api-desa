const express = require("express");
const { index, update, store, destroy, getIuranWithStatus } = require("../controllers/iuran.controller");
const router = express.Router();
const authorizeRole = require("../middlewares/authorizeRole");
const { verifyToken } = require("../middlewares/auth");

router.get("/", verifyToken, index);
router.get("/status", verifyToken, getIuranWithStatus);
router.post("/", verifyToken, authorizeRole("admin"), store);
router.put("/:id", verifyToken, authorizeRole("admin"), update);
router.delete('/:id', verifyToken, authorizeRole("admin"), destroy);

module.exports = router;
