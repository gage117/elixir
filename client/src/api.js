import axios from 'axios';

export default {
	appLoad: () => axios.get('/api/app-load'),
	exampleRoute: () => axios.get('/route')
}

// export default axios.create({
// 	baseURL: 'http://localhost:8000/api/'
// });