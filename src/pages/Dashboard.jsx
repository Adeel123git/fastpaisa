import React from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, Clock, AlertCircle, ShoppingBag } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import TransactionHistoryGrid from '../components/TransactionHistoryGrid';
import { useState } from 'react';

const Dashboard = () => {
  const { balance, activePlans, user } = useApp();

  const [activeTab, setActiveTab] = useState('deposits');

  const totalEarnings = activePlans.reduce((acc, plan) => acc + plan.earned, 0);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-1">Assalam-o-Alaikum, {user?.username}!</h2>
        <p className="text-slate-400 text-sm font-medium">Here's your investment overview today.</p>
      </section>

      {/* Balance Cards */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-gradient-to-br from-primary to-blue-700 p-5 rounded-3xl shadow-xl shadow-primary/20 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:scale-110 transition-transform">
            <Wallet className="w-12 h-12" />
          </div>
          <p className="text-[10px] font-bold text-blue-100 uppercase tracking-widest mb-1">Total Balance</p>
          <h3 className="text-2xl font-black text-white">PKR {balance.toLocaleString()}</h3>
        </motion.div>

        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-slate-800 border border-slate-700 p-5 rounded-3xl shadow-xl shadow-black/20"
        >
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-3 h-3 text-accent" />
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Daily Yields</p>
          </div>
          <h3 className="text-2xl font-black text-slate-100">PKR {totalEarnings.toLocaleString()}</h3>
        </motion.div>
      </div>

      {/* Stats Section */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 px-6 py-4 rounded-3xl flex justify-between items-center">
        <div className="text-center flex-1 border-r border-slate-700">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Active</p>
          <p className="text-lg font-black text-slate-200">{activePlans.length}</p>
        </div>
        <div className="text-center flex-1 border-r border-slate-700">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Income</p>
          <p className="text-lg font-black text-accent">+{activePlans.reduce((acc, p) => acc + p.dailyYield, 0)}/d</p>
        </div>
        <div className="text-center flex-1">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Rank</p>
          <p className="text-lg font-black text-yellow-500">Gold</p>
        </div>
      </div>

      {/* Active Projects List */}
      <section className="space-y-4 pb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Active Projects
          </h3>
          <NavLink to="/plans" className="text-xs font-bold text-primary hover:underline">View All</NavLink>
        </div>

        {activePlans.length === 0 ? (
          <div className="bg-slate-800/40 border border-dashed border-slate-700 p-10 rounded-3xl text-center flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-8 h-8 text-slate-600" />
            </div>
            <div>
              <p className="text-slate-300 font-bold">No Active Plans Yet</p>
              <p className="text-slate-500 text-xs mt-1">Start your investment journey now!</p>
            </div>
            <NavLink 
              to="/plans" 
              className="mt-2 bg-primary px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
            >
              Get Started
            </NavLink>
          </div>
        ) : (
          <div className="space-y-3">
            {activePlans.map((plan) => (
              <motion.div 
                key={plan.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-slate-800/80 border border-slate-700 p-4 rounded-2xl flex items-center gap-4"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${plan.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-100 truncate">{plan.name}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {plan.daysRemaining} Days Left
                    </p>
                    <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">
                      PKR {plan.earned} Earned
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-slate-100">+{plan.dailyYield}</p>
                  <p className="text-[9px] font-bold text-slate-500 uppercase">Daily Yield</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Safety Notice */}
      <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex gap-3">
        <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-200/70 leading-relaxed italic">
          Remember: Your earnings accrue every 24 hours. Keep your credentials secure and never share your Trx ID with anyone.
        </p>
      </div>

      {/*
        Dashboard Ad Banner Placeholder (SMART NON-INTRUSIVE PLACEMENT)
        Hook: Replace inner DIV with ad network script/snippet (AdSense/Adsterra/Ezoic).
        Placement: Compact horizontal banner styled like premium announcement at the bottom
        of the dashboard content. Do NOT use full-screen or intrusive overlays.
      */}
      <div className="mt-4">
        <div className="bg-slate-800/60 border border-slate-700/40 rounded-2xl p-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold text-slate-300">Sponsored</p>
            <p className="text-sm text-slate-400">Premium offer — ad slot</p>
          </div>
          <div className="hidden sm:block text-[11px] text-slate-500">Ad Placeholder</div>
        </div>
      </div>

      {/* Transaction history controls */}
      <section className="mt-6">
        <div className="flex gap-3 items-center mb-4">
          <motion.button
            type="button"
            onClick={() => setActiveTab('deposits')}
            aria-pressed={activeTab === 'deposits'}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`${activeTab === 'deposits' ? 'bg-primary text-white' : 'bg-slate-800 text-slate-200'} flex-1 text-sm font-bold py-2 rounded-2xl shadow-sm transition-colors`}
          >
            Deposit History
          </motion.button>

          <motion.button
            type="button"
            onClick={() => setActiveTab('withdrawals')}
            aria-pressed={activeTab === 'withdrawals'}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`${activeTab === 'withdrawals' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-200'} flex-1 text-sm font-bold py-2 rounded-2xl shadow-sm transition-colors`}
          >
            Withdraw History
          </motion.button>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 25, duration: 0.35 }}>
          <TransactionHistoryGrid view={activeTab} />
        </motion.div>
      </section>
    </div>
  );
};

export default Dashboard;
