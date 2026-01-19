import { useNavigate } from 'react-router-dom';
import { XCircle, ShoppingCart } from 'lucide-react';

export default function CancelPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-10">
      <div className="mb-6 rounded-full bg-yellow-500/20 p-4">
        <XCircle className="h-16 w-16 text-yellow-400" />
      </div>
      <h1 className="mb-2 text-3xl font-bold text-white">Paiement annulé</h1>
      <p className="mb-8 text-center text-lg text-slate-400">
        Votre paiement a été annulé. Aucun montant n'a été débité.
      </p>
      <button
        onClick={() => navigate('/cart')}
        className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
      >
        <ShoppingCart className="h-5 w-5" />
        Retour au panier
      </button>
    </div>
  );
}

