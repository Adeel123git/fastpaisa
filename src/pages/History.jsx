import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

export default function History() {
  const { deposits = [], withdrawals = [] } = useApp() || {};

  return (
    <div className="min-h-screen bg-slate-900 text-white pb-24 font-sans">
      <div className="p-4 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Transaction History</h2>

        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-3">Recent Deposits</h3>
          {deposits.length === 0 ? (
            <div className="text-sm text-slate-400">No deposits yet. Make an investment from the Plans page.</div>
          ) : (
            <div className="space-y-3">
              {deposits.map((d) => (
                <motion.div key={d.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-800 p-4 rounded-2xl border border-slate-700/50">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm font-bold">{d.planName} — PKR {d.amount.toLocaleString()}</div>
                      <div className="text-xs text-slate-400">TRX: {d.trxId || d.trx || '—'}</div>
                    </div>
                    <div className="text-right text-xs">
                      <div className={`inline-block px-3 py-1 rounded-xl font-semibold ${d.status === 'approved' ? 'bg-emerald-600 text-white' : d.status === 'rejected' ? 'bg-rose-600 text-white' : 'bg-yellow-600 text-black'}`}>
                        {d.status || 'pending'}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">{d.createdAt ? new Date(d.createdAt).toLocaleString() : ''}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-3">Withdrawals</h3>
          {withdrawals.length === 0 ? (
            <div className="text-sm text-slate-400">No withdrawals yet.</div>
          ) : (
            <div className="space-y-3">
              {withdrawals.map((w) => (
                <motion.div key={w.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-800 p-4 rounded-2xl border border-slate-700/50">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm font-bold">Withdrawal — PKR {w.amount.toLocaleString()}</div>
                      <div className="text-xs text-slate-400">Method: {w.method || '—'} • Account: {w.account || '—'}</div>
                    </div>
                    <div className="text-right text-xs">
                      <div className={`inline-block px-3 py-1 rounded-xl font-semibold ${w.status === 'approved' ? 'bg-emerald-600 text-white' : w.status === 'rejected' ? 'bg-rose-600 text-white' : 'bg-yellow-600 text-black'}`}>
                        {w.status || 'pending'}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">{w.createdAt ? new Date(w.createdAt).toLocaleString() : ''}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}