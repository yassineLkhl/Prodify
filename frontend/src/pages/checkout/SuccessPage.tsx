import { useNavigate } from 'react-router-dom';
import { CheckCircle, Home } from 'lucide-react';

export default function SuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-10">
      <div className="mb-6 rounded-full bg-emerald-500/20 p-4">
        <CheckCircle className="h-16 w-16 text-emerald-400" />
      </div>
      <h1 className="mb-2 text-3xl font-bold text-white">Paiement réussi ! 🎉</h1>
      <p className="mb-8 text-center text-lg text-slate-400">
        Merci pour votre achat. Vos tracks sont maintenant disponibles dans votre bibliothèque.
      </p>
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
      >
        <Home className="h-5 w-5" />
        Retour au catalogue
      </button>
    </div>
  );
}
