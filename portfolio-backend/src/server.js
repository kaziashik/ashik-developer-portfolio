import app from "./app.js";
import config from "./config/index.js";
import { connectDB } from "./config/db.js";

let server;

const main = async () => {
  try {
    await connectDB();

    server = app.listen(config.port, () => {
      console.log(`Portfolio backend listening on port ${config.port} [${config.nodeEnv}]`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

main();

// Safety nets — log and shut down gracefully instead of an unhandled crash
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  if (server) server.close(() => process.exit(0));
});
