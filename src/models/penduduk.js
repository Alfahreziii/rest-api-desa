const { Model } = require("objection");

class Penduduk extends Model {
  static get tableName() {
    return "penduduks";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      properties: {
        id: { type: "integer" },
        alamat: { type: "string" },
        status: { type: "string" },
        nomor_kk: { type: "string" },
        nomor_nik: { type: "string" },
        nama: { type: "string" },
        jenis_kelamin: { type: "string", enum: ["Laki-laki", "Perempuan"] },
        tempat_lahir: { type: "string" },
        tanggal_lahir: { type: "string", format: "date" },
        umur: { type: "string" },
        pekerjaan: { type: "string" },
        created_at: { type: "string", format: "date-time" },
        updated_at: { type: "string", format: "date-time" },
      },
    };
  }
}

module.exports = Penduduk;
