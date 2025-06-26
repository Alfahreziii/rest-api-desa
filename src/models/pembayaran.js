const { Model } = require("objection");
const User = require("./user");
const Iuran = require("./iuran");

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
      required: ["user_id", "iuran_id", "order_id"],
      properties: {
        id: { type: "integer" },
        user_id: { type: "integer" },
        iuran_id: { type: "integer" },
        order_id: { type: "string" },
        status: { type: "string" },
        paid_at: { type: "string", format: "date-time" },
      },
    };
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "pembayarans.user_id",
          to: "users.id",
        },
      },
      iuran: {
        relation: Model.BelongsToOneRelation,
        modelClass: Iuran,
        join: {
          from: "pembayarans.iuran_id",
          to: "iurans.id",
        },
      },
    };
  }
}

module.exports = Pembayaran;
