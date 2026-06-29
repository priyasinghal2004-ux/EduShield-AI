const env = require('./env');

const corsOptions = {
  origin: env.NODE_ENV === 'production' ? env.FRONTEND_URL : '*',
  credentials: true,
  optionsSuccessStatus: 200
};

module.exports = corsOptions;
