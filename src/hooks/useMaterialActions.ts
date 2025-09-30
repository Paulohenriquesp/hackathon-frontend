import { useMutation } from '@tanstack/react-query';
import { materialService } from '@/services/materialService';
import { useInvalidateQueries } from './useInvalidateQueries';

interface RatingData {
  rating: number;
  comment?: string;
}

/**
 * Hook para ações nos materiais com invalidação automática de cache
 * Segue princípios DRY e SOLID
 */
export function useMaterialActions() {
  const {
    invalidateDashboard,
    invalidateSpecificMaterial,
    invalidateMaterialQueries,
    invalidateAll
  } = useInvalidateQueries();

  // Mutation para download de material
  const downloadMutation = useMutation({
    mutationFn: async (materialId: string) => {
      const response = await materialService.downloadMaterial(materialId);
      return response;
    },
    onSuccess: (data, materialId) => {
      // Invalidar o material específico (para atualizar contador de downloads)
      invalidateSpecificMaterial(materialId);
      // Invalidar dashboard do usuário que fez download
      invalidateDashboard();
      // Invalidar queries gerais para refletir novos downloads
      invalidateMaterialQueries();
    },
    onError: (error) => {
      console.error('Erro ao fazer download:', error);
    },
  });

  // Mutation para avaliar material
  const rateMutation = useMutation({
    mutationFn: async ({ materialId, rating }: { materialId: string; rating: RatingData }) => {
      const response = await materialService.rateMaterial(materialId, rating);
      return response;
    },
    onSuccess: (data, { materialId }) => {
      // Invalidar o material específico (para atualizar avaliações)
      invalidateSpecificMaterial(materialId);
      // Invalidar queries gerais para refletir novas avaliações
      invalidateMaterialQueries();
      // Invalidar dashboard se o material avaliado for do usuário
      invalidateDashboard();
    },
    onError: (error) => {
      console.error('Erro ao avaliar material:', error);
    },
  });

  // Função para fazer download
  const downloadMaterial = async (materialId: string) => {
    try {
      const result = await downloadMutation.mutateAsync(materialId);

      if (result.success && result.data.downloadUrl) {
        // Abrir download em nova aba
        window.open(result.data.downloadUrl, '_blank');
        return result;
      } else {
        throw new Error('URL de download não encontrada');
      }
    } catch (error: any) {
      // Se erro 401, significa que precisa fazer login
      if (error.response?.status === 401 || error.message?.includes('Token de acesso')) {
        throw new Error('Você precisa fazer login para baixar materiais');
      }
      throw error;
    }
  };

  // Função para avaliar material
  const rateMaterial = async (materialId: string, rating: RatingData) => {
    try {
      const result = await rateMutation.mutateAsync({ materialId, rating });
      return result;
    } catch (error) {
      throw error;
    }
  };

  return {
    // Funções principais
    downloadMaterial,
    rateMaterial,

    // Estados das mutations
    download: {
      isLoading: downloadMutation.isPending,
      error: downloadMutation.error,
      isSuccess: downloadMutation.isSuccess,
    },
    rating: {
      isLoading: rateMutation.isPending,
      error: rateMutation.error,
      isSuccess: rateMutation.isSuccess,
    },

    // Reset functions
    resetDownload: downloadMutation.reset,
    resetRating: rateMutation.reset,
  };
}