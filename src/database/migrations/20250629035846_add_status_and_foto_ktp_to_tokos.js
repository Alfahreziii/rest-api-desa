/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.alterTable("tokos", (table) => {
    table.enum("status", ["pending", "aktif", "nonaktif"]).defaultTo("pending");
    table.string("foto_ktp").nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.alterTable("tokos", (table) => {
    table.dropColumn("status");
    table.dropColumn("foto_ktp");
  });
};
