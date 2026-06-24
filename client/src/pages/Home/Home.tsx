import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState, useAppDispatch } from "@/redux/store";
import {
  fetchFeaturedCourses,
  fetchCategories,
} from "@/redux/slice/courseSlice";
import CourseCard from "@/components/CourseCard/CourseCard";
import { FaSearch, FaArrowRight } from "react-icons/fa";

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const { featuredCourses, categories, isLoading } = useSelector(
    (state: RootState) => state.courses,
  );
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchFeaturedCourses());
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/courses?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-linear-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Learn from the Best in Tech
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Build your skills with our comprehensive courses taught by
              industry experts
            </p>

            <form onSubmit={handleSearch} className="flex max-w-2xl mx-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What do you want to learn?"
                className="flex-1 px-6 py-3 rounded-l-lg text-gray-900 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 px-8 py-3 rounded-r-lg transition-colors flex items-center"
              >
                <FaSearch className="mr-2" />
                Search
              </button>
            </form>

            <div className="flex flex-wrap justify-center gap-3 mt-6">
              {categories.slice(0, 6).map((category) => (
                <Link
                  key={category}
                  to={`/courses?category=${encodeURIComponent(category)}`}
                  className="bg-blue-700 bg-opacity-50 hover:bg-opacity-70 px-4 py-2 rounded-full text-sm transition-colors"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">50+</div>
              <div className="text-gray-600">Courses</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">10,000+</div>
              <div className="text-gray-600">Students</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">100+</div>
              <div className="text-gray-600">Instructors</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">4.8</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Featured Courses
              </h2>
              <p className="text-gray-600 mt-1">Handpicked by our experts</p>
            </div>
            <Link
              to="/courses"
              className="text-blue-600 hover:text-blue-700 font-semibold flex items-center"
            >
              View All Courses
              <FaArrowRight className="ml-2" />
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCourses.map((course) => (
                <CourseCard key={course._id} course={course} featured />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Explore Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link
                key={category}
                to={`/courses?category=${encodeURIComponent(category)}`}
                className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow hover:border-blue-300"
              >
                <div className="text-4xl mb-2">
                  {category === "Web Development" && "🌐"}
                  {category === "Programming" && "💻"}
                  {category === "Frontend Development" && "🎨"}
                  {category === "Backend Development" && "⚙️"}
                  {category === "Database" && "🗄️"}
                  {category === "DevOps" && "🚀"}
                  {category === "Mobile Development" && "📱"}
                  {category === "Data Science" && "📊"}
                  {![
                    "Web Development",
                    "Programming",
                    "Frontend Development",
                    "Backend Development",
                    "Database",
                    "DevOps",
                    "Mobile Development",
                    "Data Science",
                  ].includes(category) && "📚"}
                </div>
                <h3 className="font-semibold text-gray-800">{category}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of students and start your learning journey today
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
