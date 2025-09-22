import { LoginData, RegisterData, User, ApiResponse } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginResponse extends ApiResponse<AuthResponse> {}
export interface RegisterResponse extends ApiResponse<AuthResponse> {}
export interface ProfileResponse extends ApiResponse<User> {}

// Função auxiliar para fazer requisições com Authorization header
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}/auth${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${response.status}`);
  }

  return response.json();
};

export const authService = {
  async login(data: LoginData): Promise<LoginResponse> {
    try {
      console.log('🔍 authService: Fazendo login...');
      const responseData = await fetchWithAuth('/login', {
        method: 'POST',
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });
      
      // Salvar token no localStorage
      if (responseData.success && responseData.data.token) {
        localStorage.setItem('token', responseData.data.token);
        localStorage.setItem('user', JSON.stringify(responseData.data.user));
        console.log('✅ authService: Token salvo no localStorage');
      }
      
      console.log('✅ authService: Login bem-sucedido');
      return {
        success: true,
        data: responseData.data,
      };
    } catch (error: any) {
      console.error('❌ authService: Erro no login:', error);
      return {
        success: false,
        error: error.message || 'Erro interno do servidor',
        message: 'Falha no login',
      };
    }
  },

  async register(data: RegisterData): Promise<RegisterResponse> {
    try {
      console.log('🔍 authService: Fazendo registro...');
      const responseData = await fetchWithAuth('/register', {
        method: 'POST',
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          school: data.school || undefined,
        }),
      });
      
      // Salvar token no localStorage
      if (responseData.success && responseData.data.token) {
        localStorage.setItem('token', responseData.data.token);
        localStorage.setItem('user', JSON.stringify(responseData.data.user));
        console.log('✅ authService: Token salvo no localStorage');
      }
      
      console.log('✅ authService: Registro bem-sucedido');
      return {
        success: true,
        data: responseData.data,
      };
    } catch (error: any) {
      console.error('❌ authService: Erro no registro:', error);
      return {
        success: false,
        error: error.message || 'Erro interno do servidor',
        message: 'Falha no cadastro',
      };
    }
  },

  async verifyToken(): Promise<ApiResponse<User>> {
    try {
      console.log('🔍 authService: Verificando token...');
      const responseData = await fetchWithAuth('/verify');
      
      console.log('✅ authService: Token válido');
      return {
        success: true,
        data: responseData.data.user,
      };
    } catch (error: any) {
      console.error('❌ authService: Erro na verificação do token:', error);
      return {
        success: false,
        error: error.message || 'Token inválido',
        message: 'Sessão expirada',
      };
    }
  },

  async logout(): Promise<ApiResponse> {
    try {
      console.log('🔍 authService: Fazendo logout...');
      await fetchWithAuth('/logout', {
        method: 'POST',
      });
      
      // Limpar localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      console.log('✅ authService: Logout bem-sucedido, localStorage limpo');
      
      return {
        success: true,
      };
    } catch (error: any) {
      console.error('❌ authService: Erro no logout:', error);
      // Mesmo com erro, limpar localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return {
        success: true,
      };
    }
  },

  async getProfile(): Promise<ProfileResponse> {
    try {
      console.log('🔍 authService: Buscando perfil...');
      const responseData = await fetchWithAuth('/profile');
      
      return {
        success: true,
        data: responseData.data,
      };
    } catch (error: any) {
      console.error('❌ authService: Erro ao buscar perfil:', error);
      return {
        success: false,
        error: error.message || 'Erro interno do servidor',
        message: 'Falha ao carregar perfil',
      };
    }
  },
};