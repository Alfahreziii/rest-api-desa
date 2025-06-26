const { Model } = require("objection");

class Pengajian extends Model {
  static get tableName() {
    return "pengajians";
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
        ustadzah: { type: "string" },
      },
    };
  }
}

module.exports = Pengajian;
