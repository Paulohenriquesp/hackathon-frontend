'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContextType, User, LoginData, RegisterData } from '@/types';
import { authService } from '@/services/authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (token && savedUser) {
        console.log('🔍 AuthContext: Token e usuário encontrados no localStorage');
        
        // Primeiro, definir o usuário a partir do localStorage para evitar lag
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          console.log('✅ AuthContext: Usuário carregado do localStorage');
        } catch (e) {
          console.error('❌ AuthContext: Erro ao parsear usuário do localStorage');
        }
        
        // Depois, verificar se o token ainda é válido no servidor
        console.log('🔍 AuthContext: Verificando token no servidor...');
        const response = await authService.verifyToken();
        
        if (response.success && response.data) {
          console.log('✅ AuthContext: Token válido no servidor');
          setUser(response.data);
        } else {
          console.log('❌ AuthContext: Token inválido no servidor, limpando storage');
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          setUser(null);
        }
      } else {
        console.log('❌ AuthContext: Token ou usuário não encontrado no localStorage');
        setUser(null);
      }
    } catch (error) {
      console.error('❌ AuthContext: Erro ao verificar autenticação:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: LoginData): Promise<boolean> => {
    try {
      setLoading(true);
      
      console.log('🔍 AuthContext login: Iniciando login...');
      const response = await authService.login(data);
      console.log('🔍 AuthContext login: Resposta recebida:', response);
      
      if (response.success && response.data) {
        const { user } = response.data;
        
        console.log('✅ AuthContext login: Login bem-sucedido, token salvo no localStorage');
        setUser(user);
        
        return true;
      } else {
        console.error('❌ AuthContext login: Erro no login:', response.error || response.message);
        throw new Error(response.error || response.message || 'Erro no login');
      }
    } catch (error: any) {
      console.error('❌ AuthContext login: Erro no login:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      setLoading(true);
      
      console.log('🔍 AuthContext register: Iniciando registro...');
      const response = await authService.register(data);
      
      if (response.success && response.data) {
        const { user } = response.data;
        
        console.log('✅ AuthContext register: Registro bem-sucedido, token salvo no localStorage');
        setUser(user);
        
        return true;
      } else {
        console.error('❌ AuthContext register: Erro no registro:', response.error || response.message);
        throw new Error(response.error || response.message || 'Erro no registro');
      }
    } catch (error: any) {
      console.error('❌ AuthContext register: Erro no registro:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('🔍 AuthContext logout: Fazendo logout...');
      await authService.logout();
      console.log('✅ AuthContext logout: Logout bem-sucedido, localStorage limpo');
    } catch (error) {
      console.error('❌ AuthContext logout: Erro no logout:', error);
    } finally {
      setUser(null);
    }
  };

  const isAuthenticated = !!user;

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