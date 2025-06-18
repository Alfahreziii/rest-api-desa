/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("iurans", (table) => {
    table.increments("id").primary();
    table.string("bulan").notNullable();
    table.integer("harga").notNullable();
    table.date("jatuh_tempo").notNullable();
    table.timestamps(true, true); // created_at & updated_at
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("iurans");
};
