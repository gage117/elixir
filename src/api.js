const axios = require('axios');
const { client_id,
        access_token } = require('./config');

const API = axios.create({
	baseURL: 'https://api.igdb.com/v4',
	headers: {
		'Client-ID': client_id,
		'Authorization': access_token
	}
})

module.exports = API;