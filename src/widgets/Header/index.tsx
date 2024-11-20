import styled from 'styled-components';

const Header = () => {
  return (
    <HeaderContainer>
      <Logo 
        src="/img/logo.png" 
        alt="Logo"
      />
      <IconsWrapper>
        <IconButton>
          <Icon 
            src="/img/chat.png" 
            alt="Chat"
          />
        </IconButton>
        <IconButton>
          <Icon 
            src="/img/bell.png" 
            alt="Notifications"
          />
        </IconButton>
      </IconsWrapper>
    </HeaderContainer>
  );
};

export default Header;

// 스타일 컴포넌트 정의
const HeaderContainer = styled.header`
  width: 100%;
  height: 40px;
  background: #FFFFFF;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px 0 10px;
  top: 0;
  left: 0;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.05);
`;

const Logo = styled.img`
  height: 35px;
  width: auto;
`;

const IconsWrapper = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Icon = styled.img`
  width: 20px;
  height: 20px;
`;