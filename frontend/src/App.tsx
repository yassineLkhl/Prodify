import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProducerDashboard from './pages/ProducerDashboard';

function App() {
  return (
    <Routes>
      {/* Route Parent : Le Layout global */}
      <Route path="/" element={<MainLayout />}>
        
        {/* Routes Enfants (qui s'affichent dans l'Outlet) */}
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="dashboard" element={<ProducerDashboard />} />
        
        {/* Route 404 (Catch-all) */}
        <Route path="*" element={<div className="text-white p-10">Page introuvable 404</div>} />
        
      </Route>
    </Routes>
  );
}

export default App;