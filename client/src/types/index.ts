export * from "./auth";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "student" | "admin";
  avatar?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Lesson {
  _id?: string;
  title: string;
  description?: string;
  videoUrl: string;
  duration: number;
  isPreview: boolean;
  order: number;
}

export interface Section {
  _id?: string;
  title: string;
  description?: string;
  lessons: Lesson[];
  order: number;
}

export interface Course {
  _id: string;
  title: string;
  subtitle?: string;
  description: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  thumbnail: string;
  price: number;
  instructor: User | string;
  sections: Section[];
  whatYouWillLearn: string[];
  requirements: string[];
  isPublished: boolean;
  enrolledStudents: number;
  rating: number;
  totalReviews: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Enrollment {
  _id: string;
  student: User | string;
  course: Course | string;
  progress: Map<string, number>;
  completedLessons: string[];
  completed: boolean;
  completionPercentage: number;
  paymentId: string;
  amount: number;
  lastAccessedAt: Date;
  enrolledAt: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  errors?: Array<{ field: string; message: string }>;
}

export interface PaginatedResponse<T> {
  courses: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface CourseState {
  courses: Course[];
  featuredCourses: Course[];
  currentCourse: Course | null;
  categories: string[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface UIState {
  isSidebarOpen: boolean;
  isModalOpen: boolean;
  modalType: string | null;
  toast: {
    show: boolean;
    type: "success" | "error" | "warning" | "info";
    message: string;
  };
}
