const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const corsOptions = require('./config/corsOptions');
const errorHandler = require('./middleware/error.middleware');

// Route imports
// Route imports
const authRoutes = require('./routes/auth.routes');
const studentRoutes = require('./routes/student.routes');
const predictionRoutes = require('./routes/prediction.routes');
const interventionRoutes = require('./routes/intervention.routes');
const helpRequestRoutes = require('./routes/helpRequest.routes');

const app = express();

// Middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/predictions', predictionRoutes);
app.use('/api/interventions', interventionRoutes);
app.use('/api/help-requests', helpRequestRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'API Route Not Found' });
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;
