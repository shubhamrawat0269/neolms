import ApiError from "../utils/apiError.js";
import Course from "../models/Course.model.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { HTTP_STATUS } from "../config/constants.js";

// @desc    Get all courses (public)
// @route   GET /api/courses
// @access  Public
export const getAllCourses = asyncHandler(async (req, res) => {
  const {
    category,
    level,
    search,
    page = 1,
    limit = 10,
    sort = "-createdAt",
  } = req.query;

  // Build query
  const query = { isPublished: true };

  if (category) {
    query.category = category;
  }

  if (level) {
    query.level = level;
  }

  if (search) {
    query.$text = { $search: search };
  }

  // Pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Execute query
  const courses = await Course.find(query)
    .populate("instructor", "name email")
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));

  const totalCourses = await Course.countDocuments(query);

  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(
      HTTP_STATUS.OK,
      {
        courses,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalCourses,
          pages: Math.ceil(totalCourses / parseInt(limit)),
        },
      },
      "Courses fetched successfully",
    ),
  );
});

// @desc    Get single course (public)
// @route   GET /api/courses/:id
// @access  Public
export const getCourseById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const course = await Course.findById(id).populate("instructor", "name email");

  if (!course) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Course not found");
  }

  // Check if course is published or user is instructor/admin
  if (!course.isPublished) {
    // Check if user is instructor or admin
    if (
      !req.user ||
      (req.user._id.toString() !== course.instructor._id.toString() &&
        req.user.role !== "admin")
    ) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Course not found");
    }
  }

  res
    .status(HTTP_STATUS.OK)
    .json(
      new ApiResponse(HTTP_STATUS.OK, course, "Course fetched successfully"),
    );
});

// @desc    Get featured courses
// @route   GET /api/courses/featured
// @access  Public
export const getFeaturedCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({ isPublished: true })
    .sort({ enrolledStudents: -1, rating: -1 })
    .limit(6)
    .populate("instructor", "name");

  res
    .status(HTTP_STATUS.OK)
    .json(
      new ApiResponse(
        HTTP_STATUS.OK,
        courses,
        "Featured courses fetched successfully",
      ),
    );
});

// @desc    Get courses by category
// @route   GET /api/courses/categories/:category
// @access  Public
export const getCoursesByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;
  const { limit = 10 } = req.query;

  const courses = await Course.find({
    isPublished: true,
    category: category,
  })
    .limit(parseInt(limit))
    .populate("instructor", "name");

  res
    .status(HTTP_STATUS.OK)
    .json(
      new ApiResponse(
        HTTP_STATUS.OK,
        courses,
        "Courses fetched by category successfully",
      ),
    );
});

// @desc    Get unique categories
// @route   GET /api/categories
// @access  Public
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Course.distinct("category", { isPublished: true });

  res
    .status(HTTP_STATUS.OK)
    .json(
      new ApiResponse(
        HTTP_STATUS.OK,
        categories,
        "Categories fetched successfully",
      ),
    );
});
