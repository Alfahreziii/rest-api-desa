const { Model } = require("objection");

class User extends Model {
  static get tableName() {
    return "users";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["name", "email", "password"],
      properties: {
        id: { type: "integer" },
        name: { type: "string" },
        email: { type: "string", format: "email" },
        password: { type: "string" },
        nomor_kk: { type: ["string", "null"] },
        nomor_nik: { type: ["string", "null"] },
        tempat_lahir: { type: ["string", "null"] },
        tanggal_lahir: { type: ["string", "null"], format: "date" },
        jenis_kelamin: { type: ["string", "null"], enum: ["Laki-laki", "Perempuan"] },
        pekerjaan: { type: ["string", "null"] },
        status: { type: ["string", "null"] },
        alamat_rt005: { type: ["string", "null"] },
        alamat_ktp: { type: ["string", "null"] },
        role: { type: ["string", "null"], default: "user" },
        email_verified_at: { type: ["string", "null"], format: "date-time" },
        remember_token: { type: ["string", "null"] },
        created_at: { type: ["string", "null"], format: "date-time" },
        updated_at: { type: ["string", "null"], format: "date-time" },
      },
    };
  }
}

module.exports = User;
