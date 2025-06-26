/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("pengurus", (table) => {
    table.increments("id").primary();
    table.string("nama").notNullable();
    table.string("email").unique().notNullable();
    table.integer('jabatan').unsigned()
    table.foreign('jabatan').references('id').inTable('pengurus_jabatan').onDelete('CASCADE');
    table.string("alamat").notNullable();
    table.string("no_hp").notNullable();
    table.string("foto").notNullable();
    table.timestamps(true, true); // created_at & updated_at
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("pengurus");
};
