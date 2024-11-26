import React, { useState } from "react";
import styled from "styled-components";
import { useAvatarStore } from "../../features/avatar/model/avatarStore";
import { useItemStore } from "../../features/avatar/model/itemStore";

function AvatarPage() {
  const { avatar } = useAvatarStore();
  const { marketItems } = useItemStore();

  const [activeTab, setActiveTab] = useState<"background" | "pet" | "hat">(
    "background"
  );

  const equippedItems = {
    background: marketItems.find(
      (item) => item.prd_name === avatar?.cur_background
    ),
    pet: marketItems.find((item) => item.prd_name === avatar?.cur_pet),
    hat: marketItems.find((item) => item.prd_name === avatar?.cur_hat),
  };

  const filteredItems = marketItems.filter((item) => item.prd_type === activeTab);

  return (
    <Container>
      <Title>내 캐릭터 꾸미기</Title>
      <AvatarPreview>
        <Background src={equippedItems.background?.prd_image || ""} />
        <Pet src={equippedItems.pet?.prd_image || ""} />
        <Hat src={equippedItems.hat?.prd_image || ""} />
      </AvatarPreview>

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
          <ItemCard
            key={item.prd_id}
            purchased={item.prd_name === avatar?.cur_background || 
                       item.prd_name === avatar?.cur_pet || 
                       item.prd_name === avatar?.cur_hat}
          >
            <img src={item.prd_image} alt={item.prd_name} />
            <p>{item.prd_name}</p>
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

const AvatarPreview = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto 20px;
`;

const Background = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const Pet = styled.img`
  position: absolute;
  width: 60px;
  height: 60px;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
`;

const Hat = styled.img`
  position: absolute;
  width: 50px;
  height: 50px;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
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
  background-color: ${(props) => (props.active ? "#007bff" : "#e0e0e0")};
  color: ${(props) => (props.active ? "white" : "#333")};
  cursor: pointer;

  &:hover {
    background-color: ${(props) => (props.active ? "#0056b3" : "#ccc")};
  }
`;

const ItemGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
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
  img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    margin-bottom: 10px;
  }
  p {
    font-size: 14px;
    color: ${(props) => (props.purchased ? "#000" : "#aaa")};
  }
`;

const Footer = styled.p`
  font-size: 14px;
  color: #666;
  margin-top: 20px;
`;
