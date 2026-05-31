import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

const StatusBadge = ({ status, type }) => {
  if (!status) return null;
  if (type === 'deposit') {
    return (
      <span className={`text-xs font-bold px-2 py-1 rounded-full ${status.toLowerCase() === 'pending' ? 'text-amber-500 bg-amber-900/10' : 'text-emerald-400 bg-emerald-900/10'}`}>
        {status.toUpperCase()}
      </span>
    );
  }
  return (
    <span className={`text-xs font-bold px-2 py-1 rounded-full ${status.toLowerCase() === 'pending' ? 'text-amber-500 bg-amber-900/10' : 'text-emerald-400 bg-emerald-900/10'}`}>
      {status.toUpperCase()}
    </span>
  );
};

const TransactionHistoryGrid = ({ view = 'all' }) => {
  const { deposits, withdrawals } = useApp();
  const spring = { type: 'spring', stiffness: 300, damping: 25, duration: 0.35 };

  const hasDeposits = deposits && deposits.length > 0;
  const hasWithdrawals = withdrawals && withdrawals.length > 0;

  if ((view === 'all' && !hasDeposits && !hasWithdrawals) || (view === 'deposits' && !hasDeposits) || (view === 'withdrawals' && !hasWithdrawals)) {
    return (
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-3xl p-6 text-center">
        <p className="text-slate-400">Koi transaction record nahi mila.</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={spring} className={`grid grid-cols-1 ${view === 'all' ? 'md:grid-cols-2' : 'md:grid-cols-1'} gap-4`}>
      {(view === 'all' || view === 'deposits') && (
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-200">Deposit Funding Logs</h4>
          <div className="space-y-2">
            {hasDeposits ? deposits.map(d => (
              <motion.div key={d.id} initial={{ y: 6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={spring} className="bg-slate-800/60 border border-slate-700/40 p-4 rounded-2xl flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs text-slate-400">{d.planName} • {new Date(d.createdAt || d.timestamp || Date.now()).toLocaleString()}</div>
                  <div className="text-sm font-bold text-slate-100 truncate">Ref: {d.trxId}</div>
                </div>
                <div className="text-right">
                  <div className="text-blue-400 font-black">+{d.amount} PKR</div>
                  <div className="mt-2"><StatusBadge status={d.status || d.status?.toLowerCase?.()} type="deposit" /></div>
                </div>
              </motion.div>
            )) : (
              <div className="bg-slate-800/40 border border-dashed border-slate-700 p-4 rounded-2xl text-slate-500">No deposits yet</div>
            )}
          </div>
        </div>
      )}

      {(view === 'all' || view === 'withdrawals') && (
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-200">Withdrawal Disbursal Logs</h4>
          <div className="space-y-2">
            {hasWithdrawals ? withdrawals.map(w => (
              <motion.div key={w.id} initial={{ y: 6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={spring} className="bg-slate-800/60 border border-slate-700/40 p-4 rounded-2xl flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs text-slate-400">{w.method || 'Gateway'} • {new Date(w.createdAt).toLocaleString()}</div>
                  <div className="text-sm font-bold text-slate-100 truncate">Account: {String(w.account || '').slice(-6).padStart(6, '*')}</div>
                </div>
                <div className="text-right">
                  <div className="text-red-400 font-black">-{w.amount} PKR</div>
                  <div className="mt-2"><StatusBadge status={w.status} type="withdraw" /></div>
                </div>
              </motion.div>
            )) : (
              <div className="bg-slate-800/40 border border-dashed border-slate-700 p-4 rounded-2xl text-slate-500">No withdrawals yet</div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default TransactionHistoryGrid;
