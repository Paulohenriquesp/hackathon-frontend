'use client';

import React, { createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthContextType, User, LoginData, RegisterData } from '@/types';
import { authService } from '@/services/authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();

  // Query para verificar sessão (usa cookie HttpOnly automaticamente)
  const { data: authData, isLoading: isVerifying } = useQuery({
    queryKey: ['auth', 'verify'],
    queryFn: async () => {
      try {
        console.log('🔍 AuthContext: Verificando sessão com cookie HttpOnly...');

        const response = await fetch(`${API_URL}/auth/verify`, {
          method: 'GET',
          credentials: 'include', // Envia cookie automaticamente
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            console.log('ℹ️ AuthContext: Sessão expirada ou não encontrada');
            return null;
          }
          throw new Error('Erro ao verificar sessão');
        }

        const data = await response.json();
        console.log('✅ AuthContext: Sessão válida:', data.data?.user?.name);
        return data.data?.user || null;
      } catch (error: any) {
        console.log('ℹ️ AuthContext: Erro na verificação:', error.message);
        return null;
      }
    },
    retry: false, // Não retenta se falhar
    staleTime: 5 * 60 * 1000, // Considera dados válidos por 5 minutos
  });

  // Mutation para login
  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      const result = await authService.login(data);
      if (!result.success) {
        throw new Error(result.error || 'Erro no login');
      }
      return result.data!;
    },
    onSuccess: (data) => {
      // Atualizar cache com dados do usuário
      queryClient.setQueryData(['auth', 'verify'], data.user);
      console.log('✅ AuthContext: Login bem-sucedido');
    },
    onError: (error: any) => {
      console.error('❌ AuthContext: Erro no login:', error.message);
    },
  });

  // Mutation para registro
  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      const result = await authService.register(data);
      if (!result.success) {
        throw new Error(result.error || 'Erro no registro');
      }
      return result.data!;
    },
    onSuccess: (data) => {
      // Atualizar cache com dados do usuário
      queryClient.setQueryData(['auth', 'verify'], data.user);
      console.log('✅ AuthContext: Registro bem-sucedido');
    },
    onError: (error: any) => {
      console.error('❌ AuthContext: Erro no registro:', error.message);
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
      // Chamar logout no backend (limpa cookie)
      await authService.logout();

      // Limpar cache local
      queryClient.setQueryData(['auth', 'verify'], null);
      queryClient.clear();

      console.log('✅ AuthContext: Logout realizado, cookie limpo pelo servidor');
    } catch (error) {
      console.error('❌ AuthContext: Erro no logout:', error);
      // Mesmo com erro, limpar cache local
      queryClient.setQueryData(['auth', 'verify'], null);
      queryClient.clear();
    }
  };

  const user = authData || null;
  const isAuthenticated = !!user;
  const loading = loginMutation.isPending || registerMutation.isPending || isVerifying;

  return (
    <AuthContext.Provider value={{
      user,
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
