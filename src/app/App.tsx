import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ArticlePage from '../features/article/pages/articlepage';
import './App.css'

function App() {
  const sampleArticle = {
    id: 1,
    title: "샘플 제목",
    content: "샘플 내용",
    mainImageUrl: "https://example.com/image.jpg",
    publishedDate: new Date().toISOString()
  };

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<ArticlePage />} />
    </Routes>
  </BrowserRouter>
);
}
export default App
