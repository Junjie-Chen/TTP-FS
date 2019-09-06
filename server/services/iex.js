const axios = require('axios');

module.exports = axios.create({
  baseURL: 'https://api.iextrading.com/1.0'
});
