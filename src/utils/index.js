/* eslint-disable object-curly-newline */
/* eslint-disable camelcase */
const mapDBToModelAlbum = ({ id, name, year }) => ({
  id,
  name,
  year,

});

const mapDBToModelSong = ({ id, title, year, genre, performer, duration, album_id }) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId: album_id,
});

module.exports = { mapDBToModelSong, mapDBToModelAlbum };
