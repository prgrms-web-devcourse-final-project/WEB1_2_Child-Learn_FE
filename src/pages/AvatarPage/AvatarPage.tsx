import { useState, useEffect } from "react";
import styled from "styled-components";
import { useAvatarStore } from "../../features/avatar/model/avatarStore";
import { useItemStore } from "../../features/avatar/model/itemStore";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../app/providers/state/zustand/userStore";

function AvatarPage() {
  const { avatar, setAvatar } = useAvatarStore();
  const { marketItems, loadMarketItems } = useItemStore();
  const { gameCount } = useUserStore();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"background" | "pet" | "hat">("background");
  const [isRestrictedModalOpen, setIsRestrictedModalOpen] = useState(false); 

  const currentBackground = marketItems.find(
    (item) => item.prd_name === avatar?.cur_background
  )?.prd_image;

  const currentPet = marketItems.find(
    (item) => item.prd_name === avatar?.cur_pet
  )?.prd_image;

  const currentHat = marketItems.find(
    (item) => item.prd_name === avatar?.cur_hat
  )?.prd_image;

   // 페이지 접근 제약 조건 확인
   useEffect(() => {
    if (gameCount < 5) {
      setIsRestrictedModalOpen(true); // 모달 열기
    }
  }, [gameCount]);

    // 데이터 로드
  useEffect(() => {
    loadMarketItems(); // marketItems를 로드
  }, [loadMarketItems]);

  // 초기 데이터 설정
  useEffect(() => {
    setAvatar({
      avatar_id: 1,
      member_id: 1,
      cur_background: avatar?.cur_background || undefined,
      cur_pet: avatar?.cur_pet || undefined,
      cur_hat: avatar?.cur_hat || undefined,
      pre_background: avatar?.pre_background || undefined,
      pre_pet: avatar?.pre_pet || undefined,
      pre_hat: avatar?.pre_hat || undefined,
    });
  }, [setAvatar]);

  const filteredItems = marketItems.filter((item) => item.prd_type === activeTab);

   // 모달 확인 버튼 클릭 핸들러
   const handleRestrictedModalClose = () => {
    setIsRestrictedModalOpen(false); // 모달 닫기
    navigate(-1); // 이전 페이지로 이동
  };

  return (
    <Container>
      <Title>내 캐릭터 꾸미기</Title>
      <CharacterPreview>
        <BackgroundPlaceholder backgroundImage={currentBackground}>
          {!currentBackground && <Placeholder />}
          <AvatarImage src="/img/avatar.png" alt="캐릭터" />
          {currentPet && <PetImage src={currentPet} alt="펫" />}
          {currentHat && <HatImage src={currentHat} alt="모자" />}
        </BackgroundPlaceholder>
      </CharacterPreview>
      <Tabs>
        <Tab onClick={() => setActiveTab("background")} active={activeTab === "background"}>
          배경
        </Tab>
        <Tab onClick={() => setActiveTab("pet")} active={activeTab === "pet"}>
          펫
        </Tab>
        <Tab onClick={() => setActiveTab("hat")} active={activeTab === "hat"}>
          모자
        </Tab>
      </Tabs>
      <Divider />
      <ItemGrid>
      {filteredItems.map((item) => (
          <ItemCard
            key={item.prd_id}
            purchased={item.purchased}
            isEquipped={
              (item.prd_type === "background" && avatar?.cur_background === item.prd_name) ||
              (item.prd_type === "pet" && avatar?.cur_pet === item.prd_name) ||
              (item.prd_type === "hat" && avatar?.cur_hat === item.prd_name)
            }
            onClick={() => navigate(`/avatar/details/${item.prd_type}/${item.prd_name}`)} // category와 product를 URL에 포함
          >
            <ItemImage src={item.prd_image} alt={item.prd_name} />
          </ItemCard>
        ))}
      </ItemGrid>
      <Footer>더 많은 아이템이 추가될 예정입니다!</Footer>
      {/* 제약 조건 모달 */}
      {isRestrictedModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>
              {" "}
              [초급] 모의투자를 5회 이상 진행해야 이용하실 수 있습니다.
            </ModalTitle>
            <ModalButton onClick={handleRestrictedModalClose}>확인</ModalButton>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
}

export default AvatarPage;

// Styled Components
const Container = styled.div`
  padding: 20px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 17px;
  margin-bottom: 20px;
`;

const CharacterPreview = styled.div`
  margin: 20px 0;
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

const HatImage = styled.img`
  position: absolute;
  width: 60px; /* 모자 크기 */
  height: 40px; /* 모자 높이 */
  top: 20px; /* 캐릭터 머리 위에 위치 */
  left: 50%;
  transform: translateX(-40%); /* 중앙 정렬 */
  z-index: 3; /* 캐릭터보다 위에 표시 */
`;

const AvatarImage = styled.img`
  position: absolute;
  width: 135px;
  height: 135px;
`;

const Tabs = styled.div`
  display: flex;
  justify-content: flex-start;
  margin: 20px 0;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 10px 20px;
  margin: 0 5px;
  font-size: 10px;
   border: 0.5px solid ${(props) => (props.active ? "#50B498" : "#E3E3E3")};
  border-radius: 20px;
  background-color: ${(props) => (props.active ? "#50B498" : "#fff")};
  color: ${(props) => (props.active ? "white" : "#50B498")};
  cursor: pointer;

  &:hover {
    background-color: ${(props) => (props.active ? "#468585" : "#fff")};
  }
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #C8C8C8;
  margin: 20px 0;
`;

const ItemGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
`;

const ItemCard = styled.div<{ purchased: boolean; isEquipped: boolean }>`
  position: relative;
  text-align: center;
  width: 100px; 
  height: 100px; 
  background-color: #fff;
  opacity: ${(props) => (props.purchased ? 1 : 0.5)};
  filter: ${(props) => (props.purchased ? "none" : "brightness(50%)")};
  cursor: pointer;
  overflow: hidden;

  &:hover {
    filter: ${(props) => (props.purchased ? "brightness(90%)" : "none")};
  }

  &::before {
    content: ${(props) => (props.purchased ? "''" : "url('/public/img/lock-alt.png')")};
    display: ${(props) => (props.purchased ? "none" : "block")};
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
  }

  &::after {
    content: ${(props) => (props.isEquipped ? "'장착중'" : "''")};
    display: ${(props) => (props.isEquipped ? "block" : "none")};
    position: absolute;
    top: 5px; /* 좌상단 위치로 변경 */
    left: 5px; /* 좌상단 위치로 변경 */
    background-color: #50b498;
    color: white;
    font-size: 5px;
    padding: 5px;
    border-radius: 10px;
    z-index: 3;
  }
`;

const ItemImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  margin-bottom: 10px;
`;

const Footer = styled.p`
  font-size: 14px;
  color: #000000;
  margin-top: 200px;
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
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  width: 300px;
`;

const ModalTitle = styled.h2`
  margin-bottom: 15px;
`;

const ModalButton = styled.button`
  padding: 10px 20px;
  background-color: #d9534f;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #c9302c;
  }
`;