import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PLANS } from '../context/AppContext';
import { TrendingUp, ShieldCheck, Zap, Diamond, Star, Award, Crown, CheckCircle2 } from 'lucide-react';
import DepositModal from '../components/DepositModal';

const PlanCard = ({ plan, onSelect }) => {
  const icons = {
    'plan-1': TrendingUp,
    'plan-2': ShieldCheck,
    'plan-3': Zap,
    'plan-4': Star,
    'plan-5': Award,
    'plan-6': Diamond,
    'plan-7': Crown,
  };
  
  const Icon = icons[plan.id] || TrendingUp;

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      className="bg-slate-800/80 border border-slate-700/50 p-6 rounded-[2rem] relative overflow-hidden group shadow-xl shadow-black/20"
    >
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${plan.color} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`}></div>
      
      <div className="flex justify-between items-start mb-6">
        <div className={`w-14 h-14 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center shadow-lg shadow-black/30`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Return</p>
          <p className="text-lg font-black text-slate-100">PKR {plan.totalReturn.toLocaleString()}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-xl font-black text-white">{plan.name}</h4>
          <p className="text-slate-400 text-xs font-medium">45 Days Lifecycle Investment</p>
        </div>

        <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-700/50 flex justify-between items-center">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Daily Yield</p>
            <p className="text-lg font-black text-emerald-400">PKR {plan.dailyYield}</p>
          </div>
          <div className="w-px h-8 bg-slate-700"></div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Validity</p>
            <p className="text-lg font-black text-slate-200">{plan.validity} Days</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Professional Payout
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Automated Accrual
          </div>
        </div>

        <button 
          onClick={() => onSelect(plan)}
          className={`w-full bg-gradient-to-r ${plan.color} text-white font-black py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-[0.98] mt-2`}
        >
          Invest PKR {plan.cost.toLocaleString()}
        </button>
      </div>
    </motion.div>
  );
};

const Plans = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const NativeAdCard = () => (
    // Native ad placeholder: replace inner DIV with ad network script (AdSense/Adsterra/Ezoic)
    // Implementation hook: insert third-party script here when integrating real ads.
    <div className="bg-slate-800/60 border border-slate-700/40 p-4 rounded-2xl text-center">
      <p className="text-sm font-bold text-slate-300">Sponsored</p>
      <div className="mt-2 bg-gradient-to-r from-slate-900/30 to-slate-800/30 px-4 py-3 rounded-xl inline-block w-full">
        <p className="text-xs text-slate-400">Premium offer — ad slot (native)</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 pb-10">
      <section className="text-center px-4">
        <h2 className="text-3xl font-black text-white mb-2 italic uppercase tracking-tight">Investment Portfolios</h2>
        <p className="text-slate-400 text-sm font-medium">Choose a tier and start growing your digital assets daily.</p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(() => {
          const items = [];
          PLANS.forEach((plan, idx) => {
            items.push(
              <PlanCard key={plan.id} plan={plan} onSelect={setSelectedPlan} />
            );

            // Inject native ad placeholder after Plan 4 (index 3)
            if (idx === 3) {
              items.push(
                <div key="native-ad-1" className="col-span-1 md:col-span-2">
                  <NativeAdCard />
                </div>
              );
            }
          });
          return items;
        })()}
      </div>

      <DepositModal 
        plan={selectedPlan} 
        isOpen={!!selectedPlan} 
        onClose={() => setSelectedPlan(null)} 
      />

      <div className="bg-slate-800/50 p-6 rounded-[2.5rem] border border-slate-700/50 text-center">
        <p className="text-xs text-slate-500 font-medium leading-relaxed italic">
          Multiple concurrent purchases allowed. Each plan instance follows isolated 24h yield logic.
        </p>
      </div>
    </div>
  );
};

export default Plans;
