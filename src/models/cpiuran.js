const { Model } = require("objection");

class Cpiuran extends Model {
  static get tableName() {
    return "cpiurans";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      properties: {
        id: { type: "integer" },
        nama: { type: "string" },
        no_hp: { type: "string" },
      },
    };
  }
}

module.exports = Cpiuran;
