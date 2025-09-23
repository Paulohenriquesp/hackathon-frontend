'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContextNew';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Material } from '@/types';
import { materialService } from '@/services/materialService';
import { useQuery } from '@tanstack/react-query';

export default function DashboardPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  // Query para buscar estatísticas gerais
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['materials', 'stats'],
    queryFn: () => materialService.getStats(),
    enabled: !!isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Query para buscar materiais do usuário
  const { data: myMaterialsData, isLoading: materialsLoading } = useQuery({
    queryKey: ['materials', 'my-materials'],
    queryFn: () => materialService.getMyMaterials({ page: 1, limit: 5 }),
    enabled: !!isAuthenticated,
    staleTime: 1000 * 60 * 2, // 2 minutos
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  // Calcular estatísticas do usuário atual
  const userStats = {
    totalMaterials: myMaterialsData?.data?.pagination?.count || 0,
    totalDownloads: myMaterialsData?.data?.materials?.reduce((sum, material) => sum + (material.downloadCount || 0), 0) || 0,
    averageRating: myMaterialsData?.data?.materials?.length > 0
      ? (myMaterialsData.data.materials.reduce((sum, material) => sum + (material.avgRating || 0), 0) / myMaterialsData.data.materials.length)
      : 0,
    thisMonthUploads: myMaterialsData?.data?.materials?.filter(material => {
      const createdAt = new Date(material.createdAt);
      const now = new Date();
      return createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear();
    }).length || 0
  };

  const materials = myMaterialsData?.data?.materials || [];

  if (loading || (statsLoading && materialsLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Bem-vindo de volta, {user?.name}! 👋</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Meus Materiais</p>
                  <p className="text-2xl font-bold text-gray-900">{userStats.totalMaterials}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 12l2 2 4-4" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Downloads</p>
                  <p className="text-2xl font-bold text-gray-900">{userStats.totalDownloads}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avaliação Média</p>
                  <p className="text-2xl font-bold text-gray-900">{userStats.averageRating.toFixed(1)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Este Mês</p>
                  <p className="text-2xl font-bold text-gray-900">{userStats.thisMonthUploads}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
          <div className="flex flex-wrap gap-4">
            <Link href="/upload">
              <Button size="lg">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Compartilhar Material
              </Button>
            </Link>
            <Link href="/materials">
              <Button variant="outline" size="lg">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Explorar Materiais
              </Button>
            </Link>
          </div>
        </div>

        {/* Recent Materials */}
        <Card>
          <CardHeader>
            <CardTitle>Meus Materiais Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            {materials.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum material encontrado</h3>
                <p className="text-gray-600 mb-6">Comece compartilhando seu primeiro material educacional!</p>
                <Link href="/upload">
                  <Button>Compartilhar Primeiro Material</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {materials.map((material) => (
                  <div key={material.id} className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {material.title}
                        </h3>
                        <p className="text-gray-600 mb-3 line-clamp-2">{material.description}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge variant="primary">{material.discipline}</Badge>
                          <Badge variant="secondary">{material.grade}</Badge>
                          <Badge variant="default">{material.materialType}</Badge>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 12l2 2 4-4" />
                            </svg>
                            {material.downloadCount} downloads
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4 fill-current text-yellow-400" viewBox="0 0 24 24">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                            {material.avgRating.toFixed(1)} ({material.totalRatings} avaliações)
                          </span>
                          <span>{new Date(material.createdAt).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 ml-6">
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                        <Button variant="ghost" size="sm">
                          Ver Detalhes
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="pt-6 border-t border-gray-200">
                  <Link href="/materials?author=me">
                    <Button variant="outline" className="w-full">
                      Ver Todos os Meus Materiais
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}