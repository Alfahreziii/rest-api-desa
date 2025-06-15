const { Model } = require("objection");

class LaporanManual extends Model {
  static get tableName() {
    return "laporan_manuals"; // sesuaikan dengan nama tabel kamu di DB
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      properties: {
        id: { type: "integer" },
        bulan_tahun: { type: "string" },
        jumlah_rumah: { type: "integer" },
        jumlah_meninggal: { type: "integer" },
        jumlah_pindah: { type: "integer" },
        created_at: { type: "string", format: "date-time" },
        updated_at: { type: "string", format: "date-time" },
      },
    };
  }
}

module.exports = LaporanManual;
