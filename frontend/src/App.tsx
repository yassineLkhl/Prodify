function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center flex-col gap-4">
      <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
        Prodify Frontend 🚀
      </h1>
      <p className="text-slate-400">
        Si tu vois ce texte stylisé, Tailwind fonctionne !
      </p>
      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-semibold">
        Bouton Test
      </button>
    </div>
  )
}

export default App