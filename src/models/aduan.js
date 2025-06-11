const { Model } = require("objection");

class Aduan extends Model {
  static get tableName() {
    return "Aduans";
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
        keterangan: { type: "string" },
        foto: { type: "string" },
      },
    };
  }
}

module.exports = Aduan;
