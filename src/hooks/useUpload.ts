import { useState, useCallback } from 'react';
import { UploadMaterialData, UploadStatus, UploadState } from '@/types/material';

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

      // Preparar FormData
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('discipline', data.discipline);
      formData.append('grade', data.grade);
      formData.append('materialType', data.materialType);
      formData.append('difficulty', data.difficulty);
      
      if (data.subTopic) {
        formData.append('subTopic', data.subTopic);
      }
      
      if (data.estimatedDuration) {
        formData.append('estimatedDuration', data.estimatedDuration.toString());
      }
      
      if (data.tags && data.tags.length > 0) {
        formData.append('tags', JSON.stringify(data.tags));
      }
      
      formData.append('file', data.file);

      // Obter token de autenticação
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token de autenticação não encontrado');
      }

      // Fazer upload com acompanhamento de progresso
      const xhr = new XMLHttpRequest();

      // Promise para aguardar conclusão
      const uploadPromise = new Promise<any>((resolve, reject) => {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setState(prev => ({
              ...prev,
              progress
            }));
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              resolve(response);
            } catch (error) {
              reject(new Error('Erro ao processar resposta do servidor'));
            }
          } else {
            try {
              const errorResponse = JSON.parse(xhr.responseText);
              reject(new Error(errorResponse.error || 'Erro no upload'));
            } catch {
              reject(new Error(`Erro no upload: ${xhr.status}`));
            }
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Erro de conexão'));
        });

        xhr.addEventListener('timeout', () => {
          reject(new Error('Timeout no upload'));
        });
      });

      // Configurar e enviar requisição
      xhr.open('POST', `${API_URL}/materials`);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.timeout = 30000; // 30 segundos
      xhr.send(formData);

      // Aguardar conclusão
      const response = await uploadPromise;

      setState(prev => ({
        ...prev,
        status: UploadStatus.SUCCESS,
        progress: 100,
        materialId: response.data.material.id
      }));

      return response.data;

    } catch (error: any) {
      console.error('Erro no upload:', error);
      
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