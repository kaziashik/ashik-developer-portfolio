import express from "express";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import config from "./config/index.js";
import routes from "./routes/index.js";
import { globalErrorHandler } from "./middleware/globalErrorHandler.js";
import { notFound } from "./middleware/notFound.js";

const app = express();

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || config.clientUrls.includes(origin)) {
        callback(null, true);
        return;
      }
      if (config.nodeEnv === "development" && /^http:\/\/localhost:\d+$/.test(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    credentials: true,
    exposedHeaders: ["Content-Disposition"],
  })
);

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (config.nodeEnv === "development") {
  app.use(morgan("dev"));
}

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Portfolio backend is running",
    docs: "See README.md for the full API list",
  });
});

app.get("/health", (req, res) => {
  res.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=120");
  res.json({ success: true, message: "OK", timestamp: new Date().toISOString() });
});

app.use("/api", routes);

app.use(notFound);
app.use(globalErrorHandler);

export default app;
