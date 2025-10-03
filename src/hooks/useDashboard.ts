import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { materialService } from '@/services/materialService';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardStats {
  totalMaterials: number;
  totalDownloads: number;
  averageRating: number;
  thisMonthUploads: number;
}

interface UseDashboardReturn {
  materials: any[];
  stats: DashboardStats;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useDashboard(): UseDashboardReturn {
  const { user, isAuthenticated } = useAuth();

  // Query para materiais do usuário (apenas se autenticado)
  const {
    data: myMaterialsData,
    isLoading: materialsLoading,
    error: materialsError,
    refetch: refetchMaterials
  } = useQuery({
    queryKey: ['materials', 'my-materials', 'dashboard', user?.id],
    queryFn: () => materialService.getMyMaterials({ page: 1, limit: 100 }), // Buscar todos (até 100)
    enabled: !!isAuthenticated && !!user?.id,
    staleTime: 1000 * 60 * 2, // 2 minutos
    retry: 1,
  });

  // Query para estatísticas (apenas se autenticado)
  const {
    data: statsData,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats
  } = useQuery({
    queryKey: ['materials', 'stats', user?.id],
    queryFn: () => materialService.getStats(),
    enabled: !!isAuthenticated && !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: 1,
  });

  // Função de refresh unificada
  const refresh = () => {
    refetchMaterials();
    refetchStats();
  };

  // Memoização dos materiais processados
  const materials = useMemo(() => {
    // Se não autenticado, retorna array vazio
    if (!isAuthenticated) return [];
    return myMaterialsData?.data?.materials || [];
  }, [myMaterialsData, isAuthenticated]);

  // Memoização das estatísticas calculadas
  const stats = useMemo((): DashboardStats => {
    // Se não autenticado, retorna estatísticas zeradas
    if (!isAuthenticated) {
      return {
        totalMaterials: 0,
        totalDownloads: 0,
        averageRating: 0,
        thisMonthUploads: 0
      };
    }

    const userMaterials = myMaterialsData?.data?.materials || [];

    // Cálculo de estatísticas do usuário atual
    const totalMaterials = myMaterialsData?.data?.pagination?.count || 0;

    const totalDownloads = userMaterials.reduce((sum, material) =>
      sum + (material.downloadCount || 0), 0
    );

    const averageRating = userMaterials.length > 0
      ? userMaterials.reduce((sum, material) => sum + (material.avgRating || 0), 0) / userMaterials.length
      : 0;

    // Materiais criados este mês
    const thisMonthUploads = userMaterials.filter(material => {
      const createdAt = new Date(material.createdAt);
      const now = new Date();
      return createdAt.getMonth() === now.getMonth() &&
             createdAt.getFullYear() === now.getFullYear();
    }).length;

    return {
      totalMaterials,
      totalDownloads,
      averageRating,
      thisMonthUploads
    };
  }, [myMaterialsData, isAuthenticated]);

  // Estados unificados
  const loading = isAuthenticated && (materialsLoading || statsLoading);
  const error = (materialsError?.message || statsError?.message || null);

  return {
    materials,
    stats,
    loading,
    error,
    refresh
  };
}