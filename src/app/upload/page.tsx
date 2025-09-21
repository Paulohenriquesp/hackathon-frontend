'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { MaterialType, Difficulty, MaterialTypeLabels, DifficultyLabels } from '@/types';

interface FormData {
  title: string;
  description: string;
  subject: string;
  gradeLevel: string;
  materialType: MaterialType | '';
  difficulty: Difficulty | '';
  tags: string;
  estimatedDuration: string;
}

const subjects = ['Matemática', 'Português', 'Ciências', 'História', 'Geografia', 'Inglês', 'Educação Física', 'Artes'];
const gradeLevels = ['1º Ano', '2º Ano', '3º Ano', '4º Ano', '5º Ano', '6º Ano', '7º Ano', '8º Ano', '9º Ano', 'Ensino Médio'];

export default function UploadPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    subject: '',
    gradeLevel: '',
    materialType: '',
    difficulty: '',
    tags: '',
    estimatedDuration: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validações
    if (!formData.title || !formData.description || !formData.subject || !formData.gradeLevel || 
        !formData.materialType || !formData.difficulty) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    if (!file) {
      setError('Por favor, selecione um arquivo');
      return;
    }

    setLoading(true);

    try {
      // Simular upload (substituir por API real)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess('Material enviado com sucesso! Redirecionando para o dashboard...');
      
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
      
    } catch (error) {
      setError('Erro ao enviar material. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
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
            <CardTitle>Informações do Material</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
                  {success}
                </div>
              )}

              {/* Título */}
              <Input
                label="Título do Material *"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Ex: Exercícios de Matemática - Frações"
                required
              />

              {/* Descrição */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Descreva detalhadamente o conteúdo do material..."
                  required
                />
              </div>

              {/* Grid de campos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Disciplina */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Disciplina *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Selecione uma disciplina</option>
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>

                {/* Série */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Série/Ano *
                  </label>
                  <select
                    name="gradeLevel"
                    value={formData.gradeLevel}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Selecione a série</option>
                    {gradeLevels.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>

                {/* Tipo de Material */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Material *
                  </label>
                  <select
                    name="materialType"
                    value={formData.materialType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Selecione o tipo</option>
                    {Object.entries(MaterialTypeLabels).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>

                {/* Dificuldade */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nível de Dificuldade *
                  </label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Selecione a dificuldade</option>
                    {Object.entries(DifficultyLabels).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tags */}
              <Input
                label="Tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="Ex: frações, matemática, exercícios (separadas por vírgula)"
              />

              {/* Duração Estimada */}
              <Input
                label="Duração Estimada (em minutos)"
                name="estimatedDuration"
                type="number"
                value={formData.estimatedDuration}
                onChange={handleInputChange}
                placeholder="Ex: 50"
              />

              {/* Upload de Arquivo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Arquivo do Material *
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                        <span>Selecione um arquivo</span>
                        <input
                          type="file"
                          className="sr-only"
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                          required
                        />
                      </label>
                      <p className="pl-1">ou arraste e solte</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, DOC, PPT, XLS até 10MB
                    </p>
                    {file && (
                      <p className="text-sm text-green-600 mt-2">
                        Arquivo selecionado: {file.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Botões */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="submit"
                  loading={loading}
                  disabled={loading}
                  className="flex-1"
                  size="lg"
                >
                  {loading ? 'Enviando...' : 'Compartilhar Material'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/dashboard')}
                  size="lg"
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