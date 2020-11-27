const router = require("express").Router();
const API = require('../../api');
const {platform_IDs, major_platforms}  = require('../../platform_IDs');
const buildQuery = require('../../helpers/queryBuilder');

router.get('/app-load', async (req, res) => {
  //* Object to assign API response data to and send back in response
  const appData = {};
  //* Get data from /games
  let queryString = buildQuery({
    fields: ['*', 'cover.url', 'platforms'],
    limit: 25,
    where: [
      'platforms !=n',
      `platforms = (${major_platforms.join(',')})`,
      'parent_game = null', //* Excludes DLCs from response
      'total_rating >= 75',
      'total_rating_count >= 100',
      'id != 1942' //* Prevents second instance of The Witcher 3 in response
    ],
    sort: 'total_rating desc'
  });
  try {
    const gamesResponse = await API.post('/games', queryString);
    appData.gameData = gamesResponse.data;
    //* Get data from /genres
    queryString = buildQuery({
      fields: '*',
      exclude: ['updated_at', 'created_at']
    });
    const genresResponse = await API.post('/genres', queryString);
    appData.genreData = genresResponse.data;

    res.send(appData);
  } catch(err) {
    console.log("YEEHAW", err.response);
  }
});

router.get('/games', async (req, res) => {
  //! When changing queryString, make sure to also change the appropriate queryString in the /app-load route
  const queryString = buildQuery({
    fields: ['*', 'cover.url', 'platforms'],
    limit: 25,
    where: [
      'platforms !=n',
      `platforms = (${major_platforms.join(',')})`,
      'parent_game = null', //* Excludes DLCs from response
      'total_rating >= 75',
      'total_rating_count >= 100',
      'id != 1942' //* Prevents second instance of The Witcher 3 in response
    ],
    sort: 'total_rating desc'
  });
  const response = await API.post('/games', queryString);
  res.send(response.data);
});

router.get('/genres', async (req, res) => {
  //! When changing queryString, make sure to also change the appropriate queryString in the /app-load route
  const queryString = buildQuery({
    fields: '*',
    exclude: ['updated_at', 'created_at']
  });
  const response = await API.post('/genres', queryString);
  res.send(response.data);
});

router.get('/platforms', async (req, res) => {
  const queryString = buildQuery({
    fields: '*',
    limit: 500,
    where: `id = (${major_platforms.join(',')})`
  })
  const response = await API.post('/platforms', queryString);
  res.send(response.data);
});

module.exports = router;