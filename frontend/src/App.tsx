import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProducerDashboard from './pages/ProducerDashboard';
import { AuthProvider } from './context/AuthContext'; // <--- Import

function App() {
  return (
    <AuthProvider> {/* <--- On englobe tout ici */}
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="dashboard" element={<ProducerDashboard />} />
          <Route path="*" element={<div className="text-white p-10">Page introuvable 404</div>} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;