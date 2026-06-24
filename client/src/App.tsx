import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider, useSelector } from "react-redux";
import { RootState, store } from "./redux/store";

// Layout
import Layout from "./components/Layout/Layout";

// Public Pages
import Home from "./pages/Home/Home";
import CourseDetail from "./pages/CourseDetail/CourseDetail";
import Courses from "./pages/Courses/Courses";

// Auth Pages
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

// Admin Pages
import CourseList from "./pages/Admin/CourseList/CourseList";
import CourseForm from "./pages/Admin/CourseForm/CourseForm";

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "student";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth,
  );

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetail />} />

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Admin Routes */}
            <Route
              path="/admin/courses"
              element={
                <ProtectedRoute requiredRole="admin">
                  <CourseList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/courses/new"
              element={
                <ProtectedRoute requiredRole="admin">
                  <CourseForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/courses/:id/edit"
              element={
                <ProtectedRoute requiredRole="admin">
                  <CourseForm />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </Router>
    </Provider>
  );
};

export default App;
