import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Wallet, Users, MessageSquare, List, Clock } from 'lucide-react';
import { cn } from '../lib/utils';

export default function BottomNav() {
  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Home' },
    { to: '/plans', icon: List, label: 'Plans' },
    { to: '/history', icon: Clock, label: 'History' },
    { to: '/withdraw', icon: Wallet, label: 'Withdraw' },
    { to: '/team', icon: Users, label: 'Team' },
    { to: '/support', icon: MessageSquare, label: 'Support' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-secondary border-t border-slate-800 pb-safe md:pb-0 z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center w-full h-full transition-colors',
                isActive ? 'text-primary' : 'text-slate-400 hover:text-slate-200'
              )
            }
          >
            <item.icon className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium uppercase tracking-wider">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
