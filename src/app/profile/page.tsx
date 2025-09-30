'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { ConfirmModal } from '@/components/ui/Modal';
import { useDashboard } from '@/hooks/useDashboard';
import { useProfile } from '@/hooks/useProfile';
import { useMaterialActions } from '@/hooks/useMaterialActions';
import {
  User,
  Mail,
  School,
  Calendar,
  FileText,
  Download,
  Star,
  Edit2,
  Loader2,
  Save,
  X,
  TrendingUp,
  Award,
  BarChart3,
  Trash2
} from 'lucide-react';

export default function ProfilePage() {
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  const { materials, stats, loading, error, refresh } = useDashboard();
  const { updateProfile, loading: profileLoading } = useProfile();
  const { deleteMaterial, delete: deleteState } = useMaterialActions();

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedSchool, setEditedSchool] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState<{ id: string; title: string } | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (user) {
      setEditedName(user.name);
      setEditedSchool(user.school || '');
    }
  }, [user]);

  const handleStartEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (user) {
      setEditedName(user.name);
      setEditedSchool(user.school || '');
    }
  };

  const handleSaveProfile = async () => {
    if (!editedName.trim()) {
      showToast('Nome não pode ser vazio', 'error', 3000);
      return;
    }

    try {
      await updateProfile({
        name: editedName.trim(),
        school: editedSchool.trim() || undefined,
      });

      showToast('Perfil atualizado com sucesso!', 'success', 3000);
      setIsEditing(false);

      // Atualizar dashboard após edição
      refresh();
    } catch (error: any) {
      showToast(error.message || 'Erro ao atualizar perfil', 'error', 4000);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const handleDeleteClick = (materialId: string, materialTitle: string) => {
    setMaterialToDelete({ id: materialId, title: materialTitle });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!materialToDelete) return;

    try {
      await deleteMaterial(materialToDelete.id);
      showToast('Material excluído com sucesso!', 'success', 3000);
      setDeleteModalOpen(false);
      setMaterialToDelete(null);
      refresh();
    } catch (error: any) {
      showToast(error.message || 'Erro ao excluir material', 'error', 4000);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setMaterialToDelete(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-8 w-8 text-blue-600 mx-auto" />
          <p className="mt-2 text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
          <p className="text-gray-600 mt-2">Gerencie suas informações e veja suas estatísticas</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna da Esquerda - Informações Básicas */}
          <div className="lg:col-span-1 space-y-6">
            {/* Card de Informações Básicas */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Informações Básicas
                  </CardTitle>
                  {!isEditing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleStartEdit}
                      className="flex items-center gap-1"
                    >
                      <Edit2 className="h-4 w-4" />
                      Editar
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Avatar */}
                <div className="flex justify-center">
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </div>

                {/* Nome */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo
                  </label>
                  {isEditing ? (
                    <Input
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      placeholder="Seu nome"
                      disabled={profileLoading}
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-gray-900">
                      <User className="h-4 w-4 text-gray-400" />
                      <span>{user.name}</span>
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="flex items-center gap-2 text-gray-900">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">O email não pode ser alterado</p>
                </div>

                {/* Escola */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Instituição de Ensino
                  </label>
                  {isEditing ? (
                    <Input
                      value={editedSchool}
                      onChange={(e) => setEditedSchool(e.target.value)}
                      placeholder="Nome da escola"
                      disabled={profileLoading}
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-gray-900">
                      <School className="h-4 w-4 text-gray-400" />
                      <span>{user.school || 'Não informado'}</span>
                    </div>
                  )}
                </div>

                {/* Data de Cadastro */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Membro desde
                  </label>
                  <div className="flex items-center gap-2 text-gray-900">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{formatDate(user.createdAt)}</span>
                  </div>
                </div>

                {/* Botões de Ação */}
                {isEditing ? (
                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={handleSaveProfile}
                      disabled={profileLoading}
                      loading={profileLoading}
                      className="flex-1"
                      size="sm"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Salvar
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleCancelEdit}
                      disabled={profileLoading}
                      size="sm"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                  </div>
                ) : (
                  <div className="pt-4">
                    <Button
                      variant="outline"
                      onClick={handleLogout}
                      className="w-full"
                      size="sm"
                    >
                      Sair da Conta
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Card de Estatísticas Resumidas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Resumo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">Materiais</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600">{stats.totalMaterials}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Download className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-700">Downloads</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">{stats.totalDownloads}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-600" />
                    <span className="text-sm font-medium text-gray-700">Avaliação</span>
                  </div>
                  <span className="text-lg font-bold text-yellow-600">
                    {stats.averageRating.toFixed(1)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coluna da Direita - Materiais e Atividades */}
          <div className="lg:col-span-2 space-y-6">
            {/* Estatísticas Detalhadas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total de Uploads</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalMaterials}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Downloads Recebidos</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalDownloads}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-yellow-100 rounded-lg">
                      <Award className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Avaliação Média</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.averageRating.toFixed(1)} ★
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Meus Materiais */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Meus Materiais Recentes</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push('/materials?author=me')}
                  >
                    Ver Todos
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {error && (
                  <div className="text-center py-8 text-red-600">
                    <p>{error}</p>
                  </div>
                )}

                {!error && materials.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Nenhum material enviado ainda
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Comece compartilhando seu primeiro material educacional!
                    </p>
                    <Button onClick={() => router.push('/upload')}>
                      Compartilhar Material
                    </Button>
                  </div>
                )}

                {!error && materials.length > 0 && (
                  <div className="space-y-4">
                    {materials.slice(0, 5).map((material) => (
                      <div
                        key={material.id}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{material.title}</h3>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <Badge variant="secondary">{material.discipline}</Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/materials/${material.id}/edit`)}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteClick(material.id, material.title)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {material.description}
                        </p>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-4 text-gray-500">
                            <span className="flex items-center gap-1">
                              <Download className="h-4 w-4" />
                              {material.downloadCount}
                            </span>
                            <span className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              {material.avgRating.toFixed(1)} ({material.totalRatings})
                            </span>
                          </div>
                          <span className="text-xs text-gray-400">
                            {new Date(material.createdAt).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Modal de Confirmação de Exclusão */}
        <ConfirmModal
          isOpen={deleteModalOpen}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title="Excluir Material"
          message={`Tem certeza que deseja excluir o material "${materialToDelete?.title}"? Esta ação não pode ser desfeita.`}
          confirmText="Sim, Excluir"
          cancelText="Cancelar"
          variant="danger"
          isLoading={deleteState.isLoading}
        />
      </div>
    </div>
  );
}
