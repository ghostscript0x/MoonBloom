const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const morgan = require('morgan');
const connectDB = require('./config/database');
const security = require('./middleware/security');
const errorHandler = require('./middleware/error');

// Load env vars from this folder's .env (works even when started from project root)
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Connect to database
connectDB();

const app = express();

// Trust proxy for rate limiting behind Render
app.set('trust proxy', 1);

// Security middleware
security(app);

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routers
app.use('/api/auth', require('./routes/auth'));
app.use('/api/auth', require('./routes/password')); // Password reset routes
app.use('/api/users', require('./routes/users'));
app.use('/api/cycles', require('./routes/cycles'));
app.use('/api/analytics', require('./routes/analytics'));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle server listening errors
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log('Port 5000 is already in use. Attempting to kill conflicting process...');

    // Try to kill the process using the port
    const { exec } = require('child_process');
    const command = process.platform === 'win32'
      ? `for /f "tokens=5" %a in ('netstat -ano ^| findstr :5000') do taskkill /PID %a /F`
      : `lsof -ti:5000 | xargs kill -9`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.log('Failed to kill conflicting process. Please manually stop the process using port 5000.');
        console.log('You can run: npx kill-port 5000');
        process.exit(1);
      } else {
        console.log('Conflicting process killed. Restarting server...');
        // Try to start the server again after a short delay
        setTimeout(() => {
          server.listen(PORT, () => {
            console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
          });
        }, 1000);
      }
    });
  } else {
    console.error('Server error:', err);
    process.exit(1);
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

module.exports = app;