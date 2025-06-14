const { Model } = require("objection");

class JenisSurat extends Model {
  static get tableName() {
    return "jenis_surats";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      properties: {
        id: { type: "integer" },
        nama_jenis: { type: "string", unique: true },
      },
    };
  }
}

module.exports = JenisSurat;