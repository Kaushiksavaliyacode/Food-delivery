
import React, { useState } from 'react';
import { UserRole, AppState } from './types.ts';
import CustomerApp from './screens/CustomerApp.tsx';
import RestaurantApp from './screens/RestaurantApp.tsx';
import DeliveryApp from './screens/DeliveryApp.tsx';
import AdminPanel from './screens/AdminPanel.tsx';
import { Smartphone, ChevronRight, ArrowLeft, ShieldCheck, Lock, CheckCircle2, Loader2, Info } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({
    role: UserRole.CUSTOMER,
    currentLocation: null,
    savedAddresses: [],
    cart: [],
    activeOrder: null,
    isLoggedIn: false
  });

  const [authStep, setAuthStep] = useState<'phone' | 'otp' | 'role'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // SIMULATED FREE OTP HANDLER
  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) return;
    setIsLoading(true);
    
    // Architect hook: This is where you'd call Firebase Auth
    // const confirmation = await auth().signInWithPhoneNumber(phone);
    
    setTimeout(() => {
      setIsLoading(false);
      setAuthStep('otp');
    }, 1500);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) return;
    setIsLoading(true);

    // Sandbox Logic: Accept any code ending in "0" or "1234"
    setTimeout(() => {
      setIsLoading(false);
      if (phone === '9999999999' && otp === '1234') {
        setAppState(prev => ({
          ...prev,
          role: UserRole.ADMIN,
          isLoggedIn: true,
          phoneNumber: phone
        }));
      } else {
        setAuthStep('role');
      }
    }, 1500);
  };

  const selectRoleAndLogin = (role: UserRole) => {
    setAppState(prev => ({
      ...prev,
      role: role,
      isLoggedIn: true,
      phoneNumber: phone
    }));
  };

  const renderApp = () => {
    switch (appState.role) {
      case UserRole.CUSTOMER: return <CustomerApp state={appState} setState={setAppState} />;
      case UserRole.RESTAURANT: return <RestaurantApp />;
      case UserRole.DELIVERY: return <DeliveryApp />;
      case UserRole.ADMIN: return <AdminPanel />;
      default: return <CustomerApp state={appState} setState={setAppState} />;
    }
  };

  if (!appState.isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#F4F4F4] flex items-center justify-center p-4 font-['Plus_Jakarta_Sans']">
        <div className="w-full max-w-[420px] bg-white rounded-[40px] p-8 shadow-2xl relative min-h-[650px] flex flex-col overflow-hidden">
          {/* Brand Header */}
          <div className="text-center mt-8 mb-12">
            <div className="w-20 h-20 bg-[#E23744] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-red-500/20">
              <Smartphone className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">FoodGo</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Premium Delivery Ecosystem</p>
          </div>

          <div className="flex-1">
            {authStep === 'phone' && (
              <form onSubmit={handlePhoneSubmit} className="space-y-6 animate-in slide-in-from-bottom duration-500">
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-slate-900">Sign in</h2>
                  <p className="text-sm text-slate-400 font-medium">Enter your phone number to proceed</p>
                </div>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r pr-3 border-slate-200">
                    <span className="font-bold text-slate-900">+91</span>
                  </div>
                  <input 
                    type="tel" 
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-red-500/20 focus:bg-white rounded-[24px] py-5 pl-20 pr-6 outline-none transition-all font-bold text-lg tracking-widest"
                    placeholder="98765 43210"
                    required
                  />
                </div>
                
                <div className="bg-blue-50 p-4 rounded-2xl flex gap-3">
                   <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />
                   <p className="text-[9px] font-bold text-blue-600 leading-relaxed uppercase">Sandbox Mode Enabled: <br/>Use any 10-digit number. real sms cost avoided.</p>
                </div>

                <button 
                  type="submit"
                  disabled={phone.length < 10 || isLoading}
                  className="w-full bg-[#E23744] text-white py-5 rounded-[24px] font-black text-sm uppercase tracking-widest shadow-xl shadow-red-500/20 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Send OTP <ChevronRight className="w-4 h-4" /></>}
                </button>
              </form>
            )}

            {authStep === 'otp' && (
              <form onSubmit={handleOtpSubmit} className="space-y-6 animate-in slide-in-from-right duration-500">
                <div className="space-y-2">
                  <button onClick={() => setAuthStep('phone')} className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                    <ArrowLeft className="w-4 h-4" /> Change Number
                  </button>
                  <h2 className="text-2xl font-black text-slate-900">OTP Sent</h2>
                  <p className="text-sm text-slate-400 font-medium">Verify code sent to +91 {phone}</p>
                </div>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300" />
                  <input 
                    type="text" 
                    maxLength={4}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-red-500/20 focus:bg-white rounded-[24px] py-5 pl-16 pr-6 outline-none transition-all font-black text-2xl tracking-[1em]"
                    placeholder="0000"
                    required
                  />
                </div>
                <p className="text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">Test Code: 1234</p>
                <button 
                  type="submit"
                  disabled={otp.length < 4 || isLoading}
                  className="w-full bg-slate-900 text-white py-5 rounded-[24px] font-black text-sm uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Verify & Login <ShieldCheck className="w-4 h-4" /></>}
                </button>
              </form>
            )}

            {authStep === 'role' && (
              <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
                <div className="text-center mb-8">
                  <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-black text-slate-900">Verification Done</h2>
                  <p className="text-sm text-slate-400 font-medium">Choose your workspace</p>
                </div>
                <div className="space-y-4">
                  {[
                    { role: UserRole.CUSTOMER, label: 'Customer', icon: '🍔', desc: 'Order Food' },
                    { role: UserRole.RESTAURANT, label: 'Restaurant', icon: '🏪', desc: 'Merchant Hub' },
                    { role: UserRole.DELIVERY, label: 'Delivery', icon: '🛵', desc: 'Fleet Partner' }
                  ].map((r) => (
                    <button 
                      key={r.role}
                      onClick={() => selectRoleAndLogin(r.role)}
                      className="w-full flex items-center gap-5 p-5 bg-slate-50 border-2 border-transparent rounded-[24px] hover:border-red-500/30 hover:bg-white transition-all group shadow-sm"
                    >
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm group-hover:bg-red-50">{r.icon}</div>
                      <div className="text-left flex-1">
                        <h4 className="font-black text-slate-900 text-sm">{r.label}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{r.desc}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-red-500" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="mt-8 text-center text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">Powered by FoodGo Platform</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col items-center sm:py-8 font-['Plus_Jakarta_Sans']">
      <div className="w-full max-w-[480px] h-screen bg-white shadow-[0_0_80px_rgba(0,0,0,0.08)] relative flex flex-col overflow-hidden sm:rounded-[40px] sm:h-[calc(100vh-64px)]">
        {renderApp()}
        <button 
          onClick={() => setAppState(p => ({ ...p, isLoggedIn: false }))}
          className="absolute top-6 right-6 z-[9999] bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-slate-100 opacity-20 hover:opacity-100 transition-opacity"
        >
          <ArrowLeft className="w-5 h-5 text-slate-400" />
        </button>
      </div>
    </div>
  );
};

export default App;
