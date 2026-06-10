import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Headset, MoreHorizontal } from 'lucide-react';
import { useApp } from '../context/AppContext';

const spring = { type: 'spring', stiffness: 300, damping: 25, duration: 0.35 };

const SYSTEM_PROMPT = `You are the Official FastPaisa Premium Support Executive. You must always reply in extremely natural, professional, and friendly Roman Urdu (e.g., "Walaikum Assalam bhai! Aapka deposit 15 mins mein active ho jayega..."). You must act like a helpful human sitting at the helpdesk. You know everything about FastPaisa: 7 investment tiers (Plan 1: 250 PKR with 15 PKR/day, Plan 2: 520 PKR with 35 PKR/day, Plan 3: 1000 PKR with 70 PKR/day, Plan 4: 1800 PKR with 130 PKR/day, Plan 5: 2800 PKR with 210 PKR/day, Plan 6: 3900 PKR with 460 PKR/day, Plan 7: 5000 PKR with 600 PKR/day) — all plans valid for 45 days. Withdrawals have a 100 PKR minimum, 15 PKR flat fee, and take 1-2 hours. If a user asks general out-of-context questions, reply intelligently but politely guide them back to FastPaisa services.`;

function safeParseAIResponse(json) {
  try {
    if (!json) return null;
    if (json?.candidates && json.candidates[0]?.content) return json.candidates[0].content;
    if (json?.output && Array.isArray(json.output) && json.output[0]?.content) return json.output[0].content[0]?.text || json.output[0].content[0]?.content || null;
    if (json?.choices && json.choices[0]?.message?.content) return json.choices[0].message.content;
    if (json?.message?.content) return json.message.content;
    if (typeof json === 'string') return json;
    return JSON.stringify(json);
  } catch (err) {
    return null;
  }
}

const Support = () => {
  const { user, deposits, withdrawals, balance } = useApp();
  const [messages, setMessages] = useState(() => {
    const stored = localStorage.getItem('fastpaisa_support_messages');
    if (stored) try { return JSON.parse(stored); } catch (e) {}
    return [{ id: 'sys-1', role: 'assistant', text: 'Assalam-o-Alaikum! Main FastPaisa Support Desk hoon. Aap kis cheez mein madad chahte hain?' }];
  });
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('fastpaisa_support_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const delay = (ms) => new Promise(res => setTimeout(res, ms));

  const sendToGemini = useCallback(async (userMessage) => {
    // Read API key from environment. Set VITE_GEMINI_API_KEY in your local .env file.
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    if (!API_KEY) {
      console.warn('VITE_GEMINI_API_KEY not set. Add it to your .env file.');
    }
    const payload = {
      prompt: {
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `User context: username=${user?.username || 'guest'}, balance=${balance}, deposits=${deposits.length}, withdrawals=${withdrawals.length}` },
          { role: 'user', content: userMessage }
        ]
      },
      temperature: 0.2,
      maxOutputTokens: 800
    };

    try {
      const url = 'https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText';
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({ prompt: { messages: payload.prompt.messages.map(m => ({ role: m.role, content: m.content })) }, temperature: payload.temperature, maxOutputTokens: payload.maxOutputTokens })
      });
      const json = await res.json();
      const aiText = safeParseAIResponse(json) || 'Maaf kijiye, abhi kuch masla hai — dobara try karein.';
      return aiText;
    } catch (err) {
      console.error('AI send error', err);
      return 'Maaf kijiye, hamare AI service mein thodi der ke liye masla hai. Aap kuch dair baad try karein.';
    }
  }, [user, balance, deposits, withdrawals]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    const userMsg = { id: `u-${Date.now()}`, role: 'user', text: userText };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    setIsTyping(true);

    const minDelay = delay(1500);
    const aiPromise = sendToGemini(userText);

    const [aiText] = await Promise.all([aiPromise, minDelay]);

    setMessages(prev => [...prev, { id: `b-${Date.now()}`, role: 'assistant', text: aiText }]);
    setIsTyping(false);
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
            <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={spring} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-3xl text-sm font-medium leading-relaxed ${m.role === 'user' ? 'bg-primary text-white rounded-tr-none shadow-lg shadow-primary/10' : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700/50'}`}>
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
              <span className="ml-2 text-slate-400">Agent typing...</span>
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
