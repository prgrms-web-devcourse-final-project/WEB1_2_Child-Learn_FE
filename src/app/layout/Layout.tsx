import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { useLocation } from 'react-router-dom';
import Header from '../../widgets/Header/index'; // Header 컴포넌트 import
import FloatingGNB from '../../widgets/Footer/index';

// 헤더를 숨길 페이지 경로들
const HIDDEN_HEADER_PATHS = [
  '/login',
  '/flip-card',
];

// GNB를 숨길 페이지 경로들
const HIDDEN_GNB_PATHS = [
  '/login',
  '/flip-card',
];


export const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  // 동적 경로를 처리하기 위한 조건
  const shouldShowHeader = !HIDDEN_HEADER_PATHS.some((path) =>
    location.pathname.startsWith(path)
  );
  const shouldShowGNB = !HIDDEN_GNB_PATHS.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <>
      <GlobalStyles />
      <AppWrapper>
        <AppContainer>
          {shouldShowHeader && <Header />}
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
    src: url('/font/NotoSansKR-Regular.woff') format('woff');
    font-weight: 400;
    unicode-range: U+1100-11FF, U+3130-318F, U+A960-A97F, U+AC00-D7AF, U+D7B0-D7FF;
  }

  @font-face {
    font-family: 'Noto Sans KR';
    src: url('/font/NotoSansKR-Medium.woff') format('woff');
    font-weight: 500;
    unicode-range: U+1100-11FF, U+3130-318F, U+A960-A97F, U+AC00-D7AF, U+D7B0-D7FF;
  }

  @font-face {
    font-family: 'Noto Sans KR';
    src: url('/font/NotoSansKR-Bold.woff') format('woff');
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
  -ms-overflow-style: none;  // IE and Edge
  scrollbar-width: none;  // Firefox
`;
