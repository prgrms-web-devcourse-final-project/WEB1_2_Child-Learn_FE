export interface GameState {
  phase: 'BEFORE' | 'TRADING' | 'AFTER';
  isPlaying: boolean;
  elapsedTime: number;
  playedToday: boolean;
}