import { create } from 'zustand';

interface UserState {
  memberId: number; // 회원번호
  loginId: string; // 아이디
  username: string; // 닉네임 (별명)
  email: string; // 이메일
  createdAt: string; // 계정 생성일
  updatedAt: string; // 계정 수정일
  gameCount: number; // 게임 참여 횟수
  birth: string; // 생년월일
  currentPoints: number; // 현재 포인트 잔액
  currentCoins: number; // 현재 코인 잔액

  // 상태 업데이트 메서드
  setUser: (user: Partial<UserState>) => void; // 사용자 정보 설정
  addPoints: (amount: number) => void; // 포인트 추가
  addCoins: (amount: number) => void; // 코인 추가
}

export const useUserStore = create<UserState>((set) => ({
  memberId: 0, // 기본값: 회원번호 0
  loginId: '',
  username: '',
  email: '',
  createdAt: '',
  updatedAt: '',
  gameCount: 0,
  birth: '',
  currentPoints: 0, // 기본 포인트
  currentCoins: 0, // 기본 코인

  // 사용자 정보 업데이트
  setUser: (user) =>
    set((state) => ({
      ...state,
      ...user, // 전달받은 user 객체로 상태 업데이트
    })),

  // 포인트 추가
  addPoints: (amount) =>
    set((state) => ({
      currentPoints: state.currentPoints + amount,
    })),

  // 코인 추가
  addCoins: (amount) =>
    set((state) => ({
      currentCoins: state.currentCoins + amount,
    })),
}));
