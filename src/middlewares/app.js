const baseCors = require("cors");

const whitelistOrigins = ["http://localhost:5173"];
const cors = baseCors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like direct link from browser/email)
    if (!origin || whitelistOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"), false);
  },
  credentials: true,
});


module.exports = { cors };
