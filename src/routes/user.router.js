const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { verifyToken } = require("../middlewares/auth");

router.get('/profile', verifyToken, userController.getProfile);
router.get("/", verifyToken, userController.index);
router.put("/:id", verifyToken, userController.update);
router.delete("/:id", verifyToken, userController.destroy);

module.exports = router;
