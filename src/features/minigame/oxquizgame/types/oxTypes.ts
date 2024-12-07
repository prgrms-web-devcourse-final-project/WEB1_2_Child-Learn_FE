export interface QuizRequestDto {
    memberId: number;
    difficulty: string;
  }
  
  export interface QuizResponseDto {
    oxQuizDataId: number;
    question: string;
    difficulty: string;
  }
  
  export interface QuizAnswerRequestDto {
    userAnswer: string;
  }
  
  export interface QuizAnswerResponseDto {
    oxQuizDataId: number;
    explanation: string;
    isCorrect: boolean;
  }