import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Music } from 'lucide-react';
import TrackCard from '../components/TrackCard';
import { producerService } from '../services/producer.service';
import { trackService } from '../services/track.service';
import type { Producer, Track } from '../types/track';

export default function ProducerProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const [producer, setProducer] = useState<Producer | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setError('Slug du producteur non spécifié');
      setLoading(false);
      return;
    }

    const loadProducerData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Charger le producteur et ses tracks en parallèle
        const [producerData, tracksData] = await Promise.all([
          producerService.getProducerBySlug(slug),
          trackService.getTracksByProducerSlug(slug),
        ]);

        setProducer(producerData);
        setTracks(tracksData);
      } catch (err) {
        console.error('Erreur lors du chargement du profil producteur :', err);
        setError('Producteur non trouvé ou erreur lors du chargement.');
      } finally {
        setLoading(false);
      }
    };

    loadProducerData();
  }, [slug]);

  // État Chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  // État Erreur
  if (error || !producer) {
    return (
      <div className="min-h-screen bg-slate-950 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/"
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6"
          >
            <ArrowLeft size={20} />
            Retour au catalogue
          </Link>
          
          <div className="flex items-center justify-center h-96">
            <div className="text-center p-8 rounded-lg bg-red-950/50 border border-red-800 max-w-md">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-3" />
              <p className="text-red-400 font-medium text-lg">
                {error || 'Producteur non trouvé'}
              </p>
              <p className="text-red-300 text-sm mt-2">
                Vérifiez l'URL et réessayez.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header avec Bannière */}
      <div className="relative">
        {/* Bannière dégradée */}
        <div className="h-48 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
          <div className="absolute inset-0 opacity-30 bg-pattern" />
        </div>

        {/* Contenu du Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end gap-6 pb-8 -mt-24 relative z-10">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="h-32 w-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-4 border-slate-950 flex items-center justify-center shadow-xl">
                <Music className="h-16 w-16 text-white" />
              </div>
            </div>

            {/* Infos Producteur */}
            <div className="flex-1 pb-2">
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">
                {producer.displayName}
              </h1>
              {producer.slug && (
                <p className="text-slate-400 text-sm mb-3">@{producer.slug}</p>
              )}
              {producer.bio && (
                <p className="text-slate-300 text-base max-w-2xl">
                  {producer.bio}
                </p>
              )}
            </div>

            {/* Bouton Retour */}
            <Link
              to="/"
              className="mb-2 flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
              title="Retour au catalogue"
            >
              <ArrowLeft size={18} />
              <span className="hidden sm:inline">Retour</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Body : Grille des Tracks */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {tracks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Music className="h-16 w-16 text-slate-600 mb-4 opacity-50" />
            <p className="text-slate-400 text-lg font-medium">
              Pas encore d'instrumentales publiées
            </p>
            <p className="text-slate-500 text-sm mt-2">
              {producer.displayName} prépare quelque chose de spécial...
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-white mb-6">
              Instrumentales ({tracks.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {tracks.map((track) => (
                <TrackCard key={track.id} track={track} variant="default" />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
