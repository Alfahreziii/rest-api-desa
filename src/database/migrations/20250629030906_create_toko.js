/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("tokos", (table) => {
    table.increments("id").primary();
    table.integer('id_user').unsigned().unique();
    table.foreign('id_user').references('id').inTable('users').onDelete('CASCADE');
    table.string("nama_toko").notNullable();
    table.string("alamat").notNullable();
    table.string("foto").notNullable();
    table.string("no_hp").notNullable();
    table.timestamps(true, true); // created_at & updated_at
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("tokos");
};
