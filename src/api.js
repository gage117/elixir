const axios = require('axios');

const API = axios.create({
	baseURL: 'https://api-v3.igdb.com/',
	headers: {'user-key': 'bb2aedca0775a449624cae062ea21d0f'}
})

module.exports = API;