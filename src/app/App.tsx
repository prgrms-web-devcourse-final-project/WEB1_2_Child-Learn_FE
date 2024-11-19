import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MiniGamePage from '../pages/miniGamePage/MiniGamePage';
import CharacterPage from '../pages/characterPage/CharacterPage';
import ExchangePage from '../pages/exchangePage/ExchangePage';
import styled from 'styled-components';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 20px;
  background-color: #f9f9f9;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const Navigation = styled.nav`
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  background-color: #fff;
  border-bottom: 1px solid #ddd;

  a {
    text-decoration: none;
    color: #007bff;
    font-weight: bold;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const App = () => {
  return (
    <Router>
      <AppContainer>
        <Navigation>
          <Link to="/">Home</Link>
          <Link to="/minigame">Mini Game</Link>
        </Navigation>
        <MainContent>
          <Routes>
            <Route path="/" element={<h1>Welcome to Home Page</h1>} />
            <Route path="/minigame" element={<MiniGamePage />} />
            <Route path="/character" element={<CharacterPage />} />
            <Route path="/exchange" element={<ExchangePage />} />
          </Routes>
        </MainContent>
      </AppContainer>
    </Router>
  );
};

export default App;
