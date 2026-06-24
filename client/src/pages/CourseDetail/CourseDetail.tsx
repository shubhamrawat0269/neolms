import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@/redux/store";
import { fetchCourseById, clearCurrentCourse } from "@/redux/slice/courseSlice";
import { Section, Lesson } from "@/types";
import {
  FaPlay,
  FaLock,
  FaCheck,
  FaClock,
  FaUser,
  FaStar,
} from "react-icons/fa";

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentCourse, isLoading, error } = useSelector(
    (state: RootState) => state.courses,
  );
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );

  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(),
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchCourseById(id));
    }

    return () => {
      dispatch(clearCurrentCourse());
    };
  }, [id, dispatch]);

  // Toggle section expansion
  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  // Calculate total lessons
  const getTotalLessons = (sections: Section[] = []) => {
    return sections.reduce((acc, section) => acc + section.lessons.length, 0);
  };

  // Get total duration
  const getTotalDuration = (sections: Section[] = []) => {
    const totalSeconds = sections.reduce(
      (acc, section) =>
        acc + section.lessons.reduce((sum, lesson) => sum + lesson.duration, 0),
      0,
    );

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  // Format duration
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Error</h2>
          <p className="text-gray-600 mt-2">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!currentCourse) {
    return null;
  }

  const course = currentCourse;
  const totalLessons = getTotalLessons(course.sections);
  const totalDuration = getTotalDuration(course.sections);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Course Header */}
      <div className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h1 className="text-3xl lg:text-4xl font-bold mb-4">
                {course.title}
              </h1>
              {course.subtitle && (
                <p className="text-xl text-gray-300 mb-4">{course.subtitle}</p>
              )}
              <p className="text-gray-400 mb-6">{course.description}</p>

              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center">
                  <FaUser className="mr-2" />
                  <span>
                    {typeof course.instructor === "object"
                      ? course.instructor.name
                      : "Instructor"}
                  </span>
                </div>
                <div className="flex items-center">
                  <FaStar className="text-yellow-400 mr-2" />
                  <span>{course.rating.toFixed(1)}</span>
                  <span className="text-gray-400 ml-1">
                    ({course.totalReviews} reviews)
                  </span>
                </div>
                <div className="flex items-center">
                  <FaClock className="mr-2" />
                  <span>{totalDuration}</span>
                </div>
                <div>
                  <span>{totalLessons} lessons</span>
                </div>
                <div>
                  <span>{course.level}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-bold text-gray-900">
                      ${course.price.toFixed(2)}
                    </span>
                    {isAuthenticated && user?.role === "student" && (
                      <span className="text-sm text-gray-500">
                        {course.enrolledStudents} enrolled
                      </span>
                    )}
                  </div>

                  <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                    {isAuthenticated ? "Enroll Now" : "Login to Enroll"}
                  </button>

                  <p className="text-xs text-gray-500 text-center mt-2">
                    30-day money-back guarantee
                  </p>

                  <div className="mt-4 text-sm text-gray-600 space-y-2">
                    <p>✓ Full lifetime access</p>
                    <p>✓ Access on mobile and TV</p>
                    <p>✓ Certificate of completion</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* What You'll Learn */}
            {course.whatYouWillLearn && course.whatYouWillLearn.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h2 className="text-xl font-bold mb-4">What you'll learn</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {course.whatYouWillLearn.map((item, index) => (
                    <div key={index} className="flex items-start">
                      <FaCheck className="text-green-500 mt-1 mr-2 shrink-0" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Course Curriculum */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold">Course Curriculum</h2>
                <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                  <span>{course.sections?.length || 0} sections</span>
                  <span>•</span>
                  <span>{totalLessons} lessons</span>
                  <span>•</span>
                  <span>{totalDuration} total length</span>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {course.sections?.map((section: Section) => (
                  <div key={section._id} className="p-4">
                    <button
                      onClick={() => toggleSection(section._id || "")}
                      className="w-full flex items-center justify-between text-left"
                    >
                      <div>
                        <h3 className="font-semibold">{section.title}</h3>
                        {section.description && (
                          <p className="text-sm text-gray-500">
                            {section.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{section.lessons.length} lessons</span>
                        <span>
                          {expandedSections.has(section._id || "") ? "▼" : "▶"}
                        </span>
                      </div>
                    </button>

                    {expandedSections.has(section._id || "") && (
                      <div className="mt-3 space-y-2">
                        {section.lessons.map((lesson: Lesson) => (
                          <div
                            key={lesson._id}
                            className="flex items-center justify-between p-3 rounded hover:bg-gray-50"
                          >
                            <div className="flex items-center space-x-3">
                              {lesson.isPreview || isAuthenticated ? (
                                <FaPlay className="text-blue-600 text-sm" />
                              ) : (
                                <FaLock className="text-gray-400 text-sm" />
                              )}
                              <span className="text-sm">{lesson.title}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-500">
                              {lesson.duration > 0 && (
                                <span>{formatDuration(lesson.duration)}</span>
                              )}
                              {lesson.isPreview && (
                                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                                  Preview
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Requirements */}
            {course.requirements && course.requirements.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h3 className="font-semibold mb-3">Requirements</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  {course.requirements.map((req, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">•</span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Course Details */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold mb-3">Course Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Category</span>
                  <span className="font-medium">{course.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Level</span>
                  <span className="font-medium capitalize">{course.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Students</span>
                  <span className="font-medium">{course.enrolledStudents}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Last updated</span>
                  <span className="font-medium">
                    {new Date(course.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
