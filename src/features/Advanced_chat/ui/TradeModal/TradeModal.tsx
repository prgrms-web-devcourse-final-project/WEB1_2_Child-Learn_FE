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
  const generateOrderBookData = (currentPrice: number) => {
    const orderBook = [];
    
    // 매도 호가 7개 (현재가 기준 위로)
    for (let i = 7; i >= 1; i--) {
      const price = Math.round(currentPrice * (1 + (i * 0.001))); // 0.1% 간격
      orderBook.push({
        price: price,
        change: ((price - currentPrice) / currentPrice * 100).toFixed(2),
        volume: Math.floor(Math.random() * 1000)
      });
    }
    
    // 현재가
    orderBook.push({
      price: currentPrice,
      change: "0.00",
      volume: Math.floor(Math.random() * 2000)
    });
    
    // 매수 호가 7개 (현재가 기준 아래로)
    for (let i = 1; i <= 7; i++) {
      const price = Math.round(currentPrice * (1 - (i * 0.001))); // 0.1% 간격
      orderBook.push({
        price: price,
        change: ((price - currentPrice) / currentPrice * 100).toFixed(2),
        volume: Math.floor(Math.random() * 1000)
      });
    }
    
    return orderBook;
  };

  const orderBookData = generateOrderBookData(currentPrice);

  const chartOptions: ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
      animations: {
        enabled: false
      },
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '80%',
        distributed: true
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function(val, opt) {
        const price = orderBookData[opt.dataPointIndex].price;
        return `${price.toLocaleString()}원`;
      },
      style: {
        fontSize: '12px'
      }
    },
    xaxis: {
      categories: orderBookData.map(d => d.price.toLocaleString()),
      labels: {
        show: false
      }
    },
    yaxis: {
      labels: {
        show: false
      }
    },
    colors: orderBookData.map((d, i) => {
      if (i < 7) return '#ff0000';  // 매도 호가
      if (i === 7) return '#000000';  // 현재가
      return '#0000ff';  // 매수 호가
    }),
    tooltip: {
      enabled: true,
      custom: function({ seriesIndex, dataPointIndex, w }) {
        const data = orderBookData[dataPointIndex];
        return `
          <div class="custom-tooltip">
            <div>가격: ${data.price.toLocaleString()}원</div>
            <div>변동: ${data.change}%</div>
            <div>거래량: ${data.volume.toLocaleString()}</div>
          </div>
        `;
      }
    }
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