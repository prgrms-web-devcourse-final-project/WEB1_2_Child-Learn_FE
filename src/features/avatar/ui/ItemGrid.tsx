import styled from "styled-components";
import { useAvatarStore } from "../../../features/avatar/model/avatarStore";
import { useNavigate } from "react-router-dom";
import { MarketItem } from "../types/marketItemTypes";

const ItemGrid = ({ filteredItems }: { filteredItems: MarketItem[] }) => {
  const { avatar } = useAvatarStore();
  const navigate = useNavigate();

  return (
      <ItemGridWrapper>
      {filteredItems.map((item) => (
          <ItemCard
            key={item.id}
            purchased={item.purchased}
            isEquipped={
              (item.category === "BACKGROUND" && avatar?.background?.id === item.id) ||
              (item.category === "PET" && avatar?.pet?.id === item.id) ||
              (item.category === "HAT" && avatar?.hat?.id === item.id)
            }
            onClick={() => navigate(`/avatar/details/${item.category}/${item.name}`)} // category와 product를 URL에 포함
          >
            <ItemImage src={item.imageUrl} alt={item.name} />
          </ItemCard>
        ))}
      </ItemGridWrapper>
  );
}

export default ItemGrid;

const ItemGridWrapper = styled.div`
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