import React, { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { MaterialType, Difficulty, MaterialTypeLabels, DifficultyLabels, subjects, gradeLevels } from '@/types/material';
import { MaterialFilters } from '@/services/materialService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface SearchFiltersProps {
  onFiltersChange: (filters: MaterialFilters) => void;
  loading?: boolean;
  initialFilters?: MaterialFilters;
}

export function SearchFilters({ onFiltersChange, loading, initialFilters = {} }: SearchFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<MaterialFilters>(initialFilters);
  const [searchTerm, setSearchTerm] = useState(initialFilters.search || '');

  // Debounce para busca
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== filters.search) {
        handleFilterChange('search', searchTerm);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleFilterChange = (key: keyof MaterialFilters, value: any) => {
    const newFilters = { ...filters, [key]: value || undefined };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = { search: searchTerm };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.keys(filters).some(key => 
    key !== 'search' && filters[key as keyof MaterialFilters] !== undefined
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
      {/* Barra de Busca */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Buscar materiais por título, descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
            disabled={loading}
          />
        </div>
        
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2"
          disabled={loading}
        >
          <Filter className="h-4 w-4" />
          Filtros
          {hasActiveFilters && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
              {Object.keys(filters).filter(key => key !== 'search' && filters[key as keyof MaterialFilters]).length}
            </span>
          )}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={clearFilters}
            className="flex items-center gap-2 text-red-600 hover:text-red-700"
            disabled={loading}
          >
            <X className="h-4 w-4" />
            Limpar
          </Button>
        )}
      </div>

      {/* Filtros Expandidos */}
      {isExpanded && (
        <div className="border-t pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Disciplina */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Disciplina
              </label>
              <select
                value={filters.discipline || ''}
                onChange={(e) => handleFilterChange('discipline', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                disabled={loading}
              >
                <option value="">Todas as disciplinas</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            {/* Série */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Série/Ano
              </label>
              <select
                value={filters.grade || ''}
                onChange={(e) => handleFilterChange('grade', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                disabled={loading}
              >
                <option value="">Todas as séries</option>
                {gradeLevels.map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
            </div>

            {/* Tipo de Material */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Material
              </label>
              <select
                value={filters.materialType || ''}
                onChange={(e) => handleFilterChange('materialType', e.target.value as MaterialType)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                disabled={loading}
              >
                <option value="">Todos os tipos</option>
                {Object.entries(MaterialTypeLabels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            {/* Dificuldade */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dificuldade
              </label>
              <select
                value={filters.difficulty || ''}
                onChange={(e) => handleFilterChange('difficulty', e.target.value as Difficulty)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                disabled={loading}
              >
                <option value="">Todas as dificuldades</option>
                {Object.entries(DifficultyLabels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Filtros Avançados */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Avaliação Mínima */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Avaliação Mínima
              </label>
              <select
                value={filters.minRating || ''}
                onChange={(e) => handleFilterChange('minRating', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                disabled={loading}
              >
                <option value="">Qualquer avaliação</option>
                <option value="4">4+ estrelas</option>
                <option value="3">3+ estrelas</option>
                <option value="2">2+ estrelas</option>
                <option value="1">1+ estrela</option>
              </select>
            </div>

            {/* Ordenação */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ordenar por
              </label>
              <select
                value={filters.sortBy || 'createdAt'}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                disabled={loading}
              >
                <option value="createdAt">Mais recentes</option>
                <option value="avgRating">Melhor avaliados</option>
                <option value="downloadCount">Mais baixados</option>
                <option value="title">Nome (A-Z)</option>
              </select>
            </div>

            {/* Filtros Especiais */}
            <div className="flex flex-col gap-2">
              <label className="block text-sm font-medium text-gray-700">
                Filtros Especiais
              </label>
              <div className="flex flex-wrap gap-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.featured || false}
                    onChange={(e) => handleFilterChange('featured', e.target.checked || undefined)}
                    className="mr-2"
                    disabled={loading}
                  />
                  <span className="text-sm text-gray-900">Em destaque</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.hasFile || false}
                    onChange={(e) => handleFilterChange('hasFile', e.target.checked || undefined)}
                    className="mr-2"
                    disabled={loading}
                  />
                  <span className="text-sm text-gray-900">Com arquivo</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}