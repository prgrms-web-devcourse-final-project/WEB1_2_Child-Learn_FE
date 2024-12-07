import { Route, Routes } from 'react-router-dom';
import ArticlePage from '@/features/article/pages/articlepage';
import { LoginPage } from '@/pages/auth/login/LoginPage';
import { SignUpPage } from '@/pages/auth/signup/SignUpPage';
import GraphExplanationPage from '@/features/beginner_chart/ui/fast-navgation/fast-navigation';
import IntermediatePage from '@/pages/TradePages/IntermediateTradePage/IntermediatePage';
import MainPage from '@/pages/mainpage/MainPage';
import MiniGamePage from '@/pages/MiniGamePage/MiniGamePage';
import FlipCardGamePage from '@/pages/MiniGamePage/FlipCardGamePage/FlipCardGamePage';
import WordQuizGamePage from '@/pages/MiniGamePage/WordQuizGamePage/WordQuizGamePage';
import WordQuizResultPage from '@/pages/MiniGamePage/WordQuizGamePage/WordQuizResultPage';
import OXQuizGamePage from '@/pages/MiniGamePage/OXQuizGamePage/OXQuizGamePage';
import AvatarPage from '@/pages/AvatarPage/AvatarPage';
import AvatarDetailPage from '@/pages/AvatarPage/AvatarDetailPage';
import ExchangePage from '@/pages/exchangePage/ExchangePage';
import AccountRecoveryPage from '@/pages/auth/find-id-password/AccountRecoveryPage';
import AdvancedTradePage from '@/pages/TradePages/AdvancedTradePage/AdvancedTradePage';
import MyPage from '@/pages/myPage/MyPage';
import QuizGraphPage from '@/pages/TradePages/BeginnerTradePage/QuizGraphPage';
import { PublicRoute } from '@/app/router/PublicRoute';
import { PrivateRoute } from '@/app/router/PrivateRoute';
import SearchPage from '@/pages/searchPage/SearchPage';
import FriendPage from '@/pages/friendPage/FriendPage';
import LandingPage from '@/pages/LandingPage/LandingPage';

export default function Router() {
  return (
    <Routes>
      {/* Public Routes (로그인 불필요) */}
      <Route
        path="/"
        element={
          <PublicRoute restricted={true}>
            <LandingPage />
          </PublicRoute>
        }
      />
      <Route
        path="/auth/login"
        element={
          <PublicRoute restricted={true}>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/auth/signup"
        element={
          <PublicRoute restricted={true}>
            <SignUpPage />
          </PublicRoute>
        }
      />
      <Route
        path="/auth/find-id"
        element={
          <PublicRoute restricted={true}>
            <AccountRecoveryPage />
          </PublicRoute>
        }
      />

      {/* Private Routes (로그인 필요) */}
      <Route
        path="/main"
        element={
          <PrivateRoute>
            <MainPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/article"
        element={
          <PrivateRoute>
            <ArticlePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/minigame"
        element={
          <PrivateRoute>
            <MiniGamePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/flip-card/:difficulty"
        element={
          <PrivateRoute>
            <FlipCardGamePage />
          </PrivateRoute>
        }
      />
      {/* 게임 관련 라우트 */}
      <Route
        path="/word-quiz/:difficulty"
        element={
          <PrivateRoute>
            <WordQuizGamePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/word-quiz/result/:difficulty"
        element={
          <PrivateRoute>
            <WordQuizResultPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/ox-quiz/:difficulty"
        element={
          <PrivateRoute>
            <OXQuizGamePage />
          </PrivateRoute>
        }
      />
      {/* 아바타/프로필 관련 라우트 */}
      <Route
        path="/avatar"
        element={
          <PrivateRoute>
            <AvatarPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/avatar/details/:category/:product"
        element={
          <PrivateRoute>
            <AvatarDetailPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/mypage"
        element={
          <PrivateRoute>
            <MyPage />
          </PrivateRoute>
        }
      />

      {/* 차트/거래 관련 라우트 */}
      <Route
        path="/advanced"
        element={
          <PrivateRoute>
            <AdvancedTradePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/intermediate"
        element={
          <PrivateRoute>
            <IntermediatePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/fast-navigation"
        element={
          <PrivateRoute>
            <GraphExplanationPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/begin-stocks"
        element={
          <PrivateRoute>
            <QuizGraphPage />
          </PrivateRoute>
        }
      />

      {/* 기타 라우트 */}
      <Route
        path="/search"
        element={
          <PrivateRoute>
            <SearchPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/exchange"
        element={
          <PrivateRoute>
            <ExchangePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/friend"
        element={
          <PrivateRoute>
            <FriendPage />
          </PrivateRoute>
        }
      />
      {/* 404 페이지 */}
      <Route path="*" element={<div>Page not found</div>} />
    </Routes>
  );
}