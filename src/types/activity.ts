// Tipos para o conteúdo gerado pela IA (plano de aula + atividades)

export interface MultipleChoiceQuestion {
  question: string;
  options: string[];
  correct_answer: string;
  explanation?: string;
}

export interface LessonPlanStage {
  stage: string;
  description: string;
  duration: string;
  resources: string[];
}

export interface LessonPlan {
  duration_total: string;
  stages: LessonPlanStage[];
  required_materials: string[];
  assessment_methods: string[];
  teacher_tips: string[];
}

export interface Activities {
  exercises: string[];
  multiple_choice: MultipleChoiceQuestion[];
  essay_questions: string[];
  practical_activities?: string[];
}

export interface GeneratedContent {
  title: string;
  summary: string;
  objectives: string[];
  lesson_plan: LessonPlan;
  activities: Activities;
  metadata: {
    generated_at: string;
    difficulty_level: string;
    estimated_prep_time: string;
  };
}

// Manter compatibilidade com código antigo
export interface GeneratedActivities {
  summary: string;
  objectives: string[];
  exercises: string[];
  multiple_choice: MultipleChoiceQuestion[];
  essay_questions: string[];
}

export interface ContentGenerationResponse {
  success: boolean;
  data: {
    material: {
      id: string;
      title: string;
      discipline: string;
      grade: string;
      difficulty: string;
    };
    content: GeneratedContent;
    metadata: {
      contentLength: number;
      extractedFromFile: boolean;
      generatedAt: string;
    };
  };
  message: string;
}

// Compatibilidade
export interface ActivityGenerationResponse {
  success: boolean;
  data: {
    material: {
      id: string;
      title: string;
      discipline: string;
      grade: string;
    };
    activities: GeneratedActivities;
    metadata: {
      contentLength: number;
      extractedFromFile: boolean;
      generatedAt: string;
    };
  };
  message: string;
}

export interface ActivityGenerationError {
  success: false;
  error: string;
  details?: string;
}
