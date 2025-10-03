'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { materialService } from '@/services/materialService';
import { useAuth } from '@/contexts/AuthContext';
import { useMaterialActions } from '@/hooks/useMaterialActions';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MaterialTypeLabels, DifficultyLabels } from '@/types/material';
import {
  ArrowLeft,
  Download,
  Star,
  Sparkles,
  User,
  School,
  Calendar,
  FileText,
  Loader2,
  MessageSquare,
  TrendingUp,
  Lock
} from 'lucide-react';

export default function MaterialDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const materialId = params.id as string;

  const [showRatingForm, setShowRatingForm] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');

  const { downloadMaterial, rateMaterial, download, rating } = useMaterialActions();

  // Query para buscar material
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['material', materialId],
    queryFn: () => materialService.getMaterial(materialId),
    enabled: !!materialId,
  });

  const material = data?.data;

  // Query para materiais similares
  const { data: similarData } = useQuery({
    queryKey: ['materials', 'similar', materialId],
    queryFn: () => materialService.getSimilarMaterials(materialId),
    enabled: !!materialId,
  });

  const similarMaterials = similarData?.data || [];

  const handleDownload = async () => {
    if (!isAuthenticated) {
      showToast('Você precisa fazer login para baixar materiais', 'warning', 4000);
      setTimeout(() => router.push('/login'), 1000);
      return;
    }

    try {
      await downloadMaterial(materialId);
      showToast('Download iniciado!', 'success', 3000);
      refetch();
    } catch (error: any) {
      showToast(error.message || 'Erro ao fazer download', 'error', 4000);
    }
  };

  const handleRating = async () => {
    if (userRating === 0) return;

    try {
      await rateMaterial(materialId, {
        rating: userRating,
        comment: userComment.trim() || undefined,
      });

      showToast('Avaliação enviada com sucesso!', 'success', 3000);
      setShowRatingForm(false);
      setUserRating(0);
      setUserComment('');
      refetch();
    } catch (error: any) {
      showToast(error.message || 'Erro ao avaliar material', 'error', 4000);
    }
  };

  const renderStars = (rating: number, interactive = false, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClass = size === 'sm' ? 'h-4 w-4' : size === 'md' ? 'h-5 w-5' : 'h-6 w-6';

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={interactive ? () => setUserRating(star) : undefined}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Hoje';
    if (diffInDays === 1) return '1 dia atrás';
    if (diffInDays < 7) return `${diffInDays} dias atrás`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} semanas atrás`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} meses atrás`;
    return `${Math.floor(diffInDays / 365)} anos atrás`;
  };

  const calculateRatingDistribution = () => {
    if (!material?.ratings) return {};

    const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    material.ratings.forEach((r: any) => {
      distribution[r.rating] = (distribution[r.rating] || 0) + 1;
    });

    return distribution;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY':
        return 'bg-green-100 text-green-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'HARD':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando material...</p>
        </div>
      </div>
    );
  }

  if (error || !material) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-red-600 mb-4">Material não encontrado</p>
            <Button onClick={() => router.push('/materials')}>
              Voltar para Materiais
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const ratingDistribution = calculateRatingDistribution();
  const totalRatings = material.totalRatings || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Botão Voltar */}
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>

        {/* Cabeçalho do Material */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              {/* Info Principal */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {material.title}
                </h1>

                {/* Metadados */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="primary">{material.discipline}</Badge>
                  <Badge variant="secondary">{material.grade}</Badge>
                  <Badge className={getDifficultyColor(material.difficulty)}>
                    {DifficultyLabels[material.difficulty]}
                  </Badge>
                  <Badge variant="default">
                    {MaterialTypeLabels[material.materialType as keyof typeof MaterialTypeLabels]}
                  </Badge>
                </div>

                {/* Autor e Data */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{material.author.name}</span>
                  </div>
                  {material.author.school && (
                    <div className="flex items-center gap-2">
                      <School className="h-4 w-4" />
                      <span>{material.author.school}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(material.createdAt)}</span>
                  </div>
                </div>

                {/* Rating e Downloads */}
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    {renderStars(material.avgRating, false, 'md')}
                    <span className="text-lg font-semibold text-gray-900">
                      {material.avgRating.toFixed(1)}
                    </span>
                    <span className="text-gray-500">({totalRatings} avaliações)</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Download className="h-5 w-5" />
                    <span className="font-medium">{material.downloadCount} downloads</span>
                  </div>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex flex-col gap-3 lg:min-w-[200px]">
                {isAuthenticated ? (
                  <>
                    <Button
                      onClick={handleDownload}
                      disabled={download.isLoading || !material.fileUrl}
                      className="flex items-center justify-center gap-2"
                    >
                      {download.isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowRatingForm(!showRatingForm)}
                      className="flex items-center justify-center gap-2"
                    >
                      <Star className="h-4 w-4" />
                      Avaliar Material
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => router.push(`/materials/${materialId}/activities`)}
                      className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border-purple-200 text-purple-700"
                    >
                      <Sparkles className="h-4 w-4" />
                      Gerar Atividades
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    className="flex items-center justify-center gap-2"
                  >
                    <Lock className="h-4 w-4" />
                    Login para Baixar
                  </Button>
                )}
              </div>
            </div>

            {/* Formulário de Avaliação */}
            {showRatingForm && isAuthenticated && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                <h3 className="font-semibold text-gray-900 mb-3">Avaliar este Material</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Sua avaliação:
                    </label>
                    {renderStars(userRating, true, 'lg')}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Comentário (opcional):
                    </label>
                    <textarea
                      value={userComment}
                      onChange={(e) => setUserComment(e.target.value)}
                      placeholder="Compartilhe sua experiência com este material..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleRating}
                      disabled={userRating === 0 || rating.isLoading}
                      className="flex-1"
                    >
                      {rating.isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <MessageSquare className="h-4 w-4 mr-2" />
                      )}
                      Enviar Avaliação
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowRatingForm(false);
                        setUserRating(0);
                        setUserComment('');
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Descrição */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Sobre este Material
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {material.description}
                </p>
                {material.subTopic && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Subtópico:</span> {material.subTopic}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Avaliações e Comentários */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Avaliações da Comunidade ({totalRatings})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {material.ratings && material.ratings.length > 0 ? (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    {material.ratings.map((rating: any) => (
                      <div
                        key={rating.id}
                        className="border border-gray-200 rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{rating.user.name}</p>
                              <p className="text-xs text-gray-500">{getTimeAgo(rating.createdAt)}</p>
                            </div>
                          </div>
                          {renderStars(rating.rating, false, 'sm')}
                        </div>
                        {rating.comment && (
                          <p className="text-gray-700 text-sm mt-2">{rating.comment}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <p>Nenhuma avaliação ainda</p>
                    <p className="text-sm">Seja o primeiro a avaliar este material!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Distribuição de Estrelas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Distribuição de Avaliações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const count = ratingDistribution[stars] || 0;
                    const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;

                    return (
                      <div key={stars} className="flex items-center gap-2">
                        <div className="flex items-center gap-1 w-16">
                          <span className="text-sm font-medium text-gray-700">{stars}</span>
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        </div>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-yellow-400 h-2 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-12 text-right">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Arquivo */}
            {material.fileName && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FileText className="h-5 w-5" />
                    Arquivo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-700 truncate flex-1">
                      {material.fileName}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Materiais Similares */}
        {similarMaterials.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Materiais Similares</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {similarMaterials.slice(0, 4).map((similar: any) => (
                  <div
                    key={similar.id}
                    onClick={() => router.push(`/materials/${similar.id}`)}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {similar.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {similar.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      {renderStars(similar.avgRating, false, 'sm')}
                      <span className="text-gray-500 text-xs">
                        ({similar.totalRatings})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
