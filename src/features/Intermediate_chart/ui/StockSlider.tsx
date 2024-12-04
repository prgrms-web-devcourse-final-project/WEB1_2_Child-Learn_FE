import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { stockApi } from '@/shared/api/stock';
import ArticleComponent from '@/features/article/article';
import { TrendPrediction, Relevance } from '@/features/article/type/article';
import { MidStock, StockPrice, TradeAvailability } from '@/features/Intermediate_chart/model/types/stock';
import StockChart from '@/shared/ui/Intermediate/StockChat';
import { PointBadge } from '@/shared/ui/PointBadge/PointBadge';
import { useNavigate } from 'react-router-dom';

interface TradeResult {
  success: boolean;
  message: string;
  tradeType: 'buy' | 'sell';
  stockName: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

interface StockSliderProps {
  stocks: MidStock[];
}

const StyledPointBadge = styled(PointBadge)`
  z-index: 10;
`;

const StockSlider: React.FC<StockSliderProps> = ({ stocks }) => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showActions, setShowActions] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [stockList, setStockList] = useState<MidStock[]>([]);
  const [priceData, setPriceData] = useState<StockPrice[]>([]);
  const [tradeAvailability, setTradeAvailability] = useState<TradeAvailability>({
    isPossibleBuy: false,
    isPossibleSell: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tradeResult, setTradeResult] = useState<TradeResult | null>(null);
  const [hasTradedToday, setHasTradedToday] = useState(false);
  const [showTradeCompletionModal, setShowTradeCompletionModal] = useState(false);

  const currentStock = useMemo(() => stockList[currentSlide], [stockList, currentSlide]);

  useEffect(() => {
    if (Array.isArray(stocks) && stocks.length > 0) {
      setStockList(stocks);
      setIsLoading(false);
    }
  }, [stocks]);

  const loadPriceData = async (stock: MidStock) => {
    if (!stock?.midStockId) return;
    try {
      const data = await stockApi.getStockPrices(stock.midStockId);
      if (Array.isArray(data) && data.length > 0) {
        setPriceData(data);
        setPrice(data[0].avgPrice.toString());
        setTotalPrice(data[0].avgPrice * quantity);
        const availability = await stockApi.checkTradeAvailability(stock.midStockId);
        setTradeAvailability(availability);
      }
    } catch (err) {
      setError('Failed to load price data');
    }
  };

  useEffect(() => {
    if (currentStock) {
      loadPriceData(currentStock);
    }
  }, [currentStock]);

  const handleNextSlide = () => {
    const nextSlide = (currentSlide + 1) % stockList.length;
    setCurrentSlide(nextSlide);
    setShowActions(false);
    setPriceData([]);
    loadPriceData(stockList[nextSlide]);
  };

  const handlePrevSlide = () => {
    const prevSlide = (currentSlide - 1 + stockList.length) % stockList.length;
    setCurrentSlide(prevSlide);
    setShowActions(false);
    setPriceData([]);
    loadPriceData(stockList[prevSlide]);
  };

  const handleTradeClick = async (type: 'buy' | 'sell') => {
    if (hasTradedToday) {
      setTradeType(type);
      setShowLimitModal(true);
      return;
    }
    setTradeType(type);
    if (type === 'buy') {
      setShowBuyModal(true);
      setQuantity(1);
      if (priceData.length > 0) {
        setPrice(priceData[0].avgPrice.toString());
        setTotalPrice(priceData[0].avgPrice);
      }
    } else {
      setShowSellModal(true);
    }
  };

  const handleBuyTrade = async () => {
    if (!currentStock || !price) return;
    
    try {
      const tradePoint = parseInt(price.replace(/,/g, '')) * quantity;
      
      const result = await stockApi.buyStock(currentStock.midStockId, tradePoint);

      setTradeResult({
        success: result.success,
        message: result.success ? '매수 완료' : '매수 실패',
        tradeType: 'buy',
        stockName: currentStock.midName,
        price: parseInt(price.replace(/,/g, '')),
        quantity: quantity,
        totalPrice: tradePoint
      });

      if (result.success) {
        setShowBuyModal(false);
        setShowResultModal(true);
        setHasTradedToday(true);
      }
      
    } catch (err) {
      console.error('Trade error:', err);
      setTradeResult({
        success: false,
        message: '거래 처리 중 오류가 발생했습니다.',
        tradeType: 'buy',
        stockName: currentStock.midName,
        price: parseInt(price.replace(/,/g, '')),
        quantity: quantity,
        totalPrice: 0
      });
      setShowResultModal(true);
    }
  };

  const handleSellConfirm = async () => {
    if (!currentStock || !priceData.length) return;
    
    try {
      const currentPrice = priceData[0].avgPrice;
      const result = await stockApi.sellStock(currentStock.midStockId, currentPrice);

      setTradeResult({
        success: result.success,
        message: result.success ? '매도 완료' : '매도 실패',
        tradeType: 'sell',
        stockName: currentStock.midName,
        price: currentPrice,
        quantity: 1,
        totalPrice: currentPrice
      });

      if (result.success) {
        setShowSellModal(false);
        setShowResultModal(true);
        setHasTradedToday(true);
      }
      
    } catch (err) {
      console.error('Trade error:', err);
      setShowSellModal(false);
    }
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, quantity + delta);
    setQuantity(newQuantity);
    const numPrice = price === '' ? 0 : parseInt(price.replace(/,/g, ''));
    setTotalPrice(numPrice * newQuantity);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value === '') {
      setPrice('');
      setTotalPrice(0);
      return;
    }
    const numValue = parseInt(value);
    setPrice(numValue.toLocaleString());
    setTotalPrice(numValue * quantity);
  };

  const handleOutButtonClick = () => {
    if (showActions) {
      setShowActions(false);
    } else {
      navigate('/main');
    }
  };

  if (isLoading || !stockList.length) {
    return <div>Loading stocks...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!currentStock) {
    return null;
  }

  return (
    <SlideContainer>
      <HeaderWrapper>
        <OutButton onClick={handleOutButtonClick}>
          <img src="/img/out.png" alt="나가기" />
        </OutButton>
        <StyledPointBadge points={2000} />
      </HeaderWrapper>

      <PrevButton onClick={handlePrevSlide} disabled={currentSlide === 0} $show={!showActions}>
        <img src="/img/arrow2.png" alt="이전" />
      </PrevButton>

      <ChartContainer onClick={() => setShowActions(true)}>
        {currentStock && priceData.length > 0 && (
          <StockChart 
            stockId={currentStock.midStockId}
            title={`${currentStock.midName} 주가 차트`}
            data={priceData}
          />
        )}
      </ChartContainer>

      {showActions && (
        <>
          <ActionButtons>
            <BuyButton 
              onClick={() => handleTradeClick('buy')} 
              disabled={!tradeAvailability.isPossibleBuy}
            >
              매수
            </BuyButton>
            <SellButton 
              onClick={() => handleTradeClick('sell')}
              disabled={!tradeAvailability.isPossibleSell}
            >
              매도
            </SellButton>
          </ActionButtons>
          
          <ArticleContainer>
            <ArticleComponent article={{
              id: currentSlide + 1,
              article_id: 1001,
              stock_symbol: currentStock.midName,
              trend_prediction: TrendPrediction.UP,
              content: `${currentStock.midName} 분석...`,
              relevance: Relevance.HIGH,
              created_at: new Date().toISOString(),
              duration: 60,
              mid_stock_id: currentStock.midStockId,
              adv_id: 1
            }} />
          </ArticleContainer>
        </>
      )}

      {showBuyModal && (
        <>
          <ModalOverlay onClick={() => setShowBuyModal(false)} />
          <ModalContainer>
            <ModalTitle>매수하기</ModalTitle>
            <ModalContent>
              <FormGroup>
                <Label>{currentStock.midName}</Label>
                <Input
                  type="text"
                  value={price}
                  onChange={handlePriceChange}
                  placeholder="매수가를 입력하세요"
                />
              </FormGroup>

              <FormGroup>
                <Label>수량</Label>
                <QuantityControl>
                  <QuantityButton
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <img src="/img/minus.png" alt="감소" />
                  </QuantityButton>
                  <QuantityInput
                    type="text"
                    value={quantity}
                    disabled
                  />
                  <QuantityButton onClick={() => handleQuantityChange(1)}>
                    <img src="/img/plus.png" alt="증가" />
                  </QuantityButton>
                </QuantityControl>
              </FormGroup>

              <FormGroup>
                <Label>총 포인트</Label>
                <Input
                  type="text"
                  value={totalPrice.toLocaleString()}
                  disabled
                />
              </FormGroup>

              <ButtonGroup>
                <ConfirmButton 
                  onClick={handleBuyTrade}
                  disabled={!price || price === '0'}
                  type="buy"
                >
                  매수하기
                </ConfirmButton>
                <CancelButton onClick={() => setShowBuyModal(false)}>
                  나가기
                </CancelButton>
              </ButtonGroup>
            </ModalContent>
          </ModalContainer>
        </>
      )}

      {showSellModal && (
        <>
          <ModalOverlay onClick={() => setShowSellModal(false)} />
          <ModalContainer>
            <ModalTitle>매도 확인</ModalTitle>
            <SellModalContent>
              <SellMessage>
                {currentStock.midName}을(를) 매도하시겠습니까?
              </SellMessage>
              <ButtonGroup>
                <ConfirmButton 
                  onClick={handleSellConfirm}
                  type="sell"
                >
                  매도하기
                </ConfirmButton>
                <CancelButton onClick={() => setShowSellModal(false)}>
                  취소
                </CancelButton>
              </ButtonGroup>
            </SellModalContent>
          </ModalContainer>
        </>
      )}

      {showResultModal && tradeResult && (
        <>
          <ModalOverlay />
          <ModalContainer>
            <ModalTitle>
              주식 {tradeResult.tradeType === 'buy' ? '매수' : '매도'}주문
            </ModalTitle>
            <ResultModalContent>
              <ResultRow>
                <ResultLabel>종목명</ResultLabel>
                <ResultValue>{tradeResult.stockName}</ResultValue>
              </ResultRow>
              <ResultRow>
                <ResultLabel>{tradeResult.tradeType === 'buy' ? '매수가격' : '매도가격'}</ResultLabel>
                <ResultValue>{tradeResult.price.toLocaleString()}</ResultValue>
              </ResultRow>
              <ResultRow>
                <ResultLabel>주문수량</ResultLabel>
                <ResultValue>{tradeResult.quantity}</ResultValue>
              </ResultRow>
              <ResultRow>
                <ResultLabel>포인트가격</ResultLabel>
                <ResultValue>{tradeResult.totalPrice.toLocaleString()}</ResultValue>
              </ResultRow>
              <ResultButtonGroup>
                <SingleButton 
                  color="#50b498" 
                  onClick={() => {
                    setShowResultModal(false);
                    setShowTradeCompletionModal(true);
                  }}
                >
                  확인
                </SingleButton>
              </ResultButtonGroup>
            </ResultModalContent>
          </ModalContainer>
        </>
      )}

      {showTradeCompletionModal && tradeResult && (
        <>
          <ModalOverlay />
          <ModalContainer>
            <ModalTitle>
              {tradeResult.tradeType === 'buy' ? '매수' : '매도'}가 완료되었습니다
            </ModalTitle>
            <CompletionModalContent>
              <CompletionMessage>
                {`${tradeResult.stockName} ${tradeResult.quantity}주를 
               ${tradeResult.totalPrice.toLocaleString()}포인트에 ${tradeResult.tradeType === 'buy' ? '매수' : '매도'}하였습니다.`}
               </CompletionMessage>
               <CompletionButtonGroup>
                 <CompletionButton 
                   onClick={() => setShowTradeCompletionModal(false)}
                   color="#1B63AB"
                 >
                   확인
                 </CompletionButton>
               </CompletionButtonGroup>
             </CompletionModalContent>
           </ModalContainer>
         </>
       )}
 
       {showLimitModal && (
         <>
           <ModalOverlay />
           <ModalContainer>
             <ModalTitle>거래 제한</ModalTitle>
             <LimitModalContent>
               <LimitText>
                 오늘은 더 이상 {tradeType === 'buy' ? '매수' : '매도'}를 할 수 없습니다.
               </LimitText>
               <ResultButtonGroup>
                 <SingleButton color="#50b498" onClick={() => setShowLimitModal(false)}>
                   확인
                 </SingleButton>
               </ResultButtonGroup>
             </LimitModalContent>
           </ModalContainer>
         </>
       )}
 
       <NextButton onClick={handleNextSlide} disabled={currentSlide === stockList.length - 1} $show={!showActions}>
         <img src="/img/arrow2.png" alt="다음" />
       </NextButton>
 
       <SlideIndicators $show={!showActions}>
         {stockList.map((stock, index) => (
           <Indicator
             key={stock.midStockId}
             $active={index === currentSlide}
             onClick={() => {
               setCurrentSlide(index);
               setShowActions(false);
             }}
           />
         ))}
       </SlideIndicators>
     </SlideContainer>
   );
 };
 
 // Styled Components
 const SlideContainer = styled.div`
   width: 100%;
   max-width: 1200px;
   margin: 0 auto;
   position: relative;
   background: #f0fff0;
   padding: 20px;
   border-radius: 20px;
 `;
 
 const NavigationButton = styled.button<{ $show?: boolean }>`
   position: absolute;
   top: 50%;
   transform: translateY(-50%);
   background: rgba(255, 255, 255, 0.8);
   border: none;
   border-radius: 50%;
   width: 40px;
   height: 40px;
   display: flex;
   align-items: center;
   justify-content: center;
   cursor: pointer;
   z-index: 2;
   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
   display: ${props => props.$show ? 'flex' : 'none'};
 
   img {
     width: 24px;
     height: 24px;
   }
 
   &:hover {
     background: rgba(255, 255, 255, 1);
   }
 
   &:disabled {
     opacity: 0.5;
     cursor: not-allowed;
   }
 `;
 
 const PrevButton = styled(NavigationButton)`
   left: 1px;
   img {
     transform: rotate(180deg);  
   }
 `;
 
 const NextButton = styled(NavigationButton)`
   right: 1px;
 `;
 
 const ChartContainer = styled.div`
   width: 100%;
   cursor: pointer;
 `;
 
 const ActionButtons = styled.div`
   display: flex;
   justify-content: center;
   gap: 106px;
   margin-top: 16px;
 `;
 
 const Button = styled.button`
   height: 40px;
   border: none;
   border-radius: 6px;
   font-size: 14px;
   font-weight: 500;
   cursor: pointer;
   transition: all 0.2s ease;
   padding: 0 24px;
 `;
 
 const BuyButton = styled(Button)`
   background: #1B63AB;
   color: white;
   &:hover {
     background: #145293;
   }
 `;
 
 const SellButton = styled(Button)`
   background: #D75442;
   color: white;
   &:hover {
     background: #C04937;
   }
 `;
 
 const ArticleContainer = styled.div`
   margin-top: 20px;
 `;
 
 const ModalOverlay = styled.div`
   position: fixed;
   top: 0;
   left: 0;
   right: 0;
   bottom: 0;
   background: rgba(0, 0, 0, 0.3);
   z-index: 100;
 `;
 
 const ModalContainer = styled.div`
   position: fixed;
   top: 50%;
   left: 50%;
   transform: translate(-50%, -50%);
   background: white;
   width: 100%;
   max-width: 340px;
   border-radius: 12px;
   z-index: 101;
 `;
 
 const ModalTitle = styled.div`
   text-align: center;
   padding: 16px;
   font-size: 18px;
   font-weight: 600;
   border-bottom: 1px solid #eee;
 `;
 
 const ModalContent = styled.div`
   padding: 20px;
 `;
 
 const SellModalContent = styled(ModalContent)`
   text-align: center;
   padding: 24px 20px;
 `;
 
 const SellMessage = styled.p`
   margin: 0 0 24px;
   color: #333;
   font-size: 16px;
   line-height: 1.5;
 `;
 
 const FormGroup = styled.div`
   margin-bottom: 15px;
   &:last-of-type {
     margin-bottom: 24px;
   }
 `;
 
 const Label = styled.div`
   font-size: 13px;
   color: #333;
   margin-bottom: 4px;
 `;
 
 const Input = styled.input`
   width: 70%;
   height: 35px;
   padding: 0 12px;
   border: 1px solid #eaeaea;
   border-radius: 6px;
   font-size: 14px;
   color: #333;
   background: white;
 
   &:disabled {
     background: white;
     color: #333;
   }
 `;
 
 const QuantityControl = styled.div`
   display: flex;
   align-items: center;
   gap: 2px;
 `;
 
 const QuantityButton = styled.button`
   display: flex;
   align-items: center;
   justify-content: center;
   width: 25px;
   height: 35px;
   border: 1px solid #eaeaea;
   border-radius: 5px;
   background: white;
   color: #666;
   cursor: pointer;
 
   img {
     width: 12px;
     height: 12px;
   }
 
   &:hover {
     background: #f5f5f5;
   }
 
   &:disabled {
     opacity: 0.5;
     cursor: not-allowed;
   }
 `;
 
 const QuantityInput = styled(Input)`
   width: 43px;
   text-align: center;
   padding: 0;
 `;
 
 const ButtonGroup = styled.div`
   display: grid;
   grid-template-columns: 1fr 1fr;
   gap: 12px;
   margin-top: 0;
 `;
 
 const ResultModalContent = styled(ModalContent)`
   padding: 0;
 `;
 
 const ResultRow = styled.div`
   display: flex;
   justify-content: space-between;
   padding: 12px 20px;
   border-bottom: 1px solid #eee;
   
   &:last-child {
     border-bottom: none;
   }
 `;
 
 const ResultLabel = styled.span`
   color: #666;
   font-size: 14px;
 `;
 
 const ResultValue = styled.span`
   color: #333;
   font-size: 14px;
   font-weight: 500;
 `;
 
 const ResultButtonGroup = styled.div`
   display: grid;
   grid-template-columns: 1fr;
   margin: 0;
   border-top: 1px solid #eee;
 `;
 
 const LimitModalContent = styled(ModalContent)`
   text-align: center;
   padding: 24px 20px;
 `;
 
 const LimitText = styled.p`
   margin: 0 0 24px;
   color: #333;
   font-size: 14px;
 `;
 
 const SingleButton = styled(Button)<{ color: string }>`
   width: 100%;
   background: ${props => props.color};
   color: white;
   &:hover {
     opacity: 0.9;
   }
 `;
 
 const ConfirmButton = styled(Button)<{ type: 'buy' | 'sell' }>`
   background: ${props => props.type === 'buy' ? '#1B63AB' : '#1B63AB'};
   color: white;
   &:hover {
     background: ${props => props.type === 'buy' ? '#1B63AB' : '#1B63AB'};
   }
 `;
 
 const CancelButton = styled(Button)`
   background: #D75442;
   color: white;
   &:hover {
     background: #C04937;
   }
 `;
 
 const CompletionModalContent = styled(ModalContent)`
   text-align: center;
   padding: 24px 20px;
 `;
 
 const CompletionMessage = styled.p`
   margin: 0 0 24px;
   color: #333;
   font-size: 16px;
   line-height: 1.5;
   white-space: pre-line;
 `;
 
 const CompletionButtonGroup = styled(ResultButtonGroup)`
   margin-top: 24px;
 `;
 
 const CompletionButton = styled(SingleButton)`
   border-radius: 6px;
   
   &:hover {
     background: #50B498;
   }
 `;
 
 const SlideIndicators = styled.div<{ $show?: boolean }>`
   display: flex;
   justify-content: center;
   gap: 8px;
   margin-top: 16px;
   visibility: ${props => props.$show ? 'visible' : 'hidden'};
 `;
 
 const Indicator = styled.div<{ $active: boolean }>`
   width: 8px;
   height: 8px;
   border-radius: 50%;
   background-color: ${props => props.$active ? '#50B498' : '#ddd'};
   cursor: pointer;
   transition: background-color 0.3s ease;
 
   &:hover {
     background-color: ${props => props.$active ? '#50B498' : '#bbb'};
   }
 `;
 
 const HeaderWrapper = styled.div`
   display: flex;
   justify-content: space-between;
   align-items: center;
   margin-bottom: 10px;
 `;
 
 const OutButton = styled.button`
   background: none;
   border: none;
   cursor: pointer;
   padding: 0;
   z-index: 10;
   
   img {
     width: 22px;
     height: 22px;
   }
 `;
 
 export default StockSlider;