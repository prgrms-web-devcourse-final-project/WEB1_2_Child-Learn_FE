import { Route, Routes } from 'react-router-dom';
import LandingPage from '../../pages/LandingPage';
import HomePage from '../../pages/homePage';
import ArticlePage from '../../features/article/pages/articlepage';
import QuizPage from '../../features/beginner_chat/pages/quizpage';

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/" element={<ArticlePage />} />
      <Route path="/quiz" element={<QuizPage />} />
    </Routes>
  );
}
