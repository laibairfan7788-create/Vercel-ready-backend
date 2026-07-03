const mongoose = require('mongoose');

// Cache the connection promise on the module scope so that repeated
// serverless invocations (warm starts) reuse the same connection
// instead of opening a new one on every request. This is important
// on Vercel, where MongoDB Atlas has a limited connection pool.
let cachedConnectionPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    // Already connected
    return mongoose.connection;
  }

  if (!cachedConnectionPromise) {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      throw new Error(
        'MONGODB_URI is not set. Add it to your .env file locally, or under ' +
          'Project Settings -> Environment Variables on Vercel.'
      );
    }

    cachedConnectionPromise = mongoose
      .connect(uri)
      .then((conn) => {
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
      })
      .catch((error) => {
        cachedConnectionPromise = null; // allow retry on next invocation
        console.error(`MongoDB connection error: ${error.message}`);
        throw error;
      });
  }

  return cachedConnectionPromise;
};

module.exports = connectDB;
