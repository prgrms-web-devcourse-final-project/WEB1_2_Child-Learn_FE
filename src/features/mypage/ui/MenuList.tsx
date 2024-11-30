import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import type { MenuItem } from '../model/types'; // type-only import로 수정

interface MenuListProps {
  items: MenuItem[];
}

const MenuList = ({ items }: MenuListProps) => {
  const navigate = useNavigate();
  return (
    <MenuContainer>
      {items.map((item, index) => (
        <MenuItem key={index} onClick={() => navigate(item.path)}>
          <IconWrapper $backgroundColor={item.backgroundColor}>
            <Icon
              src={item.icon}
              alt={item.label}
              $iconColor={item.iconColor}
            />
          </IconWrapper>
          <MenuLabel>{item.label}</MenuLabel>
          <ArrowIcon src="/img/arrow2.png" alt="이동" />
        </MenuItem>
      ))}
    </MenuContainer>
  );
};

const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: transparent; // 배경을 투명하게
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: white; // hover 시에만 흰색 배경
    transform: translateY(-4px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.1);
  }
`;

const IconWrapper = styled.div<{ $backgroundColor: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${(props) => props.$backgroundColor};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Icon = styled.img<{ $iconColor: string }>`
  width: 20px;
  height: 20px;
  filter: ${(props) => `brightness(0) saturate(100%) ${props.$iconColor}`};
`;

const MenuLabel = styled.span`
  flex: 1;
  margin-left: 20px;
  font-size: 16px;
  font-weight: 700;
  color: #181818;
`;

const ArrowIcon = styled.img`
  width: 12px;
  height: 12px;
`;

export default MenuList;
