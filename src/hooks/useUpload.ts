import { useState, useCallback } from 'react';
import { UploadMaterialData, UploadStatus, UploadState } from '@/types/material';
import { authStore } from '@/contexts/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export function useUpload() {
  const [state, setState] = useState<UploadState>({
    status: UploadStatus.IDLE,
    progress: 0,
    error: null,
    materialId: null
  });

  const uploadMaterial = useCallback(async (data: UploadMaterialData) => {
    try {
      setState(prev => ({
        ...prev,
        status: UploadStatus.UPLOADING,
        progress: 0,
        error: null
      }));

      console.log('🔍 useUpload: Iniciando upload com dados:', {
        title: data.title,
        description: data.description,
        discipline: data.discipline,
        grade: data.grade,
        materialType: data.materialType,
        difficulty: data.difficulty,
        subTopic: data.subTopic,
        fileName: data.file?.name
      });

      // Preparar FormData conforme o backend espera
      const formData = new FormData();
      
      // Campos obrigatórios
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('discipline', data.discipline);
      formData.append('grade', data.grade);
      formData.append('materialType', data.materialType); // Enum: LESSON_PLAN, EXERCISE, etc.
      formData.append('difficulty', data.difficulty); // Enum: EASY, MEDIUM, HARD
      
      // Campos opcionais
      if (data.subTopic?.trim()) {
        formData.append('subTopic', data.subTopic.trim());
      }
      
      
      // Arquivo obrigatório
      if (!data.file) {
        throw new Error('Arquivo é obrigatório');
      }
      formData.append('file', data.file);

      // Log do FormData para debug
      console.log('🔍 useUpload: FormData preparado:');
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`  ${key}: [File] ${value.name} (${value.type})`);
        } else {
          console.log(`  ${key}: ${value}`);
        }
      }

      // Fazer upload com XMLHttpRequest para acompanhar progresso
      const xhr = new XMLHttpRequest();

      const uploadPromise = new Promise<any>((resolve, reject) => {
        // Progresso do upload
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setState(prev => ({ ...prev, progress }));
          }
        });

        // Resposta do servidor
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              console.log('✅ useUpload: Upload bem-sucedido:', response);
              resolve(response);
            } catch (error) {
              console.error('❌ useUpload: Erro ao parsear resposta:', error);
              reject(new Error('Erro ao processar resposta do servidor'));
            }
          } else {
            try {
              const errorResponse = JSON.parse(xhr.responseText);
              console.error('❌ useUpload: Erro do servidor:', errorResponse);
              reject(new Error(errorResponse.error || `Erro ${xhr.status}`));
            } catch {
              console.error('❌ useUpload: Erro HTTP:', xhr.status);
              reject(new Error(`Erro ${xhr.status}: ${xhr.statusText}`));
            }
          }
        });

        xhr.addEventListener('error', () => {
          console.error('❌ useUpload: Erro de conexão');
          reject(new Error('Erro de conexão com o servidor'));
        });

        xhr.addEventListener('timeout', () => {
          console.error('❌ useUpload: Timeout');
          reject(new Error('Timeout: Upload demorou muito para completar'));
        });
      });

      // Configurar e enviar requisição
      xhr.open('POST', `${API_URL}/materials`);
      
      // Adicionar token de autorização
      const token = authStore.getToken();
      if (!token) {
        throw new Error('Token de acesso não encontrado. Faça login novamente.');
      }
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      console.log('✅ useUpload: Authorization header definido');
      
      // Timeout de 2 minutos para uploads grandes
      xhr.timeout = 120000;
      
      console.log('🚀 useUpload: Enviando requisição...');
      xhr.send(formData);

      // Aguardar conclusão
      const response = await uploadPromise;

      setState(prev => ({
        ...prev,
        status: UploadStatus.SUCCESS,
        progress: 100,
        materialId: response.data?.material?.id
      }));

      return response.data;

    } catch (error: any) {
      console.error('❌ useUpload: Erro no upload:', error);
      
      setState(prev => ({
        ...prev,
        status: UploadStatus.ERROR,
        error: error.message || 'Erro desconhecido no upload'
      }));

      throw error;
    }
  }, []);

  const resetUpload = useCallback(() => {
    setState({
      status: UploadStatus.IDLE,
      progress: 0,
      error: null,
      materialId: null
    });
  }, []);

  return {
    uploadMaterial,
    resetUpload,
    status: state.status,
    progress: state.progress,
    error: state.error,
    materialId: state.materialId,
    isUploading: state.status === UploadStatus.UPLOADING,
    isSuccess: state.status === UploadStatus.SUCCESS,
    isError: state.status === UploadStatus.ERROR,
    isIdle: state.status === UploadStatus.IDLE
  };
}