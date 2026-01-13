import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProducerDashboard from './pages/ProducerDashboard';
import { AuthProvider } from './context/AuthContext'; // <--- Import
import { PlayerProvider } from './context/PlayerContext';

function App() {
  return (
    <AuthProvider>
      <PlayerProvider>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="dashboard" element={<ProducerDashboard />} />
            <Route
              path="*"
              element={<div className="p-10 text-white">Page introuvable 404</div>}
            />
          </Route>
        </Routes>
      </PlayerProvider>
    </AuthProvider>
  );
}

export default App;