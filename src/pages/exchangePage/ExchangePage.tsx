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
      <HeaderTitle>환전하기</HeaderTitle>
      <HeaderSubtitle>포인트를 코인으로 바꿀 수 있어요.</HeaderSubtitle>
      </Header>
      <CurrentStatus>
        <PointBadge points={point.currentPoints} />
        <CoinBadge points={coin.currentCoins} />
        </CurrentStatus>
      <ExchangeBox>
      <SectionLabel>환전할 포인트</SectionLabel>
      <ExchangeSection>
      <IconLabel>
          <Icon src="/img/coins.png" alt="Point Icon" />
          <Label>포인트</Label>
        </IconLabel>
        <InputContainer>
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
        </InputContainer>
       </ExchangeSection>
       <ChangeToIcon src="/img/change-to.png" alt="Change To Icon" />
       <SectionLabel>환전될 코인</SectionLabel>
       <ExchangeSection>
       <IconLabel>
          <Icon src="/img/coins.png" alt="Coin-Icon" />
          <Label>코인</Label>
        </IconLabel>
       <InputContainer>
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
          최대 {maxExchangeableCoins} 코인까지 환전 가능
        </MaxExchangeable>
        </InputContainer>
        </ExchangeSection>
      </ExchangeBox>
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

// PointBadge 컴포넌트
const PointBadge = ({ points }: { points: number }) => (
  <BadgeContainer>
    <BadgeIconWrapper>
      <BadgeIcon src="/img/coins.png" alt="포인트" />
    </BadgeIconWrapper>
    {points.toLocaleString()} P
  </BadgeContainer>
);

// CoinBadge 컴포넌트
const CoinBadge = ({ points }: { points: number }) => (
  <BadgeContainer>
    <BadgeIconWrapper>
      <BadgeIcon src="/img/coins.png" alt="코인" />
    </BadgeIconWrapper>
    {points.toLocaleString()} Coin
  </BadgeContainer>
);

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

const CurrentStatus = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  width: 100%;
`;

// Badge 스타일
const BadgeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  background-color: #50b498;
  color: white;
  padding: 5px 14px 5px 5px;
  border-radius: 40px;
  font-size: 11px;
  font-weight: 500;
`;

const BadgeIconWrapper = styled.div`
  background-color: white;
  border-radius: 50%;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BadgeIcon = styled.img`
  width: 25px;
  height: 25px;
`;

const ExchangeBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 300px;
  margin-top: 20px;
  margin-bottom: 20px;
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ExchangeSection = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  padding: 10px 0;
  border-bottom: 1px solid #e0e0e0; /* Divider */
`;

const ChangeToIcon = styled.img`
  left: 50%;
  transform: translateX(-50%);
  width: 30px; /* 아이콘 크기 */
  height: 30px;
  z-index: 1;
`;

const IconLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 10px; /* Space between icon and text */
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

const Label = styled.label`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: left;
  color: #468585;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const Input = styled.input`
  width: 100px;
  text-align: center;
  border-radius: 7px;
  height: 45px;
  background-color: #efefef;
  border: none;
`;

const MaxExchangeable = styled.div`
  font-size: 8px;
  color: #666;
  margin-top: 10px;
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