/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("laporan_manuals", (table) => {
    table.increments("id").primary();
    table.string("bulan_tahun").notNullable();
    table.integer("jumlah_rumah").notNullable();
    table.integer("jumlah_meninggal").notNullable();
    table.integer("jumlah_pindah").notNullable();
    table.timestamps(true, true); // created_at & updated_at
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("laporan_manuals");
};
