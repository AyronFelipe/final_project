const axios = require('axios');

const api = axios.create({
    baseURL: 'http://localhost:3000/api/',
    headers: { 'Authorization': `Token ${localStorage.token}` }
})

export default api;