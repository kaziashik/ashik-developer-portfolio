import config from "../config/index.js";

// eslint-disable-next-line no-unused-vars
export const globalErrorHandler = (err, req, res, next) => {
  console.error(err);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";
  let errors = null;

  if (err.name === "ValidationError") {
    // Mongoose schema validation failed
    statusCode = 400;
    message = "Validation failed";
    errors = Object.fromEntries(
      Object.entries(err.errors || {}).map(([field, e]) => [field, e.message])
    );
  } else if (err.name === "CastError") {
    // Bad ObjectId in a URL param, e.g. GET /api/projects/not-a-real-id
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  } else if (err.code === 11000) {
    // Duplicate key (e.g. two admins with the same email)
    statusCode = 400;
    const field = Object.keys(err.keyValue || { field: "value" })[0];
    message = `${field} already exists`;
  } else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token has expired";
  } else if (err.name === "MulterError") {
    statusCode = 400;
    message = err.code === "LIMIT_FILE_SIZE" ? "PDF must be 10 MB or smaller" : err.message;
  } else if (err.type === "entity.parse.failed") {
    // Malformed JSON body sent by the client
    statusCode = 400;
    message = "Invalid JSON in request body";
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    ...(errors && { errors }),
    ...(config.nodeEnv === "development" && { stack: err.stack }),
  });
};

export default globalErrorHandler;
