import { create } from 'zustand';
import { oxQuizApi } from '@/shared/api/minigames';
import { QuizResponseDto, QuizAnswerResponseDto } from '@/features/minigame/oxquizgame/types/oxTypes';

export interface OXQuizState {
  oxQuizzes: QuizResponseDto[]; // 현재 퀴즈 리스트
  currentIndex: number;
  completedQuizzes: number; // 진행 중인 퀴즈의 인덱스
  loading: boolean; // 로딩 상태
  result: QuizAnswerResponseDto | null; // 현재 퀴즈 결과
  fetchQuizzes: (memberId: number, difficulty: 'easy' | 'medium' | 'hard') => Promise<void>; // 퀴즈 가져오기
  submitAnswer: (oxQuizDataId: number, userAnswer: 'O' | 'X') => Promise<void>; // 정답 제출
  resetQuiz: () => void; // 퀴즈 상태 초기화
}

const useOXQuizStore = create<OXQuizState>((set) => ({
  oxQuizzes: [],
  currentIndex: 0,
  completedQuizzes: 0, // 초기값 설정
  loading: false,
  result: null,

  fetchQuizzes: async (memberId, difficulty) => {
    set({ loading: true });
    try {
      const quizzes = await oxQuizApi.startQuiz(memberId, difficulty);
      set({ oxQuizzes: quizzes, currentIndex: 0, completedQuizzes: 0, result: null });
    } catch (error) {
      console.error('Failed to fetch quizzes:', error);
    } finally {
      set({ loading: false });
    }
  },

  submitAnswer: async (oxQuizDataId, userAnswer) => {
    set({ loading: true });
    try {
      const response = await oxQuizApi.submitAnswer(oxQuizDataId, userAnswer);
      set((state) => ({
        result: response,
        currentIndex: state.currentIndex + 1,
        completedQuizzes: response.isCorrect ? state.completedQuizzes + 1 : state.completedQuizzes, // 정답 맞춘 경우 증가
      }));
    } catch (error) {
      console.error('Failed to submit answer:', error);
    } finally {
      set({ loading: false });
    }
  },

  resetQuiz: () => {
    set({ oxQuizzes: [], currentIndex: 0, completedQuizzes: 0, result: null });
  },
}));

export default useOXQuizStore;