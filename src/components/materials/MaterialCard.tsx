import React, { useState } from 'react';
import {
  Download,
  Star,
  Clock,
  User,
  Calendar,
  FileText,
  Loader2,
  MessageSquare,
  Lock,
  Sparkles
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Material } from '@/services/materialService';
import { MaterialTypeLabels, DifficultyLabels } from '@/types/material';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useMaterialActions } from '@/hooks/useMaterialActions';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/Toast';

interface MaterialCardProps {
  material: Material;
  onRatingChange?: () => void;
}

export function MaterialCard({ material, onRatingChange }: MaterialCardProps) {
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  const {
    downloadMaterial,
    rateMaterial,
    download,
    rating
  } = useMaterialActions();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return null;
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
  };

  const renderStars = (rating: number, interactive: boolean = false, size: 'sm' | 'md' = 'sm') => {
    const starSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
    
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={interactive ? () => setUserRating(star) : undefined}
          />
        ))}
      </div>
    );
  };

  const handleDownload = async () => {
    // Verificar se está autenticado
    if (!isAuthenticated) {
      showToast('Você precisa fazer login para baixar materiais', 'warning', 4000);
      // Redirecionar para login após 1 segundo
      setTimeout(() => {
        router.push('/login');
      }, 1000);
      return;
    }

    try {
      await downloadMaterial(material.id);
      showToast('Download iniciado!', 'success', 3000);
    } catch (error: any) {
      console.error('Erro no download:', error);
      showToast(error.message || 'Erro ao fazer download', 'error', 4000);
    }
  };

  const handleRating = async () => {
    if (userRating === 0) return;

    try {
      await rateMaterial(material.id, {
        rating: userRating,
        comment: userComment.trim() || undefined
      });
      
      setShowRatingForm(false);
      setUserRating(0);
      setUserComment('');
      onRatingChange?.();
    } catch (error) {
      console.error('Erro ao avaliar material:', error);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HARD': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between mb-2">
          <h3
            className="text-lg font-semibold text-gray-900 truncate flex-1"
            title={material.title}
          >
            {material.title}
          </h3>
          <div className="flex gap-1 ml-2 flex-shrink-0">
            {material.isNew && (
              <Badge variant="primary" className="text-xs">Novo</Badge>
            )}
            {material.isHighRated && (
              <Badge variant="secondary" className="text-xs">Destaque</Badge>
            )}
          </div>
        </div>

        <p
          className="text-gray-600 text-sm mb-2 truncate"
          title={material.description}
        >
          {material.description}
        </p>

        {/* Subtópico (se houver) */}
        {material.subTopic && (
          <p
            className="text-gray-500 text-xs italic truncate"
            title={`Subtópico: ${material.subTopic}`}
          >
            Subtópico: {material.subTopic}
          </p>
        )}

      </div>

      {/* Info Section */}
      <div className="p-4 space-y-3">
        {/* Metadados */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600 truncate">{material.discipline}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-600 truncate">{material.grade}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge className={getDifficultyColor(material.difficulty)}>
            {DifficultyLabels[material.difficulty]}
          </Badge>
          <Badge variant="secondary">
            {MaterialTypeLabels[material.materialType]}
          </Badge>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {renderStars(material.avgRating)}
              <span className="text-gray-500">
                {material.avgRating.toFixed(1)} ({material.totalRatings})
              </span>
            </div>
            <div className="flex items-center gap-1 text-gray-500">
              <Download className="h-4 w-4" />
              <span>{material.downloadCount}</span>
            </div>
          </div>
        </div>

        {/* Author & Date */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1 truncate">
            <User className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{material.author.name}</span>
            {material.author.school && (
              <span className="truncate">• {material.author.school}</span>
            )}
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(material.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={handleDownload}
            disabled={download.isLoading || !material.fileUrl}
            className="flex items-center justify-center gap-2"
            size="sm"
            variant={!isAuthenticated ? 'outline' : 'primary'}
          >
            {download.isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : !isAuthenticated ? (
              <Lock className="h-4 w-4" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">{!isAuthenticated ? 'Login' : 'Download'}</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => setShowRatingForm(!showRatingForm)}
            className="flex items-center justify-center gap-2"
            size="sm"
          >
            <Star className="h-4 w-4" />
            <span className="hidden sm:inline">Avaliar</span>
          </Button>
        </div>

        {/* Botão de Gerar Atividades com IA */}
        {isAuthenticated && (
          <div className="mt-2">
            <Button
              onClick={() => router.push(`/materials/${material.id}/activities`)}
              variant="outline"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border-purple-200 text-purple-700"
              size="sm"
            >
              <Sparkles className="h-4 w-4" />
              Gerar Atividades com IA
            </Button>
          </div>
        )}

        {/* Rating Form */}
        {showRatingForm && (
          <div className="mt-3 p-3 bg-white rounded-lg border">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Sua avaliação:
                </label>
                {renderStars(userRating, true, 'md')}
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Comentário (opcional):
                </label>
                <textarea
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                  placeholder="Compartilhe sua opinião sobre este material..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
                  rows={2}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleRating}
                  disabled={userRating === 0 || rating.isLoading}
                  size="sm"
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
                  size="sm"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}