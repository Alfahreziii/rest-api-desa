/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("pembayarans", (table) => {
    table.increments("id").primary();
    table.integer("user_id").unsigned().notNullable(); // Foreign Key ke tabel users
    table.integer("iuran_id").unsigned().notNullable(); // Foreign Key ke tabel iurans
    table.string("order_id").notNullable(); // ID unik dari Midtrans
    table.string("snap_token").notNullable(); // Token dari Snap Midtrans
    table.string("status").notNullable().defaultTo("pending"); // pending, settlement, cancel, etc
    table.timestamp("paid_at").nullable(); // diisi jika statusnya settlement
    table.timestamps(true, true); // created_at & updated_at

    // Foreign key constraints
    table
      .foreign("user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    table
      .foreign("iuran_id")
      .references("id")
      .inTable("iurans")
      .onDelete("CASCADE");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("pembayarans");
};
