import React, { useState } from 'react';
import * as S from '@/features/Intermediate_chart/ui/components/styles';
import { useStockStore } from '@/features/Intermediate_chart/model/stock';
import { ErrorModal } from '@/features/Intermediate_chart/ui/components/modals/ErrorModal';

interface TradeData {
    stockId: number;
    tradePoint?: number;
    type: 'buy' | 'sell';
    stockName: string;
  }
  
  export const TradeComponent: React.FC = () => {
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const executeTrade = useStockStore(state => state.executeTrade);
    const currentStockPrices = useStockStore(state => state.currentStockPrices);
  
    const handleTrade = async (tradeData: TradeData) => {
      try {
        const currentPrice = currentStockPrices[0]?.avgPrice || 0;
        const quantity = tradeData.tradePoint ? Math.floor(tradeData.tradePoint / currentPrice) : 0;
  
        const result = await executeTrade(
          tradeData.stockId,
          tradeData.tradePoint || 0,
          tradeData.type,
          tradeData.stockName,
          quantity
        );
  
        // 매도 시 획득 포인트 처리
        if (tradeData.type === 'sell' && 'earnedPoints' in result) {
          console.log(`Earned points: ${result.earnedPoints}`);
        }
  
      } catch (error: any) {
        let message = '거래 중 오류가 발생했습니다.';
  
        if (error.message.includes('이미 매수를 했습니다')) {
          message = '오늘은 이미 매수를 진행하셨습니다. 내일 다시 시도해주세요.';
        } else if (error.message.includes('매도할 주식을 찾을 수 없습니다')) {
          message = '매도할 주식이 없습니다.';
        } else if (error.message.includes('포인트가 부족합니다')) {
          message = '보유 포인트가 부족합니다.';
        }
  
        console.error('Trade error:', error);
        setErrorMessage(message);
        setShowErrorModal(true);
      }
    };
  
    const handleModalClose = () => {
      setShowErrorModal(false);
      setErrorMessage('');
    };
  
    return (
      <div>
        <S.ButtonGroup>
          <S.BuyButton
            onClick={() => handleTrade({
              stockId: 1,
              tradePoint: 1000,
              type: 'buy',
              stockName: '삼성전자'
            })}
          >
            매수
          </S.BuyButton>
          <S.SellButton
            onClick={() => handleTrade({
              stockId: 1,
              type: 'sell',
              stockName: '삼성전자'
            })}
          >
            매도
          </S.SellButton>
        </S.ButtonGroup>
        <ErrorModal
          isOpen={showErrorModal}
          message={errorMessage}
          onClose={handleModalClose}
        />
      </div>
    );
  };