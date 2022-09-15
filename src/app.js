import express from 'express';
import mongoose from 'mongoose';

import HttpError from './models/HttpError.js';
import authRouter from './routers/authRoutes.js';
import programsRoutes from './routers/programsRoutes.js';
import { errorHandler } from './controllers/errorHandler.js';
import { deleteExpiredJWTs } from './tasks/deleteExpiredBlacklistedJWTsTask.js';

const app = express();

// Set up cors headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

  next();
});

// Set up form data parsing
app.use(express.json({ extended: false }));

// Setup routes
app.use('/api/users', authRouter); // Auth routes
app.use('/api/users/:userId', programsRoutes); // Programs Routes

// 404 route
app.use((req, res, next) => {
  return next(new HttpError('Could not find this route!', 404));
});

// Global error handler
app.use(errorHandler);

// Connect to DB and start app
mongoose
  .connect(process.env.mongoUrl)
  .then(() => {
    console.log('Connected to DB');
    app.listen(process.env.PORT, async () => {
      // Delete expired JWTs on startup
      try {
        await deleteExpiredJWTs();
      } catch (err) {
        console.log('Could not delete expired blacklisted JWTs: ' + err);
      }

      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.log(err));
