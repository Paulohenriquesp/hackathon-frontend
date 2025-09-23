import axios from 'axios';
import { MaterialType, Difficulty } from '@/types/material';
import { authStore } from '@/contexts/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Configurar axios com interceptor para Authorization header
const api = axios.create({
  baseURL: API_URL,
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use((config) => {
  const token = authStore.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interfaces
export interface Material {
  id: string;
  title: string;
  description: string;
  discipline: string;
  grade: string;
  materialType: MaterialType;
  subTopic?: string;
  difficulty: Difficulty;
  fileUrl?: string;
  fileName?: string;
  avgRating: number;
  totalRatings: number;
  downloadCount: number;
  createdAt: string;
  isNew?: boolean;
  isPopular?: boolean;
  isHighRated?: boolean;
  author: {
    id: string;
    name: string;
    email: string;
    school?: string;
  };
  _count?: {
    ratings: number;
  };
}

export interface MaterialFilters {
  discipline?: string;
  grade?: string;
  materialType?: MaterialType;
  difficulty?: Difficulty;
  author?: string;
  minRating?: number;
  maxRating?: number;
  minDuration?: number;
  maxDuration?: number;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  hasFile?: boolean;
  featured?: boolean;
  sortBy?: 'createdAt' | 'title' | 'avgRating' | 'downloadCount' | 'totalRatings';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface MaterialsResponse {
  success: boolean;
  data: {
    materials: Material[];
    pagination: {
      current: number;
      total: number;
      count: number;
      limit: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
    filters: {
      applied: MaterialFilters;
      sorting: {
        sortBy: string;
        sortOrder: string;
      };
    };
    stats: {
      totalMaterials: number;
      avgRating: number;
      avgDownloads: number;
      maxRating: number;
      maxDownloads: number;
    };
  };
}

export interface MaterialStats {
  success: boolean;
  data: {
    overview: {
      totalMaterials: number;
      totalDownloads: number;
      totalRatings: number;
      avgRating: number;
      recentMaterials: number;
    };
    distribution: {
      byType: Array<{ type: MaterialType; count: number }>;
      byDifficulty: Array<{ difficulty: Difficulty; count: number }>;
      byGrade: Array<{ grade: string; count: number }>;
    };
    topAuthors: Array<{
      id: string;
      name: string;
      school?: string;
      materialsCount: number;
      totalDownloads: number;
      avgRating: number;
    }>;
    popularMaterials: Array<{
      id: string;
      title: string;
      downloadCount: number;
      avgRating: number;
      totalRatings: number;
      author: { name: string };
    }>;
  };
}

export interface RatingData {
  rating: number;
  comment?: string;
}

// Serviços
export const materialService = {
  // Buscar materiais com filtros
  async getMaterials(filters: MaterialFilters = {}, pagination: PaginationParams = { page: 1, limit: 12 }): Promise<MaterialsResponse> {
    const params = new URLSearchParams();
    
    // Adicionar paginação
    params.append('page', pagination.page.toString());
    params.append('limit', pagination.limit.toString());
    
    // Adicionar filtros
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await api.get(`/materials?${params.toString()}`);
    return response.data;
  },

  // Buscar material por ID
  async getMaterial(id: string): Promise<{ success: boolean; data: Material }> {
    const response = await api.get(`/materials/${id}`);
    return response.data;
  },

  // Download de material
  async downloadMaterial(id: string): Promise<{ success: boolean; data: { downloadUrl: string; fileName: string } }> {
    const response = await api.get(`/materials/${id}/download`);
    return response.data;
  },

  // Avaliar material
  async rateMaterial(id: string, rating: RatingData): Promise<{ success: boolean; data: any; message: string }> {
    const response = await api.post(`/materials/${id}/rate`, rating);
    return response.data;
  },

  // Materiais similares
  async getSimilarMaterials(id: string, limit: number = 5): Promise<{ success: boolean; data: { similar: Material[] } }> {
    const response = await api.get(`/materials/${id}/similar?limit=${limit}`);
    return response.data;
  },

  // Estatísticas
  async getStats(): Promise<MaterialStats> {
    const response = await api.get('/materials/stats');
    return response.data;
  },

  // Meus materiais (requer autenticação)
  async getMyMaterials(pagination: PaginationParams = { page: 1, limit: 10 }): Promise<MaterialsResponse> {
    const params = new URLSearchParams();
    params.append('page', pagination.page.toString());
    params.append('limit', pagination.limit.toString());

    const response = await api.get(`/materials/user/my-materials?${params.toString()}`);
    return response.data;
  }
};

// Hook para facilitar uso
export const useMaterialService = () => {
  return materialService;
};