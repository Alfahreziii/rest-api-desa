const { Model } = require("objection");
const Toko = require('./toko');

class Product extends Model {
  static get tableName() {
    return "products";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      properties: {
        id: { type: "integer" },
        id_toko: { type: "integer" },
        nama_produk: { type: "string" },
        deskripsi: { type: "string" },
        foto: { type: "string" },
        harga: { type: "integer" },
        stok: { type: "integer" },
      },
    };
  }

  static get relationMappings() {
    return {
      toko: {
        relation: Model.BelongsToOneRelation,
        modelClass: Toko,
        join: {
          from: "products.id_toko",
          to: "tokos.id",
        },
      },
    };
  }
}

module.exports = Product;
