/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("laporans", (table) => {
    table.increments("id").primary();
    table.integer("jumlah_rumah").notNullable();
    table.integer("jumlah_kk").notNullable();
    table.integer("jumlah_laki").notNullable();
    table.integer("jumlah_perempuan").notNullable();
    table.integer("jumlah_meninggal").notNullable();
    table.integer("jumlah_lahir").notNullable();
    table.integer("jumalah_pindah").notNullable();
    table.timestamps(true, true); // created_at & updated_at
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("laporans");
};
