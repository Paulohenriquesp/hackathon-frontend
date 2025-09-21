// Tipos para usuário
export interface User {
  id: string;
  name: string;
  email: string;
  school?: string;
  materialsCount: number;
  createdAt: string;
}

// Tipos para autenticação
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  school?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: LoginData) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Tipos para materiais
export interface Material {
  id: string;
  title: string;
  description: string;
  subject: string;
  gradeLevel: string;
  materialType: MaterialType;
  difficulty: Difficulty;
  tags: string[];
  fileUrl?: string;
  fileName?: string;
  downloadCount: number;
  rating: number;
  totalRatings: number;
  createdAt: string;
  author: {
    id: string;
    name: string;
    school?: string;
  };
}

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

// Tipos para filtros
export interface MaterialFilters {
  search?: string;
  subject?: string;
  gradeLevel?: string;
  materialType?: MaterialType;
  difficulty?: Difficulty;
  tags?: string[];
}

// Tipos para API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}