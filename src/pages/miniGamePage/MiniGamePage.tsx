import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #f5f5f5;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const Header = styled.header`
  width: 100%;
  background-color: #fff;
  padding: 10px 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
`;

const MainContent = styled.main`
  width: 100%;
  max-width: 768px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;

  @media (max-width: 768px) {
    gap: 15px;
    padding: 10px;
  }
`;

const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background-color: #e8f5e9;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const StyledLink = styled(Link)`
  display: inline-block;
  padding: 15px 30px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background-color: #007bff;
  border-radius: 10px;
  text-decoration: none;
  text-align: center;

  &:hover {
    background-color: #0056b3;
  }

  &:not(:last-child) {
    margin-bottom: 20px;
  }
`;

const Points = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
`;

const GameGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const GameCard = styled.div`
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  padding: 15px;

  h2 {
    font-size: 1.2rem;
    margin: 10px 0;
  }

  p {
    font-size: 0.9rem;
    color: #666;
  }
`;

const GameButton = styled.button`
  width: 100%;
  max-width: 300px;
  padding: 15px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background-color: #007bff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  text-align: center;

  &:hover {
    background-color: #0056b3;
  }

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 12px;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* z-index를 높게 설정하여 최상단에 표시되도록 수정 */
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 80%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); /* 더 깔끔한 효과를 위해 추가 */
  z-index: 1010; /* 모달 콘텐츠도 명확히 최상단에 배치 */
`;

const ModalButton = styled.button`
  width: 100%;
  margin-top: 10px;
  padding: 10px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #28a745;
  color: white;

  &:hover {
    background-color: #218838;
  }

  &:not(:last-child) {
    margin-bottom: 10px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
`;

const Footer = styled.footer`
  margin-top: auto;
  width: 100%;
  padding: 10px;
  text-align: center;
  background-color: #fff;
  border-top: 1px solid #ddd;
`;

const FloatingButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }

  /* 모바일 반응형 스타일 */
  @media (max-width: 768px) {
    bottom: 15px;
    right: 15px;
    width: 50px;
    height: 50px;
  }
`;

const MiniGamePage = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const openModal = (game: string) => {
    setSelectedGame(game);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedGame(null);
  };

  return (
    <PageContainer>
      <Header>안녕하세요, 최주님!</Header>
      <MainContent>
        <TopSection>
          <div>
            <p>획득한 포인트로 나를 꾸며볼까요?</p>
            <StyledLink to="/character">내 캐릭터 꾸미러 가기</StyledLink>
          </div>
          <Points>2000 P</Points>
        </TopSection>

        <TopSection>
          <div>
            <p>오늘 미니게임으로 획득한 포인트</p>
            <h2>300 Points</h2>
          </div>
          <StyledLink to="/exchange">환전하러 가기</StyledLink>
        </TopSection>

        <GameGrid>
          <GameCard>
          <GameButton onClick={() => openModal('낱말 퀴즈')}>낱말 퀴즈</GameButton>
            <p>100 Point</p>
          </GameCard>
          <GameCard>
            <h2>OX 퀴즈</h2>
            <p>0~100 Point</p>
          </GameCard>
          <GameCard>
            <h2>카드 뒤집기</h2>
            <p>100 Point</p>
          </GameCard>
          <GameCard>
            <h2>숫자를 맞혀라!</h2>
            <p>10~1000 Point</p>
          </GameCard>
        </GameGrid>
      </MainContent>
      {modalVisible && (
        <ModalOverlay>
          <ModalContent>
            <CloseButton onClick={closeModal}>&times;</CloseButton>
            <h2>{selectedGame}</h2>
            <p>난이도를 선택하세요!</p>
            <ModalButton>쉬움</ModalButton>
            <ModalButton>보통</ModalButton>
            <ModalButton>어려움</ModalButton>
          </ModalContent>
        </ModalOverlay>
      )}
      <Footer>© 2024 Mini Game App</Footer>
      <FloatingButton>≡</FloatingButton>
    </PageContainer>
  );
};

export default MiniGamePage;
