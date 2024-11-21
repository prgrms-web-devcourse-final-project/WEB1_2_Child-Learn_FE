import { Route, Routes } from 'react-router-dom';
import LandingPage from '../../pages/LandingPage';
import HomePage from '../../pages/HomePage/index';
import ArticlePage from '../../features/article/pages/articlepage';
import QuizPage from '../../features/beginner_chat/pages/quizpage';
import { LoginPage } from '@/pages/auth/login/LoginPage';

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/article" element={<ArticlePage />} /> {/* 경로 수정 */}
      <Route path="/quiz" element={<QuizPage />} />
      {/* 404 페이지 추가 */}
      <Route path="*" element={<div>Page not found</div>} />
      <Route path="/auth/login" element={<LoginPage />} />
    </Routes>
  );
}
