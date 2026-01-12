import { useState } from 'react';
import {
  Music,
  DollarSign,
  Activity,
  Tag,
  Smile,
  Image,
  FileAudio,
  FileText,
  Plus,
  X,
} from 'lucide-react';
import { trackService } from '../services/track.service';
import type { TrackRequest } from '../types/track';

export default function ProducerDashboard() {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<TrackRequest>({
    title: '',
    description: '',
    price: 0,
    bpm: undefined,
    genre: '',
    mood: '',
    coverImageUrl: '',
    audioUrl: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === 'price' || name === 'bpm'
          ? value === ''
            ? undefined
            : Number(value)
          : value,
    });
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await trackService.createTrack(formData);
      setSuccess(true);
      // Reset form
      setFormData({
        title: '',
        description: '',
        price: 0,
        bpm: undefined,
        genre: '',
        mood: '',
        coverImageUrl: '',
        audioUrl: '',
      });
      // Hide form after 2 seconds
      setTimeout(() => {
        setShowForm(false);
        setSuccess(false);
      }, 2000);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Erreur lors de la création de la track.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 text-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Espace Producteur 🎹</h1>
        <p className="text-gray-400">Gérez vos instrumentales ici.</p>
      </div>

      {!showForm ? (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          <Plus size={20} />
          Ajouter une nouvelle Track
        </button>
      ) : (
        <div className="max-w-2xl bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              Nouvelle Instrumentale
            </h2>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setError(null);
                setSuccess(false);
              }}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-500 p-3 rounded-lg mb-6 text-sm">
              Track créée avec succès ! 🎉
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-300">
                Titre <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Music className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                <input
                  name="title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Mon Beat Incroyable"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-300">
                Description
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Description de votre instrumentale..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-300">
                  Prix (€) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <input
                    name="price"
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price || ''}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="29.99"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-300">BPM</label>
                <div className="relative">
                  <Activity className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <input
                    name="bpm"
                    type="number"
                    min="60"
                    max="200"
                    value={formData.bpm || ''}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="140"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-300">Genre</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <input
                    name="genre"
                    type="text"
                    value={formData.genre}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Trap, Drill, Boombap..."
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-300">Mood</label>
                <div className="relative">
                  <Smile className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <input
                    name="mood"
                    type="text"
                    value={formData.mood}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Dark, Happy, Aggressive..."
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-300">
                URL de l'image de couverture <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Image className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                <input
                  name="coverImageUrl"
                  type="url"
                  required
                  value={formData.coverImageUrl}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/cover.jpg"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Entrez une URL valide (ex: lien image direct)
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-300">
                URL du fichier audio <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <FileAudio className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                <input
                  name="audioUrl"
                  type="url"
                  required
                  value={formData.audioUrl}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/track.mp3"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Entrez une URL valide (ex: lien MP3 direct)
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Création en cours...' : 'Créer la Track'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setError(null);
                  setSuccess(false);
                }}
                className="px-6 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}