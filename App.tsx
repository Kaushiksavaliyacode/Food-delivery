
import React, { useState } from 'react';
import { UserRole, AppState } from './types.ts';
import CustomerApp from './screens/CustomerApp.tsx';
import RestaurantApp from './screens/RestaurantApp.tsx';
import DeliveryApp from './screens/DeliveryApp.tsx';
import AdminPanel from './screens/AdminPanel.tsx';
import { Lock, Mail, ShieldCheck, Smartphone, ChevronRight, ArrowLeft, LogIn } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({
    role: UserRole.CUSTOMER,
    currentLocation: null,
    savedAddresses: [],
    cart: [],
    activeOrder: null,
    isLoggedIn: false
  });

  // Login UI states
  const [authStep, setAuthStep] = useState<'login' | 'role'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Hardcoded "Admin" bypass or general "Success"
      if (email === 'admin@foodgo.com' && password === 'admin') {
        setAppState(prev => ({
          ...prev,
          role: UserRole.ADMIN,
          isLoggedIn: true,
          userEmail: email
        }));
      } else {
        setAuthStep('role');
      }
    }, 1200);
  };

  const selectRoleAndLogin = (role: UserRole) => {
    setAppState(prev => ({
      ...prev,
      role: role,
      isLoggedIn: true,
      userEmail: email
    }));
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
    setAuthStep('login');
    setEmail('');
    setPassword('');
    setError('');
  };

  const renderApp = () => {
    switch (appState.role) {
      case UserRole.CUSTOMER:
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
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 font-['Plus_Jakarta_Sans']">
        <div className="w-full max-w-[420px] bg-white rounded-[48px] p-10 shadow-2xl overflow-hidden relative min-h-[600px] flex flex-col">
          {/* Decorative background blobs */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/5 -translate-y-16 translate-x-16 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-yellow-500/5 translate-y-12 -translate-x-12 rounded-full blur-2xl"></div>
          
          <div className="text-center mb-10 relative z-10">
            <div className="w-20 h-20 bg-orange-500 rounded-[28px] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-orange-500/20 animate-in zoom-in duration-500">
              <LogIn className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-2">FoodGo</h1>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">Dreamland Ecosystem</p>
          </div>

          <div className="flex-1 flex flex-col relative z-10">
            {authStep === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-6 animate-in slide-in-from-right duration-500">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-orange-500/20 focus:bg-white rounded-2xl py-4 pl-14 pr-6 outline-none transition-all font-bold text-slate-900"
                      placeholder="name@example.com"
                      required
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
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                {error && <p className="text-red-500 text-[10px] font-black uppercase text-center animate-bounce">{error}</p>}

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black text-sm uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>Sign In <ChevronRight className="w-4 h-4" /></>
                  )}
                </button>

                <div className="text-center pt-4">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                    Test Accounts:<br/>
                    Any Email + 4-char Pass<br/>
                    <span className="text-orange-500">admin@foodgo.com / admin</span>
                  </p>
                </div>
              </form>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom duration-500">
                <button onClick={() => setAuthStep('login')} className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 hover:text-slate-900 transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back to Login
                </button>
                <h2 className="text-xl font-black text-slate-900 mb-2 text-center">Login Success!</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-10 text-center">Welcome {email}</p>
                
                <div className="space-y-4">
                  {[
                    { role: UserRole.CUSTOMER, label: 'Hungry Customer', desc: 'Order delicious food', icon: '🍔' },
                    { role: UserRole.RESTAURANT, label: 'Restaurant Partner', desc: 'Manage your kitchen', icon: '🏪' },
                    { role: UserRole.DELIVERY, label: 'Delivery Partner', desc: 'Deliver & earn big', icon: '🛵' }
                  ].map((r) => (
                    <button 
                      key={r.role}
                      onClick={() => selectRoleAndLogin(r.role)}
                      className="w-full flex items-center gap-5 p-5 bg-slate-50 border-2 border-slate-100 rounded-3xl hover:border-orange-500 hover:bg-white transition-all group"
                    >
                      <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-2xl group-hover:bg-orange-50 transition-colors">{r.icon}</div>
                      <div className="text-left">
                        <h4 className="font-black text-slate-900 text-sm">{r.label}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{r.desc}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 ml-auto text-slate-200 group-hover:text-orange-500 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-auto pt-6 text-center opacity-40">
             <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">FoodGo Authentication v3.0</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center sm:py-8 font-['Plus_Jakarta_Sans']">
      <button 
        onClick={handleLogout}
        className="fixed top-6 right-6 z-[9999] bg-white/80 backdrop-blur-xl text-slate-900 px-6 py-2.5 rounded-2xl text-[10px] font-black tracking-widest shadow-2xl hover:bg-white active:scale-95 transition-all uppercase border border-slate-100"
      >
        Sign Out
      </button>

      <div className="w-full max-w-[480px] h-screen bg-white shadow-[0_0_80px_rgba(0,0,0,0.1)] relative flex flex-col overflow-hidden sm:rounded-[48px] sm:h-[calc(100vh-64px)]">
        {renderApp()}
      </div>
    </div>
  );
};

export default App;
