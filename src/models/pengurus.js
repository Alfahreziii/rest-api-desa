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
        jabatan: { type: "integer" },
        alamat: { type: "string" },
        no_hp: { type: "string" },
        foto: { type: "string" },
      },
    };
  }

    // Relasi ke jabatan
  static get relationMappings() {
    const Jabatan = require("./jabatan.js"); // Path ke model jabatan

    return {
      jabatan_rel: {
        relation: Model.BelongsToOneRelation, // Relasi 1 ke 1 (belongsTo)
        modelClass: Jabatan, // Model jabatan
        join: {
          from: "pengurus.jabatan", // Tabel asal
          to: "pengurus_jabatan.id", // Tabel tujuan
        },
      },
    };
  }
}

module.exports = Pengurus;
