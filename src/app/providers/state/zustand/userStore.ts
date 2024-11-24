import { create } from 'zustand';

interface UserState {
  loginId: string; // 아이디
  username: string; // 닉네임 (별명)
  email: string; // 이메일
  createdAt: string; // 계정 생성일
  updatedAt: string; // 계정 수정일
  gameCount: number; // 게임 참여 횟수
  birth: string; // 생년월일
  points: number; // 총 포인트

  setUser: (user: Partial<UserState>) => void; // 사용자 정보 설정
  addPoints: (amount: number) => void; // 포인트 추가
}

export const useUserStore = create<UserState>((set) => ({
  loginId: '',
  username: '',
  email: '',
  createdAt: '',
  updatedAt: '',
  gameCount: 0,
  birth: '',
  points: 0,

  setUser: (user) =>
    set((state) => ({
      ...state,
      ...user, // 전달받은 user 객체로 상태 업데이트
    })),
  addPoints: (amount) =>
    set((state) => ({
      points: state.points + amount,
    })),
}));
