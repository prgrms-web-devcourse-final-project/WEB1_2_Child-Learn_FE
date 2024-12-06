export interface Word {
    word: string; // 단어
    explanation: string; // 설명
    hint: string; // 힌트
  }
  
  export interface WordQuizRequest {
    isCorrect: boolean;
  }

  export interface WordQuizResponse {
    word: string;            // 퀴즈 단어
    explanation: string;     // 퀴즈 설명
    hint: string;            // 힌트
    currentPhase: number;    // 현재 단계
    remainLife: number;      // 남은 목숨
    difficulty: 'EASY' | 'NORMAL' | 'HARD'; // 난이도
  }
  
  