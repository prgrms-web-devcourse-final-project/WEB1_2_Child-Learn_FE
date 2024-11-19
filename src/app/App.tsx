import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '../app/layout/Layout';
import Router from './router/Router';
import ArticlePage from '../features/article/pages/articlepage';
import QuizPage from '../features/beginner_chat/pages/quizpage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<ArticlePage />} />
          <Route path="/quiz" element={<QuizPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;