import { Routes, Route } from 'react-router-dom';
import LandingPage from '../../pages/LandingPage';
import HomePage from '../../pages/homePage';
import ArticlePage from '../../features/article/pages/articlepage';
import QuizPage from '../../features/beginner_chat/ui/quizpage';
import GraphExplanationPage from '../../features/beginner_chat/ui/fast-navgation/fast-navigation'

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/article" element={<ArticlePage />} /> 
      <Route path="/fast-navigation" element={<GraphExplanationPage />} />
      <Route path="/quiz" element={<QuizPage />} />
      <Route path="*" element={<div>Page not found</div>} />
    </Routes>
  );
}