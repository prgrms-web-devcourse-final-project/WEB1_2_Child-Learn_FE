import styled from "styled-components";
import { useAvatarStore } from "../../../features/avatar/model/avatarStore";
import { useItemStore } from '../../../features/avatar/model/itemStore';

function AvatarPage() {
  const { avatar } = useAvatarStore();
  const { marketItems } = useItemStore();

   // 현재 아바타에 장착된 아이템을 찾아서 이미지 URL 가져오기
   const currentBackground = marketItems.find(
    (item) => item.id === avatar?.background?.id
  )?.imageUrl;

  const currentPet = marketItems.find(
    (item) => item.id === avatar?.pet?.id
  )?.imageUrl;

  const currentHat = marketItems.find(
    (item) => item.id === avatar?.hat?.id
  )?.imageUrl;

  return (
        <BackgroundPlaceholder backgroundImage={currentBackground}>
          {!currentBackground && <Placeholder />}
          <AvatarImage src="/img/avatar.png" alt="캐릭터" />
          {currentPet && <PetImage src={currentPet} alt="펫" />}
          {currentHat && <HatImage src={currentHat} alt="모자" />}
        </BackgroundPlaceholder>
  );
}

export default AvatarPage;

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
