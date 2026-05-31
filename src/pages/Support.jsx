import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Headset, MoreHorizontal } from 'lucide-react';
import { useApp } from '../context/AppContext';

const spring = { type: 'spring', stiffness: 300, damping: 25, duration: 0.35 };

function matchKeywords(input) {
  const txt = (input || '').toLowerCase();

  const depositTriggers = ['deposit', 'trx', 'paisa', 'ss', 'receipt'];
  const withdrawTriggers = ['withdraw', 'pese', 'easypaisa', 'jazzcash', 'payout'];
  const planTriggers = ['plan', 'package', 'invest', 'yield'];

  if (depositTriggers.some(k => txt.includes(k))) return 'deposit';
  if (withdrawTriggers.some(k => txt.includes(k))) return 'withdraw';
  if (planTriggers.some(k => txt.includes(k))) return 'plan';
  return 'default';
}

function responseFor(type) {
  if (type === 'deposit') {
    return `Deposit receive karne ke baad admin manual check karega. Usually 15-30 minutes ke andar aapka Trx verify ho jata hai. Baraye meherbani Trx ID aur SS bilkul clear bhejein taake verification fast ho.`;
  }
  if (type === 'withdraw') {
    return `Withdraw ki policy: Minimum PKR 100, Maximum PKR 5,000. Har payout par PKR 15 network infrastructure fee lagta hai. Processing normally 1-2 ghantay; agar queue zyada ho to thoda intizaar barhtey hain.`;
  }
  if (type === 'plan') {
    return `Hamare 7 plans fixed 45-day contracts hain. Har plan ka daily yield aur total return pre-defined hai. Aap multiple instances ek saath purchase kar sakte hain; har instance alag timer aur accrual rakhta hai.`;
  }
  return `Shukriya, aapka message mila. Baraye specific madad, deposit/withdraw/plan se related koi specific detail bhejein (e.g., Trx ID ya plan name).`;
}

const Support = () => {
  const { user } = useApp();
  const [messages, setMessages] = useState([
    { id: 1, text: 'Assalam-o-Alaikum! Main FastPaisa Support Desk hoon. Aap kis cheez mein madad chahte hain?', sender: 'bot', time: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), text: input, sender: 'user', time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simulated thinking
    setIsTyping(true);
    setTimeout(() => {
      const type = matchKeywords(input);
      const reply = responseFor(type);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: reply, sender: 'bot', time: new Date() }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
      <div className="bg-slate-800/80 backdrop-blur-md p-4 flex items-center justify-between border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary border border-primary/20">
              <Headset className="w-6 h-6" />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-800 animate-pulse"></span>
          </div>
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-wider">Official Live Support Desk</h3>
            <p className="text-[10px] text-emerald-400 font-bold">Online • {user?.username || 'Operations'}</p>
          </div>
        </div>
        <MoreHorizontal className="w-5 h-5 text-slate-500" />
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar scroll-smooth">
        <AnimatePresence initial={false}>
          {messages.map(m => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={spring} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-3xl text-sm font-medium leading-relaxed ${m.sender === 'user' ? 'bg-primary text-white rounded-tr-none shadow-lg shadow-primary/10' : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700/50'}`}>
                {m.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={spring} className="flex justify-start">
            <div className="bg-slate-800 border border-slate-700/50 p-3 rounded-2xl rounded-tl-none flex gap-1 items-center">
              <span className="w-1.5 h-1.5 bg-slate-500 rounded-full typing-dot"></span>
              <span className="w-1.5 h-1.5 bg-slate-500 rounded-full typing-dot"></span>
              <span className="w-1.5 h-1.5 bg-slate-500 rounded-full typing-dot"></span>
              <span className="ml-2 text-slate-400">Agent thinking...</span>
            </div>
          </motion.div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-4 bg-slate-800/80 backdrop-blur-md border-t border-slate-700/50">
        <div className="flex gap-2 bg-slate-950 p-1.5 rounded-full border border-slate-700/50">
          <input type="text" placeholder="Type your message..." className="flex-1 bg-transparent border-none text-white px-4 py-2 text-sm outline-none placeholder:text-slate-600 font-medium" value={input} onChange={e => setInput(e.target.value)} disabled={isTyping} />
          <button type="submit" disabled={!input.trim() || isTyping} className="bg-primary hover:bg-blue-600 disabled:bg-slate-800 text-white p-2.5 rounded-full shadow-lg shadow-primary/20 transition-all active:scale-90">
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-[9px] text-center text-slate-600 mt-2 uppercase font-black tracking-widest">Typical reply time: live AI responses</p>
      </form>
    </div>
  );
};

export default Support;
