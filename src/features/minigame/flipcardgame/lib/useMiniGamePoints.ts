import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { walletApi } from '@/shared/api/wallets'; 
import { MiniGameTransaction, Wallet } from '@/features/minigame/points/types/pointTypes';
import showToast from '@/shared/lib/toast';
import axios from 'axios';

export const useMiniGamePoints = () => {
  const queryClient = useQueryClient();
  const [isPointProcessed, setIsPointProcessed] = useState(false);

  return {
    miniGameMutation: useMutation<Wallet, Error, MiniGameTransaction>({
      mutationFn: (transaction: MiniGameTransaction) => {
        if (isPointProcessed) {
          return Promise.reject(new Error('ALREADY_PROCESSED'));
        }
        return walletApi.processMiniGamePoints(transaction);
      },
      onSuccess: async (data) => {
        setIsPointProcessed(true);
        showToast.success(
          `게임 완료! 현재 포인트: ${data.currentPoints}, 코인: ${data.currentCoins}`
        );
        // userInfo만 갱신하고 다른 쿼리는 건들지 않음
        await queryClient.invalidateQueries({
          queryKey: ['userInfo'],
          exact: true,
        });
      },
      onError: (error) => {
        if (error.message === 'ALREADY_PROCESSED') {
          return; // 이미 처리된 상태에서의 호출은 무시
        }
        if (axios.isAxiosError(error)) {
          showToast.error(
            error.response?.data?.message || '미니게임 포인트 처리에 실패했습니다.'
          );
        } else {
          showToast.error('미니게임 포인트 처리에 실패했습니다.');
        }
      },
    }),
    isPointProcessed,
  };
};
