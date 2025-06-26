const express = require("express");
const { index, update, store, destroy } = require("../controllers/pengurusjabatan.controller");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth");

router.get("/", verifyToken, index);
router.post("/", verifyToken, store);
router.put("/:id", verifyToken, update);
router.delete('/:id', verifyToken, destroy);

module.exports = router;
