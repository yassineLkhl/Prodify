import { useState, useEffect } from 'react';
import {
  Music,
  DollarSign,
  Activity,
  Tag,
  Smile,
  FileText,
  Plus,
  X,
  Trash2,
  Pencil,
} from 'lucide-react';
import { trackService } from '../services/track.service';
import { useAuth } from '../context/AuthContext';
import type { TrackRequest, Track } from '../types/track';
import FileUpload from '../components/ui/FileUpload';

export default function ProducerDashboard() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string>("");
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loadingTracks, setLoadingTracks] = useState(false);
  const [deletingTrackId, setDeletingTrackId] = useState<string | null>(null);
  const [editingTrackId, setEditingTrackId] = useState<string | null>(null);

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

  // Charger les tracks du producteur au montage
  useEffect(() => {
    const loadTracks = async () => {
      // Vérifier si l'utilisateur est producteur
      if (!user || !user.producerId) {
        setError('Vous devez être producteur pour accéder à cette page.');
        setLoadingTracks(false);
        return;
      }

      try {
        setLoadingTracks(true);
        const producerTracks = await trackService.getTracksByProducer(user.producerId);
        setTracks(producerTracks);
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : 'Erreur lors du chargement des données.'
        );
      } finally {
        setLoadingTracks(false);
      }
    };

    loadTracks();
  }, [user]);

  // Fonction pour rafraîchir la liste des tracks
  const refreshTracks = async () => {
    if (!user || !user.producerId) return;
    try {
      const producerTracks = await trackService.getTracksByProducer(user.producerId);
      setTracks(producerTracks);
    } catch (err: unknown) {
      console.error('Erreur lors du rafraîchissement:', err);
    }
  };

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
    setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (editingTrackId) { 
        // Mise à jour d'une track existante
        await trackService.updateTrack(editingTrackId, formData);
        setSuccess("Instrumentale mise à jour avec succès !");
      } else {
        // Création d'une nouvelle track
        await trackService.createTrack(formData);
        setSuccess("Instrumentale créée avec succès !");
      }

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
      setEditingTrackId(null);

      // Rafraîchir la liste des tracks
      await refreshTracks();

      // Hide form after 2 seconds
      setTimeout(() => {
        setShowForm(false);
        setSuccess("");
      }, 2000);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erreur lors de l\'opération.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEditTrack = (track: Track) => {
    // Remplir le formulaire avec les données de la track
    setFormData({
      title: track.title,
      description: track.description || '',
      price: track.price,
      bpm: track.bpm || undefined,
      genre: track.genre || '',
      mood: track.mood || '',
      coverImageUrl: track.coverImageUrl,
      audioUrl: track.audioUrl,
    });
    setEditingTrackId(track.id);
    setShowForm(true);

    // Scroll vers le formulaire
    setTimeout(() => {
      document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  };

  const handleCancelEdit = () => {
    // Réinitialiser le formulaire
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
    setEditingTrackId(null);
    setShowForm(false);
    setError(null);
    setSuccess("");
  };

  const handleDeleteTrack = async (trackId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette track ?')) {
      return;
    }

    setDeletingTrackId(trackId);
    try {
      await trackService.deleteTrack(trackId);
      // Rafraîchir la liste des tracks
      await refreshTracks();
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Erreur lors de la suppression de la track.'
      );
    } finally {
      setDeletingTrackId(null);
    }
  };

  return (
    <div className="p-8 text-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Espace Producteur 🎹</h1>
        <p className="text-gray-400">Gérez vos instrumentales ici.</p>
      </div>

      {error && !showForm && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      {!user || !user.producerId ? (
        <div className="bg-yellow-500/10 border border-yellow-500/50 text-yellow-500 p-4 rounded-lg">
          Vous devez être producteur pour accéder à cette page. Veuillez créer un profil producteur.
        </div>
      ) : !showForm ? (
        <>
          <div className="mb-6">
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              <Plus size={20} />
              Ajouter une nouvelle Track
            </button>
          </div>

          {/* Liste des tracks */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-slate-800">
              <h2 className="text-xl font-bold">Mes Tracks ({tracks.length})</h2>
            </div>

            {loadingTracks ? (
              <div className="p-8 text-center text-slate-400">
                Chargement...
              </div>
            ) : tracks.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                Aucune track pour le moment. Créez votre première track !
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-800/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                        Image
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                        Titre
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                        Prix
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-medium text-slate-300">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {tracks.map((track) => (
                      <tr
                        key={track.id}
                        className="hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          {track.coverImageUrl ? (
                            <img
                              src={track.coverImageUrl}
                              alt={track.title}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center">
                              <Music className="h-6 w-6 text-slate-500" />
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium">{track.title}</div>
                          {track.genre && (
                            <div className="text-sm text-slate-400">
                              {track.genre}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-blue-400">
                            {track.price.toFixed(2)} €
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleEditTrack(track)}
                              className="inline-flex items-center gap-2 px-3 py-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors"
                              title="Modifier cette track"
                            >
                              <Pencil size={18} />
                              <span className="hidden sm:inline">Modifier</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteTrack(track.id)}
                              disabled={deletingTrackId === track.id}
                              className="inline-flex items-center gap-2 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Trash2 size={18} />
                              {deletingTrackId === track.id ? 'Suppression...' : 'Supprimer'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="max-w-2xl bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              {editingTrackId ? 'Modifier l\'Instrumentale' : 'Nouvelle Instrumentale'}
            </h2>
            <button
              type="button"
              onClick={() => handleCancelEdit()}
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
              {success}
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

            <FileUpload
              label="Image de couverture"
              accept="image/*"
              onFileSelect={(url) => {
                setFormData({ ...formData, coverImageUrl: url });
              }}
              currentUrl={formData.coverImageUrl}
            />

            <FileUpload
              label="Fichier audio"
              accept="audio/*"
              onFileSelect={(url) => {
                setFormData({ ...formData, audioUrl: url });
              }}
              currentUrl={formData.audioUrl}
            />

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? editingTrackId
                    ? 'Mise à jour en cours...'
                    : 'Création en cours...'
                  : editingTrackId
                  ? 'Mettre à jour la Track'
                  : 'Créer la Track'}
              </button>
              <button
                type="button"
                onClick={() => handleCancelEdit()}
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