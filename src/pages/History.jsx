import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Check, Clock, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

const tabSpring = { type: 'spring', stiffness: 300, damping: 25 };

const formatDate = (ts) => new Date(ts).toLocaleString();

const Badge = ({ status }) => {
  const map = {
    pending: 'bg-amber-500 text-amber-900',
    approved: 'bg-emerald-500 text-emerald-900',
    rejected: 'bg-rose-500 text-rose-900',
    completed: 'bg-emerald-500 text-emerald-900'
  };
  return <span className={`px-2 py-1 rounded-full text-[11px] font-bold ${map[status] || 'bg-slate-600 text-slate-100'}`}>{status?.toUpperCase()}</span>;
};

const History = () => {
  const { deposits, withdrawals } = useApp();
  const [active, setActive] = useState('deposits');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-white">Transaction History</h2>
        <div className="text-sm text-slate-400">All activity is live & synced</div>
      </div>

      <div className="bg-slate-800/60 p-3 rounded-3xl border border-slate-700 flex gap-2">
        <button onClick={() => setActive('deposits')} className={`flex-1 py-2 rounded-2xl font-bold ${active === 'deposits' ? 'bg-primary text-white' : 'bg-slate-900 text-slate-300'}`}>📥 Deposit Ledger</button>
        <button onClick={() => setActive('withdrawals')} className={`flex-1 py-2 rounded-2xl font-bold ${active === 'withdrawals' ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-slate-300'}`}>📤 Withdrawal Ledger</button>
      </div>

      <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={tabSpring} className="bg-slate-900 border border-slate-800 rounded-3xl p-4">
        <AnimatePresence mode="wait">
          {active === 'deposits' ? (
            <motion.div key="deps" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} transition={tabSpring}>
              {deposits.length === 0 ? (
                <div className="p-8 text-center text-slate-500 italic">Koi transaction record nahi mila.</div>
              ) : (
                <div className="space-y-3">
                  {deposits.map(d => (
                    <div key={d.id} className="flex items-center justify-between p-3 bg-slate-800/40 border border-slate-700 rounded-2xl">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 bg-emerald-700/10 rounded-lg flex items-center justify-center text-emerald-400">
                          <ArrowDownLeft className="w-6 h-6" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-white truncate">{d.planName}</div>
                          <div className="text-xs text-slate-500 font-mono truncate">Trx: {d.trxId}</div>
                        </div>
                      </div>

                      <div className="text-right flex flex-col items-end gap-1">
                        <div className="text-sm font-black text-blue-300">+PKR {d.amount}</div>
                        <div className="text-[11px] text-slate-400">{formatDate(d.createdAt)}</div>
                        <div className="mt-1"><Badge status={d.status} /></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div key="wds" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }} transition={tabSpring}>
              {withdrawals.length === 0 ? (
                <div className="p-8 text-center text-slate-500 italic">Koi transaction record nahi mila.</div>
              ) : (
                <div className="space-y-3">
                  {withdrawals.map(w => (
                    <div key={w.id} className="flex items-center justify-between p-3 bg-slate-800/40 border border-slate-700 rounded-2xl">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 bg-rose-700/10 rounded-lg flex items-center justify-center text-rose-400">
                          <ArrowUpRight className="w-6 h-6" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-white truncate">{w.method} — {w.account}</div>
                          <div className="text-xs text-slate-500 font-mono truncate">ID: {w.id}</div>
                        </div>
                      </div>

                      <div className="text-right flex flex-col items-end gap-1">
                        <div className="text-sm font-black text-rose-400">-PKR {w.amount}</div>
                        <div className="text-[11px] text-slate-400">{formatDate(w.createdAt)}</div>
                        <div className="mt-1"><Badge status={w.status} /></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default History;
