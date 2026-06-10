import React, { useEffect, useState } from 'react';

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    function onToast(e) {
      const t = { id: Date.now() + Math.random(), ...e.detail };
      setToasts((s) => [...s, t]);
      setTimeout(() => {
        setToasts((s) => s.filter(x => x.id !== t.id));
      }, t.duration || 3500);
    }

    window.addEventListener('fastpaisa:toast', onToast);
    return () => window.removeEventListener('fastpaisa:toast', onToast);
  }, []);

  return (
    <div className="fixed right-4 top-6 z-60 flex flex-col gap-3">
      {toasts.map((t) => (
        <div key={t.id} className={`min-w-[220px] max-w-sm px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${t.type === 'error' ? 'bg-red-600 text-white' : 'bg-slate-800 text-white border border-slate-700'}`}>
          {t.message}
        </div>
      ))}
    </div>
  );
}
