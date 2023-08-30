import express from 'express';
import { config } from 'dotenv';
import authRoute from './routes/authRoute.js';
import userRoute from './routes/userRoute.js';

const app = express();
config({ path: './config.env' });

/* Middleware Define */
app.use(express.json());

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
