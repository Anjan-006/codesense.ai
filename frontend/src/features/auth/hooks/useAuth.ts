import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '@/features/auth/api/authApi';
import { useAuthStore } from '@/store/authStore';
import type { LoginRequest, RegisterRequest } from '@/types/auth.types';

/**
 * Custom hook encapsulating all auth operations with TanStack Query.
 * Handles mutations for login/register and queries for session restoration.
 */
export function useAuth() {
  const navigate = useNavigate();
  const { login: storeLogin, logout: storeLogout, setUser, setLoading } = useAuthStore();

  // ─── Fetch current user (session restoration) ─────────────────
  const { isLoading: isLoadingUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const response = await authApi.getMe();
      setUser(response.data.data);
      return response.data.data;
    },
    enabled: !!localStorage.getItem('accessToken'),
    retry: false,
    meta: {
      onError: () => {
        storeLogout();
        setLoading(false);
      },
    },
  });

  // ─── Register ─────────────────────────────────────────────────
  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: (response) => {
      toast.success(response.data.message || 'Registration successful!');
      navigate('/login');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
    },
  });

  // ─── Login ────────────────────────────────────────────────────
  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (response) => {
      const { accessToken, refreshToken, user } = response.data.data;
      storeLogin(user, accessToken, refreshToken);
      toast.success(`Welcome back, ${user.firstName}!`);
      navigate('/dashboard');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
    },
  });

  // ─── Logout ───────────────────────────────────────────────────
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    },
    onSettled: () => {
      storeLogout();
      toast.success('Logged out successfully');
      navigate('/login');
    },
  });

  return {
    isLoadingUser,
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
}
