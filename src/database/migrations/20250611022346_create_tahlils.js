/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("tahlils", (table) => {
    table.increments("id").primary();
    table.string("hari").notNullable();
    table.string("judul").notNullable();
    table.time("jam_mulai").notNullable();
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
  await knex.schema.dropTableIfExists("tahlils");
};
