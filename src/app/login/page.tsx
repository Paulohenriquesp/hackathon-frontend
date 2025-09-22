'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContextNew';
import { useToast } from '@/components/ui/Toast';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  
  // Redirecionar se já estiver autenticado
  const { isAuthenticated, loading: authLoading } = useAuthRedirect('/dashboard', false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    try {
      const success = await login({ email, password });
      
      if (success) {
        showToast('Login realizado com sucesso! Bem-vindo de volta!', 'success', 2000);
        router.push('/dashboard');
      } else {
        showToast('Email ou senha inválidos.', 'error');
        setError('Email ou senha inválidos. Verifique seus dados e tente novamente.');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Erro ao fazer login. Tente novamente.';
      showToast(errorMessage, 'error');
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
              <span className="text-white font-bold text-lg">BD</span>
            </div>
            <CardTitle className="text-2xl">Fazer Login</CardTitle>
            <p className="text-gray-600 mt-2">
              Entre na sua conta para acessar o Banco Didático
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <Input
                type="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                icon={
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                }
              />

              <PasswordInput
                label="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
                required
              />

              <Button 
                type="submit" 
                className="w-full" 
                loading={loading}
                size="lg"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            <div className="mt-6">
              <div className="text-center">
                <span className="text-gray-600">Não tem uma conta? </span>
                <Link href="/register" className="text-blue-600 hover:text-blue-500 font-medium">
                  Cadastre-se aqui
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}