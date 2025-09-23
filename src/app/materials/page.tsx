'use client';

import React, { useState, useCallback } from 'react';
import { Loader2, AlertCircle, BookOpen, Upload, Plus } from 'lucide-react';
import { SearchFilters } from '@/components/materials/SearchFilters';
import { MaterialCard } from '@/components/materials/MaterialCard';
import { Button } from '@/components/ui/Button';
import { useMaterials } from '@/hooks/useMaterials';
import { MaterialFilters } from '@/services/materialService';

export default function MaterialsPage() {
  const {
    materials,
    loading,
    error,
    pagination,
    stats,
    searchMaterials,
    loadMore,
    refresh
  } = useMaterials();

  const [currentFilters, setCurrentFilters] = useState<MaterialFilters>({});

  const handleFiltersChange = useCallback((filters: MaterialFilters) => {
    setCurrentFilters(filters);
    searchMaterials(filters, { page: 1, limit: 12 });
  }, [searchMaterials]);

  const handleLoadMore = () => {
    if (pagination?.hasNext && !loading) {
      loadMore();
    }
  };

  const handleRatingChange = () => {
    // Refresh current page to get updated ratings
    refresh();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-blue-600" />
            Explorar Materiais
          </h1>
          <p className="text-gray-600 mt-2">
            Descubra recursos educacionais compartilhados pela comunidade de professores
          </p>
          {stats && (
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
              <span>{stats.totalMaterials} materiais disponíveis</span>
              <span>•</span>
              <span>Avaliação média: {stats.avgRating.toFixed(1)}/5</span>
              <span>•</span>
              <span>{stats.avgDownloads.toFixed(0)} downloads em média</span>
            </div>
          )}
        </div>

        {/* Filtros de Busca */}
        <SearchFilters
          onFiltersChange={handleFiltersChange}
          loading={loading}
          initialFilters={currentFilters}
        />

        {/* Estados de Loading e Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-800 font-medium">Erro ao carregar materiais</span>
            </div>
            <p className="text-red-700 mt-1">{error}</p>
            <Button
              variant="outline"
              onClick={refresh}
              className="mt-3"
              size="sm"
            >
              Tentar Novamente
            </Button>
          </div>
        )}

        {/* Lista de Materiais */}
        {materials.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {materials.map((material) => (
                <MaterialCard
                  key={material.id}
                  material={material}
                  onRatingChange={handleRatingChange}
                />
              ))}
            </div>

            {/* Paginação / Load More */}
            {pagination && (
              <div className="flex flex-col items-center space-y-4">
                <div className="text-sm text-gray-600">
                  Mostrando {materials.length} de {pagination.count} materiais
                </div>
                
                {pagination.hasNext && (
                  <Button
                    onClick={handleLoadMore}
                    disabled={loading}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Carregando...
                      </>
                    ) : (
                      'Carregar Mais'
                    )}
                  </Button>
                )}

                {!pagination.hasNext && materials.length > 0 && (
                  <p className="text-sm text-gray-500">
                    Todos os materiais foram carregados
                  </p>
                )}
              </div>
            )}
          </>
        ) : loading ? (
          /* Loading State */
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Carregando materiais...
            </h3>
            <p className="text-gray-600">
              Por favor, aguarde enquanto buscamos os melhores recursos para você.
            </p>
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16">
            <div className="bg-blue-50 rounded-full p-6 mb-6">
              <BookOpen className="h-16 w-16 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {Object.keys(currentFilters).length > 0
                ? 'Nenhum material encontrado'
                : 'Bem-vindo à nossa biblioteca!'
              }
            </h3>
            <p className="text-gray-600 text-center max-w-lg mb-8 text-lg">
              {Object.keys(currentFilters).length > 0
                ? 'Não encontramos materiais que correspondam aos seus filtros. Tente ajustar os critérios de busca ou explore nossa coleção completa.'
                : 'Ainda não há materiais disponíveis. Seja o primeiro a compartilhar um recurso educacional e ajude a construir nossa comunidade de professores!'
              }
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              {Object.keys(currentFilters).length > 0 ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => handleFiltersChange({})}
                    className="flex items-center gap-2"
                  >
                    <BookOpen className="h-4 w-4" />
                    Ver Todos os Materiais
                  </Button>
                  <Button
                    onClick={() => window.location.href = '/upload'}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Adicionar Material
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => window.location.href = '/upload'}
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Compartilhar Primeiro Material
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.location.href = '/dashboard'}
                    className="flex items-center gap-2"
                  >
                    <BookOpen className="h-4 w-4" />
                    Voltar ao Dashboard
                  </Button>
                </>
              )}
            </div>

            {Object.keys(currentFilters).length === 0 && (
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-500 mb-4">
                  Precisa de inspiração? Aqui estão alguns tipos de materiais que você pode compartilhar:
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['Planos de Aula', 'Exercícios', 'Apresentações', 'Vídeos', 'Jogos Educativos'].map((type) => (
                    <span
                      key={type}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}