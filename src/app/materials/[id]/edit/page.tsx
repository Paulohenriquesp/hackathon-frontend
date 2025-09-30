'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';
import { materialService } from '@/services/materialService';
import { useInvalidateQueries } from '@/hooks/useInvalidateQueries';
import {
  MaterialTypeLabels,
  DifficultyLabels,
  subjects,
  gradeLevels
} from '@/types/material';
import { CheckCircle2Icon, AlertCircleIcon, Loader2Icon, FileText } from 'lucide-react';

// Schema de validação (sem arquivo)
const editMaterialSchema = z.object({
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  discipline: z.string().min(1, 'Selecione uma disciplina'),
  grade: z.string().min(1, 'Selecione uma série'),
  materialType: z.string().min(1, 'Selecione o tipo de material'),
  difficulty: z.string().min(1, 'Selecione a dificuldade'),
  subTopic: z.string().optional(),
});

type EditMaterialData = z.infer<typeof editMaterialSchema>;

export default function EditMaterialPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const { showToast } = useToast();
  const { invalidateDashboard, invalidateAll } = useInvalidateQueries();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [material, setMaterial] = useState<any>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const materialId = params.id as string;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid }
  } = useForm<EditMaterialData>({
    resolver: zodResolver(editMaterialSchema),
    mode: 'onChange'
  });

  // Redirecionar se não autenticado
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Carregar dados do material
  useEffect(() => {
    if (!materialId || !isAuthenticated) return;

    const loadMaterial = async () => {
      try {
        const response = await materialService.getMaterial(materialId);

        if (response.success && response.data) {
          const mat = response.data;
          setMaterial(mat);

          // Preencher formulário
          setValue('title', mat.title);
          setValue('description', mat.description);
          setValue('discipline', mat.discipline);
          setValue('grade', mat.grade);
          setValue('materialType', mat.materialType);
          setValue('difficulty', mat.difficulty);
          setValue('subTopic', mat.subTopic || '');
        }
      } catch (error: any) {
        showToast(error.message || 'Erro ao carregar material', 'error', 4000);
        router.push('/profile');
      } finally {
        setLoading(false);
      }
    };

    loadMaterial();
  }, [materialId, isAuthenticated, router, setValue, showToast]);

  // Redirecionar após sucesso
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        router.push('/profile');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, router]);

  const onSubmit = async (data: EditMaterialData) => {
    setSaving(true);

    try {
      const response = await materialService.updateMaterial(materialId, data);

      if (response.success) {
        showToast('Material atualizado com sucesso!', 'success', 3000);
        setIsSuccess(true);

        // Invalidar cache
        invalidateDashboard();
        invalidateAll();
      }
    } catch (error: any) {
      showToast(error.message || 'Erro ao atualizar material', 'error', 4000);
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2Icon className="animate-spin h-8 w-8 text-blue-600 mx-auto" />
          <p className="mt-2 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !material) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Editar Material</h1>
          <p className="text-gray-600 mt-2">
            Atualize as informações do seu material didático
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
              {/* Status de Salvamento */}
              {saving && (
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Loader2Icon className="h-4 w-4 animate-spin text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">
                      Salvando alterações...
                    </span>
                  </div>
                </div>
              )}

              {isSuccess && (
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle2Icon className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      Material atualizado com sucesso! Redirecionando...
                    </span>
                  </div>
                </div>
              )}

              {/* Arquivo Atual (somente leitura) */}
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Arquivo Atual
                </label>
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900">{material.fileName}</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  O arquivo não pode ser alterado. Para trocar o arquivo, exclua este material e crie um novo.
                </p>
              </div>

              {/* Título */}
              <div>
                <Input
                  label="Título do Material *"
                  {...register('title')}
                  placeholder="Ex: Exercícios de Matemática - Frações"
                  error={errors.title?.message}
                  disabled={saving}
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
                  } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                  placeholder="Descreva detalhadamente o conteúdo do material..."
                  disabled={saving}
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
                    } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={saving}
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
                    } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={saving}
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
                    } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={saving}
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
                    } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={saving}
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
                disabled={saving}
              />

              {/* Botões */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="submit"
                  loading={saving}
                  disabled={saving || !isValid || isSuccess}
                  className="flex-1"
                  size="lg"
                >
                  {saving ? 'Salvando...' : isSuccess ? 'Salvo!' : 'Salvar Alterações'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/profile')}
                  size="lg"
                  disabled={saving}
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
