import { Route, Routes } from 'react-router-dom';
import LandingPage from '../../pages/LandingPage/LandingPage';
import HomePage from '../../pages/HomePage/HompPage';
import ArticlePage from '../../features/article/pages/articlepage';
import QuizPage from '../../features/beginner_chat/ui/quizpage';
import { LoginPage } from '@/pages/auth/login/LoginPage';
import GraphExplanationPage from '../../features/beginner_chat/ui/fast-navgation/fast-navigation';

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/article" element={<ArticlePage />} /> 
      <Route path="/fast-navigation" element={<GraphExplanationPage />} />
      <Route path="/quiz" element={<QuizPage />} />
      <Route path="*" element={<div>Page not found</div>} />
      <Route path="/auth/login" element={<LoginPage />} />
    </Routes>
  );
}
