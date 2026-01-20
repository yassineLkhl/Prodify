import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LibraryBig, AlertCircle } from 'lucide-react';
import TrackCard from '../components/TrackCard';
import { useAuth } from '../context/AuthContext';
import { getPurchasedTracks } from '../services/library.service';
import type { Track } from '../types/track';

export default function LibraryPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Si pas connecté, rediriger vers login
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Charger les tracks achetées
    const loadLibrary = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getPurchasedTracks();
        setTracks(data);
      } catch (err) {
        console.error('Erreur lors du chargement de la bibliothèque :', err);
        setError('Impossible de charger votre bibliothèque. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };

    loadLibrary();
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <LibraryBig className="h-8 w-8 text-blue-500" />
            <h1 className="text-4xl font-bold text-white">Ma Bibliothèque</h1>
          </div>
          <p className="text-slate-400 text-lg">
            Retrouvez toutes vos instrumentales achetées
          </p>
        </div>

        {/* État Chargement */}
        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-slate-400">Chargement de votre bibliothèque...</p>
            </div>
          </div>
        )}

        {/* État Erreur */}
        {error && !loading && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center p-6 rounded-lg bg-red-950/50 border border-red-800 max-w-md">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
              <p className="text-red-400 font-medium">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Réessayer
              </button>
            </div>
          </div>
        )}

        {/* État Vide */}
        {!loading && !error && tracks.length === 0 && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <LibraryBig className="h-16 w-16 text-slate-600 mx-auto mb-4 opacity-50" />
              <p className="text-slate-400 text-lg font-medium">
                Vous n'avez pas encore acheté d'instrumentale
              </p>
              <p className="text-slate-500 text-sm mt-2">
                Explorez notre catalogue et trouvez l'instrumentale parfaite pour votre projet
              </p>
              <button
                onClick={() => navigate('/')}
                className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Découvrir les instrumentales
              </button>
            </div>
          </div>
        )}

        {/* Grille des Tracks */}
        {!loading && !error && tracks.length > 0 && (
          <>
            <p className="text-slate-400 mb-6 text-sm">
              {tracks.length} instrumentale{tracks.length > 1 ? 's' : ''} dans votre bibliothèque
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {tracks.map((track) => (
                <TrackCard key={track.id} track={track} variant="library" />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
