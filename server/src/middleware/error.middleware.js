import ApiError from "../utils/apiError.js";
import { HTTP_STATUS } from "../config/constants.js";

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error("Error:", err);

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    const message = `Duplicate value for ${field}. Please use another value.`;
    error = new ApiError(HTTP_STATUS.CONFLICT, message);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ApiError(HTTP_STATUS.BAD_REQUEST, message.join(", "));
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === "CastError") {
    const message = `Invalid ${err.path}: ${err.value}`;
    error = new ApiError(HTTP_STATUS.BAD_REQUEST, message);
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    error = new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid token");
  }

  if (err.name === "TokenExpiredError") {
    error = new ApiError(HTTP_STATUS.UNAUTHORIZED, "Token expired");
  }

  // Send response
  const statusCode = error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message = error.message || "Internal Server Error";
  const errors = error.errors || [];

  return res.status(statusCode).json({
    success: false,
    message,
    errors,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

export default errorHandler;
