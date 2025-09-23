import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContextNew';

/**
 * Hook para invalidação de queries de materiais
 * Segue o padrão DRY e centraliza a lógica de invalidação
 */
export function useInvalidateQueries() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const invalidateMaterialQueries = () => {
    // Invalida todas as queries relacionadas a materiais
    queryClient.invalidateQueries({ queryKey: ['materials'] });
  };

  const invalidateUserMaterials = () => {
    // Invalida especificamente os materiais do usuário atual
    if (user?.id) {
      queryClient.invalidateQueries({
        queryKey: ['materials', 'my-materials', 'dashboard', user.id]
      });
      queryClient.invalidateQueries({
        queryKey: ['materials', 'my-materials']
      });
    }
  };

  const invalidateStats = () => {
    // Invalida estatísticas globais e do usuário
    queryClient.invalidateQueries({ queryKey: ['materials', 'stats'] });
  };

  const invalidateDashboard = () => {
    // Invalida todo o dashboard do usuário atual
    invalidateUserMaterials();
    invalidateStats();
  };

  const invalidateSpecificMaterial = (materialId: string) => {
    // Invalida um material específico
    queryClient.invalidateQueries({
      queryKey: ['materials', materialId]
    });
  };

  const invalidateAll = () => {
    // Invalida todas as queries de materiais (usar com cuidado)
    invalidateMaterialQueries();
    invalidateStats();
  };

  return {
    invalidateMaterialQueries,
    invalidateUserMaterials,
    invalidateStats,
    invalidateDashboard,
    invalidateSpecificMaterial,
    invalidateAll
  };
}