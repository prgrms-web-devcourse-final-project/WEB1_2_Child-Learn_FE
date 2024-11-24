import { useState } from 'react';
import { signUpApi } from '../lib/signUpApi';
import type { JoinRequest } from '../model/types';

export const useJoin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleJoin = async (data: JoinRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await signUpApi.join(data);
      return response; // 성공 시 응답 반환
    } catch (err) {
      setError(err instanceof Error ? err.message : '회원가입에 실패했습니다.');
      throw err; // 에러를 throw하여 컴포넌트에서 처리할 수 있도록 함
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleJoin,
    isLoading,
    error,
  };
};
