export interface AttendanceResponse {
  memberId: number;
  currentPoints: number;
  currentCoins: number;
}

export interface AttendanceRequest {
  memberId: number;
  points: number;
  isCheckIn: boolean;
}

export enum AttendanceError {
  ALREADY_CHECKED = 'ATTENDANCE_001',
  NOT_FOUND = 'ATTENDANCE_002',
}
