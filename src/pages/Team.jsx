import React from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import { Users, UserPlus, Gift, Copy, Check, Share2, Award } from 'lucide-react';

const TeamMemberCard = ({ member }) => (
  <div className="bg-slate-800/60 border border-slate-700/50 p-4 rounded-2xl flex items-center gap-4">
    <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-slate-400 font-bold border border-slate-600">
      {member.username.charAt(0).toUpperCase()}
    </div>
    <div className="flex-1">
      <h4 className="text-sm font-bold text-slate-100">{member.username}</h4>
      <p className="text-[10px] text-slate-500 font-medium">{member.status || 'Active Member'}</p>
    </div>
    <div className="text-right">
      <p className="text-xs font-black text-emerald-500">+10 PKR</p>
      <p className="text-[9px] font-bold text-slate-500 uppercase">Referral Bonus</p>
    </div>
  </div>
);

const Team = () => {
  const { teamMembers, user } = useApp();
  const [copied, setCopied] = React.useState(false);
  
  const referralCode = `FP-${user?.mobile?.slice(-4) || '7860'}`;
  const referralLink = `https://fastpaisa.app/ref/${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <section className="text-center">
        <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-accent/30 text-accent">
          <Users className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-white">Network Matrix</h2>
        <p className="text-slate-400 text-sm font-medium">Build your team and earn flat rewards.</p>
      </section>

      {/* Referral Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-6 rounded-[2.5rem] shadow-xl shadow-indigo-900/20 relative overflow-hidden"
      >
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-indigo-200" />
            <p className="text-xs font-bold text-indigo-100 uppercase tracking-widest">Referral Bonus</p>
          </div>
          <h3 className="text-2xl font-black text-white">Get PKR 10 Flat Reward</h3>
          <p className="text-indigo-200/80 text-xs leading-relaxed max-w-[250px]">
            Earn an instant flat reward of 10 PKR for every friend who registers using your link.
          </p>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 p-4 flex items-center justify-between mt-2">
            <div className="truncate flex-1">
              <p className="text-[9px] font-bold text-indigo-200 uppercase tracking-widest leading-none mb-1">Your Link</p>
              <p className="text-sm font-mono text-white truncate pr-4">{referralLink}</p>
            </div>
            <button 
              onClick={handleCopy}
              className="bg-white text-indigo-700 p-2.5 rounded-xl hover:bg-indigo-50 transition-colors shadow-lg active:scale-95"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800/80 p-5 rounded-3xl border border-slate-700/50 flex flex-col items-center gap-2">
          <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
            <UserPlus className="w-5 h-5" />
          </div>
          <div className="text-center">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Registrations</p>
            <p className="text-xl font-black text-white">{teamMembers.length}</p>
          </div>
        </div>
        <div className="bg-slate-800/80 p-5 rounded-3xl border border-slate-700/50 flex flex-col items-center gap-2">
          <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
            <Award className="w-5 h-5" />
          </div>
          <div className="text-center">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Rewards</p>
            <p className="text-xl font-black text-white">PKR {teamMembers.length * 10}</p>
          </div>
        </div>
      </div>

      {/* Team List */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 px-1">
          <Share2 className="w-5 h-5 text-primary" />
          Active Network
        </h3>

        {teamMembers.length === 0 ? (
          <div className="bg-slate-800/40 border border-dashed border-slate-700 p-12 rounded-[2rem] text-center flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-slate-600" />
            </div>
            <div>
              <p className="text-slate-300 font-bold">No Members Yet</p>
              <p className="text-slate-500 text-xs mt-1">Share your link to grow your matrix.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {teamMembers.map((member, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <TeamMemberCard member={member} />
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Team;
