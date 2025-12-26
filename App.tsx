import React, { useState, useEffect } from 'react';
import { UserRole, AppState } from './types.ts';
import CustomerApp from './screens/CustomerApp.tsx';
import RestaurantApp from './screens/RestaurantApp.tsx';
import DeliveryApp from './screens/DeliveryApp.tsx';
import AdminPanel from './screens/AdminPanel.tsx';
import DesignDocs from './screens/DesignDocs.tsx';
import { Smartphone, ChevronRight, ArrowLeft, ShieldCheck, Lock, CheckCircle2, Loader2, BookOpen } from 'lucide-react';
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  onAuthStateChanged, 
  ConfirmationResult,
  signOut
} from 'firebase/auth';
import { doc, getDoc, setDoc, collection, limit, query, getDocs } from 'firebase/firestore';
import { auth, db } from './firebase.ts';

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
  const [showDocs, setShowDocs] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  // Health Check and Persistence
  useEffect(() => {
    // 1. Firebase Health Check
    const checkFirebase = async () => {
      try {
        await getDocs(query(collection(db, "health_check"), limit(1)));
        console.log("✅ Firebase System: Online");
      } catch (e: any) {
        console.warn("ℹ️ Firebase System: Ready (Permissions pending)", e.message);
      }
    };
    checkFirebase();

    // 2. Auth State Listener
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setAppState(prev => ({ 
            ...prev, 
            isLoggedIn: true, 
            role: userData.role, 
            phoneNumber: user.phoneNumber || '' 
          }));
        } else {
          setAuthStep('role');
        }
      } else {
        setAppState(prev => ({ ...prev, isLoggedIn: false }));
        setAuthStep('phone');
      }
    });
    return () => unsubscribe();
  }, []);

  const setupRecaptcha = () => {
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      });
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) return;
    setIsLoading(true);
    try {
      setupRecaptcha();
      const appVerifier = (window as any).recaptchaVerifier;
      const formatPhone = `+91${phone}`;
      const confirmation = await signInWithPhoneNumber(auth, formatPhone, appVerifier);
      setConfirmationResult(confirmation);
      setAuthStep('otp');
    } catch (error) {
      console.error("SMS Error:", error);
      alert("Error sending SMS. Check console.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmationResult || otp.length < 6) return;
    setIsLoading(true);
    try {
      const result = await confirmationResult.confirm(otp);
      const user = result.user;
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setAppState(prev => ({ ...prev, role: userData.role, isLoggedIn: true, phoneNumber: user.phoneNumber || '' }));
      } else {
        setAuthStep('role');
      }
    } catch (error) {
      console.error("OTP Error:", error);
      alert("Invalid Code");
    } finally {
      setIsLoading(false);
    }
  };

  const selectRoleAndLogin = async (role: UserRole) => {
    const user = auth.currentUser;
    if (!user) return;
    setIsLoading(true);
    try {
      await setDoc(doc(db, 'users', user.uid), {
        role,
        phoneNumber: user.phoneNumber,
        createdAt: Date.now()
      });
      setAppState(prev => ({ ...prev, role: role, isLoggedIn: true, phoneNumber: user.phoneNumber || '' }));
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => signOut(auth);

  const renderApp = () => {
    switch (appState.role) {
      case UserRole.CUSTOMER: return <CustomerApp state={appState} setState={setAppState} />;
      case UserRole.RESTAURANT: return <RestaurantApp />;
      case UserRole.DELIVERY: return <DeliveryApp />;
      case UserRole.ADMIN: return <AdminPanel />;
      default: return <CustomerApp state={appState} setState={setAppState} />;
    }
  };

  if (showDocs) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-8">
      <div className="w-full max-w-[800px] h-[90vh] bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col">
        <DesignDocs onClose={() => setShowDocs(false)} />
      </div>
    </div>
  );

  if (!appState.isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#F4F4F4] flex flex-col items-center justify-center p-4 font-['Plus_Jakarta_Sans']">
        <div id="recaptcha-container"></div>
        <div className="w-full max-w-[420px] bg-white rounded-[48px] p-10 shadow-2xl relative min-h-[700px] flex flex-col overflow-hidden">
          
          <button onClick={() => setShowDocs(true)} className="absolute top-8 right-8 flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-2xl font-black text-[9px] uppercase tracking-widest shadow-xl active:scale-95 transition-all">
             <BookOpen className="w-4 h-4" /> System Specs
          </button>

          <div className="text-center mt-12 mb-16">
            <div className="w-24 h-24 bg-[#E23744] rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-red-500/20">
              <Smartphone className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter">FoodGo</h1>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mt-3 opacity-60">Firebase Powered Ecosystem</p>
          </div>

          <div className="flex-1">
            {authStep === 'phone' && (
              <form onSubmit={handlePhoneSubmit} className="space-y-8 animate-in slide-in-from-bottom duration-500">
                <div className="space-y-3">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Sign in</h2>
                  <p className="text-sm text-slate-400 font-medium">Verify your identity via phone number</p>
                </div>
                <div className="relative">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-3 border-r pr-4 border-slate-200">
                    <span className="font-black text-slate-900 text-lg">+91</span>
                  </div>
                  <input 
                    type="tel" 
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-red-500/10 focus:bg-white rounded-[32px] py-7 pl-24 pr-8 outline-none transition-all font-black text-xl tracking-widest"
                    placeholder="98765 43210"
                    required
                  />
                </div>
                <button 
                  type="submit"
                  disabled={phone.length < 10 || isLoading}
                  className="w-full bg-[#E23744] text-white py-6 rounded-[32px] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-red-500/20 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Continue <ChevronRight className="w-5 h-5" /></>}
                </button>
              </form>
            )}

            {authStep === 'otp' && (
              <form onSubmit={handleOtpSubmit} className="space-y-8 animate-in slide-in-from-right duration-500">
                <div className="space-y-3">
                  <button onClick={() => setAuthStep('phone')} className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">
                    <ArrowLeft className="w-5 h-5" /> Change Number
                  </button>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Security Code</h2>
                  <p className="text-sm text-slate-400 font-medium">Enter the 6-digit code sent to you</p>
                </div>
                <div className="relative">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-7 h-7 text-slate-300" />
                  <input 
                    type="text" 
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-red-500/10 focus:bg-white rounded-[32px] py-7 pl-16 pr-8 outline-none transition-all font-black text-3xl tracking-[0.4em] text-center"
                    placeholder="000000"
                    required
                  />
                </div>
                <button 
                  type="submit"
                  disabled={otp.length < 6 || isLoading}
                  className="w-full bg-slate-900 text-white py-6 rounded-[32px] font-black text-sm uppercase tracking-widest shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Confirm & Enter <ShieldCheck className="w-5 h-5" /></>}
                </button>
              </form>
            )}

            {authStep === 'role' && (
              <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
                <div className="text-center mb-10">
                  <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6 drop-shadow-lg" />
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Verified!</h2>
                  <p className="text-sm text-slate-400 font-medium">Choose your workspace entrance</p>
                </div>
                <div className="space-y-5">
                  {[
                    { role: UserRole.CUSTOMER, label: 'Customer', icon: '🍔', desc: 'Order delicious food' },
                    { role: UserRole.RESTAURANT, label: 'Restaurant', icon: '🏪', desc: 'Manage your kitchen' },
                    { role: UserRole.DELIVERY, label: 'Delivery', icon: '🛵', desc: 'Join the courier fleet' }
                  ].map((r) => (
                    <button 
                      key={r.role}
                      onClick={() => selectRoleAndLogin(r.role)}
                      className="w-full flex items-center gap-6 p-6 bg-slate-50 border-2 border-transparent rounded-[32px] hover:border-red-500/20 hover:bg-white transition-all group shadow-sm"
                    >
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm group-hover:bg-red-50">{r.icon}</div>
                      <div className="text-left flex-1">
                        <h4 className="font-black text-slate-900 text-sm leading-tight">{r.label}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 opacity-60">{r.desc}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-red-500" />
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
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col items-center sm:py-8 font-['Plus_Jakarta_Sans']">
      <div className="w-full max-w-[480px] h-screen bg-white shadow-[0_0_80px_rgba(0,0,0,0.08)] relative flex flex-col overflow-hidden sm:rounded-[48px] sm:h-[calc(100vh-64px)]">
        {renderApp()}
        <button 
          onClick={logout}
          className="absolute top-6 right-6 z-[9999] bg-white/90 backdrop-blur-md p-4 rounded-3xl shadow-lg border border-slate-100 opacity-20 hover:opacity-100 transition-opacity"
        >
          <ArrowLeft className="w-6 h-6 text-slate-400" />
        </button>
      </div>
    </div>
  );
};

export default App;