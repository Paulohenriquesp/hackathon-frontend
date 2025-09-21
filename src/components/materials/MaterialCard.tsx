import React, { useState } from 'react';
import { 
  Download, 
  Star, 
  Clock, 
  User, 
  Calendar,
  FileText,
  Loader2,
  MessageSquare
} from 'lucide-react';
import { Material } from '@/services/materialService';
import { MaterialTypeLabels, DifficultyLabels } from '@/types/material';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useDownload, useRating } from '@/hooks/useMaterials';

interface MaterialCardProps {
  material: Material;
  onRatingChange?: () => void;
}

export function MaterialCard({ material, onRatingChange }: MaterialCardProps) {
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');
  const { downloadMaterial, downloading } = useDownload();
  const { rateMaterial, rating: isRating } = useRating();

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

  const handleDownload = () => {
    downloadMaterial(material.id, material.title);
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
      alert('Erro ao avaliar material');
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
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">
            {material.title}
          </h3>
          <div className="flex gap-1 ml-2">
            {material.isNew && (
              <Badge variant="primary" className="text-xs">Novo</Badge>
            )}
            {material.isHighRated && (
              <Badge variant="secondary" className="text-xs">Destaque</Badge>
            )}
          </div>
        </div>

        <p className="text-gray-600 text-sm line-clamp-3 mb-3">
          {material.description}
        </p>

        {/* Tags */}
        {material.tags && material.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {material.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700"
              >
                {tag}
              </span>
            ))}
            {material.tags.length > 3 && (
              <span className="text-xs text-gray-500">
                +{material.tags.length - 3} mais
              </span>
            )}
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="p-4 space-y-3">
        {/* Metadados */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">{material.discipline}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">{material.grade}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge className={getDifficultyColor(material.difficulty)}>
            {DifficultyLabels[material.difficulty]}
          </Badge>
          <Badge variant="outline">
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
          {material.estimatedDuration && (
            <div className="flex items-center gap-1 text-gray-500">
              <Clock className="h-4 w-4" />
              <span>{formatDuration(material.estimatedDuration)}</span>
            </div>
          )}
        </div>

        {/* Author & Date */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span>{material.author.name}</span>
            {material.author.school && (
              <span>• {material.author.school}</span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(material.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <div className="flex gap-2">
          <Button
            onClick={handleDownload}
            disabled={downloading === material.id || !material.fileUrl}
            className="flex-1 flex items-center gap-2"
            size="sm"
          >
            {downloading === material.id ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Download
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setShowRatingForm(!showRatingForm)}
            className="flex items-center gap-2"
            size="sm"
          >
            <Star className="h-4 w-4" />
            Avaliar
          </Button>
        </div>

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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleRating}
                  disabled={userRating === 0 || isRating}
                  size="sm"
                  className="flex-1"
                >
                  {isRating ? (
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