import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import BottomNav from './BottomNav';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col pb-20 pt-16">
      <Header />
      
      <main className="flex-1 w-full max-w-lg mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={window.location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNav />
    </div>
  );
};

export default Layout;
