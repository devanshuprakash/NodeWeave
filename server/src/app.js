const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const { PORT, NODE_ENV } = require('./config/env');
const { errorHandler } = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const workflowRoutes = require('./routes/workflowRoutes');
const executionRoutes = require('./routes/executionRoutes');

const app = express();

// --------------- Middleware ---------------
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting (only in production)
if (NODE_ENV === 'production') {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: { success: false, error: 'Too many requests, please try again later' },
  });
  app.use('/api', limiter);
}

// --------------- Routes ---------------
app.get('/api/v1/health', (req, res) => {
  res.json({ success: true, message: 'NodeWeave API is running 🚀', timestamp: new Date() });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/workflows', workflowRoutes);
app.use('/api/v1/executions', executionRoutes);

// --------------- Error Handler ---------------
app.use(errorHandler);

// --------------- Start Server ---------------
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 NodeWeave Server running on port ${PORT} in ${NODE_ENV} mode`);
  });
};

startServer();

module.exports = app;

