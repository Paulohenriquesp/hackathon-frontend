'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { FileUpload } from '@/components/ui/FileUpload';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { 
  uploadMaterialSchema, 
  UploadMaterialData, 
  MaterialType, 
  Difficulty, 
  MaterialTypeLabels, 
  DifficultyLabels,
  subjects,
  gradeLevels
} from '@/types/material';
import { useUpload } from '@/hooks/useUpload';
import { useInvalidateQueries } from '@/hooks/useInvalidateQueries';
import { CheckCircle2Icon, AlertCircleIcon, Loader2Icon } from 'lucide-react';

export default function UploadPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const { uploadMaterial, resetUpload, status, progress, error, isUploading, isSuccess, isError } = useUpload();
  const { invalidateDashboard, invalidateAll } = useInvalidateQueries();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isValid }
  } = useForm<UploadMaterialData>({
    resolver: zodResolver(uploadMaterialSchema),
    mode: 'onChange'
  });

  const watchedFile = watch('file');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isSuccess) {
      // Invalidar cache após upload bem-sucedido
      invalidateDashboard();
      invalidateAll();

      const timer = setTimeout(() => {
        router.push('/dashboard');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, router, invalidateDashboard, invalidateAll]);

  const onSubmit = async (data: UploadMaterialData) => {
    if (!data.file) return;

    try {
      await uploadMaterial(data);
    } catch (error) {
      console.error('Erro no upload:', error);
    }
  };

  const handleFileSelect = (file: File | null) => {
    setValue('file', file as File, { shouldValidate: true });
  };


  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2Icon className="animate-spin h-8 w-8 text-blue-600 mx-auto" />
          <p className="mt-2 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Compartilhar Material</h1>
          <p className="text-gray-600 mt-2">
            Compartilhe seus recursos educacionais com a comunidade de professores
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Informações do Material
              {isSuccess && <CheckCircle2Icon className="h-5 w-5 text-green-500" />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Status de Upload */}
              {isUploading && (
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Loader2Icon className="h-4 w-4 animate-spin text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">
                      Enviando material...
                    </span>
                  </div>
                  <ProgressBar progress={progress} className="mt-2" />
                </div>
              )}

              {isSuccess && (
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle2Icon className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      Material enviado com sucesso! Redirecionando para o dashboard...
                    </span>
                  </div>
                </div>
              )}

              {isError && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircleIcon className="h-5 w-5 text-red-600" />
                    <span className="text-sm font-medium text-red-800">
                      {error}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={resetUpload}
                    className="mt-2"
                  >
                    Tentar Novamente
                  </Button>
                </div>
              )}

              {/* Título */}
              <div>
                <Input
                  label="Título do Material *"
                  {...register('title')}
                  placeholder="Ex: Exercícios de Matemática - Frações"
                  error={errors.title?.message}
                  disabled={isUploading}
                />
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição *
                </label>
                <textarea
                  {...register('description')}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 ${
                    errors.description ? 'border-red-300' : 'border-gray-300'
                  } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  placeholder="Descreva detalhadamente o conteúdo do material..."
                  disabled={isUploading}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              {/* Grid de campos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Disciplina */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Disciplina *
                  </label>
                  <select
                    {...register('discipline')}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                      errors.discipline ? 'border-red-300' : 'border-gray-300'
                    } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isUploading}
                  >
                    <option value="">Selecione uma disciplina</option>
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                  {errors.discipline && (
                    <p className="mt-1 text-sm text-red-600">{errors.discipline.message}</p>
                  )}
                </div>

                {/* Série */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Série/Ano *
                  </label>
                  <select
                    {...register('grade')}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                      errors.grade ? 'border-red-300' : 'border-gray-300'
                    } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isUploading}
                  >
                    <option value="">Selecione a série</option>
                    {gradeLevels.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                  {errors.grade && (
                    <p className="mt-1 text-sm text-red-600">{errors.grade.message}</p>
                  )}
                </div>

                {/* Tipo de Material */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Material *
                  </label>
                  <select
                    {...register('materialType')}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                      errors.materialType ? 'border-red-300' : 'border-gray-300'
                    } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isUploading}
                  >
                    <option value="">Selecione o tipo</option>
                    {Object.entries(MaterialTypeLabels).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                  {errors.materialType && (
                    <p className="mt-1 text-sm text-red-600">{errors.materialType.message}</p>
                  )}
                </div>

                {/* Dificuldade */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nível de Dificuldade *
                  </label>
                  <select
                    {...register('difficulty')}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                      errors.difficulty ? 'border-red-300' : 'border-gray-300'
                    } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isUploading}
                  >
                    <option value="">Selecione a dificuldade</option>
                    {Object.entries(DifficultyLabels).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                  {errors.difficulty && (
                    <p className="mt-1 text-sm text-red-600">{errors.difficulty.message}</p>
                  )}
                </div>
              </div>

              {/* Subtópico */}
              <Input
                label="Subtópico"
                {...register('subTopic')}
                placeholder="Ex: Operações básicas, Frações equivalentes"
                disabled={isUploading}
              />



              {/* Upload de Arquivo */}
              <Controller
                name="file"
                control={control}
                render={({ field }) => (
                  <FileUpload
                    onFileSelect={handleFileSelect}
                    file={watchedFile}
                    error={errors.file?.message}
                    disabled={isUploading}
                  />
                )}
              />

              {/* Botões */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="submit"
                  loading={isUploading}
                  disabled={isUploading || !isValid || isSuccess}
                  className="flex-1"
                  size="lg"
                >
                  {isUploading ? 'Enviando...' : isSuccess ? 'Enviado!' : 'Compartilhar Material'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/dashboard')}
                  size="lg"
                  disabled={isUploading}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}