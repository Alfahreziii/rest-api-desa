const { Model } = require("objection");

class Laporan extends Model {
  static get tableName() {
    return "laporans"; // sesuaikan dengan nama tabel kamu di DB
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["tanggal_laporan"],

      properties: {
        id: { type: "integer" },
        tanggal_laporan: { type: "string" },
        jumlah_rumah: { type: "integer" },
        jumlah_kk: { type: "integer" },
        jumlah_laki: { type: "integer" },
        jumlah_perempuan: { type: "integer" },
        jumlah_meninggal: { type: "integer" },
        jumlah_lahir: { type: "integer" },
        jumlah_pindah: { type: "integer" },
        created_at: { type: "string", format: "date-time" },
        updated_at: { type: "string", format: "date-time" },
      },
    };
  }
}

module.exports = Laporan;
