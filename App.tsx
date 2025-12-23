
import React, { useState } from 'react';
import { UserRole, AppState } from './types';
import CustomerApp from './screens/CustomerApp';
import RestaurantApp from './screens/RestaurantApp';
import DeliveryApp from './screens/DeliveryApp';
import AdminPanel from './screens/AdminPanel';
import { Lock, User as UserIcon, ShieldCheck } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({
    role: UserRole.CUSTOMER,
    currentLocation: null,
    savedAddresses: [],
    cart: [],
    activeOrder: null,
    isLoggedIn: false
  });

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    let role: UserRole | null = null;

    if (username === 'A' && password === 'A') {
      role = UserRole.ADMIN;
    } else if (username === 'B' && password === 'B') {
      role = UserRole.CUSTOMER;
    } else if (username === 'D' && password === 'D') {
      role = UserRole.DELIVERY;
    } else if (username === 'R' && password === 'R') {
      role = UserRole.RESTAURANT;
    }

    if (role) {
      setAppState(prev => ({
        ...prev,
        role: role!,
        isLoggedIn: true,
        userPhone: role === UserRole.CUSTOMER ? '555-0123' : undefined
      }));
    } else {
      setError('Invalid credentials. Use A/A, B/B, D/D, or R/R.');
    }
  };

  const handleLogout = () => {
    setAppState({
      role: UserRole.CUSTOMER,
      currentLocation: null,
      savedAddresses: [],
      cart: [],
      activeOrder: null,
      isLoggedIn: false
    });
    setUsername('');
    setPassword('');
  };

  const renderApp = () => {
    switch (appState.role) {
      case UserRole.CUSTOMER:
        // When logged in via main portal, start at home or location
        return <CustomerApp state={appState} setState={setAppState} />;
      case UserRole.RESTAURANT:
        return <RestaurantApp />;
      case UserRole.DELIVERY:
        return <DeliveryApp />;
      case UserRole.ADMIN:
        return <AdminPanel />;
      default:
        return <CustomerApp state={appState} setState={setAppState} />;
    }
  };

  if (!appState.isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <div className="w-full max-w-[400px] bg-white rounded-[40px] p-10 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 -translate-y-12 translate-x-12 rounded-full"></div>
          
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-orange-500/20">
              <ShieldCheck className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-2">FoodGo Portal</h1>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Sign in to your dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Username</label>
              <div className="relative">
                <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-orange-500/20 focus:bg-white rounded-2xl py-4 pl-14 pr-6 outline-none transition-all font-bold text-slate-900"
                  placeholder="A, B, D, or R"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-orange-500/20 focus:bg-white rounded-2xl py-4 pl-14 pr-6 outline-none transition-all font-bold text-slate-900"
                  placeholder="••••"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-[10px] font-black uppercase text-center">{error}</p>
            )}

            <button 
              type="submit"
              className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black text-sm uppercase tracking-widest shadow-xl active:scale-95 transition-all"
            >
              Enter Dashboard
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100 flex justify-center gap-6 opacity-30 grayscale">
            <span className="text-[10px] font-black uppercase tracking-tighter">Admin (A)</span>
            <span className="text-[10px] font-black uppercase tracking-tighter">User (B)</span>
            <span className="text-[10px] font-black uppercase tracking-tighter">Rider (D)</span>
            <span className="text-[10px] font-black uppercase tracking-tighter">Partner (R)</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center sm:py-8">
      {/* Logout button for convenience */}
      <button 
        onClick={handleLogout}
        className="fixed top-6 right-6 z-[9999] bg-white/80 backdrop-blur-xl text-slate-900 px-6 py-2.5 rounded-2xl text-[10px] font-black tracking-widest shadow-2xl hover:bg-white active:scale-95 transition-all uppercase border border-slate-100"
      >
        Sign Out
      </button>

      {/* Main Responsive Mobile Viewport Container */}
      <div className="w-full max-w-[480px] h-screen bg-white shadow-[0_0_80px_rgba(0,0,0,0.1)] relative flex flex-col overflow-hidden sm:rounded-[48px] sm:h-[calc(100vh-64px)]">
        {renderApp()}
      </div>
    </div>
  );
};

export default App;
