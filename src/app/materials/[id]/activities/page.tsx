'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { authStore } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  Target,
  FileQuestion,
  PenLine,
  ArrowLeft
} from 'lucide-react';
import { GeneratedActivities } from '@/types/activity';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export default function MaterialActivitiesPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const materialId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activities, setActivities] = useState<GeneratedActivities | null>(null);
  const [materialInfo, setMaterialInfo] = useState<any>(null);

  // Redirecionar se não estiver autenticado
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleGenerateActivities = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Pegar token do authStore em memória
      const token = authStore.getToken();

      if (!token) {
        router.push('/login');
        return;
      }

      const response = await axios.post(
        `${API_URL}/materials/${materialId}/generate-activities`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setActivities(response.data.data.activities);
        setMaterialInfo(response.data.data.material);
      }
    } catch (err: any) {
      console.error('Erro ao gerar atividades:', err);
      setError(
        err.response?.data?.error ||
        err.response?.data?.details ||
        'Erro ao gerar atividades. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Loading state enquanto verifica autenticação
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-8 w-8 text-blue-600 mx-auto" />
          <p className="mt-2 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não estiver autenticado, não renderizar nada (vai redirecionar)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>

          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-purple-600" />
            Gerar Atividades com IA
          </h1>
          <p className="text-gray-600 mt-2">
            Use inteligência artificial para gerar atividades educacionais automaticamente
          </p>
        </div>

        {/* Estado Inicial - Botão de Gerar */}
        {!loading && !activities && !error && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-purple-100 rounded-full mb-6">
                <Sparkles className="h-12 w-12 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Pronto para gerar atividades?
              </h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg">
                Nossa IA irá analisar o conteúdo deste material e gerar automaticamente:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8 text-left">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Resumo do Conteúdo</p>
                    <p className="text-sm text-gray-600">Síntese clara e objetiva</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Objetivos de Aprendizagem</p>
                    <p className="text-sm text-gray-600">Metas pedagógicas claras</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Exercícios Abertos</p>
                    <p className="text-sm text-gray-600">Questões para reflexão</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Questões de Múltipla Escolha</p>
                    <p className="text-sm text-gray-600">Com respostas e alternativas</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Questões Dissertativas</p>
                    <p className="text-sm text-gray-600">Para desenvolvimento crítico</p>
                  </div>
                </div>
              </div>
              <Button
                onClick={handleGenerateActivities}
                size="lg"
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Gerar Atividades com IA
              </Button>
              <p className="text-sm text-gray-500 mt-4">
                Isso pode levar alguns segundos...
              </p>
            </CardContent>
          </Card>
        )}

        {/* Estado de Loading */}
        {loading && (
          <Card>
            <CardContent className="p-12 text-center">
              <Loader2 className="h-16 w-16 text-purple-600 animate-spin mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Gerando atividades...
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Nossa IA está analisando o material e criando atividades personalizadas.
                Isso pode levar alguns segundos.
              </p>
              <div className="mt-8 flex flex-col gap-2">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <div className="animate-pulse">📚</div> Analisando conteúdo...
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <div className="animate-pulse">🤖</div> Gerando questões...
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <div className="animate-pulse">✨</div> Finalizando atividades...
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Estado de Erro */}
        {error && !loading && (
          <Card>
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-red-900 mb-2">
                    Erro ao gerar atividades
                  </h3>
                  <p className="text-red-700 mb-4">{error}</p>
                  <Button
                    onClick={handleGenerateActivities}
                    variant="outline"
                  >
                    Tentar Novamente
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Resultados */}
        {activities && materialInfo && !loading && (
          <div className="space-y-6">
            {/* Info do Material */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Informações do Material
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Título</p>
                    <p className="text-lg font-semibold text-gray-900">{materialInfo.title}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="primary">{materialInfo.discipline}</Badge>
                    <Badge variant="secondary">{materialInfo.grade}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resumo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  Resumo do Conteúdo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-lg leading-relaxed">{activities.summary}</p>
              </CardContent>
            </Card>

            {/* Objetivos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-600" />
                  Objetivos de Aprendizagem
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {activities.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-700 font-semibold text-sm flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{objective}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Exercícios Abertos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PenLine className="h-5 w-5 text-purple-600" />
                  Exercícios Abertos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.exercises.map((exercise, index) => (
                    <div key={index} className="border-l-4 border-purple-400 pl-4 py-2">
                      <p className="font-medium text-purple-900 mb-1">Exercício {index + 1}</p>
                      <p className="text-gray-700">{exercise}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Múltipla Escolha */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileQuestion className="h-5 w-5 text-orange-600" />
                  Questões de Múltipla Escolha
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {activities.multiple_choice.map((question, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-orange-50">
                      <p className="font-semibold text-gray-900 mb-3">
                        {index + 1}. {question.question}
                      </p>
                      <div className="space-y-2">
                        {question.options.map((option, optIndex) => {
                          const letter = String.fromCharCode(65 + optIndex);
                          const isCorrect = letter === question.answer;
                          return (
                            <div
                              key={optIndex}
                              className={`p-3 rounded-lg ${
                                isCorrect ? 'bg-green-100 border-2 border-green-400' : 'bg-white'
                              }`}
                            >
                              <span className="font-medium text-gray-900">{letter}) </span>
                              <span className="text-gray-700">{option}</span>
                              {isCorrect && (
                                <span className="ml-2 text-green-700 font-semibold">✓ Resposta Correta</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Questões Dissertativas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PenLine className="h-5 w-5 text-indigo-600" />
                  Questões Dissertativas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.essay_questions.map((question, index) => (
                    <div key={index} className="border-l-4 border-indigo-400 pl-4 py-2">
                      <p className="font-medium text-indigo-900 mb-1">Questão {index + 1}</p>
                      <p className="text-gray-700">{question}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Ações */}
            <div className="flex gap-4">
              <Button
                onClick={handleGenerateActivities}
                variant="outline"
                className="flex-1"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Gerar Novas Atividades
              </Button>
              <Button
                onClick={() => window.print()}
                variant="outline"
                className="flex-1"
              >
                Imprimir Atividades
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
