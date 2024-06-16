import mongoose from 'mongoose';
import dotenv from 'dotenv';
import express from 'express';
import userRoutes from '../api/routes/user.route.js';
import authRoutes from '../api/routes/auth.route.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
dotenv.config();
mongoose.connect(process.env.MONGO)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.log(error);
  });
const app = express();

app.use(cookieParser()); // Parse cookies before any route handling
app.use(cors({
  origin: true, // Reflects the request origin as the allowed origin
  credentials: true // Allow credentials (cookies, authorization headers, etc.) to be sent in requests
}));
app.use(express.json());
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});
app.listen(5500, () => {
  console.log('Server listening on port 5500');
});
// 4:32