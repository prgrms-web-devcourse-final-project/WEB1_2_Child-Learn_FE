import { useState, useEffect } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';

const FloatingGNB = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // 페이지 변경 시 GNB 상태 초기화
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <Container>
      <MenuContainer $isOpen={isOpen}>
        <MenuItem
          onClick={() => handleNavigation('/main')}
          $position={1}
          $isOpen={isOpen}
        >
          <MenuIcon src="/img/home.png" alt="홈" />
        </MenuItem>
        <MenuItem
          onClick={() => handleNavigation('/minigame')}
          $position={2}
          $isOpen={isOpen}
        >
          <MenuIcon src="/img/game.png" alt="미니게임" />
        </MenuItem>
        <MenuItem
          onClick={() => handleNavigation('/search')}
          $position={3}
          $isOpen={isOpen}
        >
          <MenuIcon src="/img/search.png" alt="검색" />
        </MenuItem>
        <MenuItem
          onClick={() => handleNavigation('/avatar')}
          $position={4}
          $isOpen={isOpen}
        >
          <MenuIcon src="/img/brush.png" alt="꾸미기" />
        </MenuItem>
        <MenuItem
          onClick={() => handleNavigation('/mypage')}
          $position={5}
          $isOpen={isOpen}
        >
          <MenuIcon src="/img/user.png" alt="마이페이지" />
        </MenuItem>
      </MenuContainer>

      <ToggleButton onClick={() => setIsOpen(!isOpen)} $isOpen={isOpen}>
        <ButtonIcon
          src={isOpen ? '/img/close.png' : '/img/menu.png'}
          alt={isOpen ? '닫기' : '메뉴'}
        />
      </ToggleButton>
    </Container>
  );
};

export default FloatingGNB;

const Container = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
`;

const MenuContainer = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  bottom: -75px;
  right: -240px;
  opacity: ${({ $isOpen }) =>
    $isOpen ? 1 : 0}; // visibility 대신 opacity 사용
  pointer-events: ${({ $isOpen }) =>
    $isOpen ? 'auto' : 'none'}; // 닫혀있을 때 클릭 방지
  transition: opacity 0.2s ease-out; // opacity에 transition 추가
  width: 300px;
  height: 150px;
`;

const MenuItem = styled.button<{ $position: number; $isOpen: boolean }>`
  position: absolute;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: #468585;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  transition: all 0.3s ease-out; // transform과 opacity 모두에 transition 적용

  ${({ $position, $isOpen }) => {
    const angles: Record<number, number> = {
      1: -80,
      2: -110,
      3: -140,
      4: -170,
      5: -200,
    };

    const angle = angles[$position] || -90;
    const radius = 110;

    const radian = (angle * Math.PI) / 180;
    const x = Math.cos(radian) * radius;
    const y = Math.sin(radian) * radius;

    return css`
      transform: ${$isOpen ? `translate(${x}px, ${y}px)` : 'translate(0, 0)'};
    `;
  }}

  &:hover {
    background: #3aa46f;
  }
`;

const MenuIcon = styled.img`
  width: 24px;
  height: 24px;
  filter: brightness(0) invert(1);
`;

const ToggleButton = styled.button<{ $isOpen: boolean }>`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${({ $isOpen }) => ($isOpen ? '#3aa46f' : '#468585')};
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  z-index: 2;

  &:hover {
    background: #3aa46f;
  }
`;

const ButtonIcon = styled.img`
  width: 24px;
  height: 24px;
  filter: brightness(0) invert(1); // 이미지를 흰색으로 변경
`;
