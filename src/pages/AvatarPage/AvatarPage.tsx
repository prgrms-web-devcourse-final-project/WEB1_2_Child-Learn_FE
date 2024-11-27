import { useState, useEffect } from "react";
import styled from "styled-components";
import { useAvatarStore } from "../../features/avatar/model/avatarStore";
import { useItemStore } from "../../features/avatar/model/itemStore";

function AvatarPage() {
  const { avatar } = useAvatarStore();
  const { marketItems, setMarketItems } = useItemStore();

  const [activeTab, setActiveTab] = useState<"background" | "pet" | "hat">("background");

  // 초기 데이터 설정
  useEffect(() => {
    setMarketItems([
      {
        prd_id: 1,
        prd_name: "미래 도시",
        prd_type: "background",
        prd_image: "public/img/future-city.png",
        prd_price: 100,
        prd_description: "미래 도시 배경",
        cate_id: 1,
        purchased: true, // 구매 여부를 바로 설정
      },
      {
        prd_id: 2,
        prd_name: "수중 세계",
        prd_type: "background",
        prd_image: "public/img/underwater.png",
        prd_price: 120,
        prd_description: "수중 세계 배경",
        cate_id: 1,
        purchased: false, // 구매하지 않은 상태
      },
      {
        prd_id: 3,
        prd_name: "우주",
        prd_type: "background",
        prd_image: "public/img/space.png",
        prd_price: 150,
        prd_description: "우주 배경",
        cate_id: 1,
        purchased: false,
      },
      {
        prd_id: 4,
        prd_name: "스위트 공장",
        prd_type: "background",
        prd_image: "public/img/sweet-factory.png",
        prd_price: 200,
        prd_description: "스위트 공장 배경",
        cate_id: 1,
        purchased: false,
      },
      {
        prd_id: 5,
        prd_name: "유령 성",
        prd_type: "background",
        prd_image: "public/img/spooky-castle.png",
        prd_price: 180,
        prd_description: "유령 성 배경",
        cate_id: 1,
        purchased: true,
      },
      {
        prd_id: 6,
        prd_name: "불꽃",
        prd_type: "pet",
        prd_image: "public/img/fire.png",
        prd_price: 100,
        prd_description: "불꽃 펫",
        cate_id: 2,
        purchased: true, // 구매 여부를 바로 설정
      },
      {
        prd_id: 7,
        prd_name: "물방울",
        prd_type: "pet",
        prd_image: "public/img/water.png",
        prd_price: 120,
        prd_description: "물방울 펫",
        cate_id: 2,
        purchased: false, // 구매하지 않은 상태
      },
      {
        prd_id: 8,
        prd_name: "별똥별",
        prd_type: "pet",
        prd_image: "public/img/starlight.png",
        prd_price: 150,
        prd_description: "우주 배경",
        cate_id: 2,
        purchased: false,
      },
      {
        prd_id: 9,
        prd_name: "식물",
        prd_type: "pet",
        prd_image: "public/img/plant.png",
        prd_price: 200,
        prd_description: "식물 펫",
        cate_id: 2,
        purchased: false,
      },
      {
        prd_id: 10,
        prd_name: "구름",
        prd_type: "pet",
        prd_image: "public/img/cloud.png",
        prd_price: 180,
        prd_description: "구름 펫",
        cate_id: 2,
        purchased: true,
      },
      {
        prd_id: 11,
        prd_name: "마법사 모자",
        prd_type: "hat",
        prd_image: "public/img/wizard.png",
        prd_price: 100,
        prd_description: "마법사 모자",
        cate_id: 3,
        purchased: true, // 구매 여부를 바로 설정
      },
      {
        prd_id: 12,
        prd_name: "신사 모자",
        prd_type: "hat",
        prd_image: "public/img/gentleman.png",
        prd_price: 120,
        prd_description: "신사 모자",
        cate_id: 3,
        purchased: false, // 구매하지 않은 상태
      },
      {
        prd_id: 13,
        prd_name: "밀짚모자",
        prd_type: "hat",
        prd_image: "public/img/farmer.png",
        prd_price: 150,
        prd_description: "밀짚모자",
        cate_id: 3,
        purchased: false,
      },
      {
        prd_id: 14,
        prd_name: "야구 모자",
        prd_type: "hat",
        prd_image: "public/img/baseball.png",
        prd_price: 200,
        prd_description: "야구 모자",
        cate_id: 3,
        purchased: false,
      },
      {
        prd_id: 15,
        prd_name: "왕관",
        prd_type: "hat",
        prd_image: "public/img/tiara.png",
        prd_price: 180,
        prd_description: "왕관",
        cate_id: 3,
        purchased: true,
      },
    ]);
  }, [setMarketItems]);
  
  const filteredItems = marketItems.filter((item) => item.prd_type === activeTab);

  return (
    <Container>
      <Title>내 캐릭터 꾸미기</Title>
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
      <ItemGrid>
        {filteredItems.map((item) => (
          <ItemCard key={item.prd_id} purchased={item.purchased}>
            <ItemImage src={item.prd_image} alt={item.prd_name} />
            <ItemName purchased={item.purchased}>{item.prd_name}</ItemName>
          </ItemCard>
        ))}
      </ItemGrid>
      <Footer>더 많은 아이템이 추가될 예정입니다!</Footer>
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
  font-size: 24px;
  margin-bottom: 20px;
`;

const Tabs = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 10px 20px;
  margin: 0 5px;
  font-size: 16px;
  border: none;
  border-radius: 20px;
  background-color: ${(props) => (props.active ? "#50B498" : "#e0e0e0")};
  color: ${(props) => (props.active ? "white" : "#333")};
  cursor: pointer;

  &:hover {
    background-color: ${(props) => (props.active ? "#0056b3" : "#ccc")};
  }
`;

const ItemGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin: 20px 0;
`;

const ItemCard = styled.div<{ purchased: boolean }>`
  position: relative;
  padding: 10px;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #fff;
  opacity: ${(props) => (props.purchased ? 1 : 0.5)};
`;

const ItemImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  margin-bottom: 10px;
`;

const ItemName = styled.p<{ purchased: boolean }>`
  font-size: 14px;
  color: ${(props) => (props.purchased ? "#000" : "#aaa")};
`;

const Footer = styled.p`
  font-size: 14px;
  color: #666;
  margin-top: 20px;
`;
