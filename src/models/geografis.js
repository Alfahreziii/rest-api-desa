const { Model } = require("objection");

class Geografis extends Model {
  static get tableName() {
    return "geografis";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      properties: {
        id: { type: "integer" },
        judul: { type: "string" },
        foto: { type: "string" },
      },
    };
  }
}

module.exports = Geografis;
