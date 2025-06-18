const { Model } = require("objection");

class Iuran extends Model {
  static get tableName() {
    return "iurans";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["bulan", "harga", "jatuh_tempo"],
      properties: {
        id: { type: "integer" },
        bulan: { type: "string" },
        harga: { type: "integer" },
        jatuh_tempo: { type: "string", format: "date" },
      },
    };
  }
}

module.exports = Iuran;
