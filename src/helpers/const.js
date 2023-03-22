const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env.local') });

const API_URL = process.env.API_URL;

module.exports = API_URL;