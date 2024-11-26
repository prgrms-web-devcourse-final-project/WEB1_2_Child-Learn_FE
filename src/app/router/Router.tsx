import { Route, Routes } from 'react-router-dom';
import LandingPage from '../../pages/LandingPage/LandingPage';
import ArticlePage from '../../features/article/pages/articlepage';
import QuizPage from '../../features/beginner_chat/ui/quiz-widget/quizpage';
import { LoginPage } from '@/pages/auth/login/LoginPage';
import { SignUpPage } from '@/pages/auth/signup/SignUpPage';
import GraphExplanationPage from '../../features/beginner_chat/ui/fast-navgation/fast-navigation';
import IntermediatePage from '../../pages/TradePages/IntermediateTradePage/IntermediatePage';
import MainPage from '@/pages/mainpage/MainPage';
import MiniGamePage from '../../pages/MiniGamePage/MiniGamePage';
import FlipCardGamePage from '../../pages/MiniGamePage/FlipCardGamePage/FlipCardGamePage';
import WordQuizGamePage from '../../pages/MiniGamePage/WordQuizGamePage/WordQuizGamePage';
import WordQuizResultPage from '../../pages/MiniGamePage/WordQuizGamePage/WordQuizResultPage';
import AvatarPage from '../../pages/AvatarPage/AvatarPage';
import ExchangePage from '../../pages/exchangePage/ExchangePage';


export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/article" element={<ArticlePage />} /> 
      <Route path="/fast-navigation" element={<GraphExplanationPage />} />
      <Route path="/" element={<LoginPage />} />
      <Route path="/main" element={<MainPage />} />
      <Route path="/minigame" element={<MiniGamePage />} />
      <Route path="/flip-card/:level" element={<FlipCardGamePage />} />
      <Route path="/word-quiz/:level" element={<WordQuizGamePage />} />
      <Route path="/word-quiz/result/:level" element={<WordQuizResultPage />} />
      <Route path="/avatar" element={<AvatarPage />} />
      <Route path="/exchange" element={<ExchangePage />} />
      <Route path="/article" element={<ArticlePage />} /> {/* 경로 수정 */}
      <Route path="/quiz" element={<QuizPage />} />
      <Route path="/intermediate" element={<IntermediatePage />} />
      <Route path="*" element={<div>Page not found</div>} />
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/signup" element={<SignUpPage />} />
    </Routes>
  );
}
