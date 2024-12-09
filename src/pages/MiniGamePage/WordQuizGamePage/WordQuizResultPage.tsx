import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useUserInfo } from '@/entities/User/lib/queries';
import { useWordQuizStore } from '@/features/minigame/wordquizgame/model/wordQuizStore';
import { walletApi } from '@/shared/api/wallets';
import { MiniGameTransaction } from '@/features/minigame/points/types/pointTypes';
import { useQueryClient } from '@tanstack/react-query';

const WordQuizResultPage = () => {
  const navigate = useNavigate();
  const { data: userInfo, isLoading: isUserInfoLoading } = useUserInfo();
  const queryClient = useQueryClient();
  const { correctAnswers, resetQuiz } = useWordQuizStore();

  // 별의 개수 계산 (최대 별 3개)
  const stars = Math.min(correctAnswers, 3); // 최대 별 3개
  const earnedPoints = correctAnswers * 1000;

  useEffect(() => {
    const processPoints = async () => {
      if (!userInfo || !userInfo.id) {
        console.error('User ID is not available');
        return;
      }
      try {
        const transaction: MiniGameTransaction = {
          memberId: userInfo.id,
          gameType: 'WORD_QUIZ', // 고정 값
          points: earnedPoints,
          pointType: 'GAME', // 고정 값
          isWin: earnedPoints > 0, // 포인트가 0보다 크면 승리
        };

        // API 호출
        const updatedWallet = await walletApi.processMiniGamePoints(transaction);
        console.log("Wallet updated successfully:", updatedWallet);

        // React Query의 캐시를 갱신
        queryClient.setQueryData(['userInfo'], (oldData: any) => {
          if (oldData) {
            return {
              ...oldData,
              currentPoints: oldData.currentPoints + earnedPoints,
            };
          }
          return oldData;
        });

      } catch (error) {
        console.error("Failed to process mini-game points:", error);
      }
    };

    processPoints();
  }, [earnedPoints, userInfo]);

  const handleNavigate = () => {
    resetQuiz(); // 퀴즈 상태 초기화
    navigate('/minigame'); // 미니게임 페이지로 이동
  };

  return (
    <Container>
      <CheckImage src="/img/Check.png" alt="Check"/>
      <StarsContainer>
        {Array.from({ length: stars }).map((_, index) => (
          <Star key={index} src="/img/star.png" alt="Star" />
        ))}
      </StarsContainer>
      <PointsText>총 {earnedPoints} Points를 획득하셨습니다!</PointsText>
      <NavigateButton onClick={handleNavigate}>
        미니게임 페이지로 이동하기
      </NavigateButton>
    </Container>
  );
};

export default WordQuizResultPage;

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100vh;
  background-color: #f5f5f5;
  padding-top: 200px; /* 상단 여백 추가 */
`;

const CheckImage = styled.img`
  width: 120px;
  height: 120px;
  margin-bottom: 20px;
`;

const StarsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const Star = styled.img`
  width: 52px;
  height: 52px;
  margin: 0 5px;
`;

const PointsText = styled.p`
  font-size: 16px;
  font-weight: bold;
  color: #666;
  margin-bottom: 20px;
`;

const NavigateButton = styled.button`
  padding: 10px 20px;
  background-color: #50b498;
  color: white;
  border: none;
  border-radius: 100px;
  width: 302px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #3d937b;
  }
`;
