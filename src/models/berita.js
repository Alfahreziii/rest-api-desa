const { Model } = require("objection");

class Berita extends Model {
  static get tableName() {
    return "beritas";
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
        deskripsi: { type: "string" },
        foto: { type: "string" },
      },
    };
  }
}

module.exports = Berita;
