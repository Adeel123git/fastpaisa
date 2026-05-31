import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import { Lock, Phone, User, ArrowRight } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState(location.pathname === '/register' ? 'register' : 'login');

  useEffect(() => {
    setMode(location.pathname === '/register' ? 'register' : 'login');
  }, [location.pathname]);

  const { registerUser, validateCredentials } = useApp();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === 'register') {
      // Registration flow: create new user and log them in
      if (!username || !mobile || !password) return alert('Sab fields bharain: Username, Mobile aur Password.');
      const res = registerUser({ username, mobile, password });
      if (res.error === 'username-taken') return alert('Username pehle se exist karta hai. Koi aur username choose karein.');
      if (res.error) return alert('Registration error. Dobara koshish karein.');
      navigate('/dashboard');
      return;
    }

    // Login flow: strict credential check
    if (mode === 'login') {
      if (!username || !password) return alert('Username aur Password dono zaroori hain.');
      const res = validateCredentials(username, password);
      if (res.error === 'not-registered') {
        return alert('Aapka account register nahi hai! Pehle Register karein.');
      }
      if (res.error === 'wrong-password') {
        return alert('Ghalat password! Dobara koshish karein.');
      }
      if (res.success) {
        // set user via login helper to keep consistent state
        login(username, '', password);
        navigate('/dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 bg-[overflow-hidden]">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-primary rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-2xl shadow-primary/30"
          >
            <Lock className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">FastPaisa</h1>
          <p className="text-slate-400 font-medium">Digital Investment Gateway</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4 bg-slate-800/50 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/50 shadow-2xl">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Username"
                className="w-full bg-slate-900/50 border border-slate-700 text-white pl-12 pr-4 py-4 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            {/* Mobile number only required on registration */}
            {mode === 'register' && (
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="tel"
                  placeholder="Mobile Number"
                  className="w-full bg-slate-900/50 border border-slate-700 text-white pl-12 pr-4 py-4 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required={mode === 'register'}
                />
              </div>
            )}

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="password"
                placeholder="Security Password"
                className="w-full bg-slate-900/50 border border-slate-700 text-white pl-12 pr-4 py-4 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {mode === 'login' ? 'Secure Access' : 'Create Account'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>

        <p className="text-center mt-4 text-slate-400 text-sm">
          {mode === 'login' ? (
            <>
              Don't have an account? <button onClick={() => navigate('/register')} className="text-primary font-bold">Register</button>
            </>
          ) : (
            <>
              Already have an account? <button onClick={() => navigate('/login')} className="text-primary font-bold">Login</button>
            </>
          )}
        </p>

        <p className="text-center mt-4 text-slate-500 text-sm">
          By continuing, you agree to our <span className="text-slate-300 font-semibold cursor-pointer">Terms of Service</span>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
