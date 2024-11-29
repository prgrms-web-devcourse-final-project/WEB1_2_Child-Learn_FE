// features/Advanced_game/ui/TradeModal/index.tsx
import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import {
  ModalOverlay,
  ModalContainer,
  ModalTitle,
  ModalContent,
  PriceListContainer,
  StockInfoSection,
  StockLabel,
  StockPrice,
  PriceArrow,
  QuantitySection,
  PointsLabel,
  QuantityControl,
  QuantityButton,
  QuantityInput,
  TradeButtonGroup,
  BuyButton,
  SellButton,
  CloseButton
} from './styled';

interface StockPrice {
  price: number;
  timestamp: string;
}

interface TradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  stockName: string;
  currentPrice: number;
  priceHistory: StockPrice[];
}

export const TradeModal: React.FC<TradeModalProps> = ({
  isOpen,
  onClose,
  stockName,
  currentPrice,
  priceHistory
}) => {
  const [quantity, setQuantity] = useState(1);

  // 호가창 데이터 생성 (실제로는 API에서 받아와야 함)
  const generateOrderBookData = () => {
    const basePrice = currentPrice;
    const orderBook = [];
    
    // 매도 호가 7개
    for (let i = 7; i >= 0; i--) {
      orderBook.push({
        price: basePrice + (i + 1) * 10,
        change: (Math.random() * 0.8).toFixed(2),
        volume: Math.floor(Math.random() * 100000)
      });
    }
    
    return orderBook;
  };

  const orderBookData = generateOrderBookData();

  const chartOptions: ApexOptions = {
    chart: {
      type: 'bar',
      height: 250,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '80%',
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: orderBookData.map(d => d.price.toLocaleString()),
      labels: {
        formatter: function (val) {
          return val.toString();
        }
      }
    },
    yaxis: {
      labels: {
        show: false
      }
    },
    colors: orderBookData.map(d => Number(d.change) >= 0 ? '#d75442' : '#1B63AB'),
  };

  const series = [{
    name: '거래량',
    data: orderBookData.map(d => d.volume)
  }];

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalTitle>거래하기</ModalTitle>
        <ModalContent>
          <PriceListContainer>
            <ReactApexChart
              options={chartOptions}
              series={series}
              type="bar"
              height={350}
            />
          </PriceListContainer>

          <StockInfoSection>
            <StockLabel>구매할 주식</StockLabel>
            <StockPrice>{stockName}</StockPrice>
            <PriceArrow>↓</PriceArrow>
            <StockPrice>{currentPrice.toLocaleString()}</StockPrice>
          </StockInfoSection>

          <QuantitySection>
            <PointsLabel>포인트</PointsLabel>
            <QuantityControl>
              <label>개수</label>
              <QuantityButton onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                <img src="/img/minus.png" alt="감소" />
              </QuantityButton>
              <QuantityInput value={quantity} readOnly />
              <QuantityButton onClick={() => setQuantity(quantity + 1)}>
                <img src="/img/plus.png" alt="증가" />
              </QuantityButton>
            </QuantityControl>
          </QuantitySection>

          <TradeButtonGroup>
            <BuyButton>매수하기</BuyButton>
            <SellButton>매도하기</SellButton>
          </TradeButtonGroup>

          <CloseButton onClick={onClose}>나가기</CloseButton>
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
};