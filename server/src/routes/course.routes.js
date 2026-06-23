import express from "express";
import {
  getAllCourses,
  getCourseById,
  getFeaturedCourses,
  getCoursesByCategory,
  getCategories,
} from "../controllers/course.controller.js";

const router = express.Router();

router.get("/", getAllCourses);
router.get("/featured", getFeaturedCourses);
router.get("/categories", getCategories);
router.get("/categories/:category", getCoursesByCategory);
router.get("/:id", getCourseById);

export default router;
