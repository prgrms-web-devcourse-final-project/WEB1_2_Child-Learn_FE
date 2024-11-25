import { useState } from 'react';
import styled from 'styled-components';
import { useCoinPointStore } from '../../features/exchange/model/coinPointStore';

const EXCHANGE_RATE = 100; // 100 포인트 = 1 코인

const ExchangePage = () => {
  const { point, coin, setPoint, setCoin, addExchangeDetail } = useCoinPointStore();
  const [exchangePoints, setExchangePoints] = useState(0); // 입력된 환전 포인트
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const handleExchange = () => {
    if (exchangePoints <= 0 || exchangePoints > (point?.currentPoints || 0)) {
      alert('환전 가능한 포인트를 입력해주세요.');
      return;
    }

    const coinsToReceive = Math.floor(exchangePoints / EXCHANGE_RATE);

    // 상태 업데이트
    setPoint({ ...point, currentPoints: point.currentPoints - exchangePoints });
    setCoin({ ...coin, currentCoins: coin.currentCoins + coinsToReceive });
    addExchangeDetail({
      exchangeId: Date.now(), // 가상의 ID
      memberId: coin?.memberId || 0,
      pointsExchanged: exchangePoints,
      coinsReceived: coinsToReceive,
      createdAt: new Date().toISOString(),
    });

    setIsPopupVisible(true); // 팝업 표시
  };

  return (
    <Container>
      <Header>
        <CurrentStatus>
          <PointDisplay>포인트: {point?.currentPoints || 0}</PointDisplay>
          <CoinDisplay>코인: {coin?.currentCoins || 0}</CoinDisplay>
        </CurrentStatus>
      </Header>
      <ExchangeBox>
        <Label>환전할 포인트</Label>
        <Input
          type="number"
          value={exchangePoints}
          onChange={(e) => setExchangePoints(Number(e.target.value))}
        />
        <Result>환전될 코인: {Math.floor(exchangePoints / EXCHANGE_RATE)}</Result>
      </ExchangeBox>
      <RateDescription>100 Point = 1 Coin</RateDescription>
      <ExchangeButton onClick={handleExchange}>환전 신청하기</ExchangeButton>

      {isPopupVisible && (
        <Popup
          message={`환전이 완료되었습니다!\n사용된 포인트: ${exchangePoints}, 받은 코인: ${Math.floor(
            exchangePoints / EXCHANGE_RATE
          )}`}
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