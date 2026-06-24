import cors from "cors";
import helmet from "helmet";
import express from "express";
import cookieParser from "cookie-parser";

// Import routes
import authRoutes from "./routes/auth.routes.js";
import courseRoutes from "./routes/course.routes.js";
import adminRoutes from "./routes/admin.routes.js";

// Import middleware
import errorHandler from "./middleware/error.middleware.js";

// Import utilities
import ApiError from "./utils/apiError.js";
import { HTTP_STATUS } from "./config/constants.js";

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/courses", courseRoutes);

// 404 handler
app.use((req, res, next) => {
  next(
    new ApiError(HTTP_STATUS.NOT_FOUND, `Route ${req.originalUrl} not found`),
  );
});

// Global error handler
app.use(errorHandler);

export default app;
