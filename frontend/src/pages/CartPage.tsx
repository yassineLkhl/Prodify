import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/order.service';
import { paymentService } from '../services/payment.service';

export default function CartPage() {
  const { items, removeFromCart, clearCart, total } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (items.length === 0) {
      setError('Votre panier est vide.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // 1. Créer l'Order
      const trackIds = items.map((item) => item.id);
      const order = await orderService.createOrder(trackIds);
      
      // 2. Initier le checkout Stripe (AVANT de vider le panier)
      const checkoutUrl = await paymentService.initiateCheckout(order.id);
      
      // 3. Vider le panier UNIQUEMENT si le checkout Stripe a réussi
      clearCart();
      
      // 4. Rediriger vers Stripe
      window.location.href = checkoutUrl;
    } catch (err: unknown) {
      // En cas d'erreur, on garde les items dans le panier pour que l'utilisateur puisse réessayer
      const errorMessage = err instanceof Error
        ? err.message
        : 'Erreur lors de la validation de la commande. Veuillez réessayer.';
      
      setError(errorMessage);
      setLoading(false);
      
      // Log l'erreur pour le debugging
      console.error('Erreur lors du checkout:', err);
    }
  };

  if (items.length === 0 && !success) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-10">
        <ShoppingCart className="mb-4 h-16 w-16 text-slate-600" />
        <h2 className="mb-2 text-2xl font-bold text-white">Votre panier est vide</h2>
        <p className="mb-6 text-slate-400">Ajoutez des tracks pour commencer vos achats.</p>
        <button
          onClick={() => navigate('/')}
          className="rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
        >
          Parcourir le catalogue
        </button>
      </div>
    );
  }

  return (
    <div className="px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Panier 🛒</h1>
        <p className="mt-2 text-gray-400">
          {items.length} {items.length === 1 ? 'track' : 'tracks'} dans votre panier
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-red-400">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Liste des items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((track) => (
              <div
                key={track.id}
                className="flex gap-4 rounded-xl border border-slate-800 bg-slate-900 p-4"
              >
                <img
                  src={track.coverImageUrl}
                  alt={track.title}
                  className="h-24 w-24 rounded-lg object-cover"
                />
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{track.title}</h3>
                    <p className="text-sm text-slate-400">
                      Prod. {track.producer?.displayName || 'Unknown'}
                    </p>
                    {track.genre && (
                      <p className="mt-1 text-xs text-slate-500">{track.genre}</p>
                    )}
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-lg font-semibold text-emerald-400">
                      {track.price.toFixed(2)} €
                    </span>
                    <button
                      onClick={() => removeFromCart(track.id)}
                      className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-red-400 transition-colors hover:bg-red-500/10"
                    >
                      <Trash2 size={16} />
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Résumé de commande */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="mb-4 text-xl font-bold text-white">Résumé</h2>
            <div className="mb-4 space-y-2">
              <div className="flex justify-between text-slate-400">
                <span>Sous-total ({items.length} {items.length === 1 ? 'track' : 'tracks'})</span>
                <span>{total.toFixed(2)} €</span>
              </div>
            </div>
            <div className="mb-6 border-t border-slate-800 pt-4">
              <div className="flex justify-between text-lg font-bold text-white">
                <span>Total</span>
                <span className="text-emerald-400">{total.toFixed(2)} €</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              disabled={loading || items.length === 0}
              className="w-full rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Redirection vers Stripe...' : 'Valider la commande'}
            </button>
            {!isAuthenticated && (
              <p className="mt-2 text-center text-xs text-slate-400">
                Vous devez être connecté pour valider la commande
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

