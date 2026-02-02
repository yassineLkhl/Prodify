import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import AudioPlayer from './AudioPlayer';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* 1. La barre de navigation fixe en haut */}
      <Navbar />

      {/* 2. Le contenu changeant de la page */}
      <main className="pb-28">
        <Outlet />
      </main>

      <AudioPlayer />
    </div>
  );
}
