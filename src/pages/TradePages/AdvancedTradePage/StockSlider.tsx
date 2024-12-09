import { AdvancedArticlePage} from '@/pages/article/AdvancedArticlePage';

interface AdvancedArticlePageProps {
  stockId: number;  // string에서 number로 변경
  stockName: string;
}

export const StockSlider: React.FC<AdvancedArticlePageProps> = ({ stockId, stockName }) => {
  return <AdvancedArticlePage stockId={stockId} stockName={stockName} />;
};