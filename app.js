import express from 'express';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import authRoute from './routes/authRoute.js';
import userRoute from './routes/userRoute.js';

const app = express();
config({ path: './config.env' });

/* Middleware Define */
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

/* Routes Define */
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/user', userRoute);

/* Error Handling Middleware */
app.use((err, req, res, next) => {
  res.status(err?.statusCode || 500).json({
    errorInfo: {
      status: 'failure',
      statusCode: '99',
      message: err?.message || 'Please try again, Something went wrong!',
    },
  });
  next();
});

export default app;
