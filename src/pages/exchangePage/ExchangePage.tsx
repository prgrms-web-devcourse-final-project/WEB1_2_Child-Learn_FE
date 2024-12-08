import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useUserInfo } from '@/entities/User/lib/queries';
import { useCoinPointStore } from '@/features/exchange/model/coinPointStore';
import CurrentStatus from '@/features/exchange/ui/CurrentStatus';
import ExchangeBox from '@/features/exchange/ui/ExchangeBox';
import Popup from '@/features/exchange/ui/Popup'
import { walletApi } from '@/shared/api/wallets';
import { useQueryClient } from '@tanstack/react-query';

const EXCHANGE_RATE = 100; // 100 포인트 = 1 코인

const ExchangePage = () => {
  const { data: userInfo, isLoading, error } = useUserInfo();
  const { point, coin, setPoint, setCoin, addExchangeDetail } = useCoinPointStore();
  const [exchangePoints, setExchangePoints] = useState(''); // 입력된 환전 포인트
  const [exchangeCoins, setExchangeCoins] = useState(''); // 입력된 환전 코인
  const [popupMessage, setPopupMessage] = useState(''); // 팝업 메시지
  const [popupDetails, setPopupDetails] = useState<{ pointsUsed?: number; coinsGained?: number }>({}); // 팝업 상세 정보
  const [popupButtonText, setPopupButtonText] = useState(''); // 팝업 버튼 텍스트
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const queryClient = useQueryClient();

  if (isLoading) return <div>Loading...</div>;
  if (error || !userInfo) return <div>Error loading user info.</div>;

  const currentPoints = userInfo.currentPoints;
  const currentCoins = userInfo.currentCoins;

  useEffect(() => {
    setPoint({ currentPoints: userInfo.currentPoints }); // 기본값 2000 설정
    setCoin({ currentCoins: userInfo.currentCoins }); // 기본값 10 설정
  }, [currentPoints, currentCoins, setPoint, setCoin]);

  // 최대 환전 가능 코인 계산
  const maxExchangeableCoins = Math.floor(point.currentPoints / EXCHANGE_RATE);

  const handleExchange = async () => {
    const pointsToExchange = Number(exchangePoints);
    const coinsToExchange = Number(exchangeCoins);

    if (pointsToExchange <= 0 || pointsToExchange > point.currentPoints) {
      setPopupMessage('환전 가능한 포인트를 입력해주세요!');
      setPopupButtonText('다시 입력하기');
      setPopupDetails({ pointsUsed: 0, coinsGained: 0 });
      setIsPopupVisible(true);
      return;
    }

    try {
      const updatedWallet = await walletApi.exchangePoints({
        memberId: userInfo.id,
        pointsExchanged: pointsToExchange,
      });

      queryClient.setQueryData(['userInfo'], (oldData: any) => {
        if (oldData) {
          return {
            ...oldData,
            currentPoints: updatedWallet.currentPoints,
            currentCoins: updatedWallet.currentCoins,
          };
        }
        return oldData;
      });
      
    // 상태 업데이트
    setPoint({ currentPoints: updatedWallet.currentPoints  });
    setCoin({ currentCoins: updatedWallet.currentCoins });

    addExchangeDetail({
      exchangeId: Date.now(),
      memberId: userInfo.id,// 예시로 사용
      pointsExchanged: pointsToExchange,
      coinsReceived: coinsToExchange,
      createdAt: new Date().toISOString(),
    });

    // 환전 성공 시 팝업 데이터 설정
  setPopupMessage('환전이 완료되었습니다!');
  setPopupButtonText('환전 종료하기');
  setPopupDetails({
    pointsUsed: pointsToExchange,
    coinsGained: coinsToExchange,
  });
    setIsPopupVisible(true); // 팝업 표시
  } catch (error) {
    console.error('Failed to exchange points:', error);
    setPopupMessage('환전 처리 중 오류가 발생했습니다.');
    setPopupButtonText('닫기');
    setIsPopupVisible(true);
  }
};

  return (
    <Container>
      <Header>
      <HeaderTitle>환전하기</HeaderTitle>
      <HeaderSubtitle>포인트를 코인으로 바꿀 수 있어요.</HeaderSubtitle>
      </Header>
      <CurrentStatus points={point.currentPoints} coins={coin.currentCoins} />
      <ExchangeBox
        exchangePoints={exchangePoints}
        setExchangePoints={setExchangePoints}
        exchangeCoins={exchangeCoins}
        setExchangeCoins={setExchangeCoins}
        maxExchangeableCoins={maxExchangeableCoins}
        EXCHANGE_RATE={EXCHANGE_RATE}
      />
      <SectionLabel>포인트 변환 비율</SectionLabel>
        <RateSection>
          <Icon src="/img/coins.png" alt="Point Icon" />
          <RateText>
            100 <StrongText>Point</StrongText>
          </RateText>
          <RateEqualImage src="/img/equals.png" alt="Equals Icon" />
          <Icon src="/img/coins.png" alt="Coin Icon" />
          <RateText>
            1 <StrongText>Coin</StrongText>
          </RateText>
        </RateSection>
      <ExchangeButton onClick={handleExchange}>환전 신청하기</ExchangeButton>

      {isPopupVisible && (
        <Popup
          message={popupMessage}
          pointsUsed={popupDetails.pointsUsed}
          coinsGained={popupDetails.coinsGained}
          buttonText={popupButtonText}
          onClose={() => setIsPopupVisible(false)}
        />
      )}
    </Container>
  );
};

export default ExchangePage;

// 나머지 Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
`;

const Header = styled.div`
  margin-bottom: 60px;
  text-align: center; /* 중앙 정렬 */
`;

const HeaderTitle = styled.h1`
  font-size: 17px;
  font-weight: bold;
  margin: 0;
  color: #000000;
`;

const HeaderSubtitle = styled.p`
  font-size: 14px;
  font-weight: bold;
  margin: 5px 0 0;
  color: #808080;
`;

const Icon = styled.img`
  width: 40px; /* Size of the icon */
  height: 40px;
`;

const SectionLabel = styled.div`
  font-size: 15px;
  font-weight: normal;
  text-align: left;
  color: #989898; /* 회색 */
  margin-bottom: 10px;
`;

const RateSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const RateText = styled.div`
  font-size: 14px;
  font-weight: normal;
  color: #000000;
`;

const StrongText = styled.span`
  font-weight: bold;
`;

const RateEqualImage = styled.img`
  width: 25px; /* 이미지 크기 */
  height: 25px;
`;

const ExchangeButton = styled.button`
  padding: 10px 20px;
  margin-top: 160px;
  width: 300px;
  background-color: #50b498;
  color: white;
  border: none;
  border-radius: 100px;
  cursor: pointer;

  &:hover {
    background-color: #3d937b;
  }
`;