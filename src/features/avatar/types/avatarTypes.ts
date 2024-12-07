// 아바타 상태
export interface Avatar {
    avatar_id: number;
    member_id: number;
    cur_background?: string; // 현재 배경
    cur_pet?: string;        // 현재 펫
    cur_hat?: string;        // 현재 모자
    pre_background?: string; // 프리셋 배경
    pre_pet?: string;        // 프리셋 펫
    pre_hat?: string;        // 프리셋 모자
  }