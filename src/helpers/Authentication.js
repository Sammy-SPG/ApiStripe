const path = require('path');
require('dotenv').config({path: path.join(__dirname, '../../.env.local') });

const API_STRIPE_PK = process.env.API_STRIPE_PK;
const API_STRIPE_SK = process.env.API_STRIPE_SK;

module.exports = { API_STRIPE_PK, API_STRIPE_SK }
