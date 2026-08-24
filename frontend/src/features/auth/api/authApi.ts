import api from '@/lib/axios';
import type { ApiResponse } from '@/types/api.types';
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  User,
} from '@/types/auth.types';

export const authApi = {
  register: (data: RegisterRequest) =>
    api.post<ApiResponse<User>>('/auth/register', data),

  login: (data: LoginRequest) =>
    api.post<ApiResponse<AuthResponse>>('/auth/login', data),

  refreshToken: (refreshToken: string) =>
    api.post<ApiResponse<AuthResponse>>('/auth/refresh', { refreshToken }),

  logout: (refreshToken: string) =>
    api.post('/auth/logout', { refreshToken }),

  verifyEmail: (token: string) =>
    api.get(`/auth/verify-email?token=${token}`),

  forgotPassword: (data: ForgotPasswordRequest) =>
    api.post('/auth/forgot-password', data),

  resetPassword: (data: ResetPasswordRequest) =>
    api.post('/auth/reset-password', data),

  getMe: () => api.get<ApiResponse<User>>('/users/me'),
};
