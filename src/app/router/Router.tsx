import { Route, Routes } from 'react-router-dom';
import LandingPage from '../../pages/LandingPage/index';
import HomePage from '../../pages/HomePage/index';

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<HomePage />} />
    </Routes>
  );
}
