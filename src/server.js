/* eslint-disable no-dupe-keys */
require('dotenv').config();

const Hapi = require('@hapi/hapi');

// songs
const song = require('./api/song');
const SongService = require('./services/postgres/SongService');
const SongsValidator = require('./validator/songs');

// albums
const album = require('./api/album');
const AlbumsValidator = require('./validator/albums');
const AlbumService = require('./services/postgres/AlbumService');

const init = async () => {
  const songService = new SongService();
  const albumService = new AlbumService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: song,
      options: {
        service: songService,
        validator: SongsValidator,
      },
    },
    {
      plugin: album,
      options: {
        service: albumService,
        validator: AlbumsValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};
init();
