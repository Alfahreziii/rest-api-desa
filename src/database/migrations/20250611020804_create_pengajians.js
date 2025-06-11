/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("pengajians", (table) => {
    table.increments("id").primary();
    table.string("hari").notNullable();
    table.time("jam_mulai").unique().notNullable();
    table.time("jam_selesai").notNullable();
    table.string("tempat").notNullable();
    table.string("ustadzah").notNullable();
    table.timestamps(true, true); // created_at & updated_at
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("pengajians");
};
