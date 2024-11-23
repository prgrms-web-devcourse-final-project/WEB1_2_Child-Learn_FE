import { JoinRequest, JoinResponse } from '../model/types';
import { BASE_URL } from '@/shared/api/base';

export const signUpApi = {
  join: async (data: JoinRequest): Promise<JoinResponse> => {
    const response = await fetch(`${BASE_URL}/member/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    return response.json();
  },
};
