import { z } from 'zod';

// Enums do backend
export enum MaterialType {
  LESSON_PLAN = 'LESSON_PLAN',
  EXERCISE = 'EXERCISE', 
  PRESENTATION = 'PRESENTATION',
  VIDEO = 'VIDEO',
  DOCUMENT = 'DOCUMENT',
  WORKSHEET = 'WORKSHEET',
  QUIZ = 'QUIZ',
  PROJECT = 'PROJECT',
  GAME = 'GAME',
  OTHER = 'OTHER'
}

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

// Labels para exibição
export const MaterialTypeLabels: Record<MaterialType, string> = {
  [MaterialType.LESSON_PLAN]: 'Plano de Aula',
  [MaterialType.EXERCISE]: 'Exercício',
  [MaterialType.PRESENTATION]: 'Apresentação',
  [MaterialType.VIDEO]: 'Vídeo',
  [MaterialType.DOCUMENT]: 'Documento',
  [MaterialType.WORKSHEET]: 'Folha de Atividades',
  [MaterialType.QUIZ]: 'Quiz/Questionário',
  [MaterialType.PROJECT]: 'Projeto',
  [MaterialType.GAME]: 'Jogo Educativo',
  [MaterialType.OTHER]: 'Outros'
};

export const DifficultyLabels: Record<Difficulty, string> = {
  [Difficulty.EASY]: 'Fácil',
  [Difficulty.MEDIUM]: 'Médio',
  [Difficulty.HARD]: 'Difícil'
};

// Schema de validação para upload
export const uploadMaterialSchema = z.object({
  title: z.string()
    .min(3, 'Título deve ter pelo menos 3 caracteres')
    .max(100, 'Título deve ter no máximo 100 caracteres'),
  description: z.string()
    .min(10, 'Descrição deve ter pelo menos 10 caracteres')
    .max(1000, 'Descrição deve ter no máximo 1000 caracteres'),
  discipline: z.string()
    .min(2, 'Disciplina é obrigatória'),
  grade: z.string()
    .min(1, 'Série é obrigatória'),
  materialType: z.nativeEnum(MaterialType, {
    errorMap: () => ({ message: 'Tipo de material é obrigatório' })
  }),
  subTopic: z.string().optional(),
  difficulty: z.nativeEnum(Difficulty, {
    errorMap: () => ({ message: 'Dificuldade é obrigatória' })
  }),
  estimatedDuration: z.number()
    .int()
    .positive('Duração deve ser um número positivo')
    .optional(),
  tags: z.array(z.string()).default([]),
  file: z.instanceof(File, { message: 'Arquivo é obrigatório' })
    .refine((file) => file.size <= 10 * 1024 * 1024, 'Arquivo deve ter no máximo 10MB')
    .refine(
      (file) => {
        const allowedTypes = [
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'application/vnd.ms-powerpoint',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-excel',
          'image/jpeg',
          'image/png',
          'image/gif',
          'text/plain'
        ];
        return allowedTypes.includes(file.type);
      },
      'Tipo de arquivo não permitido. Use PDF, DOC, PPT, XLS, imagens ou TXT'
    )
});

export type UploadMaterialData = z.infer<typeof uploadMaterialSchema>;

// Dados das opções
export const subjects = [
  'Matemática',
  'Português', 
  'Ciências',
  'História',
  'Geografia',
  'Inglês',
  'Educação Física',
  'Artes',
  'Filosofia',
  'Sociologia',
  'Física',
  'Química',
  'Biologia'
];

export const gradeLevels = [
  '1º Ano',
  '2º Ano', 
  '3º Ano',
  '4º Ano',
  '5º Ano',
  '6º Ano',
  '7º Ano',
  '8º Ano',
  '9º Ano',
  '1ª Série - Ensino Médio',
  '2ª Série - Ensino Médio',
  '3ª Série - Ensino Médio'
];

// Estados do upload
export enum UploadStatus {
  IDLE = 'idle',
  UPLOADING = 'uploading',
  SUCCESS = 'success',
  ERROR = 'error'
}

export interface UploadState {
  status: UploadStatus;
  progress: number;
  error: string | null;
  materialId: string | null;
}