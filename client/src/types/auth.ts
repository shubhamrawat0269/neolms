export interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null | unknown;
}

export interface SignupCredentials {
  email: string;
  password: string;
  name: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupResponse {
  user: User;
  token?: string;
}

export interface LoginResponse {
  user: User;
  token?: string;
}
