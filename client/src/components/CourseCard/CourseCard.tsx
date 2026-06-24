import React from "react";
import { Link } from "react-router-dom";
import { Course } from "@/types";

interface CourseCardProps {
  course: Course;
  featured?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  featured = false,
}) => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ${featured ? "border-2 border-blue-500" : ""}`}
    >
      <Link to={`/courses/${course._id}`}>
        <div className="relative">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-48 object-cover"
          />
          {featured && (
            <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
              Featured
            </span>
          )}
          {course.level && (
            <span
              className={`absolute bottom-2 left-2 text-xs px-2 py-1 rounded-full ${getLevelColor(course.level)}`}
            >
              {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
            </span>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/courses/${course._id}`}>
          <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
            {course.title}
          </h3>
        </Link>

        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
          {course.description}
        </p>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {course.instructor && typeof course.instructor === "object"
                ? course.instructor.name
                : "Instructor"}
            </span>
          </div>

          <div className="flex items-center space-x-1">
            <span className="text-yellow-400">★</span>
            <span className="text-sm font-medium">
              {course.rating.toFixed(1)}
            </span>
            <span className="text-xs text-gray-500">
              ({course.totalReviews})
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>{course.sections?.length || 0} sections</span>
            <span>•</span>
            <span>{course.enrolledStudents || 0} students</span>
          </div>

          <div className="flex items-center space-x-2">
            {course.price > 0 ? (
              <span className="text-lg font-bold text-gray-900">
                ${course.price.toFixed(2)}
              </span>
            ) : (
              <span className="text-lg font-bold text-green-600">Free</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
