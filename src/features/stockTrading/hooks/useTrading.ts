import { useState, useCallback } from 'react';
import { TRADE_POINT_UNIT, MIN_QUANTITY } from '../../../shared/config/index';

export const useTrading = (basePrice: number) => {
  const [quantity, setQuantity] = useState(MIN_QUANTITY);
  const [points, setPoints] = useState(basePrice);

  const handleQuantityChange = useCallback((delta: number) => {
    const newQuantity = Math.max(MIN_QUANTITY, quantity + delta);
    setQuantity(newQuantity);
    setPoints(basePrice * newQuantity);
  }, [quantity, basePrice]);

  return {
    quantity,
    points,
    handleQuantityChange
  };
};