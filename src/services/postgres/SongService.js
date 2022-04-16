const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapDBToModelSong } = require('../../utils');

class SongService {
  constructor() {
    this._pool = new Pool();
  }

  // POST new song
  async addSong({
    title, year, genre, performer, duration, albumId,
  }) {
    const id = nanoid(16);

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, genre, performer, duration, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  // GET all songs
  async getSongs() {
    const result = await this._pool.query('SELECT id, title, performer FROM songs');
    return result.rows.map(mapDBToModelSong);
  }

  // GET songs by id
  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id=$1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan. Id tidak ditemukan');
    }
    return result.rows.map(mapDBToModelSong)[0];
  }

  // POST (edit songs by id)
  async editSongById(id, {
    title, year, genre, performer, duration, albumId,
  }) {
    // const updateAt = new Date().toISOString();
    const query = {
      text: 'UPDATE songs SET title=$1, year =$2, genre=$3, performer=$4, duration=$5, album_id=$6 WHERE id=$7 RETURNING id',
      values: [title, year, genre, performer, duration, albumId, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan');
    }
  }

  // DELETE song by id
  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id=$1 RETURNING id',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('lagu gagal dihapus. Id tidak ditemukan');
    }
  }
}
module.exports = SongService;
