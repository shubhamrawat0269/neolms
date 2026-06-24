import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Course, CourseState, PaginatedResponse } from "@/types";
import { apiService } from "@/services/api";

// Async Thunks
export const fetchCourses = createAsyncThunk(
  "courses/fetchCourses",
  async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", String(params.page));
    if (params?.limit) queryParams.append("limit", String(params.limit));
    if (params?.category) queryParams.append("category", params.category);
    if (params?.search) queryParams.append("search", params.search);

    const url = `/courses${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    const response = await apiService.get<PaginatedResponse<Course>>(url);
    return response;
  },
);

export const fetchFeaturedCourses = createAsyncThunk(
  "courses/fetchFeaturedCourses",
  async () => {
    const response = await apiService.get<Course[]>("/courses/featured");
    return response;
  },
);

export const fetchCourseById = createAsyncThunk(
  "courses/fetchCourseById",
  async (id: string) => {
    const response = await apiService.get<Course>(`/courses/${id}`);
    return response;
  },
);

export const fetchCategories = createAsyncThunk(
  "courses/fetchCategories",
  async () => {
    const response = await apiService.get<string[]>("/categories");
    return response;
  },
);

// Admin Thunks
export const createCourse = createAsyncThunk(
  "courses/createCourse",
  async (courseData: Partial<Course>) => {
    const response = await apiService.post<Course>(
      "/admin/courses",
      courseData,
    );
    return response;
  },
);

export const updateCourse = createAsyncThunk(
  "courses/updateCourse",
  async ({ id, data }: { id: string; data: Partial<Course> }) => {
    const response = await apiService.put<Course>(`/admin/courses/${id}`, data);
    return response;
  },
);

export const deleteCourse = createAsyncThunk(
  "courses/deleteCourse",
  async (id: string) => {
    await apiService.delete(`/admin/courses/${id}`);
    return id;
  },
);

const initialState: CourseState = {
  courses: [],
  featuredCourses: [],
  currentCourse: null,
  categories: [],
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
};

const courseSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    clearCurrentCourse: (state) => {
      state.currentCourse = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Courses
      .addCase(fetchCourses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.courses = action.payload.courses;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch courses";
      })
      // Fetch Featured Courses
      .addCase(fetchFeaturedCourses.fulfilled, (state, action) => {
        state.featuredCourses = action.payload;
      })
      // Fetch Course By ID
      .addCase(fetchCourseById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCourse = action.payload;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch course";
      })
      // Fetch Categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      // Create Course
      .addCase(createCourse.fulfilled, (state, action) => {
        state.courses.unshift(action.payload);
      })
      // Update Course
      .addCase(updateCourse.fulfilled, (state, action) => {
        const index = state.courses.findIndex(
          (c) => c._id === action.payload._id,
        );
        if (index !== -1) {
          state.courses[index] = action.payload;
        }
        if (state.currentCourse?._id === action.payload._id) {
          state.currentCourse = action.payload;
        }
      })
      // Delete Course
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.courses = state.courses.filter((c) => c._id !== action.payload);
        if (state.currentCourse?._id === action.payload) {
          state.currentCourse = null;
        }
      });
  },
});

export const { clearCurrentCourse, clearError } = courseSlice.actions;
export default courseSlice.reducer;
