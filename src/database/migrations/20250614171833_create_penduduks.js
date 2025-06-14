/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("penduduks", (table) => {
    table.increments("id").primary();
    table.string("alamat").notNullable();
    table.string("status").notNullable();
    table.string("nomor_kk").notNullable();
    table.string("nomor_nik").notNullable();
    table.string("nama").notNullable();
    table.enum("jenis_kelamin", ["Laki-laki", "Perempuan"]);
    table.string("tempat_lahir").notNullable();
    table.string("tgl_lahir").notNullable();
    table.integer("umur").notNullable();
    table.string("pekerjaan").notNullable();
    table.timestamps(true, true); // created_at & updated_at
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("penduduks");
};
