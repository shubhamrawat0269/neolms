import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { HTTP_STATUS } from "../config/constants.js";

// 1st Middleware : Protect routes - verify JWT token
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in cookies (preferred method for security)
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // Fallback to Authorization header
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      "Not authorized to access this route",
    );
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "User not found");
    }

    if (!user.isActive) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Account is deactivated");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid token");
    }
    if (error.name === "TokenExpiredError") {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Token expired");
    }
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, error.message);
  }
});

// 2nd Middleware : Authorize based on roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "User not authenticated");
    }

    if (!roles.includes(req.user.role)) {
      throw new ApiError(
        HTTP_STATUS.FORBIDDEN,
        `User role ${req.user.role} is not authorized to access this route`,
      );
    }

    next();
  };
};
