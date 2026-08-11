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
    const teacher = new User({
      name: 'Aditi Sharma',
      email: 'teacher@edushield.ai',
      password: 'teacher123',
      role: 'teacher',
      assignedClass: 'Class-A'
    });
    const student = new User({
      name: 'Ansh Bansal',
      email: 'student@edushield.ai',
      password: 'student123',
      role: 'student',
      studentId: 'STU-018'
    });
    await admin.save();
    await teacher.save();
    await student.save();

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

const seedProductionDB = async () => {
  try {
    logger.info('Checking production demo users...');

    const existingStudent = await User.findOne({
      email: 'student@edushield.ai'
    });

    if (!existingStudent) {
      const student = new User({
        name: 'Ansh Bansal',
        email: 'student@edushield.ai',
        password: 'student123',
        role: 'student',
        studentId: 'STU-018',
        assignedClass: 'Class-A'
      });

      await student.save();
      logger.info('Production student demo user created.');
    } else {
      logger.info('Production student demo user already exists.');
    }

  } catch (err) {
    logger.error(`Production seeding failed: ${err.message}`);
  }
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGO_URI, { serverSelectionTimeoutMS: 2000 });
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    await seedProductionDB();
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

