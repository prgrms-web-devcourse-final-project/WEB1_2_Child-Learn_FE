import styled from 'styled-components';

interface CharacterProps {
  onCustomizeClick: () => void;
}

const Character = ({ onCustomizeClick }: CharacterProps) => {
  return (
    <CharacterBox onClick={onCustomizeClick}>
      <CharacterImage src="/img/shopping.png" alt="쇼핑백" />
      <CharacterInfo>
        <CharacterTitle>내 캐릭터 꾸미기</CharacterTitle>
        <CharacterSubtitle>멋진 아이템을 사러 가요 !</CharacterSubtitle>
      </CharacterInfo>
    </CharacterBox>
  );
};

const CharacterBox = styled.div`
  background: white;
  border-radius: 16px;
  padding: 15px;
  margin-top: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: #d1d5db;
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.1);
  }
`;

const CharacterImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: contain;
`;

const CharacterInfo = styled.div`
  flex: 1;
`;

const CharacterTitle = styled.h3`
  font-size: 17px;
  font-weight: 700;
  color: #333;
  margin: 0;
`;

const CharacterSubtitle = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: #666;
  margin: 2px 0 0 0;
`;

export default Character;
