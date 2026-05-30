import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import { Shield, Check, X, ArrowUpRight, ArrowDownLeft, Wallet, User as UserIcon, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const { 
    deposits, withdrawals, balance, approveDeposit, rejectDeposit, 
    approveWithdrawal, rejectWithdrawal, setBalance 
  } = useApp();
  const navigate = useNavigate();
  const [adjustAmount, setAdjustAmount] = useState('');

  const pendingDeposits = deposits.filter(d => d.status === 'pending');
  const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending');

  const handleAdjustBalance = (e) => {
    e.preventDefault();
    if (!adjustAmount) return;
    setBalance(prev => prev + Number(adjustAmount));
    setAdjustAmount('');
    alert('Balance adjusted successfully!');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10">
      {/* Admin Header */}
      <header className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/20">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight uppercase italic">Master Control Hub</h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Secret Admin Access Level 10</p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/dashboard')}
          className="bg-slate-800 hover:bg-slate-700 p-3 rounded-xl transition-all"
        >
          <LogOut className="w-5 h-5 text-slate-400" />
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats & Balance Adjustment */}
        <div className="space-y-8">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-[2rem] shadow-2xl">
            <h2 className="text-lg font-black mb-4 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-rose-500" />
              System Liquidity
            </h2>
            <p className="text-4xl font-black text-white mb-6">PKR {balance.toLocaleString()}</p>
            
            <form onSubmit={handleAdjustBalance} className="space-y-3">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Manual Balance Offset</label>
              <div className="flex gap-2">
                <input 
                  type="number"
                  placeholder="+/- Amount"
                  className="flex-1 bg-slate-950 border border-slate-800 text-white px-4 py-3 rounded-xl outline-none focus:ring-1 focus:ring-rose-500 text-sm font-bold"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                />
                <button type="submit" className="bg-rose-500 hover:bg-rose-600 px-4 rounded-xl font-bold text-sm">Apply</button>
              </div>
            </form>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-[2rem]">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-400">Total Deposits</span>
                <span className="text-sm font-black text-emerald-500">{deposits.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-400">Pending Approvals</span>
                <span className="text-sm font-black text-amber-500">{pendingDeposits.length + pendingWithdrawals.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-400">Total Withdrawals</span>
                <span className="text-sm font-black text-rose-500">{withdrawals.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle/Right Columns: Transaction Queues */}
        <div className="lg:col-span-2 space-y-10">
          {/* Pending Deposits */}
          <section>
            <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
              <ArrowDownLeft className="w-5 h-5 text-emerald-500" />
              Outstanding Deposit Tickets
            </h3>
            <div className="space-y-3">
              {pendingDeposits.length === 0 ? (
                <div className="bg-slate-900/40 border border-dashed border-slate-800 p-8 rounded-3xl text-center text-slate-600 text-sm font-medium italic">
                  No pending deposits in queue.
                </div>
              ) : (
                pendingDeposits.map(d => (
                  <motion.div 
                    key={d.id}
                    layout
                    className="bg-slate-900 border border-slate-800 p-5 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                        <UserIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white">{d.planName} Tier Activation</h4>
                        <p className="text-xs text-slate-500 font-mono tracking-tight">{d.trxId}</p>
                        <p className="text-[10px] font-bold text-slate-600 uppercase mt-1">Amount: PKR {d.amount}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => approveDeposit(d.id)}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl transition-all"
                      >
                        <Check className="w-4 h-4" /> Approve
                      </button>
                      <button 
                        onClick={() => rejectDeposit(d.id)}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-800 hover:bg-rose-900/30 text-rose-500 font-bold px-5 py-2.5 rounded-xl transition-all border border-slate-700"
                      >
                        <X className="w-4 h-4" /> Reject
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </section>

          {/* Pending Withdrawals */}
          <section>
            <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
              <ArrowUpRight className="w-5 h-5 text-rose-500" />
              Pending Payout Requests
            </h3>
            <div className="space-y-3">
              {pendingWithdrawals.length === 0 ? (
                <div className="bg-slate-900/40 border border-dashed border-slate-800 p-8 rounded-3xl text-center text-slate-600 text-sm font-medium italic">
                  Queue is clear. No active withdrawal requests.
                </div>
              ) : (
                pendingWithdrawals.map(w => (
                  <motion.div 
                    key={w.id}
                    layout
                    className="bg-slate-900 border border-slate-800 p-5 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-500">
                        <Wallet className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white uppercase italic">{w.method} Payment</h4>
                        <p className="text-xs text-slate-500 font-mono tracking-tight">Acc: {w.account}</p>
                        <p className="text-[10px] font-bold text-rose-400 uppercase mt-1">Amount: PKR {w.amount} (Total: {w.totalDeduction})</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => approveWithdrawal(w.id)}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-500 text-white font-bold px-5 py-2.5 rounded-xl transition-all"
                      >
                        <Check className="w-4 h-4" /> Disburse
                      </button>
                      <button 
                        onClick={() => rejectWithdrawal(w.id)}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-400 font-bold px-5 py-2.5 rounded-xl transition-all border border-slate-700"
                      >
                        <X className="w-4 h-4" /> Block
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
