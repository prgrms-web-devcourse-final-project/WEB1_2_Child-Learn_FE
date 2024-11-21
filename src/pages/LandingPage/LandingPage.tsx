import styled from 'styled-components';

const LandingPage = () => {
  return (
    <Content>
      <h1>Welcome</h1>
      <p>This app is designed for 390x844 resolution.</p>
      <p>안녕하세요.</p>
    </Content>
  );
};

export default LandingPage;

//styled-components
const Content = styled.div`
  padding: 20px;
  text-align: center;
`;
