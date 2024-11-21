import { Route, Routes } from 'react-router-dom';
import LandingPage from '../../pages/LandingPage/index';
import HomePage from '../../pages/HomePage/index';
import { LoginPage } from '@/pages/auth/login/LoginPage';

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/auth/login" element={<LoginPage />} />
    </Routes>
  );
}
