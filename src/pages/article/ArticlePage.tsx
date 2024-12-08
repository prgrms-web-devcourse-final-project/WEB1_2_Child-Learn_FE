import styled from 'styled-components';
import { MidArticlePage } from './MidArticlePage';
import { AdvancedArticlePage } from './AdvancedArticlePage';
const Container = styled.div`
  display: flex;
  gap: 20px;
  padding: 20px;
`;

const Column = styled.div`
  flex: 1;
`;

export const ArticlePage = () => {
  return (
    <Container>
      <Column>
        <MidArticlePage />
      </Column>
      <Column>
        <AdvancedArticlePage />
      </Column>
    </Container>
  );
};