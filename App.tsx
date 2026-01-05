import React, { useState, useEffect } from 'react';
import { UserRole, AppState, Order } from './types.ts';
import CustomerApp from './screens/CustomerApp.tsx';
import DeliveryApp from './screens/DeliveryApp.tsx';
import AdminPanel from './screens/AdminPanel.tsx';
import { supabase } from './supabase.ts';
import { 
  ShoppingBag, ShieldCheck, Bike, ChevronRight, 
  Smartphone, LogOut, Settings, 
  Mail, Key
} from 'lucide-react';

const App: React.FC = () => {
  const [platform, setPlatform] = useState<'NONE' | 'CUSTOMER' | 'ADMIN' | 'DELIVERY'>('NONE');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSplashing, setIsSplashing] = useState(false);
  const [isBooting, setIsBooting] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  
  const [appState, setAppState] = useState<AppState>(() => {
    const saved = localStorage.getItem('foodgo_session_state');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Hydration failed", e);
      }
    }
    return {
      role: UserRole.CUSTOMER,
      currentLocation: null,
      savedAddresses: [],
      cart: [],
      activeOrder: null,
      isLoggedIn: false,
      language: 'en',
      favorites: []
    };
  });

  // INITIAL BOOT SEQUENCE
  useEffect(() => {
    const savedPlatform = localStorage.getItem('foodgo_platform_lock');
    const authStatus = localStorage.getItem('foodgo_auth_active') === 'true';
    
    if (savedPlatform) setPlatform(savedPlatform as any);
    if (authStatus) setIsAuthenticated(true);

    fetchOrders();

    // Real-time Order Stream
    const channel = supabase
      .channel('global-ecosystem')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => fetchOrders())
      .subscribe();

    const timer = setTimeout(() => setIsBooting(false), 1000);

    return () => { 
      clearTimeout(timer);
      supabase.removeChannel(channel); 
    };
  }, []);

  // PERSISTENCE SYNC
  useEffect(() => {
    if (!isBooting) {
      localStorage.setItem('foodgo_session_state', JSON.stringify(appState));
    }
  }, [appState, isBooting]);

  const fetchOrders = async () => {
    const { data } = await supabase.from('orders').select('*').order('timestamp', { ascending: false });
    if (data) setOrders(data);
  };

  const handlePlatformLock = (type: 'CUSTOMER' | 'ADMIN' | 'DELIVERY') => {
    setIsSplashing(true);
    setPlatform(type);
    localStorage.setItem('foodgo_platform_lock', type);
    
    // Simulate App Binary Initialization
    setTimeout(() => {
      setIsSplashing(false);
    }, 2000);
  };

  const handleLogin = (id?: string) => {
    setIsAuthenticated(true);
    localStorage.setItem('foodgo_auth_active', 'true');
    setAppState(prev => ({ 
      ...prev, 
      isLoggedIn: true, 
      phoneNumber: id || prev.phoneNumber 
    }));
  };

  const handleLogout = () => {
    if(window.confirm("Do you want to sign out? This terminal will remain locked to this app role.")) {
      setIsAuthenticated(false);
      localStorage.setItem('foodgo_auth_active', 'false');
      setAppState(prev => ({ ...prev, isLoggedIn: false }));
    }
  };

  const factoryReset = () => {
    if(window.confirm("CRITICAL: This will wipe all local data and return to the Platform Selector. Proceed?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  // --- BOOT LOADER ---
  if (isBooting) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-[3px] border-slate-100 border-t-[#E23744] rounded-full animate-spin mb-4" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Initializing Core...</p>
      </div>
    );
  }

  // --- SPLASH TRANSITIONS ---
  if (isSplashing) {
    const config = {
      CUSTOMER: { color: 'bg-[#E23744]', icon: ShoppingBag, name: 'FoodGo Consumer' },
      DELIVERY: { color: 'bg-[#2563EB]', icon: Bike, name: 'Rider Logistics' },
      ADMIN: { color: 'bg-slate-900', icon: ShieldCheck, name: 'Merchant Hub' }
    }[platform as 'CUSTOMER' | 'ADMIN' | 'DELIVERY'];

    return (
      <div className={`min-h-screen ${config?.color} flex flex-col items-center justify-center text-white animate-in fade-in duration-700`}>
        <div className="w-24 h-24 bg-white/20 rounded-[40px] flex items-center justify-center mb-8 backdrop-blur-2xl animate-bounce">
          {config && <config.icon className="w-12 h-12" />}
        </div>
        <h2 className="text-xl font-black tracking-[0.2em] uppercase italic">{config?.name}</h2>
        <div className="mt-12 flex gap-1.5">
          <div className="w-2 h-2 bg-white/30 rounded-full animate-pulse" />
          <div className="w-2 h-2 bg-white/30 rounded-full animate-pulse [animation-delay:200ms]" />
          <div className="w-2 h-2 bg-white/30 rounded-full animate-pulse [animation-delay:400ms]" />
        </div>
      </div>
    );
  }

  // --- PERSISTENT PLATFORM SELECTOR (One-time Setup) ---
  if (platform === 'NONE') {
    return (
      <div className="min-h-screen bg-[#F8F9FB] flex flex-col items-center justify-center p-6 font-['Plus_Jakarta_Sans']">
        <div className="w-full max-w-sm space-y-12">
          <div className="text-center">
            <h1 className="text-6xl font-black text-slate-900 tracking-tighter italic">FoodGo<span className="text-[#E23744]">.</span></h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] mt-6">Enterprise Entry Point</p>
          </div>

          <div className="grid gap-4">
            {[
              { id: 'CUSTOMER', name: 'Consumer App', sub: 'Food & Groceries', icon: '🍕' },
              { id: 'DELIVERY', name: 'Fleet Terminal', sub: 'Rider Logistics', icon: '🛵' },
              { id: 'ADMIN', name: 'Merchant Pro', sub: 'Business Control', icon: '📊' }
            ].map((app) => (
              <button 
                key={app.id}
                onClick={() => handlePlatformLock(app.id as any)}
                className="group bg-white p-6 rounded-[36px] border border-slate-100 shadow-xl shadow-slate-200/50 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-6 text-left"
              >
                <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-4xl group-hover:rotate-6 transition-transform">{app.icon}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-black text-slate-900 leading-none">{app.name}</h3>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">{app.sub}</p>
                </div>
                <ChevronRight className="w-6 h-6 text-slate-200 group-hover:translate-x-1 transition-transform" />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- LIFETIME AUTHENTICATION (Standalone Look) ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="text-center">
             <h2 className="text-4xl font-black text-slate-900 italic tracking-tighter">
                {platform === 'CUSTOMER' ? 'Welcome.' : platform === 'DELIVERY' ? 'Rider Ops.' : 'Admin Hub.'}
             </h2>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-4">Security Credentials Required</p>
          </div>

          <div className="space-y-4">
            {platform === 'CUSTOMER' ? (
              <div className="relative">
                <Smartphone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                <input 
                  type="tel" 
                  id="phone_input"
                  placeholder="Mobile Number" 
                  className="w-full bg-slate-50 border-2 border-slate-100 focus:border-[#E23744]/20 py-6 pl-16 pr-6 rounded-[32px] outline-none font-bold text-sm" 
                />
              </div>
            ) : (
              <>
                <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                  <input type="email" placeholder="Work Email" className="w-full bg-slate-50 border-2 border-slate-100 py-6 pl-16 pr-6 rounded-[32px] outline-none font-bold text-sm" />
                </div>
                <div className="relative">
                  <Key className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                  <input type="password" placeholder="Passcode" className="w-full bg-slate-50 border-2 border-slate-100 py-6 pl-16 pr-6 rounded-[32px] outline-none font-bold text-sm" />
                </div>
              </>
            )}
            
            <button 
              onClick={() => {
                const el = document.getElementById('phone_input') as HTMLInputElement;
                handleLogin(el?.value);
              }}
              className={`w-full py-6 rounded-[32px] font-black text-white text-[11px] uppercase tracking-[0.25em] shadow-2xl transition-all active:scale-95 
                ${platform === 'CUSTOMER' ? 'bg-[#E23744] shadow-red-500/30' : 
                  platform === 'DELIVERY' ? 'bg-blue-600 shadow-blue-500/30' : 
                  'bg-slate-900 shadow-slate-900/30'}`}
            >
              Sign In to Terminal
            </button>

            <button onClick={() => setPlatform('NONE')} className="w-full py-4 text-slate-300 text-[9px] font-black uppercase tracking-widest hover:text-slate-900 transition-colors">
              Wrong App? Switch Role
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- ACTIVE APP TERMINAL ---
  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col items-center sm:py-8 font-['Plus_Jakarta_Sans'] select-none">
      <div className="w-full max-w-[480px] h-screen bg-white shadow-[0_0_100px_rgba(0,0,0,0.15)] relative flex flex-col overflow-hidden sm:rounded-[60px] sm:h-[calc(100vh-64px)] border-[10px] border-white ring-1 ring-slate-200">
        
        {/* Hidden System Trigger (Hover Top-Right) */}
        <div className="absolute top-6 right-8 z-[1000] group">
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
             <button onClick={handleLogout} title="Sign Out" className="p-3 bg-white/95 backdrop-blur rounded-full border shadow-xl text-slate-400 hover:text-red-500"><LogOut className="w-4 h-4" /></button>
             <button onClick={factoryReset} title="Factory Reset" className="p-3 bg-white/95 backdrop-blur rounded-full border shadow-xl text-slate-400 hover:text-slate-900"><Settings className="w-4 h-4" /></button>
          </div>
        </div>

        {platform === 'CUSTOMER' && <CustomerApp state={appState} setState={setAppState} orders={orders} />}
        {platform === 'ADMIN' && <AdminPanel orders={orders} />}
        {platform === 'DELIVERY' && <DeliveryApp orders={orders} setOrders={setOrders} />}
      </div>
    </div>
  );
};

export default App;