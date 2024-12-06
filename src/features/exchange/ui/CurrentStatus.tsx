import styled from 'styled-components';

interface Props {
  points: number | undefined;
  coins: number | undefined;
}

const CurrentStatus = ({ points = 0, coins = 0}: Props) => (
  <StatusContainer>
    <PointBadge>
      <BadgeIconWrapper>
        <BadgeIcon src="/img/coins.png" alt="포인트" />
      </BadgeIconWrapper>
      {points.toLocaleString()} P
    </PointBadge>
    <CoinBadge>
      <BadgeIconWrapper>
        <BadgeIcon src="/img/coins.png" alt="코인" />
      </BadgeIconWrapper>
      {coins.toLocaleString()} Coin
    </CoinBadge>
  </StatusContainer>
);

export default CurrentStatus;

const StatusContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  width: 100%;
`;

const PointBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  background-color: #50b498;
  color: white;
  padding: 5px 14px 5px 5px;
  border-radius: 40px;
  font-size: 11px;
  font-weight: 500;
`;

const CoinBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  background-color: #50b498;
  color: white;
  padding: 5px 14px 5px 5px;
  border-radius: 40px;
  font-size: 11px;
  font-weight: 500;
`;

const BadgeIconWrapper = styled.div`
  background-color: white;
  border-radius: 50%;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BadgeIcon = styled.img`
  width: 25px;
  height: 25px;
`;
