import { useState, useEffect } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';
import type { TrackSearchCriteria } from '../types/track';

interface TrackFiltersProps {
  onSearch: (criteria: TrackSearchCriteria) => void;
  isLoading?: boolean;
}

const GENRES = [
  'Trap',
  'Drill',
  'Boombap',
  'Lofi',
  'Boom Bap',
  'Hip Hop',
  'Trap Latin',
  'UK Drill',
];
const MOODS = ['Dark', 'Happy', 'Aggressive', 'Chill', 'Energetic', 'Melancholic', 'Uplifting'];

export default function TrackFilters({ onSearch, isLoading = false }: TrackFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // État local pour chaque champ
  const [titleInput, setTitleInput] = useState('');
  const [genre, setGenre] = useState('');
  const [mood, setMood] = useState('');
  const [minBpm, setMinBpm] = useState('');
  const [maxBpm, setMaxBpm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Debouncer le titre (500ms)
  const debouncedTitle = useDebounce(titleInput, 500);

  // Construire les critères de recherche
  const criteria: TrackSearchCriteria = {
    title: debouncedTitle || undefined,
    genre: genre || undefined,
    mood: mood || undefined,
    minBpm: minBpm ? Number(minBpm) : undefined,
    maxBpm: maxBpm ? Number(maxBpm) : undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
  };

  // Auto-search : déclencher la recherche quand les critères changent
  useEffect(() => {
    onSearch(criteria);
  }, [debouncedTitle, genre, mood, minBpm, maxBpm, minPrice, maxPrice]);

  const handleReset = () => {
    setTitleInput('');
    setGenre('');
    setMood('');
    setMinBpm('');
    setMaxBpm('');
    setMinPrice('');
    setMaxPrice('');
  };

  const hasActiveFilters = titleInput || genre || mood || minBpm || maxBpm || minPrice || maxPrice;

  return (
    <div className="mb-6">
      {/* Header avec toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mb-3 flex w-full items-center justify-between rounded-lg border border-slate-700 bg-slate-900/70 px-4 py-2.5 text-white hover:bg-slate-800/70 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Search size={18} className="text-slate-400" />
          <span className="text-sm font-semibold">
            Filtres{' '}
            {hasActiveFilters &&
              `(${[titleInput, genre, mood, minBpm, maxBpm, minPrice, maxPrice].filter(Boolean).length})`}
          </span>
        </div>
        <ChevronDown
          size={18}
          className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Panneau des filtres */}
      {isExpanded && (
        <div className="space-y-3 rounded-lg border border-slate-700 bg-slate-900/50 p-4">
          {/* Grid responsive : 1 colonne sur mobile, 4 colonnes sur desktop */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
            {/* Titre */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Titre</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-600" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded py-1.5 pl-8 pr-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Genre */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Genre</label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded py-1.5 px-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Tous</option>
                {GENRES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            {/* Mood */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Ambiance</label>
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded py-1.5 px-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Toutes</option>
                {MOODS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Spacer (vide sur la 4ème colonne si pas de bouton) */}
            <div className="hidden lg:block" />
          </div>

          {/* Deuxième rangée : BPM et Prix */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-4">
            {/* BPM Min */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">BPM Min</label>
              <input
                type="number"
                placeholder="60"
                min="0"
                max="300"
                value={minBpm}
                onChange={(e) => setMinBpm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded py-1.5 px-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* BPM Max */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">BPM Max</label>
              <input
                type="number"
                placeholder="200"
                min="0"
                max="300"
                value={maxBpm}
                onChange={(e) => setMaxBpm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded py-1.5 px-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Prix Min */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Prix Min (€)</label>
              <input
                type="number"
                placeholder="0"
                min="0"
                step="0.01"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded py-1.5 px-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Prix Max */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Prix Max (€)</label>
              <input
                type="number"
                placeholder="100"
                min="0"
                step="0.01"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded py-1.5 px-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Bouton Réinitialiser (si des filtres actifs) */}
          {hasActiveFilters && (
            <div className="pt-2 border-t border-slate-700">
              <button
                onClick={handleReset}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 w-full px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded transition-colors"
              >
                <X size={16} />
                Réinitialiser les filtres
              </button>
            </div>
          )}

          {/* Indicateur de recherche en cours */}
          {isLoading && (
            <div className="text-xs text-slate-400 text-center animate-pulse">
              Recherche en cours...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
