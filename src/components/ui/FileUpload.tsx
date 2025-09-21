import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadIcon, FileIcon, XIcon, CheckIcon } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  file: File | null;
  error?: string;
  disabled?: boolean;
}

const allowedTypes = {
  'application/pdf': '.pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
  'application/msword': '.doc',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
  'application/vnd.ms-powerpoint': '.ppt',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
  'application/vnd.ms-excel': '.xls',
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'text/plain': '.txt'
};

const maxSize = 10 * 1024 * 1024; // 10MB

export function FileUpload({ onFileSelect, file, error, disabled }: FileUploadProps) {
  const [dragError, setDragError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setDragError(null);

    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors.find((e: any) => e.code === 'file-too-large')) {
        setDragError('Arquivo muito grande. Máximo 10MB.');
      } else if (rejection.errors.find((e: any) => e.code === 'file-invalid-type')) {
        setDragError('Tipo de arquivo não permitido.');
      } else {
        setDragError('Erro no arquivo selecionado.');
      }
      return;
    }

    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize,
    accept: allowedTypes,
    disabled
  });

  const removeFile = () => {
    onFileSelect(null);
    setDragError(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (file: File) => {
    if (file.type.includes('pdf')) return '📄';
    if (file.type.includes('word')) return '📝';
    if (file.type.includes('presentation')) return '📊';
    if (file.type.includes('sheet')) return '📋';
    if (file.type.includes('image')) return '🖼️';
    return '📎';
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Arquivo do Material *
      </label>
      
      {!file ? (
        <div
          {...getRootProps()}
          className={`
            relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${isDragActive && !isDragReject ? 'border-blue-400 bg-blue-50' : ''}
            ${isDragReject ? 'border-red-400 bg-red-50' : ''}
            ${!isDragActive && !isDragReject ? 'border-gray-300 hover:border-gray-400' : ''}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input {...getInputProps()} />
          
          <div className="space-y-4">
            <UploadIcon 
              className={`mx-auto h-12 w-12 ${
                isDragActive ? 'text-blue-500' : 'text-gray-400'
              }`} 
            />
            
            <div>
              <p className="text-lg font-medium text-gray-900">
                {isDragActive ? 'Solte o arquivo aqui' : 'Arraste e solte seu arquivo'}
              </p>
              <p className="text-sm text-gray-500">
                ou <span className="text-blue-600 font-medium">clique para selecionar</span>
              </p>
            </div>
            
            <div className="text-xs text-gray-500">
              <p>Tipos aceitos: PDF, DOC, PPT, XLS, imagens, TXT</p>
              <p>Tamanho máximo: 10MB</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">
                {getFileIcon(file)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(file.size)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <CheckIcon className="h-5 w-5 text-green-500" />
              <button
                type="button"
                onClick={removeFile}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                disabled={disabled}
              >
                <XIcon className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      )}

      {(error || dragError) && (
        <p className="mt-2 text-sm text-red-600">
          {error || dragError}
        </p>
      )}
    </div>
  );
}