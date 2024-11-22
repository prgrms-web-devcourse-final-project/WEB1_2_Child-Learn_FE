import { create } from 'zustand';

export interface OXQuiz {
  id: number; // OX 퀴즈 고유 ID
  content: string; // 질문 내용
  isCorrect: boolean | null; // 정답 여부 (null은 아직 답하지 않음)
  priority: 'LOW' | 'HIGH'; // 우선순위
  level: 'beginner' | 'medium' | 'advanced'; // 난이도
}

interface OXQuizState {
  memberId: number; // 회원 번호
  oxQuizzes: OXQuiz[]; // 진행 중인 퀴즈들
  completedQuizzes: number; // 완료된 퀴즈 수
  fetchInitialQuizzes: (quizzes: OXQuiz[]) => void; // 초기 퀴즈 설정
  submitAnswer: (quizId: number, isCorrect: boolean) => void; // 정답 제출
  refreshQuizzes: (newQuizzes: OXQuiz[]) => void; // 새로운 퀴즈 추가
  clearOldLowPriority: () => void; // 오래된 LOW priority 퀴즈 제거
}

const useOXQuizStore = create<OXQuizState>((set, get) => ({
  memberId: 0,
  oxQuizzes: [],
  completedQuizzes: 0,

  // 초기 퀴즈 설정
  fetchInitialQuizzes: (quizzes: OXQuiz[]) => {
    set({
      oxQuizzes: quizzes.map((quiz) => ({
        ...quiz,
        isCorrect: null, // 초기값은 정답 여부 미정
      })),
      completedQuizzes: 0,
    });
  },

  // 정답 제출
  submitAnswer: (quizId: number, isCorrect: boolean) => {
    const { oxQuizzes } = get();

    // 상태 업데이트
    set({
      oxQuizzes: oxQuizzes.map((quiz) =>
        quiz.id === quizId ? { ...quiz, isCorrect } : quiz
      ),
      completedQuizzes: get().completedQuizzes + 1,
    });

    // 틀린 퀴즈는 그대로 유지, 맞춘 퀴즈는 제거
    if (isCorrect) {
      set({
        oxQuizzes: oxQuizzes.filter((quiz) => quiz.id !== quizId),
      });
    }
  },

  // 새로운 퀴즈 추가
  refreshQuizzes: (newQuizzes: OXQuiz[]) => {
    const { oxQuizzes } = get();
    set({
      oxQuizzes: [...oxQuizzes, ...newQuizzes],
    });
  },

  // 오래된 LOW priority 퀴즈 제거
  clearOldLowPriority: () => {
    const { oxQuizzes } = get();

    // LOW priority 질문 제거
    set({
      oxQuizzes: oxQuizzes.filter((quiz) => quiz.priority !== 'LOW'),
    });
  },
}));

export default useOXQuizStore;