// Tipos para as atividades geradas pela IA

export interface MultipleChoiceQuestion {
  question: string;
  options: string[];
  answer: string;
}

export interface GeneratedActivities {
  summary: string;
  objectives: string[];
  exercises: string[];
  multiple_choice: MultipleChoiceQuestion[];
  essay_questions: string[];
}

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
