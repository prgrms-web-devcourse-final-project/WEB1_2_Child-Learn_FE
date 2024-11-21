import { Route, Routes } from 'react-router-dom';
import LandingPage from '../../pages/LandingPage';
import HomePage from '../../pages/homePage';
import ArticlePage from '../../features/article/pages/articlepage';
import QuizPage from '../../features/beginner_chat/pages/quizpage';
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
      <Route path="/article" element={<ArticlePage />} /> {/* 경로 수정 */}
      <Route path="/quiz" element={<QuizPage />} />
      {/* 404 페이지 추가 */}
      <Route path="*" element={<div>Page not found</div>} />
    </Routes>
  );
}