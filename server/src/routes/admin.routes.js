import express from "express";
import {
  createCourse,
  updateCourse,
  deleteCourse,
  getAdminCourses,
} from "../controllers/admin.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";
import {
  validateCourse,
  validate,
} from "../middleware/validation.middleware.js";
import { USER_ROLES } from "../config/constants.js";

const router = express.Router();

// All admin routes are protected and require admin role
router.use(protect);
router.use(authorize(USER_ROLES.ADMIN));

// Course management
router.get("/courses", getAdminCourses);
router.post("/courses", validateCourse, validate, createCourse);
router.put("/courses/:id", validateCourse, validate, updateCourse);
router.delete("/courses/:id", deleteCourse);

export default router;
