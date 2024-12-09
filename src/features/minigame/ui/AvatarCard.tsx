import styled from 'styled-components';

interface AvatarCardProps {
    onClick?: () => void;
  }

export const AvatarCard = ({ onClick }: AvatarCardProps) => {

  return (
    <CardContainer>
      <CardContent>
        <Title>
              <div className="main-text">획득한 포인트로</div>
              <div className="sub-text">나를 꾸며볼까요?</div>
        </Title>
          <ActionButton onClick={onClick}>내 캐릭터 꾸미러 가기</ActionButton>
      </CardContent>
      <IconImage src="/img/gift.png" alt="gift" />
    </CardContainer>
  );
};

const CardContainer = styled.div`
  background-color: #50b498;
  padding: 24px 20px;
  border-radius: 24px;
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  height: 130px; // min-height 대신 height로 고정
  box-sizing: border-box; // padding이 height에 포함되도록
`;

const CardContent = styled.div`
  width: 100%;
  height: 100%; // min-height 대신 height로 고정
  z-index: 1;
  display: flex;
  flex-direction: column;
  position: relative; // 자식 요소의 absolute 포지셔닝을 위해
`;

const Title = styled.div`
  color: white;
  transition: all 0.3s ease;
  text-align: left;

  .complete-text {
    font-size: 16px;
    font-weight: 800;
    line-height: 1.4;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  .main-text {
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 2px;
  }

  .sub-text {
    font-size: 18px;
    font-weight: 700;
  }
`;

const ActionButton = styled.button`
  background-color: white;
  color: #468585;
  border: none;
  padding: 6px; // 8px에서 축소
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  width: 100%;
  margin-top: 10px; // 40px에서 축소
  transition: opacity 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  &:hover {
    opacity: 0.9;
  }
`;

const IconImage = styled.img`
  position: absolute;
  top: 15px; // 32px에서 축소
  right: 20px; // 24px에서 축소
  width: 60px; // 48px에서 축소
  height: 60px; // 48px에서 축소
  z-index: 1;
`;