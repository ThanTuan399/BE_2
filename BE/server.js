require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const connectDatabase = require('./src/config/database');

const authRoutes = require('./src/routes/auth.route');
const publicRoutes = require('./src/routes/public.route');
const doctorRoutes = require('./src/routes/doctor.route');

const app = express();
const PORT = Number(process.env.PORT) || 5000;


// =============================
// Middleware dùng chung
// =============================

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());


// =============================
// Routes
// =============================

app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/bac-si', doctorRoutes);


// =============================
// Health check
// =============================



app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Phòng khám BE v1 đang hoạt động',
    database:
      mongoose.connection.readyState === 1
        ? 'connected'
        : 'disconnected',
  });
});


// =============================
// 404
// =============================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Không tìm thấy API',
  });
});


// =============================
// Error handler
// =============================

app.use((err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message:
      statusCode === 500
        ? 'Lỗi máy chủ'
        : err.message,
  });
});


// =============================
// Start server
// =============================

async function startServer() {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(
        `Server running at http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error(
      'Không thể khởi động server:',
      error.message
    );

    process.exit(1);
  }
}

startServer();