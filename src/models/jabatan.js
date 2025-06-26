const { Model } = require("objection");

class Jabatan extends Model {
  static get tableName() {
    return "pengurus_jabatan";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      properties: {
        id: { type: "integer" },
        nama_jabatan : { type: "string" },
      },
    };
  }
}

module.exports = Jabatan;