import { useState, useCallback } from 'react';
import type { TradeType } from '@/features/stockTrading/model/types';
import type { Stock } from '@/entities/stock/model/stock';

export const useStockSlider = (stocks: Stock[]) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tradeType, setTradeType] = useState<TradeType | null>(null);

  const currentStock = stocks[currentIndex];

  const handleStockClick = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleTradeClick = useCallback((type: TradeType) => {
    setTradeType(type);
  }, []);

  const handleCloseModal = useCallback(() => {
    setTradeType(null);
  }, []);

  const handleTradeConfirm = useCallback((quantity: number, points: number) => {
    console.log('Trade confirmed:', { stock: currentStock.name, quantity, points });
    handleCloseModal();
  }, [currentStock, handleCloseModal]);

  return {
    currentStock,
    isModalOpen,
    tradeType,
    handleStockClick,
    handleTradeClick,
    handleTradeConfirm,
    handleCloseModal
  };
};