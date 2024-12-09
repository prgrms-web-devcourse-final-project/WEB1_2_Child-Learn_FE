// pages/TradePages/AdvancedTradePage/StockSlider.tsx
import AdvancedGameStockSlider from '@/features/Advanced_chat/ui/StockSlider/stockSlider';

interface AdvancedArticlePageProps {
  stockId: string;
  stockName: string;
}

export const StockSlider = ({ stockId, stockName }: AdvancedArticlePageProps) => {
  return <AdvancedGameStockSlider stockId={Number(stockId)} stockName={stockName} />;
};