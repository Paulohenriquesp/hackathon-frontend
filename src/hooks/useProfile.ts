import { useMutation, useQueryClient } from '@tanstack/react-query';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface UpdateProfileData {
  name?: string;
  school?: string;
}

export function useProfile() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: UpdateProfileData) => {
      console.log('🔍 useProfile: Iniciando atualização de perfil...');
      console.log('🔍 useProfile: Dados:', data);
      console.log('🔍 useProfile: URL:', `${API_URL}/auth/profile`);
      console.log('🔍 useProfile: credentials:', 'include');
      console.log('🔍 useProfile: Cookies antes da requisição:', document.cookie);

      const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Envia cookies automaticamente
        body: JSON.stringify(data),
      });

      console.log('🔍 useProfile: Status da resposta:', response.status);
      console.log('🔍 useProfile: Headers da resposta:', Object.fromEntries(response.headers.entries()));
      console.log('🔍 useProfile: Cookies depois da requisição:', document.cookie);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ useProfile: Erro do servidor:', errorData);
        throw new Error(errorData.error || 'Erro ao atualizar perfil');
      }

      const result = await response.json();
      console.log('✅ useProfile: Resposta bem-sucedida:', result);

      if (result.success && result.data) {
        return result.data;
      }

      throw new Error('Resposta inválida do servidor');
    },
    onSuccess: (updatedUser) => {
      // Atualizar cache do AuthContext com os novos dados
      queryClient.setQueryData(['auth', 'verify'], updatedUser);
      console.log('✅ useProfile: Perfil atualizado e cache sincronizado');
    },
    onError: (error: any) => {
      console.error('❌ useProfile: Erro ao atualizar perfil:', error.message);
    },
  });

  return {
    updateProfile: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error?.message || null,
  };
}
