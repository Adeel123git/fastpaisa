import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Bell, User, LogOut, CheckCircle } from 'lucide-react';

const Header = () => {
  const { user } = useApp();
  const { logout, balance } = useApp();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-secondary border-b border-slate-800 z-50 flex items-center px-4 justify-between">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-primary/20">
          FP
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-100 leading-none">FastPaisa</h1>
          <p className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">Investment Pro</p>
        </div>
      </div>
      
        <div className="flex items-center gap-3">
        <button className="relative p-2 text-slate-400 hover:text-slate-100 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-secondary"></span>
        </button>
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-slate-200">{user?.username || 'Guest'}</p>
            <p className="text-[10px] text-accent font-medium">Verified Account</p>
          </div>
          <div className="relative" ref={ref}>
            <button onClick={() => setOpen(v => !v)} className="w-9 h-9 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700 hover:scale-105 transition-transform">
              <User className="w-5 h-5 text-slate-400" />
            </button>

            {open && (
              <div className="absolute right-0 mt-3 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-3 z-50">
                <div className="flex items-center gap-3 p-2 border-b border-slate-800 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold">{(user?.username || 'G').charAt(0).toUpperCase()}</div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-100">{user?.username || 'Guest'}</p>
                    <p className="text-[10px] text-slate-400">{user?.mobile || ''}</p>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold">
                    <CheckCircle className="w-4 h-4" /> Active
                  </div>
                </div>

                <div className="px-2 py-2">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">Balance</div>
                  <div className="text-lg font-black text-white">PKR {Number(balance).toLocaleString()}</div>
                </div>

                <div className="mt-3">
                  <button onClick={() => { logout(); navigate('/login'); }} className="w-full bg-rose-600 hover:bg-rose-500 text-white py-2 rounded-xl font-bold flex items-center justify-center gap-2">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
