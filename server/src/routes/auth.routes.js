import express from "express";
import {
  login,
  logout,
  signup,
  refreshToken,
  getCurrentUser,
  updatePassword,
} from "../controllers/auth.controller.js";

import {
  validate,
  validateLogin,
  validateRegister,
} from "../middleware/validation.middleware.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes
router.post("/signup", validateRegister, validate, signup);
router.post("/login", validateLogin, validate, login);

// Protected routes
router.post("/logout", protect, logout);
router.get("/me", protect, getCurrentUser);
router.post("/refresh-token", protect, refreshToken);
router.put("/update-password", protect, updatePassword);

export default router;
