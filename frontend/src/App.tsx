import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProducerDashboard from './pages/ProducerDashboard';
import CartPage from './pages/CartPage';
import LibraryPage from './pages/LibraryPage';
import ProducerProfilePage from './pages/ProducerProfilePage';
import SuccessPage from './pages/checkout/SuccessPage';
import CancelPage from './pages/checkout/CancelPage';
import { AuthProvider } from './context/AuthContext'; // <--- Import
import { PlayerProvider } from './context/PlayerContext';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <PlayerProvider>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="dashboard" element={<ProducerDashboard />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="library" element={<LibraryPage />} />
            <Route path="p/:slug" element={<ProducerProfilePage />} />
            <Route path="checkout/success" element={<SuccessPage />} />
            <Route path="checkout/cancel" element={<CancelPage />} />
            <Route
              path="*"
              element={<div className="p-10 text-white">Page introuvable 404</div>}
            />
            </Route>
          </Routes>
        </PlayerProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;