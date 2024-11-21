import { Route, Routes } from 'react-router-dom';
import LandingPage from '../../pages/LandingPage/index';
import HomePage from '../../pages/HomePage/index';
import MiniGamePage from '../../pages/MiniGamePage/MiniGamePage';
import FlipCardGamePage from '../../pages/MiniGamePage/FlipCardGamePage/FlipCardGamePage';
import CharacterPage from '../../pages/characterPage/CharacterPage';
import ExchangePage from '../../pages/exchangePage/ExchangePage';

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/minigame" element={<MiniGamePage />} />
      <Route path="/flip-card/:level" element={<FlipCardGamePage />} />
      <Route path="/character" element={<CharacterPage />} />
      <Route path="/exchange" element={<ExchangePage />} />
    </Routes>
  );
}
