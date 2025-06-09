const { isEmail, isStrongPassword } = require("validator");
const UserModel = require("../models/user");

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const validateRegister = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).send({
      message: "Bad request: Semua field harus diisi",
      data: null,
    });
  }

  if (!isEmail(email)) {
    return res.status(400).send({
      message: "Invalid email",
      data: null,
    });
  }

  if (
    !isStrongPassword(password, {
      minLength: 8,
      minLowercase: 0,
      minUppercase: 0,
      minNumbers: 0,
      minSymbols: 0,
    })
  ) {
    return res.status(400).send({
      message: "Password is too weak",
      data: null,
    });
  }

  // Perbaikan di sini
  const emailCheck = await UserModel.query().findOne({ email });
  if (emailCheck) {
    return res.status(400).send({
      message: "Email already registered",
      data: null,
    });
  }

  next();
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({
      message: "Bad request",
      data: null,
    });
  }

  if (!isEmail(email)) {
    return res.status(400).send({
      message: "Invalid email",
      data: null,
    });
  }

  next();
};

module.exports = { validateRegister, validateLogin };
