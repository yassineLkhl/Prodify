import { Play, ShoppingCart, Check, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePlayer } from '../context/PlayerContext';
import { useCart } from '../context/CartContext';
import type { Track } from '../types/track';

interface TrackCardProps {
  track: Track;
  variant?: 'default' | 'library';
}

export default function TrackCard({ track, variant = 'default' }: TrackCardProps) {
  const { playTrack, currentTrack, isPlaying } = usePlayer();
  const { addToCart, isInCart } = useCart();
  const isActive = currentTrack?.id === track.id && isPlaying;
  const trackInCart = isInCart(track.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(track);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Ouvre le fichier audio dans un nouvel onglet
    // Optionnellement, on peut forcer le téléchargement avec download attribute
    window.open(track.audioUrl, '_blank');
  };

  const handleProducerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Navigation vers le profil du producteur (gérée par React Router Link)
  };

  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-lg transition transform hover:-translate-y-1 hover:shadow-slate-900/50">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={track.coverImageUrl}
          alt={track.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <button
          type="button"
          onClick={() => playTrack(track)}
          className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        >
          <span className="flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-emerald-400">
            <Play size={18} />
            {isActive ? 'Playing' : 'Play'}
          </span>
        </button>
      </div>

      <div className="space-y-1 px-4 py-3">
        <p className="text-xs uppercase tracking-wide text-emerald-400">
          {track.genre || 'Genre'}
          {track.bpm ? ` · ${track.bpm} BPM` : ''}
        </p>
        <h3 className="text-lg font-semibold text-white truncate">{track.title}</h3>
        
        {/* Nom producteur cliquable */}
        {track.producer?.slug ? (
          <Link
            to={`/p/${track.producer.slug}`}
            onClick={handleProducerClick}
            className="text-sm text-slate-400 hover:text-blue-400 transition-colors inline-block"
          >
            Prod. {track.producer?.displayName || 'Unknown'}
          </Link>
        ) : (
          <p className="text-sm text-slate-400">Prod. {track.producer?.displayName || 'Unknown'}</p>
        )}
        
        {/* Affichage différent selon la variante */}
        <div className="mt-2 flex items-center justify-between">
          {variant === 'default' ? (
            <>
              <p className="text-md font-semibold text-emerald-400">{track.price.toFixed(2)} €</p>
              <button
                onClick={handleAddToCart}
                disabled={trackInCart}
                className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
                title={trackInCart ? 'Déjà dans le panier' : 'Ajouter au panier'}
              >
                {trackInCart ? (
                  <>
                    <Check size={14} />
                    <span>Dans le panier</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart size={14} />
                    <span>Ajouter</span>
                  </>
                )}
              </button>
            </>
          ) : (
            // Variante library : bouton Télécharger
            <button
              onClick={handleDownload}
              className="ml-auto flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-700"
              title="Télécharger la track"
            >
              <Download size={14} />
              <span>Télécharger</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


