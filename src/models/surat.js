const { Model } = require("objection");

class Surat extends Model {
  static get tableName() {
    return "surats";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      properties: {
        id: { type: "integer" },
        id_jenissurat: { type: "integer" },
        atas_nama: { type: "string" },
        ditunjukan: { type: "string" },
        keterangan: { type: "string" },
      },
    };
  }

  // Relasi ke jenis_surat
  static get relationMappings() {
    const JenisSurat = require("./jenissurat.js"); // Path ke model JenisSurat

    return {
      jenisSurat: {
        relation: Model.BelongsToOneRelation, // Relasi 1 ke 1 (belongsTo)
        modelClass: JenisSurat, // Model JenisSurat
        join: {
          from: "surats.id_jenissurat", // Tabel asal
          to: "jenis_surats.id", // Tabel tujuan
        },
      },
    };
  }
}

module.exports = Surat;
