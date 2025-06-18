const { Model } = require("objection");

class Pembayaran extends Model {
  static get tableName() {
    return "pembayarans";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["user_id", "iuran_id", "order_id", "snap_token"],
      properties: {
        id: { type: "integer" },
        user_id: { type: "integer" },
        iuran_id: { type: "integer" },
        order_id: { type: "string" },
        snap_token: { type: "string" },
        status: { type: "string" },
        paid_at: { type: "string", format: "date-time" },
      },
    };
  }
}

module.exports = Pembayaran;
