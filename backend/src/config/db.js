const mongoose = require('mongoose');
const env = require('./env');
const logger = require('../utils/logger');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../models/User.model');
const Student = require('../models/Student.model');
const { DUMMY_STUDENTS } = require('../../../frontend/src/data/dummyData');

const seedInMemoryDB = async () => {
  logger.info('Seeding in-memory DB...');
  try {
    const admin = new User({ name: 'Dr. Sarah Admin', email: 'admin@edushield.ai', password: 'admin123', role: 'admin' });
    const teacher = new User({ name: 'Maria Flores', email: 'teacher@edushield.ai', password: 'teacher123', role: 'teacher', assignedClass: 'Class-A' });
    await admin.save();
    await teacher.save();

    const dbStudents = DUMMY_STUDENTS.map(s => {
      const dbStudent = { ...s };
      delete dbStudent._id;
      delete dbStudent.prediction;
      delete dbStudent.interventions;
      return dbStudent;
    });

    await Student.insertMany(dbStudents);
    logger.info('In-memory DB seeded successfully.');
  } catch (err) {
    logger.error(`In-memory seeding failed: ${err.message}`);
  }
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGO_URI, { serverSelectionTimeoutMS: 2000 });
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.warn(`Primary MongoDB connection failed: ${error.message}`);
    if (env.NODE_ENV !== 'production') {
      logger.info('Starting fallback in-memory MongoDB server for development...');
      try {
        const mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);
        logger.info(`In-memory MongoDB Connected: ${mongoUri}`);
        await seedInMemoryDB();
      } catch (memError) {
         logger.error(`In-memory MongoDB failed: ${memError.message}`);
         process.exit(1);
      }
    } else {
      process.exit(1);
    }
  }
};

module.exports = connectDB;

