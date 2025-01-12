import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import { useUserInfo } from '@/entities/User/lib/queries';
import { MiniGameTransaction } from '@/features/minigame/points/types/pointTypes';
import useOXQuizStore from './store/useOXQuizStore';
import { walletApi } from '@/shared/api/wallets';

const OXQuizResultPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: userInfo, isLoading: isUserInfoLoading } = useUserInfo();
  const { oxQuizzes, completedQuizzes } = useOXQuizStore();

  // 점수 계산 (퀴즈당 10포인트)
  const totalPoints = completedQuizzes * 100;

  useEffect(() => {
    const processPoints = async () => {
      if (!userInfo || !userInfo.id) {
        console.error('User ID is not available');
        return;
      }
      try {
        const transaction: MiniGameTransaction = {
          memberId: userInfo.id,
          gameType: 'OX_QUIZ', 
          points: totalPoints,
          pointType: 'GAME', // 고정 값
          isWin: totalPoints > 0, // 포인트가 0보다 크면 승리
        };

        // API 호출
        const updatedWallet = await walletApi.processMiniGamePoints(transaction);
        console.log("Wallet updated successfully:", updatedWallet);

        // React Query의 캐시를 갱신
        queryClient.setQueryData(['userInfo'], (oldData: any) => {
          if (oldData) {
            return {
              ...oldData,
              currentPoints: oldData.currentPoints + totalPoints,
            };
          }
          return oldData;
        });

      } catch (error) {
        console.error("Failed to process mini-game points:", error);
      }
    };

    processPoints();
  }, []);

  // 스타 표시 (완료된 문제 수를 기준으로)
  const stars = Array.from({ length: 3 }, (_, index) =>
    index < completedQuizzes ? '/img/star.png' : '/img/star-empty.png'
  );

  return (
    <Container>
     <CheckImage src="/img/Check.png" alt="Check"/>

      <StarsContainer>
        {stars.map((star, index) => (
          <Star key={index} src={star} alt="Star" />
        ))}
      </StarsContainer>
      <PointsText>{totalPoints} Point를 획득하셨습니다!</PointsText>

      <NavigateButton onClick={() => navigate('/minigame')}>미니게임 페이지로 이동하기</NavigateButton>
    </Container>
  );
};

export default OXQuizResultPage;

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
  font-size: 30px;
  color: #ffc107;
  margin: 0 5px;
`;

const PointsText = styled.p`
  font-size: 20px;
  font-weight: bold;
  color: #212529;
  margin-bottom: 30px;
`;

const NavigateButton = styled.button`
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #218838;
  }
`;