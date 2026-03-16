import { apiClient } from './api';

interface LoginResponse {
  token: string;
  user: {
    username: string;
  };
}

export const login = async (username: string, password: string) => {
  const response = await apiClient.post<{ success: boolean; data?: LoginResponse; error?: { message: string } }>(
    '/auth/login',
    { username, password }
  );

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error?.message ?? 'Login failed');
  }

  const { token, user } = response.data.data;
  localStorage.setItem('auth_token', token);
  localStorage.setItem('auth_username', user.username);

  return user;
};

export const logout = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_username');
};

export const getCurrentUser = () => {
  const username = localStorage.getItem('auth_username');
  if (!username) return null;
  return { username };
};

