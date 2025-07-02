/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("products", (table) => {
    table.increments("id").primary();
    table.integer('id_toko').unsigned()
    table.foreign('id_toko').references('id').inTable('tokos').onDelete('CASCADE');
    table.string("nama_produk").notNullable();
    table.string("foto").notNullable();
    table.string("deskripsi");
    table.integer("harga").notNullable();
    table.integer("stok").notNullable();
    table.timestamps(true, true); // created_at & updated_at
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("products");
};
