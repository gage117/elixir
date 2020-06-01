require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const API = require('./api');
const {platform_IDs, major_platforms}  = require('./platform_IDs');

const app = express();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.get('/app-load', async (req, res) => {
  //* Object to assign API response data to and send back in response
  const appData = {};
  //* Get data from /games
  let queryString = `fields *, cover.url, platforms; limit 25; where platforms !=n & platforms = (${major_platforms.join(',')}) & parent_game = null & total_rating >= 75 & total_rating_count >= 100 & id != 1942; sort total_rating desc;`;
  const gamesResponse = await API.post('/games', queryString);
  appData.gameData = gamesResponse.data;
  //* Get data from /genres
  queryString = 'fields *; exclude updated_at , created_at;';
  const genresResponse = await API.post('/genres', queryString);
  appData.genreData = genresResponse.data;

  res.send(appData);
});

app.get('/games', async (req, res) => {
  //! When changing queryString, make sure to also change the appropriate queryString in the /app-load route
  const queryString = `fields *, cover.url, platforms; limit 25; where platforms !=n & platforms = (${major_platforms.join(',')}) & parent_game = null & total_rating >= 75 & total_rating_count >= 100 & id != 1942; sort total_rating desc;`;
  const response = await API.post('/games', queryString);
  res.send(response.data);
});

app.get('/genres', async (req, res) => {
  //! When changing queryString, make sure to also change the appropriate queryString in the /app-load route
  const queryString = 'fields *; exclude updated_at , created_at;';
  const response = await API.post('/genres', queryString);
  res.send(response.data);
});

app.get('/platforms', async (req, res) => {
  const queryString = `fields *; limit 500; where id = (${IDs.join(',')});`;
  const response = await API.post('/platforms', queryString);
  res.send(response.data);
});

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = {error: {message: 'server error'}};
  } else {
    // eslint-disable-next-line no-console
    console.log(error);
    response = {message: error.message, error};
  }
  res.status(500).json(response);
});

module.exports = app;