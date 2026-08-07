import mongoose from "mongoose";
import config from "./index.js";

// Cached across invocations so serverless platforms (Vercel) don't open
// a new MongoDB connection on every single request.
let cached = global._mongooseConnection;

if (!cached) {
  cached = global._mongooseConnection = { conn: null, promise: null };
}

export const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!config.databaseUrl) {
    throw new Error(
      "DATABASE_URL is not set. Copy .env.example to .env and add your MongoDB Atlas connection string."
    );
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(config.databaseUrl, {
        serverSelectionTimeoutMS: 8000,
      })
      .then((mongooseInstance) => mongooseInstance);
  }

  cached.conn = await cached.promise;
  console.log("MongoDB Atlas connected");
  return cached.conn;
};

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err.message);
});

export default connectDB;
