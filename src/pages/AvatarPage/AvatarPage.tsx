import { useState, useEffect } from "react";
import styled from "styled-components";
import { useUserInfo } from "@/entities/User/lib/queries";
import { useAvatarStore } from "@/features/avatar/model/avatarStore";
import { useItemStore } from "@/features/avatar/model/itemStore";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/app/providers/state/zustand/userStore";
import { avatarApi } from "@/shared/api/avatar";
import AvatarPreview from "@/features/avatar/ui/AvatarPreview";
import ItemGrid from "@/features/avatar/ui/ItemGrid";
import Tabs from "@/features/avatar/ui/Tabs";
import Modal from "@/features/avatar/ui/Modal";

function AvatarPage() {
  const { data: userInfo, isLoading, error } = useUserInfo();
  const { avatar, setAvatar } = useAvatarStore();
  const { marketItems } = useItemStore();
  const { gameCount } = useUserStore();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"background" | "pet" | "hat">("background");
  const [isRestrictedModalOpen, setIsRestrictedModalOpen] = useState(false); 

  if (isLoading) return <div>Loading...</div>;
  if (error || !userInfo) return <div>Error loading user info.</div>;

   // 페이지 접근 제약 조건 확인
   /*
   useEffect(() => {
    if (gameCount < 5) {
      setIsRestrictedModalOpen(true); // 모달 열기
    }
  }, [gameCount]);
    */

  // 초기 데이터 설정
  useEffect(() => {
    setAvatar({
      avatar_id: 1,
      member_id: userInfo.id,
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
      <AvatarPreviewWrapper>
      <AvatarPreview />
      </AvatarPreviewWrapper>
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <Divider />
      <ItemGrid filteredItems={filteredItems} />
      <Footer>더 많은 아이템이 추가될 예정입니다!</Footer>
      {isRestrictedModalOpen && (
        <Modal
        title={
          <>
            [초급] 난이도의<br />
            모의투자를 5회 이상<br />
            진행해야 이용하실 수 있습니다.
          </>
        }
          onClose={handleRestrictedModalClose}
        />
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

const AvatarPreviewWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #C8C8C8;
  margin: 20px 0;
`;

const Footer = styled.p`
  font-size: 14px;
  color: #000000;
  margin-top: 200px;
`;