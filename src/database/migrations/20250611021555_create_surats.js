/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("surats", (table) => {
    table.increments("id").primary();
    table.integer('id_jenissurat').unsigned()
    table.foreign('id_jenissurat').references('id').inTable('jenis_surats').onDelete('CASCADE');
    table.string("atas_nama").unique().notNullable();
    table.string("ditunjukan").notNullable();
    table.string("keterangan").notNullable();
    table.timestamps(true, true); // created_at & updated_at
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("surats");
};
