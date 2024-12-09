// pages/TradePages/AdvancedTradePage/AdvancedTradePage.tsx
import { useNavigate } from 'react-router-dom';// 경로 수정
import { PointBadge } from '@/shared/ui/PointBadge/PointBadge';
import { PageContainer, HeaderWrapper, OutButton } from './AdvancedTradeStyled';
import { StockSlider } from '@/pages/TradePages/AdvancedTradePage/StockSlider';
const AdvancedTradePage = () => {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <HeaderWrapper>
        <OutButton onClick={() => navigate('/main')}>
          <img src="/img/out.png" alt="나가기" />
        </OutButton>
        <PointBadge/>
      </HeaderWrapper>
      <StockSlider />
    </PageContainer>
  );
};

export default AdvancedTradePage;