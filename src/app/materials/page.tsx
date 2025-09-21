'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Material, MaterialFilters } from '@/types';

// Dados mock expandidos
const mockMaterials: Material[] = [
  {
    id: '1',
    title: 'Exercícios de Matemática - Frações',
    description: 'Lista completa de exercícios sobre frações para 5º ano do ensino fundamental com gabarito detalhado',
    subject: 'Matemática',
    gradeLevel: '5º Ano',
    materialType: 'EXERCISE' as any,
    difficulty: 'MEDIUM' as any,
    tags: ['frações', 'matemática', 'exercícios'],
    downloadCount: 45,
    rating: 4.5,
    totalRatings: 12,
    createdAt: '2024-01-15T10:00:00Z',
    author: {
      id: '2',
      name: 'Maria Silva',
      school: 'Escola Municipal Santos Dumont'
    }
  },
  {
    id: '2',
    title: 'Plano de Aula - Sistema Solar',
    description: 'Plano completo sobre o sistema solar com atividades práticas, experimentos e jogos educativos',
    subject: 'Ciências',
    gradeLevel: '4º Ano',
    materialType: 'LESSON_PLAN' as any,
    difficulty: 'EASY' as any,
    tags: ['sistema solar', 'ciências', 'astronomia'],
    downloadCount: 32,
    rating: 4.8,
    totalRatings: 8,
    createdAt: '2024-01-10T14:30:00Z',
    author: {
      id: '3',
      name: 'João Santos',
      school: 'Colégio Estadual da Ciência'
    }
  },
  {
    id: '3',
    title: 'Atividades de Português - Interpretação de Texto',
    description: 'Coletânea de textos com questões de interpretação para 6º ano',
    subject: 'Português',
    gradeLevel: '6º Ano',
    materialType: 'WORKSHEET' as any,
    difficulty: 'MEDIUM' as any,
    tags: ['português', 'interpretação', 'leitura'],
    downloadCount: 67,
    rating: 4.2,
    totalRatings: 15,
    createdAt: '2024-01-08T09:15:00Z',
    author: {
      id: '4',
      name: 'Ana Costa',
      school: 'Escola Particular Monteiro Lobato'
    }
  },
  {
    id: '4',
    title: 'Jogo Educativo - Tabuada Divertida',
    description: 'Jogo interativo para ensinar tabuada de forma lúdica e divertida',
    subject: 'Matemática',
    gradeLevel: '3º Ano',
    materialType: 'GAME' as any,
    difficulty: 'EASY' as any,
    tags: ['tabuada', 'jogo', 'matemática'],
    downloadCount: 89,
    rating: 4.9,
    totalRatings: 23,
    createdAt: '2024-01-05T16:45:00Z',
    author: {
      id: '5',
      name: 'Carlos Pereira',
      school: 'Centro Educacional Futuro'
    }
  }
];

const subjects = ['Todas', 'Matemática', 'Português', 'Ciências', 'História', 'Geografia', 'Inglês'];
const gradeLevels = ['Todos', '1º Ano', '2º Ano', '3º Ano', '4º Ano', '5º Ano', '6º Ano', '7º Ano', '8º Ano', '9º Ano'];

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>(mockMaterials);
  const [filters, setFilters] = useState<MaterialFilters>({
    search: '',
    subject: '',
    gradeLevel: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSearch = (searchTerm: string) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
    filterMaterials({ ...filters, search: searchTerm });
  };

  const handleFilterChange = (key: keyof MaterialFilters, value: string) => {
    const newFilters = { ...filters, [key]: value === 'Todas' || value === 'Todos' ? '' : value };
    setFilters(newFilters);
    filterMaterials(newFilters);
  };

  const filterMaterials = (currentFilters: MaterialFilters) => {
    setLoading(true);
    
    // Simular delay de busca
    setTimeout(() => {
      let filtered = mockMaterials;

      if (currentFilters.search) {
        filtered = filtered.filter(material => 
          material.title.toLowerCase().includes(currentFilters.search!.toLowerCase()) ||
          material.description.toLowerCase().includes(currentFilters.search!.toLowerCase()) ||
          material.tags.some(tag => tag.toLowerCase().includes(currentFilters.search!.toLowerCase()))
        );
      }

      if (currentFilters.subject) {
        filtered = filtered.filter(material => material.subject === currentFilters.subject);
      }

      if (currentFilters.gradeLevel) {
        filtered = filtered.filter(material => material.gradeLevel === currentFilters.gradeLevel);
      }

      setMaterials(filtered);
      setLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Explorar Materiais</h1>
          <p className="text-gray-600 mt-2">Descubra recursos educacionais compartilhados pela comunidade</p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Input
                  placeholder="Buscar materiais..."
                  value={filters.search}
                  onChange={(e) => handleSearch(e.target.value)}
                  icon={
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  }
                />
              </div>
              
              <div>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filters.subject || 'Todas'}
                  onChange={(e) => handleFilterChange('subject', e.target.value)}
                >
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filters.gradeLevel || 'Todos'}
                  onChange={(e) => handleFilterChange('gradeLevel', e.target.value)}
                >
                  {gradeLevels.map(grade => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            {loading ? 'Buscando...' : `${materials.length} material(is) encontrado(s)`}
          </p>
        </div>

        {/* Materials Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4 w-2/3"></div>
                  <div className="flex gap-2 mb-4">
                    <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                    <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : materials.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum material encontrado</h3>
              <p className="text-gray-600 mb-6">Tente ajustar os filtros ou fazer uma nova busca</p>
              <Button onClick={() => {
                setFilters({ search: '', subject: '', gradeLevel: '' });
                setMaterials(mockMaterials);
              }}>
                Limpar Filtros
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials.map((material) => (
              <Card key={material.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {material.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                      {material.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="primary" size="sm">{material.subject}</Badge>
                      <Badge variant="secondary" size="sm">{material.gradeLevel}</Badge>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 12l2 2 4-4" />
                        </svg>
                        {material.downloadCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4 fill-current text-yellow-400" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        {material.rating}
                      </span>
                    </div>

                    <div className="text-xs text-gray-500 mb-4">
                      Por <span className="font-medium">{material.author.name}</span>
                      {material.author.school && (
                        <span> - {material.author.school}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 12l2 2 4-4" />
                      </svg>
                      Baixar
                    </Button>
                    <Button variant="outline" size="sm">
                      Detalhes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Upload CTA */}
        <Card className="mt-12">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Não encontrou o que procura?
            </h3>
            <p className="text-gray-600 mb-6">
              Compartilhe seus próprios materiais e ajude outros professores!
            </p>
            <Link href="/upload">
              <Button size="lg">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Compartilhar Material
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}