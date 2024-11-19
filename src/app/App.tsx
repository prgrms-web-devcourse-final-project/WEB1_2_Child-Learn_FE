import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ArticlePage from '../features/article/pages/articlepage';
import QuizPage from './features/Beginner_chat/pages/QuizPage';
import './App.css'

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<ArticlePage />} />
      <Route path="/quiz" element={<QuizPage />} />
    </Routes>
  </BrowserRouter>
);
}
export default App
