import mongoose from 'mongoose';
import server from './app.js';

mongoose
  .connect(process.env.DB)
  .then(() => console.log('Database is connection is success...😎'))
  .catch((err) => console.log('Database is connection is failure...🔥', err));

server.listen('4000', () => console.log('Server is Started...😎'));
