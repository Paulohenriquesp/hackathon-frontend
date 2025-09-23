import { useState, useEffect, useCallback } from 'react';
import { materialService, Material, MaterialFilters, PaginationParams } from '@/services/materialService';

interface UseMaterialsState {
  materials: Material[];
  loading: boolean;
  error: string | null;
  pagination: {
    current: number;
    total: number;
    count: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
  } | null;
  stats: {
    totalMaterials: number;
    avgRating: number;
    avgDownloads: number;
  } | null;
}

interface UseMaterialsReturn extends UseMaterialsState {
  searchMaterials: (filters: MaterialFilters, pagination?: PaginationParams) => Promise<void>;
  loadMore: () => Promise<void>;
  resetSearch: () => void;
  refresh: () => Promise<void>;
}

export function useMaterials(
  initialFilters: MaterialFilters = {},
  initialPagination: PaginationParams = { page: 1, limit: 12 }
): UseMaterialsReturn {
  const [state, setState] = useState<UseMaterialsState>({
    materials: [],
    loading: false,
    error: null,
    pagination: null,
    stats: null
  });

  const [currentFilters, setCurrentFilters] = useState<MaterialFilters>(initialFilters);
  const [currentPagination, setCurrentPagination] = useState<PaginationParams>(initialPagination);

  const searchMaterials = useCallback(async (
    filters: MaterialFilters = {}, 
    pagination: PaginationParams = { page: 1, limit: 12 }
  ) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await materialService.getMaterials(filters, pagination);
      
      if (response.success) {
        setState(prev => ({
          ...prev,
          materials: pagination.page === 1 ? response.data.materials : [...prev.materials, ...response.data.materials],
          pagination: response.data.pagination,
          stats: response.data.stats,
          loading: false
        }));

        setCurrentFilters(filters);
        setCurrentPagination(pagination);
      } else {
        setState(prev => ({
          ...prev,
          error: 'Erro ao carregar materiais',
          loading: false
        }));
      }
    } catch (error: any) {
      console.error('Erro ao buscar materiais:', error);

      // Se o erro for 404 ou indicar que não há materiais, não mostrar como erro
      const isEmptyResult = error.response?.status === 404 ||
                           error.response?.data?.message?.includes('Nenhum material encontrado') ||
                           error.response?.data?.error?.includes('Nenhum material encontrado');

      if (isEmptyResult) {
        setState(prev => ({
          ...prev,
          materials: [],
          pagination: {
            current: 1,
            total: 0,
            count: 0,
            limit: 12,
            hasNext: false,
            hasPrev: false
          },
          stats: {
            totalMaterials: 0,
            avgRating: 0,
            avgDownloads: 0
          },
          loading: false,
          error: null
        }));
      } else {
        setState(prev => ({
          ...prev,
          error: error.response?.data?.error || 'Erro ao carregar materiais',
          loading: false
        }));
      }
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (state.pagination && state.pagination.hasNext && !state.loading) {
      const nextPage = state.pagination.current + 1;
      await searchMaterials(currentFilters, { ...currentPagination, page: nextPage });
    }
  }, [state.pagination, state.loading, currentFilters, currentPagination, searchMaterials]);

  const resetSearch = useCallback(() => {
    setState({
      materials: [],
      loading: false,
      error: null,
      pagination: null,
      stats: null
    });
    setCurrentFilters({});
    setCurrentPagination({ page: 1, limit: 12 });
  }, []);

  const refresh = useCallback(async () => {
    await searchMaterials(currentFilters, { ...currentPagination, page: 1 });
  }, [currentFilters, currentPagination, searchMaterials]);

  // Carregar dados iniciais
  useEffect(() => {
    searchMaterials(initialFilters, initialPagination);
  }, []);

  return {
    ...state,
    searchMaterials,
    loadMore,
    resetSearch,
    refresh
  };
}

// Hook para um material específico
export function useMaterial(id: string | null) {
  const [material, setMaterial] = useState<Material | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMaterial = useCallback(async (materialId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await materialService.getMaterial(materialId);
      if (response.success) {
        setMaterial(response.data);
      } else {
        setError('Material não encontrado');
      }
    } catch (error: any) {
      console.error('Erro ao buscar material:', error);
      setError(error.response?.data?.error || 'Erro ao carregar material');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchMaterial(id);
    }
  }, [id, fetchMaterial]);

  return {
    material,
    loading,
    error,
    refresh: () => id ? fetchMaterial(id) : Promise.resolve()
  };
}

// Hook para download
export function useDownload() {
  const [downloading, setDownloading] = useState<string | null>(null);

  const downloadMaterial = useCallback(async (id: string, title: string) => {
    setDownloading(id);

    try {
      const response = await materialService.downloadMaterial(id);
      
      if (response.success) {
        // Criar link de download
        const link = document.createElement('a');
        link.href = response.data.downloadUrl;
        link.download = response.data.fileName || `${title}.pdf`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error: any) {
      console.error('Erro no download:', error);
      alert('Erro ao fazer download do arquivo');
    } finally {
      setDownloading(null);
    }
  }, []);

  return {
    downloadMaterial,
    downloading
  };
}

// Hook para avaliação
export function useRating() {
  const [rating, setRating] = useState(false);

  const rateMaterial = useCallback(async (id: string, ratingData: { rating: number; comment?: string }) => {
    setRating(true);

    try {
      const response = await materialService.rateMaterial(id, ratingData);
      
      if (response.success) {
        return response.data;
      } else {
        throw new Error('Erro ao avaliar material');
      }
    } catch (error: any) {
      console.error('Erro na avaliação:', error);
      throw error;
    } finally {
      setRating(false);
    }
  }, []);

  return {
    rateMaterial,
    rating
  };
}