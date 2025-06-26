const { Model } = require("objection");

class Kerjabakti extends Model {
  static get tableName() {
    return "rapats";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      properties: {
        id: { type: "integer" },
        hari: { type: "string" },
        judul: { type: "string" },
        jam_mulai: {
          type: "string",
          pattern: "^([01]\\d|2[0-3]):([0-5]\\d)$"
        },
        jam_selesai: {
          type: "string",
          pattern: "^([01]\\d|2[0-3]):([0-5]\\d)$"
        },
        tempat: { type: "string" },
        peserta: { type: "string" },
        bahasan: { type: "string" },
      },
    };
  }
}

module.exports = Kerjabakti;
