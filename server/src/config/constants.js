export const USER_ROLES = {
  STUDENT: "student",
  ADMIN: "admin",
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

export const MESSAGES = {
  USER_EXISTS: "User already exists with this email",
  USER_NOT_FOUND: "User not found",
  INVALID_CREDENTIALS: "Invalid email or password",
  UNAUTHORIZED: "Unauthorized access",
  FORBIDDEN: "Forbidden access",
  COURSE_NOT_FOUND: "Course not found",
  ENROLLMENT_EXISTS: "Already enrolled in this course",
};
