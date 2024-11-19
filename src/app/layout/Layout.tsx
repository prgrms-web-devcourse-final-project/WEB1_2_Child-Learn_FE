import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <GlobalStyles />
      <AppWrapper>
        <AppContainer>{children}</AppContainer>
      </AppWrapper>
    </>
  );
};

const GlobalStyles = createGlobalStyle`
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
    font-family: 'Arial', sans-serif;
    background-color: #f0f0f0;
    color: black;
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
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
  width: 390px;
  height: 844px;
  background-color: white;
  border: 1px solid #ccc;
  overflow-y: auto;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  position: relative;

  @media screen and (max-width: 390px) {
    width: 100%;
    height: 100vh;
    border: none;
  }

  @media screen and (max-height: 844px) {
    height: 100vh;
  }
`;
