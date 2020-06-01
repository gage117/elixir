require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const API = require('./api');

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
  let queryString = 'fields name, cover.url; limit 25;';
  const gamesResponse = await API.post('/games', queryString);
  appData.gameData = gamesResponse.data;
  //* Get data from /genres
  queryString = 'fields *; exclude updated_at , created_at;';
  const genresResponse = await API.post('/genres', queryString);
  appData.genreData = genresResponse.data;

  res.send(appData);
});

app.get('/games', async (req, res) => {
  const queryString = 'fields name, cover.url; limit 25;';
  const response = await API.post('/games', queryString);
  res.send(response.data);
});

app.get('/genres', async (req, res) => {
  const queryString = 'fields *; exclude updated_at , created_at;';
  const response = await API.post('/genres', queryString);
  res.send(response.data);
});

app.get('/platforms', async (req, res) => {
  const IDs = [
    163, //* SteamVR 
    92, //* Steam
    3, //* Linux
    6, //* PC (Microsoft Windows)
    162, //* Oculus VR
    7, //* PlayStation 1
    8, //* PlayStation 2
    9, //* PlayStation 3
    48, //* PlayStation 4
    167, //* PlayStation 5
    165, //* PlayStation VR
    46, //* PlayStation Vita
    38, //* PSP (PlayStation Portable)
    34, //* Android
    39, //* iOS
    203, //* Google Stadia
    170, //* Google Stadia Again.
    11, //* Xbox
    12, //* Xbox 360
    49, //* Xbox One
    169, //* Xbox Series X
    18, //* NES (Nintendo Entertainment System)
    19, //* SNES (Super Nintendo Entertainment System)
    4, //* Nintendo 64
    33, //* Nintendo Game Boy
    22, //* Game Boy Color
    24, //* Game Boy Advance
    21, //* Nintendo GameCube
    20, //* Nintendo DS
    159, //* Nintendo DSi
    37, //* Nintendo 3DS
    137, //* New Nintendo 3DS
    5, //* Nintendo Wii
    41, //* Nintendo WiiU
    130, //* Nintendo Switch
    42, //* NGage (Because why wouldn't I include the console that has my name in it?)
    29, //* Sega Genesis
    32, //* Sega Saturn
    64, //* Sega Master System
    59, //* Atari 2600
  ]
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