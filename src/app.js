require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV,
        client_id,
        client_secret,
        access_token } = require('./config');
const API = require('./api');
const axios = require('axios');
const routes = require("./routes");

const app = express();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

// Serve up static assets
if (process.env.NODE_ENV === "production") {
  console.log("PRODUCTION");
  console.log(path.join(__dirname, "..", "client", "build"));
  app.use(express.static(path.join(__dirname, "..", "client", "build")));
}

//Self-executing function to get access token if none is available or current one doesn't work
(async function testAccessToken(client_id, client_secret, access_token) {
  if (client_id === 'No client_id found.') throw new Error("Woah there chief, you don't have a client_id!");
  if (client_secret === 'No client_secret found.') throw new Error("Woah there chief, you don't have a client_secret!");

  try {
    // responds with object containing access_token and expires_in properties to use API
    const tokenResponse = await axios.post('https://id.twitch.tv/oauth2/token?' +
      `client_id=${client_id}&` +
      `client_secret=${client_secret}&` +
      `grant_type=client_credentials`
    );
    // Set timer, converting expires_in seconds to milliseconds with some headroom
    let timer = tokenResponse.data.expires_in * 99;
    // Set access_token in env variables and config
    process.env.access_token = tokenResponse.data.access_token;
    access_token = tokenResponse.data.access_token;
    // set timeout to recursively call the function when timer runs close to expiry
    setTimeout(() => {
      testAccessToken(client_id, client_secret, access_token);
    }, timer);
    API.defaults.headers['Authorization'] = `Bearer ${access_token}`;
    // Log successful execution and variables set.
    console.log(
      "access_token set to: " + process.env.access_token +
      " and expires in " + (timer / 100) + " seconds"
    );
  } catch(err) {
    console.log("access_token request failed:", err);
  }
})(client_id, client_secret, access_token);

app.use(routes);

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