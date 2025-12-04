import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* 1. La barre de navigation fixe en haut */}
      <Navbar />

      {/* 2. Le contenu changeant de la page */}
      <main>
        <Outlet />
      </main>

      {/* (Optionnel) Ici, on mettra le Player Audio fixe plus tard */}
    </div>
  );
}