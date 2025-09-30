import { useState } from 'react';
import { authStore } from '@/contexts/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface UpdateProfileData {
  name?: string;
  school?: string;
}

export function useProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = async (data: UpdateProfileData) => {
    setLoading(true);
    setError(null);

    try {
      const token = authStore.getToken();

      if (!token) {
        throw new Error('Não autenticado');
      }

      const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erro ao atualizar perfil');
      }

      const result = await response.json();

      if (result.success && result.data) {
        // Atualizar o authStore com os novos dados
        authStore.setAuth(result.data, token);
        return result.data;
      }

      throw new Error('Resposta inválida do servidor');
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao atualizar perfil';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateProfile,
    loading,
    error,
  };
}
