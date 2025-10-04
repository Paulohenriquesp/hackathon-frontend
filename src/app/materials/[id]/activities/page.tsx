'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
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
  ArrowLeft,
  Clock,
  ListChecks,
  Lightbulb,
  Package,
  GraduationCap
} from 'lucide-react';
import { GeneratedContent, ContentGenerationResponse } from '@/types/activity';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

type TabType = 'lesson-plan' | 'activities';

export default function MaterialActivitiesPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const materialId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [materialInfo, setMaterialInfo] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<TabType>('lesson-plan');

  // Redirecionar se não estiver autenticado
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleGenerateContent = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post<ContentGenerationResponse>(
        `${API_URL}/materials/${materialId}/generate-activities`,
        {},
        {
          withCredentials: true, // Envia cookies automaticamente
        }
      );

      if (response.data.success) {
        const receivedContent = response.data.data?.content;
        const receivedMaterial = response.data.data?.material;

        setContent(receivedContent);
        setMaterialInfo(receivedMaterial);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.details ||
        'Erro ao gerar plano de aula e atividades. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

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
            Gerar Recursos Educacionais com IA
          </h1>
          <p className="text-gray-600 mt-2">
            Use inteligência artificial para gerar plano de aula completo + atividades automaticamente
          </p>
        </div>

        {/* Estado Inicial */}
        {!loading && !content && !error && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-purple-100 rounded-full mb-6">
                <Sparkles className="h-12 w-12 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Pronto para gerar recursos educacionais?
              </h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg">
                Nossa IA irá analisar o conteúdo deste material e gerar automaticamente:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto mb-8 text-left">
                <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-lg">
                  <GraduationCap className="h-6 w-6 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Plano de Aula Completo</p>
                    <p className="text-sm text-gray-600">Etapas, cronograma, materiais e dicas</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-green-50 p-4 rounded-lg">
                  <Target className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Objetivos de Aprendizagem</p>
                    <p className="text-sm text-gray-600">Metas pedagógicas claras</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-orange-50 p-4 rounded-lg">
                  <FileQuestion className="h-6 w-6 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Atividades Diversas</p>
                    <p className="text-sm text-gray-600">Exercícios, múltipla escolha, dissertativas</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-purple-50 p-4 rounded-lg">
                  <Lightbulb className="h-6 w-6 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Atividades Práticas</p>
                    <p className="text-sm text-gray-600">Experimentos e projetos hands-on</p>
                  </div>
                </div>
              </div>
              <Button
                onClick={handleGenerateContent}
                size="lg"
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Gerar Plano de Aula + Atividades com IA
              </Button>
              <p className="text-sm text-gray-500 mt-4">
                Isso pode levar alguns segundos...
              </p>
            </CardContent>
          </Card>
        )}

        {/* Loading */}
        {loading && (
          <Card>
            <CardContent className="p-12 text-center">
              <Loader2 className="h-16 w-16 text-purple-600 animate-spin mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Gerando recursos educacionais...
              </h2>
              <p className="text-gray-600 max-w-md mx-auto mb-8">
                Nossa IA está analisando o material e criando um plano de aula completo com atividades personalizadas.
              </p>
              <div className="mt-8 flex flex-col gap-2">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <div className="animate-pulse">📚</div> Analisando conteúdo...
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <div className="animate-pulse">📋</div> Estruturando plano de aula...
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <div className="animate-pulse">🤖</div> Gerando questões e atividades...
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <div className="animate-pulse">✨</div> Finalizando recursos...
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error */}
        {error && !loading && (
          <Card>
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-red-900 mb-2">
                    Erro ao gerar recursos
                  </h3>
                  <p className="text-red-700 mb-4">{error}</p>
                  <Button
                    onClick={handleGenerateContent}
                    variant="outline"
                  >
                    Tentar Novamente
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Resultados com Tabs */}
        {content && materialInfo && !loading && (
          <div className="space-y-6">
            {/* Info do Material */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  {content.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="primary">{materialInfo.discipline}</Badge>
                  <Badge variant="secondary">{materialInfo.grade}</Badge>
                  <Badge>{materialInfo.difficulty}</Badge>
                  {content.lesson_plan?.duration_total && (
                    <Badge variant="default">
                      <Clock className="h-3 w-3 mr-1" />
                      {content.lesson_plan.duration_total}
                    </Badge>
                  )}
                  {content.metadata?.estimated_prep_time && (
                    <Badge variant="default">
                      <Clock className="h-3 w-3 mr-1" />
                      Preparo: {content.metadata.estimated_prep_time}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  <button
                    onClick={() => setActiveTab('lesson-plan')}
                    className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'lesson-plan'
                        ? 'border-purple-600 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <GraduationCap className="h-5 w-5 inline mr-2" />
                    Plano de Aula
                  </button>
                  <button
                    onClick={() => setActiveTab('activities')}
                    className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'activities'
                        ? 'border-purple-600 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <FileQuestion className="h-5 w-5 inline mr-2" />
                    Atividades
                  </button>
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'lesson-plan' && (
                  <div className="space-y-6">
                    {/* Resumo */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-blue-600" />
                          Resumo do Conteúdo
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 text-lg leading-relaxed">{content.summary}</p>
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
                          {content.objectives.map((objective, index) => (
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

                    {/* Etapas do Plano */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-purple-600" />
                          Etapas do Plano de Aula ({content.lesson_plan.duration_total})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {content.lesson_plan.stages.map((stage, index) => (
                            <div key={index} className="border-l-4 border-purple-400 pl-4 py-3 bg-purple-50 rounded-r-lg">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-purple-900 text-lg">
                                  {index + 1}. {stage.stage}
                                </h4>
                                <Badge variant="default" className="bg-purple-100 text-purple-700">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {stage.duration}
                                </Badge>
                              </div>
                              <p className="text-gray-700 mb-3">{stage.description}</p>
                              {stage.resources.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {stage.resources.map((resource, i) => (
                                    <span key={i} className="inline-flex items-center px-2 py-1 bg-white rounded-md text-sm text-gray-600">
                                      <Package className="h-3 w-3 mr-1" />
                                      {resource}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Materiais Necessários */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Package className="h-5 w-5 text-orange-600" />
                          Materiais Necessários
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {content.lesson_plan.required_materials.map((material, index) => (
                            <Badge key={index} variant="default" className="bg-orange-100 text-orange-700">
                              {material}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Formas de Avaliação */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <ListChecks className="h-5 w-5 text-blue-600" />
                          Formas de Avaliação
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {content.lesson_plan.assessment_methods.map((method, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">{method}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    {/* Dicas para o Professor */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Lightbulb className="h-5 w-5 text-yellow-600" />
                          Dicas para o Professor
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {content.lesson_plan.teacher_tips.map((tip, index) => (
                            <li key={index} className="flex items-start gap-2 bg-yellow-50 p-3 rounded-lg">
                              <Lightbulb className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {activeTab === 'activities' && (
                  <div className="space-y-6">
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
                          {content.activities.exercises.map((exercise, index) => (
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
                          {content.activities.multiple_choice.map((question, index) => (
                            <div key={index} className="border rounded-lg p-4 bg-orange-50">
                              <p className="font-semibold text-gray-900 mb-3">
                                {index + 1}. {question.question}
                              </p>
                              <div className="space-y-2">
                                {question.options.map((option, optIndex) => {
                                  const isCorrect = question.correct_answer === option.charAt(0);
                                  return (
                                    <div
                                      key={optIndex}
                                      className={`p-3 rounded-lg ${
                                        isCorrect ? 'bg-green-100 border-2 border-green-400' : 'bg-white'
                                      }`}
                                    >
                                      <span className="text-gray-700">{option}</span>
                                      {isCorrect && (
                                        <span className="ml-2 text-green-700 font-semibold">✓ Resposta Correta</span>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                              {question.explanation && (
                                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                  <p className="text-sm text-blue-900">
                                    <strong>Explicação:</strong> {question.explanation}
                                  </p>
                                </div>
                              )}
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
                          {content.activities.essay_questions.map((question, index) => (
                            <div key={index} className="border-l-4 border-indigo-400 pl-4 py-2">
                              <p className="font-medium text-indigo-900 mb-1">Questão {index + 1}</p>
                              <p className="text-gray-700">{question}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Atividades Práticas */}
                    {content.activities.practical_activities && content.activities.practical_activities.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Lightbulb className="h-5 w-5 text-yellow-600" />
                            Atividades Práticas
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {content.activities.practical_activities.map((activity, index) => (
                              <div key={index} className="border-l-4 border-yellow-400 pl-4 py-2 bg-yellow-50 rounded-r-lg">
                                <p className="font-medium text-yellow-900 mb-1">Atividade {index + 1}</p>
                                <p className="text-gray-700">{activity}</p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Ações */}
            <div className="flex gap-4">
              <Button
                onClick={handleGenerateContent}
                variant="outline"
                className="flex-1"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Gerar Novamente
              </Button>
              <Button
                onClick={() => window.print()}
                variant="outline"
                className="flex-1"
              >
                Imprimir Recursos
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
