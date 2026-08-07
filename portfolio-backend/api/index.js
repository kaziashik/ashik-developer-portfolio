import app from "../src/app.js";
import { connectDB } from "../src/config/db.js";

// Vercel serverless handler. Ensures the (cached) DB connection is ready
// before handing the request to the same Express app used locally.
export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Database connection failed",
      detail: error.message,
    });
    return;
  }
    return app(req, res);
}
