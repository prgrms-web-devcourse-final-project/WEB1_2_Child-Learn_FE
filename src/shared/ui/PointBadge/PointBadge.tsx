import styled from 'styled-components';
import { useUserInfo } from '@/entities/User/lib/queries';

interface PointBadgeProps {
  className?: string;
}

export const PointBadge: React.FC<PointBadgeProps> = ({ className }) => {
  const { data: userInfo } = useUserInfo();

  const formatPoints = (points: number = 0) => {
    if (points >= 10000) {
      return `${(points / 10000).toFixed(1)}만 P`;
    }
    return `${points.toLocaleString()} P`;
  };

  return (
    <Container className={className}>
      <PointIconWrapper>
        <PointIcon src="/img/coins.png" alt="포인트" />
      </PointIconWrapper>
      {formatPoints(userInfo?.currentPoints)}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  background-color: #50b498;
  color: white;
  padding: 5px 14px 5px 5px; // top right bottom left 순서로 padding 지정
  border-radius: 40px;
  font-size: 14px;
  font-weight: 500;
`;

const PointIconWrapper = styled.div`
  background-color: white; // 흰색 원
  border-radius: 50%; // 원형으로 만들기
  width: 35px; // 아이콘보다 약간 크게
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PointIcon = styled.img`
  width: 25px;
  height: 25px;
`;
