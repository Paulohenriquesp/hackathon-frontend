import axios from 'axios';
import { LoginData, RegisterData, User, ApiResponse } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginResponse extends ApiResponse<AuthResponse> {}
export interface RegisterResponse extends ApiResponse<AuthResponse> {}
export interface ProfileResponse extends ApiResponse<User> {}

const authAPI = axios.create({
  baseURL: `${API_URL}/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token em todas as requisições
authAPI.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas e erros
authAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido, limpar storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  async login(data: LoginData): Promise<LoginResponse> {
    try {
      const response = await authAPI.post<AuthResponse>('/login', {
        email: data.email,
        password: data.password,
      });
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error('Erro no login:', error);
      
      return {
        success: false,
        error: error.response?.data?.error || 'Erro interno do servidor',
        message: error.response?.data?.message || 'Falha no login',
      };
    }
  },

  async register(data: RegisterData): Promise<RegisterResponse> {
    try {
      const response = await authAPI.post<AuthResponse>('/register', {
        name: data.name,
        email: data.email,
        password: data.password,
        school: data.school || undefined,
      });
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error('Erro no registro:', error);
      
      return {
        success: false,
        error: error.response?.data?.error || 'Erro interno do servidor',
        message: error.response?.data?.message || 'Falha no cadastro',
      };
    }
  },

  async getProfile(): Promise<ProfileResponse> {
    try {
      const response = await authAPI.get<User>('/profile');
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error('Erro ao buscar perfil:', error);
      
      return {
        success: false,
        error: error.response?.data?.error || 'Erro interno do servidor',
        message: error.response?.data?.message || 'Falha ao carregar perfil',
      };
    }
  },

  async updateProfile(data: { name?: string; school?: string }): Promise<ProfileResponse> {
    try {
      const response = await authAPI.put<User>('/profile', data);
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      
      return {
        success: false,
        error: error.response?.data?.error || 'Erro interno do servidor',
        message: error.response?.data?.message || 'Falha ao atualizar perfil',
      };
    }
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse> {
    try {
      const response = await authAPI.post('/change-password', {
        currentPassword,
        newPassword,
      });
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error('Erro ao alterar senha:', error);
      
      return {
        success: false,
        error: error.response?.data?.error || 'Erro interno do servidor',
        message: error.response?.data?.message || 'Falha ao alterar senha',
      };
    }
  },

  async logout(): Promise<ApiResponse> {
    try {
      await authAPI.post('/logout');
      
      return {
        success: true,
      };
    } catch (error: any) {
      console.error('Erro no logout:', error);
      
      // Mesmo com erro, ainda queremos limpar o localStorage
      return {
        success: true,
      };
    }
  },

  async verifyToken(): Promise<ApiResponse<User>> {
    try {
      const response = await authAPI.get<User>('/verify');
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error('Erro na verificação do token:', error);
      
      return {
        success: false,
        error: error.response?.data?.error || 'Token inválido',
        message: error.response?.data?.message || 'Sessão expirada',
      };
    }
  },
};