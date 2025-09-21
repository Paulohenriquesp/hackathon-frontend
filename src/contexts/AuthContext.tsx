'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContextType, User, LoginData, RegisterData } from '@/types';

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
      const savedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      if (savedUser && token) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: LoginData): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Simular login (substituir por API real)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: '1',
        name: 'Professor Teste',
        email: data.email,
        school: 'Escola Exemplo',
        materialsCount: 5,
        createdAt: new Date().toISOString()
      };
      
      const mockToken = 'mock-token-' + Date.now();
      
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('token', mockToken);
      setUser(mockUser);
      
      return true;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Simular registro (substituir por API real)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: '1',
        name: data.name,
        email: data.email,
        school: data.school || '',
        materialsCount: 0,
        createdAt: new Date().toISOString()
      };
      
      const mockToken = 'mock-token-' + Date.now();
      
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('token', mockToken);
      setUser(mockUser);
      
      return true;
    } catch (error) {
      console.error('Erro no registro:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
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