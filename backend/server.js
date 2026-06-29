const app = require('./src/app');
const env = require('./src/config/env');
const connectDB = require('./src/config/db');
const logger = require('./src/utils/logger');

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "EduShield AI Backend is Running 🚀"
  });
});

// Connect to MongoDB
connectDB();

const server = app.listen(env.PORT, () => {
  logger.info(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  logger.error(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
