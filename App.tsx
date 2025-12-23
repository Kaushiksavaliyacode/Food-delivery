
import React, { useState } from 'react';
import { UserRole, AppState } from './types.ts';
import CustomerApp from './screens/CustomerApp.tsx';
import RestaurantApp from './screens/RestaurantApp.tsx';
import DeliveryApp from './screens/DeliveryApp.tsx';
import AdminPanel from './screens/AdminPanel.tsx';
import { Lock, User as UserIcon, ShieldCheck, Phone, Smartphone, ChevronRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

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
  const [loginMode, setLoginMode] = useState<'phone' | 'admin'>('phone');
  const [authStep, setAuthStep] = useState<'input' | 'otp' | 'role'>('input');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // Master bypasses for testing as requested
    if (username === 'A' && password === 'A') {
      setAppState(prev => ({ ...prev, role: UserRole.ADMIN, isLoggedIn: true }));
    } else if (username === 'B' && password === 'B') {
      setAppState(prev => ({ ...prev, role: UserRole.CUSTOMER, isLoggedIn: true }));
    } else if (username === 'D' && password === 'D') {
      setAppState(prev => ({ ...prev, role: UserRole.DELIVERY, isLoggedIn: true }));
    } else if (username === 'R' && password === 'R') {
      setAppState(prev => ({ ...prev, role: UserRole.RESTAURANT, isLoggedIn: true }));
    } else {
      setError('Invalid admin credentials.');
    }
  };

  const handlePhoneSubmit = () => {
    if (phone.length < 10) {
      setError('Enter a valid 10-digit number');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAuthStep('otp');
      setError('');
    }, 800);
  };

  const handleOtpSubmit = () => {
    if (otp.some(d => d === '')) {
      setError('Complete the 4-digit OTP');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAuthStep('role');
      setError('');
    }, 800);
  };

  const selectRoleAndLogin = (role: UserRole) => {
    setAppState(prev => ({
      ...prev,
      role: role,
      isLoggedIn: true,
      userPhone: `+91${phone}`
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
    setAuthStep('input');
    setPhone('');
    setOtp(['', '', '', '']);
    setUsername('');
    setPassword('');
    setLoginMode('phone');
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
              <Smartphone className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-2">FoodGo</h1>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">India's Next-Gen Fleet</p>
          </div>

          <div className="flex-1 flex flex-col relative z-10">
            {loginMode === 'phone' ? (
              <div className="space-y-6 animate-in slide-in-from-right duration-500">
                {authStep === 'input' && (
                  <>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-3 block">Phone Number</label>
                      <div className="flex gap-3">
                        <div className="bg-slate-50 rounded-2xl px-5 py-4 font-black text-slate-900 border border-slate-100">+91</div>
                        <input 
                          type="tel" 
                          maxLength={10}
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                          className="flex-1 bg-slate-50 border-2 border-transparent focus:border-orange-500/20 focus:bg-white rounded-2xl py-4 px-6 outline-none transition-all font-bold text-lg text-slate-900"
                          placeholder="98765 43210"
                        />
                      </div>
                      {error && <p className="text-red-500 text-[10px] font-black uppercase mt-2 ml-1">{error}</p>}
                    </div>
                    <button 
                      onClick={handlePhoneSubmit}
                      disabled={isLoading || phone.length < 10}
                      className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black text-sm uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <>Send Verification Code <ChevronRight className="w-4 h-4" /></>}
                    </button>
                    <button 
                      onClick={() => setLoginMode('admin')}
                      className="w-full text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-slate-500 transition-colors mt-4"
                    >
                      Switch to ID/Pass Login
                    </button>
                  </>
                )}

                {authStep === 'otp' && (
                  <div className="animate-in fade-in slide-in-from-right duration-500">
                    <button onClick={() => setAuthStep('input')} className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 hover:text-slate-900 transition-colors">
                      <ArrowLeft className="w-4 h-4" /> Change Number
                    </button>
                    <h2 className="text-xl font-black text-slate-900 mb-2">Verify Phone</h2>
                    <p className="text-xs text-slate-400 font-medium mb-8">OTP sent to +91 {phone}</p>
                    
                    <div className="flex justify-between gap-4 mb-10">
                      {otp.map((digit, i) => (
                        <input 
                          key={i}
                          type="text"
                          maxLength={1}
                          className="w-14 h-16 bg-slate-50 rounded-2xl text-center text-2xl font-black border-2 border-transparent focus:border-orange-500 focus:bg-white outline-none transition-all"
                          value={digit}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            if (val.length > 1) return;
                            const next = [...otp];
                            next[i] = val;
                            setOtp(next);
                            if (val && i < 3) {
                              const nextInput = e.currentTarget.nextElementSibling as HTMLInputElement;
                              nextInput?.focus();
                            }
                          }}
                        />
                      ))}
                    </div>

                    <button 
                      onClick={handleOtpSubmit}
                      disabled={isLoading}
                      className="w-full bg-orange-600 text-white py-5 rounded-3xl font-black text-sm uppercase tracking-widest shadow-xl shadow-orange-600/20 active:scale-95 transition-all"
                    >
                      {isLoading ? "Verifying..." : "Verify OTP"}
                    </button>
                  </div>
                )}

                {authStep === 'role' && (
                  <div className="animate-in fade-in slide-in-from-bottom duration-500">
                    <h2 className="text-xl font-black text-slate-900 mb-2 text-center">Verification Success!</h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-10 text-center">Select your role to proceed</p>
                    
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
            ) : (
              <form onSubmit={handleAdminLogin} className="space-y-6 animate-in slide-in-from-left duration-500">
                <button onClick={() => setLoginMode('phone')} className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 hover:text-slate-900 transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back to Phone Login
                </button>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Username / ID</label>
                  <div className="relative">
                    <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                    <input 
                      type="text" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-orange-500/20 focus:bg-white rounded-2xl py-4 pl-14 pr-6 outline-none transition-all font-bold text-slate-900"
                      placeholder="Enter ID (A, B, D, R)"
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
                {error && <p className="text-red-500 text-[10px] font-black uppercase text-center">{error}</p>}
                <button 
                  type="submit"
                  className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black text-sm uppercase tracking-widest shadow-xl active:scale-95 transition-all"
                >
                  Authorize Access
                </button>
              </form>
            )}
          </div>
          
          <div className="mt-auto pt-6 text-center opacity-40">
             <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Secured Gateway v2.1</p>
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
