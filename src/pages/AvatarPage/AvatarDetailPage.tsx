import { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { MarketItem } from "../../features/avatar/types/marketItemTypes";
import { useItemStore } from "../../features/avatar/model/itemStore";
import { useAvatarStore } from "../../features/avatar/model/avatarStore";
import { useUserStore } from "../../app/providers/state/zustand/userStore";

const AvatarDetailPage = () => {
  const { marketItems, updateMarketItems } = useItemStore();
  const { avatar, updateAvatarItem } = useAvatarStore();
  const { currentCoins, setUser } = useUserStore();
  const { category, product } = useParams();

  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 관리
  const [modalMessage, setModalMessage] = useState("");
  const [selectedItem, setSelectedItem] = useState<MarketItem | null>(null);

     // marketItems에서 선택된 아이템을 설정합니다.
  useEffect(() => {
    const item = marketItems.find(
      (item) => item.prd_type === category && item.prd_name === product
    );
    setSelectedItem(item || null);
  }, [marketItems, category, product]);

   // 현재 상태와 선택된 아이템을 조합하여 표시할 배경과 펫 계산
   const computedBackground =
   category === "background" ? selectedItem?.prd_image : marketItems.find((item) => item.prd_name === avatar?.cur_background)?.prd_image;

 const computedPet =
   category === "pet" ? selectedItem?.prd_image : marketItems.find((item) => item.prd_name === avatar?.cur_pet)?.prd_image;

   const computedHat =
   category === "hat" ? selectedItem?.prd_image : marketItems.find((item) => item.prd_name === avatar?.cur_hat)?.prd_image;

   // 현재 장착 여부 확인
   const isEquipped =
   (category === "background" && avatar?.cur_background === product) ||
   (category === "pet" && avatar?.cur_pet === product) ||
   (category === "hat" && avatar?.cur_hat === product);

 // 버튼 상태 결정
 let buttonText: string;
 if (selectedItem?.purchased) {
   buttonText = isEquipped ? "장착 해제하기" : "장착하기";
 } else {
   buttonText = "구매하기";
 }

    // 구매 확인 모달에서 구매 버튼 클릭 시 처리
  const handlePurchaseConfirm = () => {
    if (!selectedItem) {
      return;
    }

    if (currentCoins < selectedItem.prd_price) {
      // 코인이 부족한 경우
      setIsModalOpen(false);
      setModalMessage("코인이 부족합니다.");
      return;
    }

    updateMarketItems(selectedItem.prd_id, true);

    setUser({ currentCoins: currentCoins - selectedItem.prd_price }); // 유저의 코인 차감
    setIsModalOpen(false);
    setModalMessage("구매가 완료되었습니다.");
    setTimeout(() => setModalMessage(""), 3000); // 3초 후 메시지 숨기기
  };

  // 버튼 클릭 핸들러
  const handleButtonClick = () => {
    if (!selectedItem?.purchased) {
      // 구매 모달 열기
      setIsModalOpen(true);
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
      <BackgroundPlaceholder backgroundImage={computedBackground}>
      {!computedBackground && <Placeholder />}
          <AvatarImage src="/img/avatar.png" alt="캐릭터" />
          {computedPet && <PetImage src={computedPet} alt="펫" />}
          {computedHat && <HatImage src={computedHat} alt="모자" isBaseball={selectedItem?.prd_name === "baseball"} />}
        </BackgroundPlaceholder>
      </CharacterPreview>

      {/* 구매 모달 */}
      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>정말로 구매하시겠습니까?</ModalTitle>
            {category && selectedItem?.prd_image && (
        <ModalPreview
          src={selectedItem.prd_image}
          alt={selectedItem.prd_name}
          category={category}
        />
      )}
            <ModalActions>
              <ModalButton onClick={handlePurchaseConfirm} confirm>
                구매
              </ModalButton>
              <ModalButton onClick={() => setIsModalOpen(false)}>취소</ModalButton>
            </ModalActions>
          </ModalContent>
        </ModalOverlay>
      )}
       {/* 결과 메시지 모달 */}
       {modalMessage && (
        <ModalOverlay>
          <ModalContent>
            {/* 코인이 부족한 경우만 CloseButton 표시 */}
      {modalMessage === "코인이 부족합니다." && (
        <CloseButton onClick={() => setModalMessage("")}>&times;</CloseButton>
      )}
      <ModalTitle>{modalMessage}</ModalTitle>
          </ModalContent>
        </ModalOverlay>
      )}
       <BackgroundContainer>
       <DetailSection>
        <ItemTitle>
          {selectedItem?.prd_name}
          <ItemPrice>
            <CoinIcon src="/public/img/coins.png" alt="코인" />
            {selectedItem?.prd_price} Coin
          </ItemPrice>
        </ItemTitle>
        <ItemDescription>{selectedItem?.prd_description}</ItemDescription>
        <ActionButton onClick={handleButtonClick}>{buttonText}</ActionButton>
      </DetailSection>
       </BackgroundContainer>
    </Container>
  );
};

export default AvatarDetailPage;

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  text-align: center;
  background-color: #def9c4; /* 연두색 배경 */
  position: relative;
`;

const BackgroundContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  top: 400px;
   background-color: #fff; 
  border-top-left-radius: 75px;
`;

const CharacterPreview = styled.div`
  margin: 100px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative; /* 펫 이미지를 배경 위에 겹치게 하기 위해 필요 */
  overflow: visible;
`;

const BackgroundPlaceholder = styled.div<{ backgroundImage?: string }>`
  position: relative;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: ${({ backgroundImage }) =>
    backgroundImage ? `url(${backgroundImage})` : "#E8DFCC"};
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: visible;
`;

const Placeholder = styled.div`
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background-color: #e8dfcc;
`;

const PetImage = styled.img`
  position: absolute;
  width: 60px; /* 펫 이미지 크기 조정 */
  height: 60px;
  bottom: 5px; /* 배경 아래로 약간 내려감 */
  left: 5px; /* 배경 왼쪽으로 약간 나감 */
  object-fit: contain;
  z-index: 2;
`;

const HatImage = styled.img<{ isBaseball?: boolean }>`
  position: absolute;
  width: 60px; /* 모자 크기 */
  height: 40px; /* 모자 높이 */
  top: 20px; /* 캐릭터 머리 위에 위치 */
  left: ${({ isBaseball }) => (isBaseball ? "7                                 0%" : "50%")};
  transform: translateX(-40%); /* 중앙 정렬 */
  z-index: 3; /* 캐릭터보다 위에 표시 */
`;

const AvatarImage = styled.img`
  position: absolute;
  width: 135px;
  height: 135px;
`;

const DetailSection = styled.div`
  margin-top: 50px;
  text-align: center;
`;

const ItemTitle = styled.div`
  font-size: 22px;
  font-weight: bold;
  display: flex;
  margin: 0 20px;
  justify-content: space-between;
`;

const ItemPrice = styled.span`
  font-size: 18px;
  color: #000;
`;

const CoinIcon = styled.img`
  width: 30px; /* 아이콘 크기 */
  height: 30px;
  margin-right: 5px; /* 숫자와 아이콘 사이의 간격 */
`;

const ItemDescription = styled.p`
  font-size: 14px;
  text-align: left;
  margin-left: 20px;
  margin-top: 20px;
  color: #666;
`;

const ActionButton = styled.button`
  padding: 10px 20px;
  margin-top: 160px;
  background-color: #50b498;
  width: 247px;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 12px;
  cursor: pointer;

  &:hover {
    background-color: #3a816a;
  }
`;

// Modal styles
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  width: 300px;
  position: relative;
`;

const ModalTitle = styled.h2`
 font-size: 20px;
  margin-bottom: 50px;
  color: #1F2261;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background: none;
  border: none;
  font-size: 20px;
  font-weight: bold;
  color: #333;
  cursor: pointer;

  &:hover {
    color: #000;
  }
`;

const ModalPreview = styled.img<{ category?: string }>`
  width: 100px;
  height: 100px;
  margin-bottom: 50px;
  object-fit: ${({ category }) => (category === "background" ? "cover" : "contain")};
  border-radius: ${({ category }) => (category === "background" ? "50%" : "0")};
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: space-around;
`;

const ModalButton = styled.button<{ confirm?: boolean }>`
  padding: 10px 20px;
  background-color: ${({ confirm }) => (confirm ? "#4A87DC" : "#E16266")};
  color: white;
  border: 1px solid white;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: ${({ confirm }) => (confirm ? "#3657DC" : "#c9302c")};
  }
`;