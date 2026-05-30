import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Headset, MoreHorizontal } from 'lucide-react';

const SUPPORT_RESPONSES = [
  { keywords: ['hello', 'hi', 'salam', 'aoa', 'assalam'], response: "Walaikum Assalam! FastPaisa platform par aapka khair maqdam hai. Main aapki kya madad kar sakta hoon?" },
  { keywords: ['deposit', 'payment', 'jama'], response: "Deposit karne ke liye Plans section mein jaayein, apna plan select karein aur EasyPaisa ke zariye payment karein. Payment ke baad Trx ID aur screenshot submit karein. Approval 1-2 ghantay mein ho jata hai." },
  { keywords: ['withdraw', 'nikalna', 'paise'], response: "Withdrawal ke liye Withdraw section mein jaayein. Minimum withdrawal PKR 100 aur maximum PKR 5,000 hai. Pehli withdrawal free hai, aur doosri par 2% processing fee lagti hai. Har withdrawal par PKR 15 network fee hoti hai." },
  { keywords: ['plan', 'invest', 'package'], response: "Humari 7 investment plans hain jo PKR 250 se PKR 5,000 tak hain. Har plan 45 din ki validity ke saath daily yield deta hai. Aap ek waqt mein multiple plans activate kar sakte hain." },
  { keywords: ['referral', 'refer', 'team', 'invite'], response: "Har successful referral par aapko flat PKR 10 milte hain. Apna referral code Team section se copy karein aur apne doston ko share karein!" },
  { keywords: ['time', 'kab', 'kitna', 'wait'], response: "Deposits ki approval usually 1-2 ghantay mein ho jaati hai. Withdrawals 24 ghantay ke andar process ho jaati hain. Agar koi delay ho toh humse dubara rabta karein." },
  { keywords: ['problem', 'issue', 'masla', 'error'], response: "Aapki pareshani ka mujhe afsos hai. Baraye meherbani apni problem detail mein bataayein, jaise Transaction ID ya screenshot, taake main aapki jaldi madad kar sakoon." },
  { keywords: ['thank', 'shukriya', 'jazak'], response: "Shukriya! Aapki khushi humari kaamyaabi hai. Agar koi aur sawaal ho toh befikr poochein. FastPaisa har waqt aapke saath hai!" }
];

const Support = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Assalam-o-Alaikum! Main FastPaisa Support Desk se hoon. Main aapki kya madad kar sakta hoon?", sender: 'bot', time: new Date() }
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
    setIsTyping(true);

    // Simulated Agent Response
    setTimeout(() => {
      const lowerInput = input.toLowerCase();
      let responseText = "Shukriya aapke message ka. Abhi main aapki request check kar raha hoon. Baraye meherbani thoda intezaar karein ya apna sawaal dobara detail mein likhein.";
      
      for (const entry of SUPPORT_RESPONSES) {
        if (entry.keywords.some(k => lowerInput.includes(k))) {
          responseText = entry.response;
          break;
        }
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, text: responseText, sender: 'bot', time: new Date() }]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
      {/* Bot Header */}
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
            <p className="text-[10px] text-emerald-400 font-bold">Online • Operations Manager</p>
          </div>
        </div>
        <MoreHorizontal className="w-5 h-5 text-slate-500" />
      </div>

      {/* Chat Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar scroll-smooth"
      >
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] p-4 rounded-3xl text-sm font-medium leading-relaxed ${
                m.sender === 'user' 
                ? 'bg-primary text-white rounded-tr-none shadow-lg shadow-primary/10' 
                : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700/50'
              }`}>
                {m.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-slate-800 border border-slate-700/50 p-3 rounded-2xl rounded-tl-none flex gap-1 items-center">
              <span className="w-1.5 h-1.5 bg-slate-500 rounded-full typing-dot"></span>
              <span className="w-1.5 h-1.5 bg-slate-500 rounded-full typing-dot"></span>
              <span className="w-1.5 h-1.5 bg-slate-500 rounded-full typing-dot"></span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-4 bg-slate-800/80 backdrop-blur-md border-t border-slate-700/50">
        <div className="flex gap-2 bg-slate-950 p-1.5 rounded-full border border-slate-700/50">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 bg-transparent border-none text-white px-4 py-2 text-sm outline-none placeholder:text-slate-600 font-medium"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping}
          />
          <button 
            type="submit"
            disabled={!input.trim() || isTyping}
            className="bg-primary hover:bg-blue-600 disabled:bg-slate-800 text-white p-2.5 rounded-full shadow-lg shadow-primary/20 transition-all active:scale-90"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-[9px] text-center text-slate-600 mt-2 uppercase font-black tracking-widest">Typical reply time: 2 Minutes</p>
      </form>
    </div>
  );
};

export default Support;
