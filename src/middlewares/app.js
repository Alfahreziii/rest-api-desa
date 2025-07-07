const baseCors = require("cors");
require("dotenv").config();

const whitelistOrigins = [
  process.env.CLIENT_URL || "http://localhost:5175"
];

const cors = baseCors({
  origin: function (origin, callback) {
    // Allow requests with no origin (misal: curl, postman, atau email link)
    if (!origin || whitelistOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"), false);
  },
  credentials: true,
});

module.exports = { cors };
