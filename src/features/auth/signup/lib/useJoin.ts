import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUpApi } from '../lib/signUpApi';
import type { JoinRequest } from '../model/types';

export const useJoin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleJoin = async (data: JoinRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      await signUpApi.join(data);
      navigate('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : '회원가입에 실패했습니다.');
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
