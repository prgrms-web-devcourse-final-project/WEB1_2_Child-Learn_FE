import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import { useItemStore } from "../../features/avatar/model/itemStore";

const AvatarDetailPage = () => {
  const { marketItems } = useItemStore();
  const { category, product } = useParams();
  const navigate = useNavigate();

  // 선택된 아이템
  const selectedItem = marketItems.find(
    (item) => item.prd_type === category && item.prd_name === product
  );

  if (!selectedItem) {
    return <div>아이템을 찾을 수 없습니다.</div>;
  }

  return (
    <Container>
      <Header>
        <Title>{selectedItem.prd_name}</Title>
      </Header>
      <CharacterPreview>
        <BackgroundPreview backgroundImage={selectedItem.prd_image}>
          <AvatarImage src="/img/avatar.png" alt="캐릭터" />
        </BackgroundPreview>
      </CharacterPreview>
      <DetailSection>
        <ItemTitle>
          {selectedItem.prd_name}
          <ItemPrice>{selectedItem.prd_price} Coin</ItemPrice>
        </ItemTitle>
        <ItemDescription>{selectedItem.prd_description}</ItemDescription>
        <ActionButton>장착하기</ActionButton>
      </DetailSection>
    </Container>
  );
};

export default AvatarDetailPage;

// Styled Components
const Container = styled.div`
  padding: 20px;
  text-align: center;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  margin-right: auto;
`;

const Title = styled.h1`
  font-size: 18px;
  font-weight: bold;
`;

const CharacterPreview = styled.div`
  margin: 20px 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BackgroundPreview = styled.div<{ backgroundImage: string }>`
  position: relative;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: ${({ backgroundImage }) => `url(${backgroundImage})`} no-repeat center/cover;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AvatarImage = styled.img`
  position: absolute;
  width: 80px;
  height: 80px;
`;

const DetailSection = styled.div`
  margin-top: 20px;
  text-align: left;
`;

const ItemTitle = styled.div`
  font-size: 20px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
`;

const ItemPrice = styled.span`
  font-size: 16px;
  color: #50b498;
`;

const ItemDescription = styled.p`
  font-size: 14px;
  color: #666;
  margin: 10px 0 20px;
`;

const ActionButton = styled.button`
  padding: 10px 20px;
  background-color: #50b498;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #3a816a;
  }
`;
