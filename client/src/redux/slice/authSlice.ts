import axios, { AxiosError } from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type {
  AuthState,
  SignupCredentials,
  LoginCredentials,
  SignupResponse,
  LoginResponse,
} from "../../types";

// API instance
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Async thunks
export const signup = createAsyncThunk<
  SignupResponse,
  SignupCredentials,
  {
    rejectValue: unknown;
  }
>("auth/signup", async (userData, { rejectWithValue }) => {
  try {
    const response = await api.post<{ data: SignupResponse }>(
      "/auth/signup",
      userData,
    );
    return response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    return rejectWithValue(axiosError.response?.data);
  }
});

export const login = createAsyncThunk<
  LoginResponse,
  LoginCredentials,
  {
    rejectValue: unknown;
  }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.post<{ data: LoginResponse }>(
      "/auth/login",
      credentials,
    );
    return response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    return rejectWithValue(axiosError.response?.data);
  }
});

export const logout = createAsyncThunk<
  null,
  void,
  {
    rejectValue: unknown;
  }
>("auth/logout", async (_, { rejectWithValue }) => {
  try {
    await api.post("/auth/logout");
    return null;
  } catch (error) {
    const axiosError = error as AxiosError;
    return rejectWithValue(axiosError.response?.data);
  }
});

export const getCurrentUser = createAsyncThunk<
  SignupResponse,
  void,
  {
    rejectValue: unknown;
  }
>("auth/getCurrentUser", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<{ data: SignupResponse }>("/auth/me");
    return response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    return rejectWithValue(axiosError.response?.data);
  }
});

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Signup
      .addCase(signup.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
      })
      // Get Current User
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
