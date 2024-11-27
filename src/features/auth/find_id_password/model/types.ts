export type RecoveryTab = 'id' | 'password';

export interface FindIdRequest {
  email: string;
  birth: string;
}

export interface ResetPasswordRequest {
  loginId: string;
  email: string;
}

export interface RecoveryFormData {
  birthday?: string;
  email: string;
  loginId?: string;
}
