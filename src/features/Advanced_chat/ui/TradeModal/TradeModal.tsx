// features/Advanced_game/ui/TradeModal/index.tsx
import React, { useState, useEffect } from 'react';
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
  TradeButtonGroup,
  BuyButton,
  SellButton,
  CloseButton
} from './styled';
import styled from 'styled-components';

interface StockPrice {
  price: number;
  timestamp: string;
}

interface OrderBookItem {
  price: number;
  change: string;
  volume: number;
}

interface TradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  stockName: string;
  currentPrice: number;
  priceHistory: StockPrice[];
  isPlaying: boolean;
}

const TRADE_TIME_LIMIT = 7 * 60; // 7분을 초로 변환

export const TradeModal: React.FC<TradeModalProps> = ({
  isOpen,
  onClose,
  stockName,
  currentPrice,
  priceHistory,
  isPlaying
}) => {
  const [quantity, setQuantity] = useState(1);
  const [showNotice, setShowNotice] = useState(false);
  const [remainingTime, setRemainingTime] = useState(10);
  const [isRunning, setIsRunning] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [showTradeButtons, setShowTradeButtons] = useState(true);
  const [noticeMessage, setNoticeMessage] = useState("");
  const [orderBookData, setOrderBookData] = useState<OrderBookItem[]>([]);

  useEffect(() => {
    if (remainingTime > TRADE_TIME_LIMIT) {
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
      setShowNotice(true); // 거래시간 종료 모달 표시
      setNoticeMessage("거래 시간이 종료되었습니다");
    }
  }, [remainingTime]);

  useEffect(() => {
    // 초기 데이터는 항상 설정
    setOrderBookData(generateOrderBookData(currentPrice));
    
    // 실시간 업데이트는 isPlaying이 true일 때만
    let updateInterval: NodeJS.Timeout | null = null;
    
    if (isPlaying) {
      updateInterval = setInterval(() => {
        setOrderBookData(generateOrderBookData(currentPrice));
      }, 3000);
    }

    return () => {
      if (updateInterval) {
        clearInterval(updateInterval);
      }
    };
  }, [currentPrice, isPlaying]);

  // 호가창 데이터 생성 (실제로는 API에서 받아와야 함)
  const generateOrderBookData = (currentPrice: number) => {
    const orderBook = [];
    
    // 매도 호가 7개 (현재가 기준 위로)
    for (let i = 7; i >= 1; i--) {
      const price = Math.floor(currentPrice * (1 + (i * 0.001)));
      orderBook.push({
        price: price,
        change: ((price - currentPrice) / currentPrice * 100).toFixed(2),
        volume: Math.floor(Math.random() * 1000)
      });
    }
    
    // 현재가
    orderBook.push({
      price: Math.floor(currentPrice),
      change: "0.00",
      volume: Math.floor(Math.random() * 2000)
    });
    
    // 매수 호가 7개 (현재가 기준 아래로)
    for (let i = 1; i <= 7; i++) {
      const price = Math.floor(currentPrice * (1 - (i * 0.001)));
      orderBook.push({
        price: price,
        change: ((price - currentPrice) / currentPrice * 100).toFixed(2),
        volume: Math.floor(Math.random() * 1000)
      });
    }
    
    return orderBook;
  };

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
        const data = orderBookData[opt.dataPointIndex];
        return `${data.price.toLocaleString()}원 (${data.volume})`;
      },
      style: {
        fontSize: '12px',
        colors: ['#000']
      },
      offsetX: 10
    },
    xaxis: {
      categories: orderBookData.map(d => d.price.toLocaleString()),
      labels: {
        show: true,
        style: {
          colors: orderBookData.map((d, i) => 
            i < 7 ? '#600a0a' : 
            i === 7 ? '#000000' : '#0000ff'
          )
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      labels: {
        show: false
      }
    },
    grid: {
      show: false
    },
    colors: orderBookData.map((d, i) => 
      i < 7 ? '#ff0000' :  // 매도 호가
      i === 7 ? '#000000' :  // 현재가
      '#0000ff'  // 매수 호가
    ),
    tooltip: {
      enabled: true,
      custom: function({ seriesIndex, dataPointIndex, }) {
        const data = orderBookData[dataPointIndex];
        return `
          <div class="custom-tooltip">
            <div>가격: ${data.price.toLocaleString()}원</div>
            <div>거래량: ${data.volume.toLocaleString()}</div>
            <div>${data.price > currentPrice ? '매도' : data.price < currentPrice ? '매수' : '현재가'}</div>
          </div>
        `;
      }
    }
  };

  const series = [{
    name: '거래량',
    data: orderBookData.map(d => d.volume)
  }];

  const handleBuy = () => {
    // 매수 로직 구현
  };

  const handleSell = () => {
    // 매도 로직 구현
  };

  const ChartContainer = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
  `;

  const TimeUpMessage = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(255, 255, 255, 0.9);
    padding: 15px 25px;
    border-radius: 8px;
    text-align: center;
    z-index: 10;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  `;

  const ConfirmButton = styled.button`
    background-color: #7FBA7A;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 8px 16px;
    margin-top: 10px;
    cursor: pointer;
    
    &:hover {
      background-color: #6ca968;
    }
  `;

  if (!isOpen) return null;

  return (
    <>
      <ModalOverlay>
        <ModalContainer>
          <ModalTitle>거래하기</ModalTitle>
          <ModalContent>
            <PriceListContainer>
              <ChartContainer>
                {orderBookData?.length > 0 && (
                  <ReactApexChart 
                    options={chartOptions} 
                    series={series} 
                    type="bar" 
                    height={350} 
                  />
                )}
                {(remainingTime > TRADE_TIME_LIMIT) && (
                  <TimeUpMessage>
                    <p>{noticeMessage}</p>
                    <ConfirmButton onClick={() => setShowTradeButtons(true)}>
                      확인
                    </ConfirmButton>
                  </TimeUpMessage>
                )}
              </ChartContainer>
            </PriceListContainer>

            <StockInfoSection>
              <StockLabel>구매할 주식</StockLabel>
              <StockPrice>{stockName}</StockPrice>
              <PriceArrow>↓</PriceArrow>
              <StockPrice>{Math.floor(currentPrice).toLocaleString()}</StockPrice>
            </StockInfoSection>

            <QuantitySection>
              <PointsLabel>포인트</PointsLabel>
              <QuantityControl>
                <label>개수</label>
                <QuantityButton onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  <img src="/img/minus.png" alt="감소" />
                </QuantityButton>
                <StyledQuantityInput value={quantity} readOnly />
                <QuantityButton onClick={() => setQuantity(quantity + 1)}>
                  <img src="/img/plus.png" alt="증가" />
                </QuantityButton>
              </QuantityControl>
            </QuantitySection>

            {showTradeButtons && (
              <TradeButtonGroup>
                <BuyButton onClick={handleBuy}>매수</BuyButton>
                <SellButton onClick={handleSell}>매도</SellButton>
              </TradeButtonGroup>
            )}

            <CloseButton onClick={onClose}>나가기</CloseButton>
          </ModalContent>
        </ModalContainer>
      </ModalOverlay>
    </>
  );
};

const StyledQuantityInput = styled.input`
  width: 40px;
  height: 30px;
  text-align: center;
  border: 1px solid #ddd;
  background-color: white;
  color: black;
  font-size: 14px;
  margin: 0 5px;
  border-radius: 4px;
`;