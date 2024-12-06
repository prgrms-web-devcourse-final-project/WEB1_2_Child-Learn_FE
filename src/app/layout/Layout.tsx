import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { useLocation } from 'react-router-dom';
import Header from '@/widgets/Header/index';
import FloatingGNB from '@/widgets/Footer/index';
import { BackButton } from '@/widgets/BackButton/index';

// 헤더를 숨길 페이지 경로들
const HIDDEN_HEADER_PATHS = [
  /^\/avatar\/details\/[^/]+\/[^/]+$/,
  '/',
  '/auth/login',
  '/auth/signup',
  /^\/flip-card\/[^/]+$/,
  /^\/word-quiz\/[^/]+$/,
  /^\/word-quiz\/result\/[^/]+$/,
  '/exchange',
  '/fast-navigation',
  '/avatar',
  '/auth/find-id',
  '/notifications',
];

// GNB를 숨길 페이지 경로들
const HIDDEN_GNB_PATHS = [
  /^\/avatar\/details\/[^/]+\/[^/]+$/,
  '/',
  '/auth/login',
  '/auth/signup',
  /^\/flip-card\/[^/]+$/,
  /^\/word-quiz\/[^/]+$/,
  /^\/word-quiz\/result\/[^/]+$/,
  '/exchange',
  '/fast-navigation',
  '/avatar',
  '/auth/find-id',
  '/advanced',
  '/begin-stocks',
];

// BackButton만 표시할 페이지 경로들
const SHOW_BACK_BUTTON_PATHS = [
  /^\/flip-card\/[^/]+$/,
  /^\/word-quiz\/[^/]+$/,
  '/exchange',
  '/avatar',
  /^\/avatar\/details\/[^/]+\/[^/]+$/,
];

// BackButton을 숨길 페이지 경로 추가
const HIDDEN_BACK_BUTTON_PATHS = [/^\/word-quiz\/result\/[^/]+$/];

// 정확한 경로 매칭을 위한 함수
const isExactPath = (currentPath: string, targetPath: string | RegExp) => {
  if (typeof targetPath === 'string') {
    return (
      currentPath === targetPath ||
      (targetPath.startsWith('/auth/') && currentPath.startsWith(targetPath))
    );
  } else if (targetPath instanceof RegExp) {
    return targetPath.test(currentPath);
  }
  return false;
};

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  const shouldShowHeader = !HIDDEN_HEADER_PATHS.some((path) =>
    isExactPath(location.pathname, path)
  );

  const shouldShowGNB = !HIDDEN_GNB_PATHS.some((path) =>
    isExactPath(location.pathname, path)
  );

  const shouldShowBackButton =
    SHOW_BACK_BUTTON_PATHS.some((path) =>
      typeof path === 'string'
        ? location.pathname.startsWith(path)
        : path.test(location.pathname)
    ) &&
    !HIDDEN_BACK_BUTTON_PATHS.some((path) =>
      isExactPath(location.pathname, path)
    );

  return (
    <>
      <GlobalStyles />
      <AppWrapper>
        <AppContainer>
          {shouldShowHeader && <Header />}
          {!shouldShowHeader && shouldShowBackButton && <BackButton />}
          <ScrollContainer>{children}</ScrollContainer>
          {shouldShowGNB && <FloatingGNB />}
        </AppContainer>
      </AppWrapper>
    </>
  );
};
const GlobalStyles = createGlobalStyle`
  /* Roboto 폰트 설정 - 영어, 숫자, 기호용 */
  @font-face {
    font-family: 'Roboto';
    src: url('/font/Roboto-Regular.woff') format('woff');
    font-weight: 400;
  }

  @font-face {
    font-family: 'Roboto';
    src: url('/font/Roboto-Medium.woff') format('woff');
    font-weight: 500;
  }

  @font-face {
    font-family: 'Roboto';
    src: url('/font/Roboto-Bold.woff') format('woff');
    font-weight: 700;
  }

  /* Noto Sans KR 폰트 설정 - 한글용 */
  @font-face {
    font-family: 'Noto Sans KR';
    src: url('/font/NotoSansKR-Light.woff') format('woff');
    font-weight: 400;
    unicode-range: U+1100-11FF, U+3130-318F, U+A960-A97F, U+AC00-D7AF, U+D7B0-D7FF;
  }

  @font-face {
    font-family: 'Noto Sans KR';
    src: url('/font/NotoSansKR-Regular.woff') format('woff');
    font-weight: 500;
    unicode-range: U+1100-11FF, U+3130-318F, U+A960-A97F, U+AC00-D7AF, U+D7B0-D7FF;
  }

  @font-face {
    font-family: 'Noto Sans KR';
    src: url('/font/NotoSansKR-SemiBold.woff') format('woff');
    font-weight: 700;
    unicode-range: U+1100-11FF, U+3130-318F, U+A960-A97F, U+AC00-D7AF, U+D7B0-D7FF;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    height: 100%;
  }

  body {
    margin: 0;
    padding: 0;
    /* 여기 font-family 순서 중요합니다 */
    font-family: 'Roboto', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif;
    background-color: #f0f0f0;
    color: black;
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #root {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  @media screen and (max-width: 390px) {
    html {
      font-size: 14px;
    }
  }

  /* Toast 컨테이너 위치 설정 */
  .Toastify__toast-container {
    width: auto !important;
    max-width: 350px !important;
    top: 1rem !important;
    left: 50% !important;
    transform: translateX(-50%) !important;
    padding: 0 !important;
  }

  /* 공통 Toast 스타일 */
  .Toastify__toast {
    margin: 0 auto !important;
    min-height: unset !important;
    padding: 16px 24px !important;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
    font-family: 'Roboto', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif !important;
    border-radius: 8px !important;
    text-align: center !important;
    justify-content: center !important;
  }

  /* Toast 내부 컨텐츠 스타일 */
  .Toastify__toast-body {
    padding: 0 !important;
    margin: 0 !important;
    text-align: center !important;
    justify-content: center !important;
    flex: none !important;
  }

  /* 불필요한 요소 제거 */
  .Toastify__toast-icon,
  .Toastify__close-button {
    display: none !important;
  }

  /* 타입별 배경색 설정 */
  .Toastify__toast--error {
    background-color: #ef4444 !important;
    color: white !important;
  }

  .Toastify__toast--success {
    background-color: #10b981 !important;
    color: white !important;
  }

  .Toastify__toast--info {
    background-color: #3b82f6 !important;
    color: white !important;
  }

  /* 나타나는 애니메이션 */
  .Toastify__toast-enter {
    transform: translateY(-150%) !important;
  }

  .Toastify__toast-enter-active {
    transform: translateY(0) !important;
    transition: transform 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) !important;
  }

  /* 사라지는 애니메이션 */
  .Toastify__toast-exit {
    transform: translateY(0) !important;
  }

  .Toastify__toast-exit-active {
    transform: translateY(-150%) !important;
    transition: transform 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) !important;
  }

`;

const AppWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
`;

const AppContainer = styled.div`
  width: 100%;
  max-width: 390px;
  height: 844px;
  background-color: white;
  border: 1px solid #ccc;
  overflow: hidden; /* overflow-y: auto 대신 hidden으로 변경 */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  position: relative;
  display: flex;
  flex-direction: column;

  @media screen and (max-width: 390px) {
    width: 100%;
    height: 100vh;
    border: none;
  }

  @media screen and (max-height: 844px) {
    height: 100vh;
  }
`;

// 새로운 스크롤 컨테이너 추가
const ScrollContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  height: 0;
  -webkit-overflow-scrolling: touch;

  // 스크롤바 숨기기
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; // IE and Edge
  scrollbar-width: none; // Firefox
`;
