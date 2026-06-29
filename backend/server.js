const app = require('./src/app');
const env = require('./src/config/env');
const connectDB = require('./src/config/db');
const logger = require('./src/utils/logger');
const seedStudents = require('./seedStudents');

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "EduShield AI Backend is Running 🚀"
  });
});

// Connect to MongoDB
connectDB()
  .then(async () => {
    await seedStudents();

    const server = app.listen(env.PORT, () => {
      logger.info(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
    });

    process.on('unhandledRejection', (err) => {
      logger.error(`Error: ${err.message}`);
      server.close(() => process.exit(1));
    });
  })
  .catch((err) => {
    logger.error(err);
    process.exit(1);
  });