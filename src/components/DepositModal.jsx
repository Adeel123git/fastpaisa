import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Upload, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';

const DepositModal = ({ plan, isOpen, onClose }) => {
  const [trxId, setTrxId] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { submitDeposit } = useApp();

  const handleCopy = () => {
    navigator.clipboard.writeText('03022594589');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (trxId.length < 11) return alert('Please enter a valid Transaction ID');
    
    setIsSubmitting(true);
    setTimeout(() => {
      submitDeposit(plan.id, trxId, 'mock-screenshot-url');
      setIsSubmitting(false);
      onClose();
      alert('Deposit submitted successfully! Approval will take 1-2 hours.');
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md bg-slate-900 border-t sm:border border-slate-800 rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 pb-2 flex items-center justify-between">
            <h3 className="text-xl font-black text-white">Investment Escrow</h3>
            <button onClick={onClose} className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-6 pb-8 space-y-6 max-h-[85vh] overflow-y-auto no-scrollbar">
            {/* Plan Info */}
            <div className={`bg-gradient-to-br ${plan.color} p-5 rounded-3xl text-white shadow-lg`}>
              <div className="flex justify-between items-start mb-2">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Selected Plan</p>
                <div className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase">45 Days</div>
              </div>
              <h4 className="text-2xl font-black">{plan.name}</h4>
              <p className="text-lg font-bold opacity-90">PKR {plan.cost.toLocaleString()}</p>
            </div>

            {/* Account Details */}
            <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-3xl space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-500 font-bold">
                  EP
                </div>
                <p className="text-sm font-bold text-slate-300">EasyPaisa Gateway</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium uppercase tracking-wider">Account Title</span>
                  <span className="text-slate-200 font-black">Adeel</span>
                </div>
                <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded-2xl border border-slate-700/30">
                  <span className="text-slate-200 font-black tracking-widest">03022594589</span>
                  <button 
                    onClick={handleCopy}
                    className="p-2 hover:bg-slate-700 rounded-xl transition-colors text-primary"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl flex gap-3">
              <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-200/80 leading-relaxed font-medium italic">
                Payment karne ke baad apna payment Screenshot (SS) aur Transaction ID (Trx ID) niche submit karein.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Transaction ID</label>
                <input 
                  type="text"
                  placeholder="Enter 11-20 digit Trx ID"
                  className="w-full bg-slate-800 border border-slate-700 text-white p-4 rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all font-mono"
                  value={trxId}
                  onChange={(e) => setTrxId(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Payment Proof (Screenshot)</label>
                <div className="w-full bg-slate-800 border border-dashed border-slate-700 p-8 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-800/80 transition-all group">
                  <Upload className="w-8 h-8 text-slate-600 group-hover:text-primary transition-colors" />
                  <p className="text-xs font-bold text-slate-500 italic">Select Screenshot from Gallery</p>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-blue-600 disabled:bg-slate-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Verifying...
                  </>
                ) : (
                  'Confirm Investment'
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DepositModal;
