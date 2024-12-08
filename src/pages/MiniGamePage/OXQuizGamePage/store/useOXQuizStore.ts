import { create } from 'zustand';
import { oxQuizApi } from '@/shared/api/minigames';
import { QuizResponseDto, QuizAnswerResponseDto } from '@/features/minigame/oxquizgame/types/oxTypes';

export interface OXQuizState {
  oxQuizzes: Record<'easy' | 'medium' | 'hard', QuizResponseDto[]>; // 현재 퀴즈 리스트
  currentIndex: number;
  completedQuizzes: number; // 진행 중인 퀴즈의 인덱스
  loading: boolean; // 로딩 상태
  result: QuizAnswerResponseDto | null; // 현재 퀴즈 결과
  setQuizzes: (difficulty: 'easy' | 'medium' | 'hard', quizzes: QuizResponseDto[]) => void;
  submitAnswer: (oxQuizDataId: number, userAnswer: 'O' | 'X') => Promise<void>; // 정답 제출
  resetQuiz: (difficulty: 'easy' | 'medium' | 'hard') => void; // 퀴즈 상태 초기화
}

const useOXQuizStore = create<OXQuizState>((set) => ({
  oxQuizzes: { easy: [], medium: [], hard: [] },
  currentIndex: 0,
  completedQuizzes: 0, // 초기값 설정
  currentKey: null,
  loading: false,
  result: null,

  setQuizzes: (difficulty, quizzes) => {
    set((state) => ({
      oxQuizzes: {
        ...state.oxQuizzes,
        [difficulty]: quizzes,
      },
      currentIndex: 0,
      completedQuizzes: 0,
      result: null,
    }));
  },

  submitAnswer: async (oxQuizDataId, userAnswer) => {
    set({ loading: true });
    try {
      const response = await oxQuizApi.submitAnswer(oxQuizDataId, userAnswer);
      set((state) => ({
        result: response,
        currentIndex: state.currentIndex,
        completedQuizzes: response.correct ? state.completedQuizzes + 1 : state.completedQuizzes, // 정답 맞춘 경우 증가
      }));
    } catch (error) {
      console.error('Failed to submit answer:', error);
    } finally {
      set({ loading: false });
    }
  },

  resetQuiz: (difficulty) => {
    set((state) => ({
      oxQuizzes: {
        ...state.oxQuizzes,
        [difficulty]: [],
      },
      currentIndex: 0,
      completedQuizzes: 0,
      result: null,
    }));
  },
}));

export default useOXQuizStore;