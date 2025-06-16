const express = require("express");
const { index, update, store, destroy, count } = require("../controllers/penduduk.controller");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth");

router.get("/", verifyToken, index);
router.post("/", verifyToken, store);
router.put("/:id", verifyToken, update);
router.delete('/:id', verifyToken, destroy);

router.get("/count", verifyToken, count);

module.exports = router;
