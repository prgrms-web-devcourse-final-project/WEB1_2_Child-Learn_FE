import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <ImageWrapper>
        <NotFoundImage src="/img/not-found.png" alt="404 에러" />
      </ImageWrapper>
      <Title>페이지를 찾을 수 없습니다.</Title>
      <Description>
        현재 페이지는 준비 중입니다.
        <br />
        빠른 시일 내에 찾아뵙겠습니다!
      </Description>
      <HomeButton onClick={() => navigate('/main')}>
        메인으로 돌아가기
      </HomeButton>
    </Container>
  );
};

export default NotFoundPage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 20px;
  text-align: center;
`;

const ImageWrapper = styled.div`
  margin-bottom: 24px;
`;

const NotFoundImage = styled.img`
  width: 300px;
  height: auto;
`;

const Title = styled.h1`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #181818;
`;

const Description = styled.p`
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
  color: #666;
  margin-bottom: 24px;
`;

const HomeButton = styled.button`
  padding: 12px 24px;
  background-color: #6cc2a1;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #5ba890;
  }
`;
