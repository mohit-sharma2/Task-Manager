const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const requestLogger = require('./middleware/requestLogger');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  
  trustProxy: process.env.NODE_ENV === 'production',
});
// app.use(cors({ 
//   origin: process.env.CLIENT_URL || 'http://localhost:5173',
//   credentials: true  
// }));
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173').split(',');

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy violation'));
    }
  },
  credentials: true, // cookies ke liye zaroori
}));

app.use(express.json());
app.use(cookieParser());
app.use(limiter);
app.use(requestLogger);

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.use(errorHandler);

module.exports = app;
