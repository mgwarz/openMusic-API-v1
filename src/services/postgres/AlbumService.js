const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapDBToModelAlbum, mapDBToModelSong } = require('../../utils');

class AlbumService {
  constructor() {
    this._pool = new Pool();
  }

  // POST album
  async addAlbum({ name, year }) {
    const id = nanoid(16);
    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };
    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  // GET  album by id
  async getAlbumById(id) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    return result.rows.map(mapDBToModelAlbum)[0];
  }

  // edit by id
  async editAlbumById(id, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name=$1, year =$2 WHERE id=$3 RETURNING id',
      values: [name, year, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  // delete
  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('album gagal dihapus. Id tidak ditemukan');
    }
  }

  // GET song in album
  async getSongInAlbum(id) {
    const query = {
      text: 'SELECT id, title, performer FROM songs WHERE "albumid" = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    return result.rows.map(mapDBToModelSong);
  }
}
module.exports = AlbumService;
