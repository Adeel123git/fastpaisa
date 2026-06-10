import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Local rule-based FastPaisa assistant (no external AI calls)
function ruleResponder(userText, lastReply = '') {
  const t = (userText || '').toLowerCase();
  if (!t) return 'Bhai, pehle apna sawaal type karein please.';

  const pick = (arr) => {
    if (!arr || arr.length === 0) return '';
    if (arr.length === 1) return arr[0];
    let choice = arr[Math.floor(Math.random() * arr.length)];
    if (choice === lastReply) {
      // try once more for variety
      const alt = arr.filter(x => x !== lastReply);
      if (alt.length) choice = alt[Math.floor(Math.random() * alt.length)];
    }
    return choice;
  };

  const plans = [
    `Hamare plans: 250PKR (15/day), 520PKR (35/day), 1000PKR (70/day), 1800PKR (130/day), 2800PKR (210/day), 3900PKR (460/day), 5000PKR (600/day). Har plan 45 din ka contract hai.`,
    `Available plans: 250, 520, 1000, 1800, 2800, 3900, 5000 PKR — 45 din ka duration. Batain kaunsa dekhna chahte ho?`,
    `Simple summary: Plan 1=250, Plan 2=520, Plan 3=1000 ... Sab 45 din ke liye hain. Agar balance batayein to recommend kar doon.`
  ];

  const withdraws = [
    'Minimum withdrawal 100 PKR hai. Har withdrawal pe 15 PKR network fee lagegi. Process usually 1-2 hours.',
    'Aap 100 PKR se zyada withdrawal kar sakte hain; network fee 15 PKR flat. Approval 1-2 hours mein aata hai.'
  ];

  const deposits = [
    'Deposit karne ke liye Dashboard → Deposit use karein. Screenshot aur Trx ID submit karna zaroori hai.',
    'Deposit submit karne ke baad hamari team 1-2 hours mein check karegi. Trx ID sahi hona chahiye.'
  ];

  const generic = [
    'Achha sawal — thoda detail dein (e.g., "Maine deposit kiya, confirm kab hoga?") taake main specific madad kar sakun.',
    'Batayein aapko kis cheez mein help chahiye — deposit, withdraw, ya plans? Thoda detail dein.'
  ];

  if (t.includes('plan') || t.includes('plans') || t.includes('investment')) return pick(plans);
  if (t.includes('withdraw') || t.includes('withdrawal') || t.includes('cash out')) return pick(withdraws);
  if (t.includes('deposit') || t.includes('add balance') || t.includes('top up')) return pick(deposits);
  if (t.includes('minimum') && t.includes('withdraw')) return pick(withdraws);
  if (t.includes('fee') || t.includes('network')) return 'Har withdrawal pe 15 PKR ka flat network fee lagta hai.';
  if (t.includes('multi') && t.includes('account')) return 'Multi-accounting mana hai — ek mobile number sirf ek account ke sath link ho sakta hai.';
  if (t.includes('how') && t.includes('login')) return 'Login ke liye username/password use karein. Agar problem aaye to "Forgot" ka button try karein.';
  if (t.includes('balance')) return 'Dashboard me balance section check karein. Kuch mismatch ho to screenshot bhejein.';

  return pick(generic);
}

export default function Support() {
  const [messages, setMessages] = useState(() => {
    try {
      const raw = localStorage.getItem('fastpaisa_support_messages');
      return raw ? JSON.parse(raw) : [{ id: 1, sender: 'ai', text: 'Walaikum Assalam bhai! FastPaisa Support mein khushamdeed. Aap kaise madad chahenge?', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }];
    } catch (e) {
      return [{ id: 1, sender: 'ai', text: 'Walaikum Assalam bhai! FastPaisa Support mein khushamdeed. Aap kaise madad chahenge?', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }];
    }
  });

  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const chatBottomRef = useRef(null);

  useEffect(() => {
    try { localStorage.setItem('fastpaisa_support_messages', JSON.stringify(messages)); } catch (e) {}
  }, [messages]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSendMessage = (e) => {
    e && e.preventDefault();
    if (!input.trim() || isThinking) return;

    const userText = input.trim();
    setInput('');

    const userMessage = { id: Date.now(), sender: 'user', text: userText, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMessage]);
    setIsThinking(true);

    setTimeout(() => {
      const lastAi = messages.slice().reverse().find(m => m.sender === 'ai');
      const lastText = lastAi ? lastAi.text : '';
      const reply = ruleResponder(userText, lastText);
      const botMessage = { id: Date.now() + 1, sender: 'ai', text: reply, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      setMessages(prev => [...prev, botMessage]);
      setIsThinking(false);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white pb-24 font-sans">
      <div className="bg-slate-900 p-4 sticky top-0 z-10 shadow-sm border-b border-slate-800">
        <div className="flex items-center space-x-3 max-w-2xl mx-auto">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20 animate-pulse">
            <span className="text-xl">🤖</span>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-wide">FastPaisa Support</h1>
            <p className="text-xs text-slate-400">Official helpdesk — Roman Urdu replies</p>
          </div>
        </div>
      </div>

      <div className="p-4 max-w-2xl mx-auto space-y-4 overflow-y-auto" style={{ minHeight: 'calc(100vh - 180px)' }}>
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-[14px] shadow-md leading-relaxed ${
                msg.sender === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-100 border border-slate-700 rounded-tl-none'
              }`}>
                <p className="whitespace-pre-line">{msg.text}</p>
                <span className="block text-[10px] text-right mt-1 opacity-60">{msg.timestamp}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isThinking && (
          <div className="text-xs italic text-slate-400 bg-slate-800/50 px-3 py-2 rounded-xl border border-slate-700/50 w-max">
            FastPaisa Agent typing...
          </div>
        )}
        <div ref={chatBottomRef} />
      </div>

      <div className="fixed bottom-16 left-0 right-0 p-3 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 max-w-2xl mx-auto z-10">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Apna sawaal Roman Urdu mein likhein..."
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            disabled={isThinking}
          />
          <button
            type="submit"
            disabled={!input.trim() || isThinking}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 text-white rounded-xl px-5 py-3 text-sm font-semibold transition-all shadow-lg"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}