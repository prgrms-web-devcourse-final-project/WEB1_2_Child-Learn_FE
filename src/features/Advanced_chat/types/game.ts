// 게임 관련 타입 정의
export interface GameState {
    phase: 'BEFORE' | 'TRADING' | 'AFTER';
    isPlaying: boolean;
    elapsedTime: number;
    playedToday: boolean;
  }
  