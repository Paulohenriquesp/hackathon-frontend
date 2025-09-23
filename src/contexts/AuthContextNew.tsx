'use client';

import React, { createContext, useContext, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthContextType, User, LoginData, RegisterData } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

interface AuthState {
  user: User | null;
  token: string | null;
}

class AuthStore {
  private state: AuthState = { user: null, token: null };
  private listeners: Set<() => void> = new Set();

  getState() {
    return this.state;
  }

  setState(newState: Partial<AuthState>) {
    this.state = { ...this.state, ...newState };
    this.listeners.forEach(listener => listener());
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  setAuth(user: User, token: string) {
    this.setState({ user, token });
  }

  clearAuth() {
    this.setState({ user: null, token: null });
  }

  getToken() {
    return this.state.token;
  }
}

const authStore = new AuthStore();

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook para usar o store de auth
function useAuthStore() {
  const [state, setState] = React.useState(authStore.getState());

  React.useEffect(() => {
    return authStore.subscribe(() => {
      setState(authStore.getState());
    });
  }, []);

  return state;
}

// Função para fazer requisições com token
export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = authStore.getToken();
  
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Token inválido, limpar auth
      authStore.clearAuth();
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${response.status}`);
  }

  return response.json();
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const authState = useAuthStore();
  const queryClient = useQueryClient();

  // Mutation para login
  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erro no login');
      }

      return response.json();
    },
    onSuccess: (response) => {
      if (response.success && response.data) {
        authStore.setAuth(response.data.user, response.data.token);
        console.log('✅ Login bem-sucedido, token armazenado em memória');
      }
    },
  });

  // Mutation para registro
  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erro no registro');
      }

      return response.json();
    },
    onSuccess: (response) => {
      if (response.success && response.data) {
        authStore.setAuth(response.data.user, response.data.token);
        console.log('✅ Registro bem-sucedido, token armazenado em memória');
      }
    },
  });

  // Query para verificar token (só executa se tiver token)
  const { isLoading } = useQuery({
    queryKey: ['auth', 'verify'],
    queryFn: async () => {
      return fetchWithAuth('/auth/verify');
    },
    enabled: !!authState.token,
    onSuccess: (response) => {
      if (response.success && response.data) {
        authStore.setState({ user: response.data.user });
        console.log('✅ Token verificado com sucesso');
      }
    },
    onError: (error) => {
      console.error('❌ Token inválido:', error);
      authStore.clearAuth();
    },
  });

  const login = async (data: LoginData): Promise<boolean> => {
    try {
      await loginMutation.mutateAsync(data);
      return true;
    } catch (error: any) {
      throw error;
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      await registerMutation.mutateAsync(data);
      return true;
    } catch (error: any) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Tentar chamar logout no backend (opcional)
      if (authState.token) {
        await fetchWithAuth('/auth/logout', { method: 'POST' }).catch(() => {
          // Ignorar erros de logout no backend
        });
      }
    } finally {
      // Sempre limpar estado local
      authStore.clearAuth();

      // Invalidar todo o cache do React Query para remover dados do usuário anterior
      queryClient.clear();

      console.log('✅ Logout realizado, memória e cache limpos');
    }
  };

  const isAuthenticated = !!authState.user && !!authState.token;
  const loading = loginMutation.isPending || registerMutation.isPending || (!!authState.token && isLoading);

  return (
    <AuthContext.Provider value={{
      user: authState.user,
      loading,
      login,
      register,
      logout,
      isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

// Export do store para uso em outros lugares
export { authStore };