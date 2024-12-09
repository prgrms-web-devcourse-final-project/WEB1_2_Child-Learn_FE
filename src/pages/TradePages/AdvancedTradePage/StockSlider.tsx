interface AdvancedArticlePageProps {
  stockId: string;
  stockName: string;
}

interface AdvancedGameStockSliderProps {
  stockId: number;
  stockName: string;
}

const LocalAdvancedGameStockSlider: React.FC<AdvancedGameStockSliderProps> = ({ stockId, stockName }) => {
  return (
    <div>
      {/* 컴포넌트 로직 */}
      <p>Stock ID: {stockId}</p>
      <p>Stock Name: {stockName}</p>
    </div>
  );
};

export const StockSlider = ({ stockId, stockName }: AdvancedArticlePageProps) => {
  return <LocalAdvancedGameStockSlider stockId={Number(stockId)} stockName={stockName} />;
};