module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  client_id: process.env.client_id || 'No client_id found.',
  client_secret: process.env.client_secret || 'No client_secret found.',
  access_token: process.env.access_token || 'No access_token found.'
};