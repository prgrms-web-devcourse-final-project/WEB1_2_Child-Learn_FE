import { Route, Routes } from 'react-router-dom';
import LandingPage from '../../pages/LandingPage/LandingPage';
import ArticlePage from '../../features/article/pages/articlepage';
import QuizPage from '../../features/beginner_chat/ui/quiz-widget/quizpage';
import { LoginPage } from '@/pages/auth/login/LoginPage';
import { SignUpPage } from '@/pages/auth/signup/SignUpPage';
<<<<<<< HEAD
import GraphExplanationPage from '../../features/beginner_chat/ui/fast-navgation/fast-navigation';
import IntermediatePage from '../../pages/TradePages/IntermediateTradePage/IntermediatePage';
=======
import MainPage from '@/pages/mainpage/MainPage';
>>>>>>> origin/develop

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
<<<<<<< HEAD
      <Route path="/home" element={<HomePage />} />
      <Route path="/article" element={<ArticlePage />} /> 
      <Route path="/fast-navigation" element={<GraphExplanationPage />} />
=======
      <Route path="/main" element={<MainPage />} />
      <Route path="/article" element={<ArticlePage />} /> {/* 경로 수정 */}
>>>>>>> origin/develop
      <Route path="/quiz" element={<QuizPage />} />
      <Route path="/intermediate" element={<IntermediatePage />} />
      <Route path="*" element={<div>Page not found</div>} />
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/signup" element={<SignUpPage />} />
    </Routes>
  );
}
