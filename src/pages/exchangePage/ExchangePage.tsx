import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useUserStore } from '../../app/providers/state/zustand/userStore'
import { useCoinPointStore } from '../../features/exchange/model/coinPointStore';

const EXCHANGE_RATE = 100; // 100 포인트 = 1 코인

const ExchangePage = () => {
  const { currentPoints, currentCoins } = useUserStore();
  const { point, coin, setPoint, setCoin, addExchangeDetail } = useCoinPointStore();
  const [exchangePoints, setExchangePoints] = useState(''); // 입력된 환전 포인트
  const [exchangeCoins, setExchangeCoins] = useState(''); // 입력된 환전 코인
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  useEffect(() => {
    setPoint({ currentPoints: currentPoints || 2000 }); // 기본값 2000 설정
    setCoin({ currentCoins: currentCoins || 10 }); // 기본값 10 설정
  }, [currentPoints, currentCoins, setPoint, setCoin]);

  // 최대 환전 가능 코인 계산
  const maxExchangeableCoins = Math.floor(point.currentPoints / EXCHANGE_RATE);

  const handleExchange = () => {
    const pointsToExchange = Number(exchangePoints);
    const coinsToExchange = Number(exchangeCoins);

    if (pointsToExchange <= 0 || pointsToExchange > point.currentPoints) {
      alert('환전 가능한 포인트를 입력해주세요.');
      return;
    }

    // 상태 업데이트
    setPoint({ currentPoints: point.currentPoints - pointsToExchange });
    setCoin({ currentCoins: coin.currentCoins + coinsToExchange });

    addExchangeDetail({
      exchangeId: Date.now(),
      memberId: 1, // 예시로 사용
      pointsExchanged: pointsToExchange,
      coinsReceived: coinsToExchange,
      createdAt: new Date().toISOString(),
    });

    setIsPopupVisible(true); // 팝업 표시
  };

  return (
    <Container>
      <Header>
        <CurrentStatus>
          <PointDisplay>포인트: {point.currentPoints}</PointDisplay>
          <CoinDisplay>코인: {coin.currentCoins}</CoinDisplay>
        </CurrentStatus>
      </Header>
      <ExchangeBox>
        <Label>환전할 포인트</Label>
        <Input
          type="number"
          value={exchangePoints}
          onChange={(e) => {
            const value = e.target.value;
            setExchangePoints(value);
            setExchangeCoins(String(Math.floor(Number(value) / EXCHANGE_RATE)));
          }}
          placeholder="포인트 입력"
        />
        <MaxExchangeable>
          최대 환전 가능: {maxExchangeableCoins} 코인
        </MaxExchangeable>
        <Input
          type="number"
          value={exchangeCoins}
          onChange={(e) => {
            const value = e.target.value;
            setExchangeCoins(value);
            setExchangePoints(String(Number(value) * EXCHANGE_RATE));
          }}
          placeholder="코인 입력"
        />
        <MaxExchangeable>
          최대 환전 가능: {maxExchangeableCoins} 코인
        </MaxExchangeable>
      </ExchangeBox>
      <RateDescription>100 Point = 1 Coin</RateDescription>
      <ExchangeButton onClick={handleExchange}>환전 신청하기</ExchangeButton>

      {isPopupVisible && (
        <Popup
          message={`환전이 완료되었습니다!\n사용된 포인트: ${exchangePoints}, 받은 코인: ${exchangeCoins}`}
          buttonText="확인"
          onClose={() => setIsPopupVisible(false)}
        />
      )}
    </Container>
  );
};

export default ExchangePage;

interface PopupProps {
  message: string;
  buttonText: string;
  onClose: () => void;
}

const Popup = ({ message, buttonText, onClose }: PopupProps) => (
  <PopupContainer>
    <Message>{message}</Message>
    <PopupButton onClick={onClose}>{buttonText}</PopupButton>
  </PopupContainer>
);

// Styled Components
const PopupContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
  z-index: 1000;
`;

const Message = styled.p`
  font-size: 16px;
  margin-bottom: 20px;
`;

const PopupButton = styled.button`
  padding: 10px 20px;
  background-color: #50b498;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #3d937b;
  }
`;

// 나머지 Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const Header = styled.div`
  margin-bottom: 20px;
`;

const CurrentStatus = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const PointDisplay = styled.div`
  font-size: 16px;
`;

const CoinDisplay = styled.div`
  font-size: 16px;
`;

const ExchangeBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const Label = styled.label`
  font-size: 14px;
  margin-bottom: 10px;
`;

const Input = styled.input`
  width: 100px;
  text-align: center;
  margin-bottom: 10px;
`;

const Result = styled.div`
  font-size: 14px;
`;

const MaxExchangeable = styled.div`
  font-size: 14px;
  color: #666;
  margin-top: 10px;
`;

const RateDescription = styled.div`
  margin: 10px 0;
`;

const ExchangeButton = styled.button`
  padding: 10px 20px;
  background-color: #50b498;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;

  &:hover {
    background-color: #3d937b;
  }
`;