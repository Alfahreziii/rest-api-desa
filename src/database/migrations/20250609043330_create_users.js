/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("email").unique().notNullable();
    table.string("password").notNullable();
    table.string("nomor_kk");
    table.string("nomor_nik");
    table.string("tempat_lahir");
    table.date("tanggal_lahir");
    table.enum("jenis_kelamin", ["Laki-laki", "Perempuan"]);
    table.string("pekerjaan");
    table.string("status");
    table.text("alamat_rt005");
    table.text("alamat_ktp");
    table.string("role").defaultTo("user");
    table.timestamp("email_verified_at").nullable();
    table.string("remember_token").nullable();
    table.timestamps(true, true); // created_at & updated_at
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("users");
};
