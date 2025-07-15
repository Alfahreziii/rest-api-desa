const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { verifyToken } = require("../middlewares/auth");
const authorizeRole = require("../middlewares/authorizeRole");``

router.get('/profile', verifyToken, userController.getProfile);
router.get("/", verifyToken, authorizeRole("admin"), userController.index);
router.put("/:id", verifyToken, userController.update);
router.delete("/:id", verifyToken, authorizeRole("admin"), userController.destroy);

module.exports = router;
