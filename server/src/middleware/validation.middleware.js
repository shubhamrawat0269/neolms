import { body, validationResult } from "express-validator";
import ApiError from "../utils/apiError.js";
import { HTTP_STATUS } from "../config/constants.js";

// Validation rules for User Registration
export const validateRegister = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters")
    .isLength({ max: 50 })
    .withMessage("Name cannot exceed 50 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .matches(/^(?=.*[A-Za-z])(?=.*\d)/)
    .withMessage("Password must contain at least one letter and one number"),

  body("role")
    .optional()
    .isIn(["student", "admin"])
    .withMessage("Invalid role"),
];

// Validation rules for Login
export const validateLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("password").notEmpty().withMessage("Password is required"),
];

// Validation rules for Course Creation
export const validateCourse = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Course title is required")
    .isLength({ min: 5 })
    .withMessage("Title must be at least 5 characters")
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Course description is required")
    .isLength({ min: 20 })
    .withMessage("Description must be at least 20 characters"),

  body("category").trim().notEmpty().withMessage("Category is required"),

  body("thumbnail")
    .trim()
    .notEmpty()
    .withMessage("Thumbnail is required")
    .isURL()
    .withMessage("Thumbnail must be a valid URL"),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isNumeric()
    .withMessage("Price must be a number")
    .custom((value) => value >= 0)
    .withMessage("Price cannot be negative"),
];

// Validation result handler
export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => ({
      field: error.path,
      message: error.msg,
    }));

    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "Validation failed",
      errorMessages,
    );
  }

  next();
};
