import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useItemStore } from "../../features/avatar/model/itemStore";
import { useAvatarStore } from "../../features/avatar/model/avatarStore";


const AvatarDetailPage = () => {
  const { marketItems, setMarketItems } = useItemStore();
  const { avatar, updateAvatarItem } = useAvatarStore();
  const { category, product } = useParams();

  // 선택된 아이템
  const selectedItem = marketItems.find(
    (item) => item.prd_type === category && item.prd_name === product
  );

  if (!selectedItem) {
    return <div>아이템을 찾을 수 없습니다.</div>;
  }

   // 현재 장착 여부 확인
   const isEquipped =
   (category === "background" && avatar?.cur_background === product) ||
   (category === "pet" && avatar?.cur_pet === product) ||
   (category === "hat" && avatar?.cur_hat === product);

 // 버튼 상태 결정
 let buttonText: string;
 if (selectedItem.purchased) {
   buttonText = isEquipped ? "장착 해제하기" : "장착하기";
 } else {
   buttonText = "구매하기";
 }

  // 버튼 클릭 핸들러
  const handleButtonClick = () => {
    if (!selectedItem.purchased) {
      // 구매 로직
      setMarketItems(
        marketItems.map((item) =>
          item.prd_id === selectedItem.prd_id
            ? { ...item, purchased: true }
            : item
        )
      );
      alert(`${selectedItem.prd_name} 구매 완료!`);
      return;
    }

    if (isEquipped) {
      // 장착 해제 로직
      updateAvatarItem(category as "background" | "pet" | "hat", "");
      alert(`${selectedItem.prd_name} 장착 해제 완료!`);
    } else {
      // 장착 로직
      updateAvatarItem(category as "background" | "pet" | "hat", selectedItem.prd_name);
      alert(`${selectedItem.prd_name} 장착 완료!`);
    }
  };

  return (
    <Container>
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
        <ActionButton onClick={handleButtonClick}>{buttonText}</ActionButton>
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
  width:135px;
  height: 135px;
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
