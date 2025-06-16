const { Model } = require("objection");

class Pengurus extends Model {
  static get tableName() {
    return "pengurus";
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
        email: { type: "string", format: "email" },
        jabatan: { type: "string" },
        alamat: { type: "string" },
        no_hp: { type: "string" },
        foto: { type: "string" },
      },
    };
  }
}

module.exports = Pengurus;
