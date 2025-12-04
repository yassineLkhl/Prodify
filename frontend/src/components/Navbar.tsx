import { Link, useNavigate } from 'react-router-dom'; // Ajout useNavigate
import { Music, User, LogOut } from 'lucide-react'; // Ajout LogOut
import { useAuth } from '../context/AuthContext'; // Import du hook

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth(); // On récupère l'état
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <Link to="/" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
            <Music className="h-8 w-8 text-blue-500" />
            <span className="font-bold text-xl tracking-tight">Prodify</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-sm font-medium hover:text-blue-400 transition-colors">
              Espace Producteur
            </Link>
            
            <div className="h-6 w-px bg-slate-700 mx-2"></div>

            {/* LOGIQUE DYNAMIQUE ICI 👇 */}
            {isAuthenticated ? (
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Déconnexion
              </button>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium hover:text-white text-slate-300">
                  Connexion
                </Link>
                <Link 
                  to="/register" 
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  Inscription
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}