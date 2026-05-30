import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Plans from './pages/Plans';
import Team from './pages/Team';
import Withdraw from './pages/Withdraw';
import Support from './pages/Support';
import AdminPanel from './pages/AdminPanel';

const ProtectedRoute = ({ children }) => {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" />;
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Login />} />
      
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="plans" element={<Plans />} />
        <Route path="team" element={<Team />} />
        <Route path="withdraw" element={<Withdraw />} />
        <Route path="support" element={<Support />} />
      </Route>

      <Route path="/secret-adeel-panel" element={<AdminPanel />} />
      
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AppProvider>
  );
}

export default App;
