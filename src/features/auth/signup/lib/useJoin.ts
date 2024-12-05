import { useState } from 'react';
import { signUpApi } from '../lib/signUpApi';
import type { JoinRequest } from '../model/types';

export const useJoin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleJoin = async (data: JoinRequest) => {
    setIsLoading(true);
    setError(null);
    setFieldErrors({}); // fieldErrors 초기화

    try {
      const response = await signUpApi.join(data);
      return response;
    } catch (err) {
      if (err && typeof err === 'object' && 'field' in err) {
        // 특정 필드 에러인 경우 (중복 에러 등)
        const fieldError = err as { field: string; message: string };
        setFieldErrors({ [fieldError.field]: fieldError.message });
      } else {
        // 일반 에러인 경우
        setError(
          err instanceof Error ? err.message : '회원가입에 실패했습니다.'
        );
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleJoin,
    isLoading,
    error,
    fieldErrors, // fieldErrors도 반환
  };
};
