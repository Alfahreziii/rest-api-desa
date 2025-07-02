const express = require("express");
const { index, update, store, destroy } = require("../controllers/surat.controller");
const router = express.Router();
const authorizeRole = require("../middlewares/authorizeRole");
const { verifyToken } = require("../middlewares/auth");

router.get("/", verifyToken, index);
router.post("/", verifyToken, store);
router.put("/:id", verifyToken, authorizeRole("admin"), update);
router.delete('/:id', verifyToken, authorizeRole("admin"), destroy);

module.exports = router;
