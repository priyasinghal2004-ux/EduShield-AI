require('dotenv').config();

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5001,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/edushield',
  JWT_SECRET: process.env.JWT_SECRET || 'supersecret_edushield_jwt_key_2024',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  AI_API_KEY: process.env.AI_API_KEY || 'dummy_key',
  AI_SERVICE_URL: process.env.AI_SERVICE_URL || 'http://localhost:8000',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000'
};
