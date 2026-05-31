import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ensureUniquePayoutAccount } from '../utils/security';

const AppContext = createContext();

export const PLANS = [
  { id: 'plan-1', name: 'Tier 1', cost: 250, dailyYield: 15, validity: 45, totalReturn: 675, color: 'from-blue-500 to-blue-600' },
  { id: 'plan-2', name: 'Tier 2', cost: 520, dailyYield: 35, validity: 45, totalReturn: 1575, color: 'from-emerald-500 to-emerald-600' },
  { id: 'plan-3', name: 'Tier 3', cost: 1000, dailyYield: 70, validity: 45, totalReturn: 3150, color: 'from-purple-500 to-purple-600' },
  { id: 'plan-4', name: 'Tier 4', cost: 1800, dailyYield: 130, validity: 45, totalReturn: 5850, color: 'from-amber-500 to-amber-600' },
  { id: 'plan-5', name: 'Tier 5', cost: 2800, dailyYield: 210, validity: 45, totalReturn: 9450, color: 'from-rose-500 to-rose-600' },
  { id: 'plan-6', name: 'Tier 6', cost: 3900, dailyYield: 460, validity: 45, totalReturn: 20700, color: 'from-indigo-500 to-indigo-600' },
  { id: 'plan-7', name: 'Tier 7', cost: 5000, dailyYield: 600, validity: 45, totalReturn: 27000, color: 'from-cyan-500 to-cyan-600' },
];

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('faisa_user')) || null);
  const [balance, setBalance] = useState(() => Number(localStorage.getItem('faisa_balance')) || 0);
  const [activePlans, setActivePlans] = useState(() => JSON.parse(localStorage.getItem('faisa_active_plans')) || []);
  const [deposits, setDeposits] = useState(() => JSON.parse(localStorage.getItem('faisa_deposits')) || []);
  const [withdrawals, setWithdrawals] = useState(() => JSON.parse(localStorage.getItem('faisa_withdrawals')) || []);
  const [teamMembers, setTeamMembers] = useState(() => JSON.parse(localStorage.getItem('faisa_team')) || []);
  const [users, setUsers] = useState(() => JSON.parse(localStorage.getItem('faisa_users')) || []);

  useEffect(() => {
    localStorage.setItem('faisa_user', JSON.stringify(user));
    localStorage.setItem('faisa_balance', balance.toString());
    localStorage.setItem('faisa_active_plans', JSON.stringify(activePlans));
    localStorage.setItem('faisa_deposits', JSON.stringify(deposits));
    localStorage.setItem('faisa_withdrawals', JSON.stringify(withdrawals));
    localStorage.setItem('faisa_team', JSON.stringify(teamMembers));
    localStorage.setItem('faisa_users', JSON.stringify(users));
  }, [user, balance, activePlans, deposits, withdrawals, teamMembers, users]);

  // Yield Calculation logic
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      let balanceIncr = 0;
      let updated = false;

      const newPlans = activePlans.map(plan => {
        if (plan.daysRemaining > 0 && now >= plan.nextYieldAt) {
          balanceIncr += plan.dailyYield;
          updated = true;
          return {
            ...plan,
            daysRemaining: plan.daysRemaining - 1,
            earned: plan.earned + plan.dailyYield,
            nextYieldAt: plan.nextYieldAt + (24 * 60 * 60 * 1000)
          };
        }
        return plan;
      });

      if (updated) {
        setActivePlans(newPlans);
        setBalance(prev => prev + balanceIncr);
      }
    }, 10000); // Check every 10 seconds for demo purposes, can be daily in real app

    return () => clearInterval(interval);
  }, [activePlans]);

  const validateCredentials = (username, password) => {
    if (!username) return { error: 'no-username' };
    const found = users.find(u => u.username === username);
    if (!found) return { error: 'not-registered' };
    if (found.password !== password) return { error: 'wrong-password' };
    return { success: true, user: found };
  };

  const registerUser = ({ username, mobile, password }) => {
    if (!username || !password) return { error: 'missing-fields' };
    const exists = users.find(u => u.username === username);
    if (exists) return { error: 'username-taken' };
    const newUser = { id: `user-${Date.now()}`, username, mobile: mobile || '', password };
    setUsers(prev => [newUser, ...prev]);
    setUser(newUser);
    return { success: true, user: newUser };
  };

  const login = (username, mobile, password) => {
    const res = validateCredentials(username, password);
    if (res.error) return res;
    setUser(res.user);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setBalance(0);
    setActivePlans([]);
    setDeposits([]);
    setWithdrawals([]);
    setTeamMembers([]);
    // localStorage will be synced by the effect
  };

  const submitDeposit = (planId, trxId, screenshot) => {
    const plan = PLANS.find(p => p.id === planId);
    const newDeposit = {
      id: `dep-${Date.now()}`,
      planId,
      planName: plan.name,
      amount: plan.cost,
      trxId,
      screenshot,
      status: 'pending',
      createdAt: Date.now()
    };
    setDeposits([newDeposit, ...deposits]);
  };

  const approveDeposit = (depositId) => {
    const deposit = deposits.find(d => d.id === depositId);
    if (!deposit) return;

    const planTemplate = PLANS.find(p => p.id === deposit.planId);
    const newActivePlan = {
      id: `ap-${Date.now()}`,
      ...planTemplate,
      activatedAt: Date.now(),
      nextYieldAt: Date.now() + (24 * 60 * 60 * 1000),
      daysRemaining: planTemplate.validity,
      earned: 0,
      status: 'active'
    };

    // Day 1 yield applied immediately upon approval
    setBalance(prev => prev + planTemplate.dailyYield);
    newActivePlan.earned = planTemplate.dailyYield;
    newActivePlan.daysRemaining -= 1;

    setActivePlans([newActivePlan, ...activePlans]);
    setDeposits(deposits.map(d => d.id === depositId ? { ...d, status: 'approved' } : d));
  };

  const rejectDeposit = (depositId) => {
    setDeposits(deposits.map(d => d.id === depositId ? { ...d, status: 'rejected' } : d));
  };

  const requestWithdrawal = (amount, method, account) => {
    if (!user || !user.id) return { error: 'User not authenticated' };
    if (amount < 100 || amount > 5000) return { error: 'Amount must be between 100 and 5000 PKR' };

    // Anti-fraud: ensure payout account not already assigned to another user
    try {
      ensureUniquePayoutAccount(account, user.id, { withdrawals, deposits, teamMembers });
    } catch (err) {
      return { error: err.message };
    }

    const today = new Date().toDateString();
    const withdrawalsToday = withdrawals.filter(w => new Date(w.createdAt).toDateString() === today && w.status !== 'rejected');
    
    let fee = 0;
    if (withdrawalsToday.length > 0) {
      fee = amount * 0.02;
    }
    
    const flatNetworkFee = 15;
    const totalDeduction = amount + fee + flatNetworkFee;

    if (balance < totalDeduction) return { error: 'Insufficient balance' };

    const newWithdrawal = {
      id: `wd-${Date.now()}`,
      userId: user.id,
      amount,
      fee,
      networkFee: flatNetworkFee,
      totalDeduction,
      method,
      account,
      status: 'pending',
      createdAt: Date.now()
    };

    setBalance(prev => prev - totalDeduction);
    setWithdrawals([newWithdrawal, ...withdrawals]);
    return { success: true };
  };

  const approveWithdrawal = (id) => {
    setWithdrawals(withdrawals.map(w => w.id === id ? { ...w, status: 'approved' } : w));
  };

  const rejectWithdrawal = (id) => {
    const wd = withdrawals.find(w => w.id === id);
    if (wd) {
      setBalance(prev => prev + wd.totalDeduction); // Refund
    }
    setWithdrawals(withdrawals.map(w => w.id === id ? { ...w, status: 'rejected' } : w));
  };

  return (
    <AppContext.Provider value={{
      user, users, balance, activePlans, deposits, withdrawals, teamMembers,
      login, logout, registerUser, validateCredentials, submitDeposit, approveDeposit, rejectDeposit,
      requestWithdrawal, approveWithdrawal, rejectWithdrawal, setBalance
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
