import Course from "../models/Course.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { HTTP_STATUS } from "../config/constants.js";

// @desc    Get all courses (admin)
// @route   GET /api/admin/courses
// @access  Private/Admin
export const getAdminCourses = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search } = req.query;

  const query = {};
  if (search) {
    query.$text = { $search: search };
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const courses = await Course.find(query)
    .populate("instructor", "name email")
    .sort("-createdAt")
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Course.countDocuments(query);

  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(
      HTTP_STATUS.OK,
      {
        courses,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
      "Courses fetched successfully",
    ),
  );
});

// @desc    Create course
// @route   POST /api/admin/courses
// @access  Private/Admin
export const createCourse = asyncHandler(async (req, res) => {
  const courseData = {
    ...req.body,
    instructor: req.user._id,
  };

  const course = await Course.create(courseData);

  res
    .status(HTTP_STATUS.CREATED)
    .json(
      new ApiResponse(
        HTTP_STATUS.CREATED,
        course,
        "Course created successfully",
      ),
    );
});

// @desc    Update course
// @route   PUT /api/admin/courses/:id
// @access  Private/Admin
export const updateCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const course = await Course.findById(id);
  if (!course) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Course not found");
  }

  const updatedCourse = await Course.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res
    .status(HTTP_STATUS.OK)
    .json(
      new ApiResponse(
        HTTP_STATUS.OK,
        updatedCourse,
        "Course updated successfully",
      ),
    );
});

// @desc    Delete course
// @route   DELETE /api/admin/courses/:id
// @access  Private/Admin
export const deleteCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const course = await Course.findById(id);
  if (!course) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Course not found");
  }

  await course.deleteOne();

  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, null, "Course deleted successfully"));
});
