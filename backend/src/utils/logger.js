const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    process.env.NODE_ENV === 'production' ? winston.format.json() : winston.format.simple()
  ),
  transports: [
    new winston.transports.Console({
      format: process.env.NODE_ENV === 'production' 
        ? winston.format.json()
        : winston.format.combine(
            winston.format.colorize(),
            winston.format.printf(({ level, message, timestamp, stack }) => {
              if (stack) return `${timestamp} ${level}: ${message}\n${stack}`;
              return `${timestamp} ${level}: ${message}`;
            })
          )
    })
  ]
});

module.exports = logger;
