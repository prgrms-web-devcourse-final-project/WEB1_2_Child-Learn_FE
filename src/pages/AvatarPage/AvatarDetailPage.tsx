import { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { MarketItem } from "@/features/avatar/types/marketItemTypes";
import { useItemStore } from "@/features/avatar/model/itemStore";
import { useAvatarStore } from "@/features/avatar/model/avatarStore";
import { useUserInfo } from "@/entities/User/lib/queries";
import { useUserStore } from "@/app/providers/state/zustand/userStore";
import { avatarApi } from "@/shared/api/avatar";

const AvatarDetailPage = () => {
  const { marketItems, updateMarketItem } = useItemStore();
  const { avatar, updateAvatarItem } = useAvatarStore();
  const { data: userInfo } = useUserInfo();
  const { category, product } = useParams();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [selectedItem, setSelectedItem] = useState<MarketItem | null>(null);

  // 선택된 아이템 찾기
  useEffect(() => {
    const item = marketItems.find(
      (item) => item.category === category && item.name === product
    );
    setSelectedItem(item || null);
  }, [marketItems, category, product]);

  // 현재 상태와 선택된 아이템 기반으로 계산
  const computedBackground = category === "BACKGROUND"
    ? selectedItem?.imageUrl
    : avatar?.background?.imageUrl;

  const computedPet = category === "PET"
    ? selectedItem?.imageUrl
    : avatar?.pet?.imageUrl;

  const computedHat = category === "HAT"
    ? selectedItem?.imageUrl
    : avatar?.hat?.imageUrl;

  // 현재 장착 여부 확인
  const isEquipped =
    (category === "BACKGROUND" && avatar?.background?.id === selectedItem?.id) ||
    (category === "PET" && avatar?.pet?.id === selectedItem?.id) ||
    (category === "HAT" && avatar?.hat?.id === selectedItem?.id);

  // 버튼 텍스트 결정
  let buttonText: string;
  if (selectedItem?.purchased) {
    buttonText = isEquipped ? "장착 해제하기" : "장착하기";
  } else {
    buttonText = "구매하기";
  }

  // 구매 확인 모달 처리
  const handlePurchaseConfirm = async () => {
    if (!selectedItem || !userInfo) return;

    if (userInfo.currentCoins < selectedItem.price) {
      setIsModalOpen(false);
      setModalMessage("코인이 부족합니다.");
      return;
    }

    try {
      const response = await avatarApi.purchaseItem({ itemId: selectedItem.id });

      if (response.message === "아이템을 구매했습니다") {
        updateMarketItem(selectedItem.id, true); // 아이템을 구매 상태로 변경
      }
      setIsModalOpen(false);
      setModalMessage("구매가 완료되었습니다.");
      setTimeout(() => setModalMessage(""), 3000);
    } catch (error) {
      console.error("Failed to purchase item:", error);
      setModalMessage("구매 처리 중 오류가 발생했습니다.");
      setTimeout(() => setModalMessage(""), 3000);
    }
  };

  // 버튼 클릭 핸들러
  const handleButtonClick = async () => {
    if (!selectedItem?.purchased) {
      setIsModalOpen(true);
      return;
    }

    try {
      if (isEquipped) {
        // 장착 해제 로직
        await avatarApi.removeItem({ itemId: selectedItem.id }); // 서버에 해제 요청
        updateAvatarItem(category?.toLowerCase() as "background" | "pet" | "hat", selectedItem);
        alert(`${selectedItem.name} 장착 해제 완료!`);
      } else {
        // 장착 로직
        await avatarApi.equipItem({ itemId: selectedItem.id }); // 서버에 장착 요청
        updateAvatarItem(category?.toLowerCase() as "background" | "pet" | "hat", selectedItem);
        alert(`${selectedItem.name} 장착 완료!`);
      }
    } catch (error) {
      console.error("장착/해제 처리 중 오류 발생:", error);
      alert("처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <Container>
      <CharacterPreview>
        <BackgroundPlaceholder backgroundImage={computedBackground}>
          {!computedBackground && <Placeholder />}
          <AvatarImage src="/img/avatar.png" alt="캐릭터" />
          {computedPet && <PetImage src={computedPet} alt="펫" />}
          {computedHat && <HatImage src={computedHat} alt="모자" />}
        </BackgroundPlaceholder>
      </CharacterPreview>

      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>정말로 구매하시겠습니까?</ModalTitle>
            {category && selectedItem?.imageUrl && (
              <ModalPreview src={selectedItem.imageUrl} alt={selectedItem.name} />
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

      {modalMessage && (
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>{modalMessage}</ModalTitle>
          </ModalContent>
        </ModalOverlay>
      )}

      <BackgroundContainer>
        <DetailSection>
          <ItemTitle>
            {selectedItem?.name}
            <ItemPrice>
              <CoinIcon src="/img/coins.png" alt="코인" />
              {selectedItem?.price} Coin
            </ItemPrice>
          </ItemTitle>
          <ItemDescription>{selectedItem?.description}</ItemDescription>
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