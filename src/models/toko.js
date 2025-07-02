// models/toko.js
const { Model } = require('objection');
const User = require('./user');

class Toko extends Model {
  static get tableName() {
    return 'tokos';
  }

  static get idColumn() {
    return 'id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['id_user', 'nama_toko', 'foto', 'no_hp', 'alamat'],
      properties: {
        id: { type: 'integer' },
        id_user: { type: 'integer' },
        nama_toko: { type: 'string', minLength: 1, maxLength: 255 },
        alamat: { type: 'string', minLength: 1, maxLength: 255 },
        foto: { type: 'string', minLength: 1, maxLength: 255 },
        foto_ktp: { type: ['string', 'null'] },
        no_hp: { type: 'string', minLength: 1, maxLength: 20 },
        status: { type: 'string', enum: ['pending', 'aktif', 'nonaktif'] },
      },
    };
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'tokos.id_user',
          to: 'users.id',
        },
      },
    };
  }
}

module.exports = Toko;
