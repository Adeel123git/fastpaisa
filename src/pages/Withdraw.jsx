import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Info, ArrowUpRight, History, CheckCircle2, XCircle, Clock } from 'lucide-react';

const Withdraw = () => {
  const { balance, withdrawals, requestWithdrawal } = useApp();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('EasyPaisa');
  const [account, setAccount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const today = new Date().toDateString();
  const withdrawalsToday = withdrawals.filter(w => new Date(w.createdAt).toDateString() === today && w.status !== 'rejected');
  
  const estimatedFee = withdrawalsToday.length > 0 ? (Number(amount) * 0.02) : 0;
  const networkFee = 15;
  const totalDeduction = Number(amount) + estimatedFee + networkFee;

  const handleWithdraw = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    setTimeout(() => {
      const res = requestWithdrawal(Number(amount), method, account);
      if (res.error) {
        setMessage({ type: 'error', text: res.error });
      } else {
        setMessage({ type: 'success', text: 'Withdrawal request submitted successfully!' });
        setAmount('');
        setAccount('');
      }
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-10">
      <section className="text-center">
        <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/30 text-primary">
          <Wallet className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-white italic uppercase tracking-tight">Withdraw Funds</h2>
        <p className="text-slate-400 text-sm font-medium">Safe and secure payouts to your mobile wallet.</p>
      </section>

      {/* Balance Box */}
      <div className="bg-slate-800/80 border border-slate-700/50 p-6 rounded-[2rem] text-center shadow-xl shadow-black/20">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Available for Payout</p>
        <h3 className="text-3xl font-black text-white">PKR {balance.toLocaleString()}</h3>
      </div>

      {/* Form */}
      <form onSubmit={handleWithdraw} className="space-y-4">
        <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-[2.5rem] space-y-5">
          <div className="flex gap-2">
            {['EasyPaisa', 'JazzCash'].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMethod(m)}
                className={`flex-1 py-3 rounded-2xl text-xs font-black transition-all ${
                  method === m 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'bg-slate-900 text-slate-500 border border-slate-700'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Withdraw Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">PKR</span>
              <input 
                type="number"
                placeholder="100 - 5,000"
                className="w-full bg-slate-900 border border-slate-700 text-white pl-14 pr-4 py-4 rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all font-bold"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">{method} Account Number</label>
            <input 
              type="tel"
              placeholder="03xx xxxxxxx"
              className="w-full bg-slate-900 border border-slate-700 text-white p-4 rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all font-mono"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              required
            />
          </div>

          {/* Fee Calculation Preview */}
          <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800 space-y-2">
            <div className="flex justify-between text-[10px] font-bold">
              <span className="text-slate-500">Service Fee ({withdrawalsToday.length > 0 ? '2%' : '0%'})</span>
              <span className="text-slate-300">PKR {estimatedFee.toFixed(1)}</span>
            </div>
            <div className="flex justify-between text-[10px] font-bold">
              <span className="text-slate-500">Network Charge</span>
              <span className="text-slate-300">PKR 15.0</span>
            </div>
            <div className="h-px bg-slate-800 my-1"></div>
            <div className="flex justify-between text-xs font-black">
              <span className="text-slate-400">Total Deduction</span>
              <span className="text-emerald-400">PKR {totalDeduction.toLocaleString()}</span>
            </div>
          </div>

          {message.text && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className={`p-3 rounded-xl text-xs font-bold text-center ${
                message.type === 'error' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
              }`}
            >
              {message.text}
            </motion.div>
          )}

          <button 
            type="submit"
            disabled={isSubmitting || !amount || parseFloat(amount) < 100}
            className="w-full bg-primary hover:bg-blue-600 disabled:bg-slate-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                Confirm Payout
                <ArrowUpRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Rules Notice */}
      <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/30 flex gap-3">
        <Info className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Withdrawal Rules</p>
          <p className="text-[10px] text-slate-500 leading-relaxed italic">
            Min: 100 | Max: 5,000. Each transaction includes a flat 15 PKR network fee. First daily withdrawal is free; sequential requests incur 2% service tax.
          </p>
        </div>
      </div>

      {/* History */}
      <section className="space-y-4 pt-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 px-1">
          <History className="w-5 h-5 text-primary" />
          Recent Payouts
        </h3>

        {withdrawals.length === 0 ? (
          <div className="bg-slate-800/40 border border-dashed border-slate-700 p-10 rounded-[2rem] text-center">
            <p className="text-slate-500 text-xs font-bold italic underline decoration-slate-700 underline-offset-4">No recent withdrawal history found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {withdrawals.map((wd) => (
              <div key={wd.id} className="bg-slate-800/80 border border-slate-700/50 p-4 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    wd.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' : 
                    wd.status === 'rejected' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'
                  }`}>
                    {wd.status === 'approved' ? <CheckCircle2 className="w-5 h-5" /> : 
                     wd.status === 'rejected' ? <XCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-100">{wd.method} Payout</h4>
                    <p className="text-[9px] font-bold text-slate-500 uppercase">{new Date(wd.createdAt).toLocaleDateString()} • {new Date(wd.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-slate-100">PKR {wd.amount}</p>
                  <p className={`text-[9px] font-bold uppercase ${
                    wd.status === 'approved' ? 'text-emerald-500' : 
                    wd.status === 'rejected' ? 'text-rose-500' : 'text-amber-500'
                  }`}>{wd.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Withdraw;
