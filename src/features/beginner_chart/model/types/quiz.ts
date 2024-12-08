export interface BeginQuiz {
  content: string;    // 퀴즈 내용
  oContent: string;   // O 답변 내용
  xContent: string;   // X 답변 내용
  answer: string;     // 정답 ("O" 또는 "X")
}

export interface QuizSubmissionResponse {
  isCorrect: boolean;
  points?: number;
}