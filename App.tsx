
import React, { useState, useEffect } from 'react';
import { UserRole, AppState, Order, OrderStatus } from './types.ts';
import CustomerApp from './screens/CustomerApp.tsx';
import RestaurantApp from './screens/RestaurantApp.tsx';
import DeliveryApp from './screens/DeliveryApp.tsx';
import AdminPanel from './screens/AdminPanel.tsx';
import { supabase } from './supabase.ts';
import { 
  Smartphone, ChevronRight, ArrowLeft, ShieldCheck, 
  Lock, CheckCircle2, Loader2, BookOpen, Globe, Layout 
} from 'lucide-react';

const App: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
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

  // Load persistence
  useEffect(() => {
    const savedUser = localStorage.getItem('foodgo_user_session');
    if (savedUser) {
      setAppState(JSON.parse(savedUser));
    }
    fetchOrders();
    
    // Subscribe to real-time order updates
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, payload => {
        fetchOrders();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchOrders = async () => {
    const { data, error } = await supabase.from('orders').select('*').order('timestamp', { ascending: false });
    if (data) setOrders(data);
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) return;
    setIsLoading(true);
    setTimeout(() => {
      setAuthStep('otp');
      setIsLoading(false);
    }, 1200);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) return;
    setIsLoading(true);
    setTimeout(() => {
      setAuthStep('role');
      setIsLoading(false);
    }, 1000);
  };

  const selectRoleAndLogin = (role: UserRole) => {
    const newState = { 
      ...appState, 
      role, 
      isLoggedIn: true, 
      phoneNumber: phone 
    };
    setAppState(newState);
    localStorage.setItem('foodgo_user_session', JSON.stringify(newState));
  };

  const logout = () => {
    localStorage.removeItem('foodgo_user_session');
    setAppState(prev => ({ ...prev, isLoggedIn: false }));
    setAuthStep('phone');
    setPhone('');
    setOtp('');
  };

  const renderRoleApp = () => {
    switch (appState.role) {
      case UserRole.CUSTOMER: return <CustomerApp state={appState} setState={setAppState} orders={orders} />;
      case UserRole.RESTAURANT: return <RestaurantApp orders={orders} />;
      case UserRole.DELIVERY: return <DeliveryApp orders={orders} setOrders={setOrders} />;
      case UserRole.ADMIN: return <AdminPanel orders={orders} />;
      default: return <CustomerApp state={appState} setState={setAppState} orders={orders} />;
    }
  };

  if (!appState.isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#F0F2F5] flex flex-col items-center justify-center p-6 sm:p-0">
        <div className="w-full max-w-[440px] bg-white rounded-[48px] p-10 shadow-[0_24px_80px_rgba(0,0,0,0.1)] relative min-h-[780px] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-700">
          
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-red-50 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-yellow-50 rounded-full blur-3xl opacity-50"></div>

          <div className="text-center mt-12 mb-16 relative z-10">
            <div className="w-24 h-24 bg-[#E23744] rounded-[36px] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-red-500/30 animate-float">
              <Smartphone className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter">FoodGo</h1>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mt-3 opacity-60">Connected Ecosystem</p>
          </div>

          <div className="flex-1 relative z-10">
            {authStep === 'phone' && (
              <form onSubmit={handlePhoneSubmit} className="space-y-8 animate-in slide-in-from-bottom-12 duration-500">
                <div className="space-y-3">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Welcome back</h2>
                  <p className="text-sm text-slate-400 font-medium">Verify your phone to access the fleet</p>
                </div>
                <div className="relative group">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-3 border-r pr-4 border-slate-100 group-focus-within:border-red-500/20 transition-colors">
                    <span className="font-black text-slate-900 text-lg">+91</span>
                  </div>
                  <input 
                    type="tel" 
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-red-500/10 focus:bg-white rounded-[32px] py-7 pl-24 pr-8 outline-none transition-all font-black text-xl tracking-widest shadow-inner"
                    placeholder="98765 43210"
                    required
                  />
                </div>
                <button 
                  type="submit"
                  disabled={phone.length < 10 || isLoading}
                  className="w-full bg-[#E23744] text-white py-6 rounded-[32px] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-red-500/20 bouncy-click disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Get OTP <ChevronRight className="w-5 h-5" /></>}
                </button>
              </form>
            )}

            {authStep === 'otp' && (
              <form onSubmit={handleOtpSubmit} className="space-y-8 animate-in slide-in-from-right-12 duration-500">
                <div className="space-y-3">
                  <button onClick={() => setAuthStep('phone')} className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 hover:text-[#E23744] transition-colors">
                    <ArrowLeft className="w-5 h-5" /> Change Number
                  </button>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Security Check</h2>
                  <p className="text-sm text-slate-400 font-medium">Enter the 6-digit code sent to +91 {phone}</p>
                </div>
                <div className="relative">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-7 h-7 text-slate-300" />
                  <input 
                    type="text" 
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-red-500/10 focus:bg-white rounded-[32px] py-7 pl-16 pr-8 outline-none transition-all font-black text-3xl tracking-[0.4em] text-center shadow-inner"
                    placeholder="000000"
                    required
                  />
                </div>
                <button 
                  type="submit"
                  disabled={otp.length < 6 || isLoading}
                  className="w-full bg-slate-900 text-white py-6 rounded-[32px] font-black text-sm uppercase tracking-widest shadow-2xl bouncy-click flex items-center justify-center gap-3"
                >
                  {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Verify & Secure <ShieldCheck className="w-5 h-5" /></>}
                </button>
              </form>
            )}

            {authStep === 'role' && (
              <div className="space-y-6 animate-in slide-in-from-bottom-12 duration-500">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-500 drop-shadow-lg" />
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Authenticated</h2>
                  <p className="text-sm text-slate-400 font-medium">Choose your entry point</p>
                </div>
                <div className="space-y-4">
                  {[
                    { role: UserRole.CUSTOMER, label: 'Order Food', icon: '🍔', desc: 'Explore top restaurants', color: 'bg-orange-50' },
                    { role: UserRole.RESTAURANT, label: 'Kitchen Manager', icon: '🏪', desc: 'Manage menu & live orders', color: 'bg-red-50' },
                    { role: UserRole.DELIVERY, label: 'Delivery Partner', icon: '🛵', desc: 'Join the logistics fleet', color: 'bg-blue-50' },
                    { role: UserRole.ADMIN, label: 'System Admin', icon: '⚙️', desc: 'Global platform control', color: 'bg-slate-50' }
                  ].map((r) => (
                    <button 
                      key={r.role}
                      onClick={() => selectRoleAndLogin(r.role)}
                      className="w-full flex items-center gap-5 p-5 bg-white border-2 border-slate-50 rounded-[28px] hover:border-[#E23744]/20 hover:shadow-xl hover:shadow-red-500/5 transition-all group relative overflow-hidden"
                    >
                      <div className={`w-14 h-14 ${r.color} rounded-2xl flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 transition-transform`}>{r.icon}</div>
                      <div className="text-left flex-1">
                        <h4 className="font-black text-slate-900 text-sm">{r.label}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5 opacity-60">{r.desc}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-[#E23744] group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col items-center sm:py-8 font-['Plus_Jakarta_Sans'] select-none">
      <div className="w-full max-w-[480px] h-screen bg-white shadow-[0_0_100px_rgba(0,0,0,0.12)] relative flex flex-col overflow-hidden sm:rounded-[56px] sm:h-[calc(100vh-64px)] border-[8px] border-white ring-1 ring-slate-200">
        {renderRoleApp()}
        <button 
          onClick={logout}
          className="absolute top-6 right-6 z-[1000] bg-white/40 backdrop-blur-md p-4 rounded-3xl shadow-lg border border-white/30 opacity-10 hover:opacity-100 transition-all bouncy-click"
        >
          <ArrowLeft className="w-6 h-6 text-slate-900" />
        </button>
      </div>
    </div>
  );
};

export default App;
