import React from 'react';
import styled from 'styled-components';

interface ExchangeBoxProps {
  exchangePoints: string;
  setExchangePoints: React.Dispatch<React.SetStateAction<string>>;
  exchangeCoins: string;
  setExchangeCoins: React.Dispatch<React.SetStateAction<string>>;
  maxExchangeableCoins: number;
  EXCHANGE_RATE: number;
}

const ExchangeBox = ({
  exchangePoints,
  setExchangePoints,
  exchangeCoins,
  setExchangeCoins,
  maxExchangeableCoins,
  EXCHANGE_RATE,
}: ExchangeBoxProps) => {
  return (
    <BoxContainer>
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
    </BoxContainer>
  );
};

export default ExchangeBox;

const BoxContainer = styled.div`
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

const SectionLabel = styled.div`
  font-size: 15px;
  font-weight: normal;
  text-align: left;
  color: #989898;
  margin-bottom: 10px;
`;

const ExchangeSection = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  padding: 10px 0;
  border-bottom: 1px solid #e0e0e0;
`;

const ChangeToIcon = styled.img`
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 30px;
  z-index: 1;
`;

const IconLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Icon = styled.img`
  width: 40px;
  height: 40px;
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
