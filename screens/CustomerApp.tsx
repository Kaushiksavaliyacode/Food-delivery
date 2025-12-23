
import React, { useState, useEffect, useMemo } from 'react';
import { AppState, Restaurant, MenuItem, OrderStatus, Order, Location } from '../types';
import { CATEGORIES, MOCK_RESTAURANTS, COLORS } from '../constants';
import { 
  Search, MapPin, ShoppingBag, Clock, Star, ArrowLeft, Plus, Minus, X, 
  CheckCircle, Navigation, Phone, MessageSquare, ChevronRight, Heart, 
  Tag, User, Filter, SlidersHorizontal, Bell, Flame, Map as MapIcon, 
  CreditCard, Wallet, Home, Briefcase, MoreHorizontal, History 
} from 'lucide-react';

interface Props {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const CustomerApp: React.FC<Props> = ({ state, setState }) => {
  // If we arrived here from the main App login, we should be "isLoggedIn" already.
  // We'll default to 'location' if no location is set, otherwise 'home'.
  const [view, setView] = useState<'onboarding' | 'login' | 'otp' | 'location' | 'home' | 'itemDetail' | 'cart' | 'tracking' | 'profile'>(
    state.isLoggedIn ? (state.currentLocation ? 'home' : 'location') : 'onboarding'
  );
  
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleLogin = () => {
    if (phone.length < 10) return;
    setIsLoading(true);
    setTimeout(() => {
      setView('otp');
      setIsLoading(false);
    }, 1000);
  };

  const verifyOtp = () => {
    setIsLoading(true);
    setTimeout(() => {
      setState(prev => ({ ...prev, isLoggedIn: true, userPhone: phone }));
      setView('location');
      setIsLoading(false);
    }, 1000);
  };

  const confirmLocation = (loc: Location) => {
    setState(prev => ({ ...prev, currentLocation: loc }));
    setView('home');
  };

  const addToCart = (item: MenuItem, q: number = 1) => {
    setState(prev => {
      const existing = prev.cart.find(c => c.menuItem.id === item.id);
      if (existing) {
        return {
          ...prev,
          cart: prev.cart.map(c => c.menuItem.id === item.id ? { ...c, quantity: c.quantity + q } : c)
        };
      }
      return { ...prev, cart: [...prev.cart, { menuItem: item, quantity: q }] };
    });
  };

  const removeFromCart = (id: string) => {
    setState(prev => ({
      ...prev,
      cart: prev.cart.map(c => c.menuItem.id === id ? { ...c, quantity: c.quantity - 1 } : c).filter(c => c.quantity > 0)
    }));
  };

  const cartTotal = state.cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);

  const placeOrder = () => {
    setIsLoading(true);
    setTimeout(() => {
      setView('tracking');
      setState(prev => ({ ...prev, cart: [] }));
      setIsLoading(false);
    }, 1500);
  };

  // Views mapping
  if (view === 'onboarding') {
    return (
      <div className="flex flex-col h-full bg-[#FFC107] relative overflow-hidden">
        <div className="flex-1 flex flex-col items-center justify-center p-8 z-10">
          <div className="relative mb-8 group">
            <div className="absolute inset-0 bg-white/30 blur-[100px] rounded-full group-hover:bg-white/50 transition-all duration-700"></div>
            <img src="https://ouch-cdn2.icons8.com/5u9yF-uY2fX5zY8H1q9fG7_N-yG7v6_xR6-0eY8V4vY/rs:fit:456:456/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9zdmcvMTYv/OWFmYmY3YjEtZjE5/Mi00YmY5LWFkZjct/NDFlYmQ5ZjhlOGUz/LnN2Zw.png" alt="Hero" className="w-72 h-72 relative z-10 animate-bounce-slow" />
          </div>
          <div className="bg-white rounded-[48px] p-10 text-center shadow-2xl w-full max-w-sm border border-white/20">
            <h1 className="text-3xl font-black text-slate-900 mb-4 leading-tight">Gourmet Food<br/>At Your Door</h1>
            <p className="text-slate-400 text-sm mb-10 leading-relaxed font-medium">Fastest delivery for the finest cuisines in your neighborhood.</p>
            <button 
              onClick={() => setView('login')}
              className="w-full bg-[#FFC107] text-slate-900 py-5 rounded-3xl font-black text-sm uppercase tracking-widest shadow-xl shadow-yellow-200 hover:shadow-yellow-300 transition-all active:scale-95"
            >
              Get Started
            </button>
          </div>
        </div>
        <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-orange-500/10 rounded-full blur-3xl"></div>
      </div>
    );
  }

  if (view === 'login') {
    return (
      <div className="flex flex-col h-full bg-white p-8 animate-in fade-in duration-500">
        <div className="mt-12 mb-12">
          <h1 className="text-3xl font-black text-slate-900 mb-2">Hello!</h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Sign in to your account</p>
        </div>
        
        <div className="space-y-6">
          <div className="relative">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-3 block">Phone Number</label>
            <div className="flex gap-3">
              <div className="bg-slate-50 rounded-2xl px-4 py-4 font-bold text-slate-900">+1</div>
              <input 
                type="tel" 
                placeholder="202 555 0123"
                className="flex-1 bg-slate-50 border-0 rounded-2xl py-4 px-6 outline-none focus:ring-4 ring-[#FFC107]/20 transition-all font-bold text-lg"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="mt-auto pb-12">
          <p className="text-[10px] text-slate-400 font-medium text-center mb-8 px-4">By continuing, you agree to our <span className="text-slate-900 font-bold underline">Terms of Service</span> and <span className="text-slate-900 font-bold underline">Privacy Policy</span></p>
          <button 
            onClick={handleLogin}
            disabled={phone.length < 10 || isLoading}
            className="w-full bg-[#FFC107] text-slate-900 py-5 rounded-3xl font-black text-sm uppercase tracking-widest shadow-xl shadow-yellow-100 active:scale-95 transition-all disabled:opacity-30 flex items-center justify-center gap-3"
          >
            {isLoading ? <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div> : "Send OTP"}
          </button>
        </div>
      </div>
    );
  }

  if (view === 'otp') {
    return (
      <div className="flex flex-col h-full bg-white p-8 animate-in slide-in-from-right duration-500">
        <button onClick={() => setView('login')} className="p-3 bg-slate-50 rounded-2xl w-fit mb-12"><ArrowLeft className="w-5 h-5" /></button>
        
        <div className="mb-12">
          <h1 className="text-3xl font-black text-slate-900 mb-2">Verify Phone</h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Sent to +1 {phone}</p>
        </div>

        <div className="flex justify-between gap-4 mb-12">
          {otp.map((digit, i) => (
            <input 
              key={i}
              type="text"
              maxLength={1}
              className="w-16 h-20 bg-slate-50 rounded-3xl text-center text-2xl font-black border-2 border-transparent focus:border-[#FFC107] focus:bg-white outline-none transition-all"
              value={digit}
              onChange={(e) => {
                const next = [...otp];
                next[i] = e.target.value;
                setOtp(next);
                if (e.target.value && i < 3) (e.target.nextSibling as HTMLInputElement)?.focus();
              }}
            />
          ))}
        </div>

        <div className="text-center mb-12">
          <p className="text-xs text-slate-400 font-medium">Didn't receive code? <button className="text-[#FFC107] font-black underline ml-1">Resend in 30s</button></p>
        </div>

        <button 
          onClick={verifyOtp}
          disabled={otp.some(d => !d) || isLoading}
          className="w-full bg-[#FFC107] text-slate-900 py-5 rounded-3xl font-black text-sm uppercase tracking-widest shadow-xl shadow-yellow-100 active:scale-95 transition-all disabled:opacity-30"
        >
          {isLoading ? "Verifying..." : "Confirm & Login"}
        </button>
      </div>
    );
  }

  if (view === 'location') {
    return (
      <div className="flex flex-col h-full bg-white animate-in slide-in-from-bottom duration-500">
        <div className="flex-1 bg-slate-200 relative">
           <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/-118.2437,34.0522,13,0/600x600?access_token=pk.eyJ1IjoibW9ja3VzZXIiLCJhIjoiY2p4eCJ9')] bg-cover bg-center"></div>
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative">
                <MapPin className="w-12 h-12 text-orange-600 drop-shadow-2xl animate-bounce" />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-2 bg-black/20 blur-sm rounded-full"></div>
              </div>
           </div>
           <button className="absolute top-8 left-8 p-3 bg-white rounded-2xl shadow-xl"><ArrowLeft className="w-5 h-5" /></button>
        </div>
        <div className="bg-white p-8 rounded-t-[48px] -mt-12 relative z-10 shadow-2xl">
          <h2 className="text-2xl font-black text-slate-900 mb-6">Select Location</h2>
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-3xl border border-slate-100 hover:border-orange-200 transition-all cursor-pointer">
              <div className="bg-orange-100 p-3 rounded-2xl"><Home className="w-5 h-5 text-orange-600" /></div>
              <div className="flex-1">
                <h4 className="font-black text-sm">Home</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">909 E 49th St, Los Angeles</p>
              </div>
              <div className="w-6 h-6 rounded-full border-4 border-orange-500 bg-white"></div>
            </div>
            <div className="flex items-center gap-4 p-5 bg-white rounded-3xl border border-slate-100 hover:border-orange-200 transition-all cursor-pointer">
              <div className="bg-blue-100 p-3 rounded-2xl"><Briefcase className="w-5 h-5 text-blue-600" /></div>
              <div className="flex-1">
                <h4 className="font-black text-sm">Work</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">123 Market St, San Francisco</p>
              </div>
              <div className="w-6 h-6 rounded-full border-2 border-slate-200"></div>
            </div>
          </div>
          <button 
            onClick={() => confirmLocation({ lat: 34.0522, lng: -118.2437, address: "909 E 49th St, Los Angeles", type: 'Home' })}
            className="w-full bg-[#FFC107] text-slate-900 py-5 rounded-3xl font-black text-sm uppercase tracking-widest shadow-xl shadow-yellow-100 active:scale-95 transition-all"
          >
            Confirm Location
          </button>
        </div>
      </div>
    );
  }

  if (view === 'itemDetail' && selectedItem) {
    return (
      <div className="flex flex-col h-full bg-white animate-in slide-in-from-right duration-500">
        <div className="relative h-2/5 overflow-hidden">
           <img src={selectedItem.image} className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
           <div className="absolute top-8 left-8 right-8 flex justify-between items-center">
              <button onClick={() => setView('home')} className="p-3 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl text-white"><ArrowLeft className="w-5 h-5" /></button>
              <button className="p-3 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl text-white"><Heart className="w-5 h-5" /></button>
           </div>
           <div className="absolute bottom-8 left-8">
              <h1 className="text-3xl font-black text-white mb-2">{selectedItem.name}</h1>
              <div className="flex gap-4">
                 <div className="bg-orange-500/80 backdrop-blur-md px-4 py-1.5 rounded-full text-white text-[10px] font-black uppercase tracking-widest">Hot Pick</div>
                 <div className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-1"><Flame className="w-3 h-3" /> {selectedItem.calories || 120} Cal</div>
              </div>
           </div>
        </div>

        <div className="flex-1 px-8 py-8 bg-white rounded-t-[48px] -mt-12 relative z-10 overflow-y-auto hide-scrollbar">
           <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                 <div className="bg-[#FFC107] px-4 py-2 rounded-2xl flex items-center gap-3 text-slate-900 font-black">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-1 hover:bg-black/5 rounded-lg"><Minus className="w-4 h-4" /></button>
                    <span className="text-xl">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="p-1 hover:bg-black/5 rounded-lg"><Plus className="w-4 h-4" /></button>
                 </div>
              </div>
              <span className="text-3xl font-black text-slate-900">${(selectedItem.price * quantity).toFixed(2)}</span>
           </div>

           <div className="mb-8">
              <h3 className="text-sm font-black text-slate-900 mb-3 uppercase tracking-widest">Description</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">{selectedItem.description}</p>
           </div>

           <div className="mb-12">
              <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-widest">Ingredients</h3>
              <div className="flex gap-4 overflow-x-auto hide-scrollbar">
                 {['🍅 Tomato', '🧀 Cheese', '🧅 Onion', '🍄 Fungi'].map((ing, i) => (
                   <div key={i} className="px-6 py-4 bg-slate-50 border border-slate-100 rounded-3xl whitespace-nowrap text-xs font-bold text-slate-600">{ing}</div>
                 ))}
              </div>
           </div>

           <button 
             onClick={() => { addToCart(selectedItem, quantity); setView('home'); }}
             className="w-full bg-slate-900 text-white py-6 rounded-[32px] font-black text-sm uppercase tracking-widest shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4 mb-8"
           >
             <ShoppingBag className="w-6 h-6 text-[#FFC107]" />
             Add To Cart
           </button>
        </div>
      </div>
    );
  }

  if (view === 'tracking') {
    return (
      <div className="flex flex-col h-full bg-white">
         <div className="h-[55%] bg-slate-100 relative">
            <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s-restaurant+FF4136(-118.24,34.05),pin-s-home+22C55E(-118.25,34.06)/-118.245,34.055,14,0/600x600?access_token=pk.eyJ1IjoibW9ja3VzZXIiLCJhIjoiY2p4eCJ9')] bg-cover bg-center"></div>
            <div className="absolute top-8 left-8 right-8 flex justify-between">
               <button onClick={() => setView('home')} className="p-3 bg-white rounded-2xl shadow-xl"><ArrowLeft className="w-5 h-5" /></button>
               <div className="bg-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest">Live Tracking</span>
               </div>
            </div>
            {/* Pulsing Dot for Rider */}
            <div className="absolute top-1/2 left-1/2 w-8 h-8 -translate-x-1/2 -translate-y-1/2">
               <div className="absolute inset-0 bg-orange-500 rounded-full animate-ping opacity-20"></div>
               <div className="w-full h-full bg-white rounded-full shadow-2xl flex items-center justify-center p-1.5 border-2 border-orange-500">
                  <Navigation className="w-full h-full text-orange-500 fill-orange-500" />
               </div>
            </div>
         </div>
         <div className="flex-1 bg-white p-8 rounded-t-[48px] -mt-12 relative z-10 shadow-2xl overflow-y-auto">
            <div className="flex justify-between items-start mb-10">
               <div>
                  <h2 className="text-2xl font-black text-slate-900 mb-1">Coming in 12 min</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Estimated arrival 12:45 PM</p>
               </div>
               <div className="flex gap-3">
                  <button className="p-4 bg-slate-50 rounded-2xl text-slate-900"><Phone className="w-5 h-5" /></button>
                  <button className="p-4 bg-slate-50 rounded-2xl text-slate-900"><MessageSquare className="w-5 h-5" /></button>
               </div>
            </div>

            <div className="space-y-8">
               <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                     <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white p-1"><CheckCircle className="w-full h-full" /></div>
                     <div className="w-0.5 h-12 bg-green-500"></div>
                  </div>
                  <div>
                     <h4 className="text-sm font-black text-slate-900">Order Confirmed</h4>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">12:30 PM</p>
                  </div>
               </div>
               <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                     <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white p-1 shadow-lg shadow-orange-500/20"><Clock className="w-full h-full" /></div>
                     <div className="w-0.5 h-12 bg-slate-100"></div>
                  </div>
                  <div>
                     <h4 className="text-sm font-black text-slate-900">Preparing Your Food</h4>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">12:35 PM • In Progress</p>
                  </div>
               </div>
               <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                     <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 p-1"></div>
                  </div>
                  <div className="opacity-40">
                     <h4 className="text-sm font-black text-slate-900">On The Way</h4>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Soon</p>
                  </div>
               </div>
            </div>

            <div className="mt-12 bg-slate-50 p-6 rounded-[32px] flex items-center gap-4">
               <div className="w-14 h-14 rounded-2xl overflow-hidden border-4 border-white shadow-xl">
                  <img src="https://picsum.photos/seed/rider/100/100" />
               </div>
               <div className="flex-1">
                  <h4 className="font-black text-sm">Alex Rider</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1"><Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> 4.9 • Delivery Partner</p>
               </div>
               <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
                  <ChevronRight className="w-5 h-5 text-slate-300" />
               </div>
            </div>
         </div>
      </div>
    );
  }

  // Home Screen
  return (
    <div className="flex flex-col h-full bg-white overflow-hidden relative">
      {/* Header */}
      <div className="px-8 pt-10 pb-4 sticky top-0 bg-white z-30">
        <div className="flex items-center justify-between mb-8">
           <button onClick={() => setView('location')} className="flex flex-col items-start">
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">Delivering To</span>
              <div className="flex items-center gap-1">
                 <MapPin className="w-4 h-4 text-orange-600" />
                 <span className="text-sm font-black text-slate-900">{state.currentLocation?.address || "Detecting..."}</span>
                 <ChevronRight className="w-4 h-4 text-slate-300" />
              </div>
           </button>
           <div className="flex gap-3">
              <button className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900 relative">
                 <Bell className="w-5 h-5" />
                 <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full ring-4 ring-white"></span>
              </button>
              <button onClick={() => setView('profile')} className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-slate-50">
                 <img src="https://picsum.photos/seed/user1/100/100" />
              </button>
           </div>
        </div>

        <div className="relative mb-6">
           <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300"><Search className="w-5 h-5" /></div>
           <input 
             type="text" 
             placeholder="What's for lunch?" 
             className="w-full bg-slate-50 border-0 rounded-[24px] py-4 pl-14 pr-12 outline-none focus:ring-4 ring-yellow-400/10 transition-all font-bold text-sm"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
           />
           <button className="absolute right-4 top-1/2 -translate-y-1/2 bg-slate-900 text-white p-2 rounded-xl shadow-lg active:scale-90 transition"><Filter className="w-4 h-4" /></button>
        </div>

        <div className="flex gap-4 overflow-x-auto hide-scrollbar -mx-8 px-8">
           {CATEGORIES.map(cat => (
             <button 
               key={cat.id} 
               onClick={() => setActiveCategory(activeCategory === cat.name ? null : cat.name)}
               className={`flex items-center gap-3 px-6 py-4 rounded-[24px] whitespace-nowrap transition-all border-2 ${activeCategory === cat.name ? 'bg-slate-900 border-slate-900 text-white shadow-2xl' : 'bg-slate-50 border-transparent text-slate-400'}`}
             >
               <span className="text-xl">{cat.icon}</span>
               <span className="text-[10px] font-black uppercase tracking-widest">{cat.name}</span>
             </button>
           ))}
        </div>
      </div>

      {/* Main Feed */}
      <div className="flex-1 overflow-y-auto px-8 pb-32 pt-4 hide-scrollbar">
         {/* Featured Banner */}
         {!searchQuery && !activeCategory && (
           <div className="mb-10 bg-gradient-to-br from-[#FFC107] to-orange-500 rounded-[40px] p-8 text-slate-900 relative overflow-hidden shadow-2xl shadow-yellow-200">
              <div className="relative z-10 w-2/3">
                 <h2 className="text-2xl font-black mb-2 leading-tight">30% OFF on your first order!</h2>
                 <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-6">Use code: NEWFOODGO</p>
                 <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest">Claim Now</button>
              </div>
              <img src="https://ouch-cdn2.icons8.com/Psh5n9NqK_FkH8A-oU0VpS3053K1XG9K3tG3t7p3k7k/rs:fit:456:456/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9zdmcvMTYv/NDI0YjFjYmItYTAw/NC00YmU4LWI4ZjUt/N2EyYjg4YjY3Y2Fh/LnN2Zw.png" className="absolute top-0 right-[-20px] w-48 h-48 opacity-90 scale-125" />
           </div>
         )}

         <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black text-slate-900">{searchQuery || activeCategory ? 'Results Found' : 'Popular Dishes'}</h3>
            <button className="text-[10px] font-black text-slate-300 uppercase tracking-widest">See All</button>
         </div>

         <div className="grid grid-cols-1 gap-8">
            {MOCK_RESTAURANTS[0].menu.filter(m => !activeCategory || m.category === activeCategory).map(item => (
              <div key={item.id} onClick={() => { setSelectedItem(item); setView('itemDetail'); }} className="group cursor-pointer">
                 <div className="relative mb-4">
                    <div className="aspect-[4/3] rounded-[48px] overflow-hidden shadow-xl border-4 border-slate-50 transition-transform group-hover:scale-[1.02] duration-500">
                       <img src={item.image} className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute top-6 left-6 flex flex-col gap-2">
                       <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 shadow-lg">
                          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          <span className="text-[10px] font-black">4.8</span>
                       </div>
                       <div className="bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 shadow-lg text-white">
                          <Clock className="w-3 h-3" />
                          <span className="text-[10px] font-black uppercase">25 min</span>
                       </div>
                    </div>
                    <button className="absolute bottom-6 right-6 w-14 h-14 bg-white rounded-3xl flex items-center justify-center text-slate-900 shadow-2xl transition-all group-hover:bg-[#FFC107] group-hover:rotate-12">
                       <Plus className="w-6 h-6" />
                    </button>
                 </div>
                 <div className="px-2">
                    <div className="flex justify-between items-start mb-1">
                       <h4 className="text-lg font-black text-slate-900">{item.name}</h4>
                       <span className="text-xl font-black text-slate-900">${item.price}</span>
                    </div>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">{item.description}</p>
                 </div>
              </div>
            ))}
         </div>
      </div>

      {/* Bottom Nav / Cart Sticky */}
      {state.cart.length > 0 && view === 'home' && (
        <div className="fixed bottom-32 left-8 right-8 z-40 animate-in slide-in-from-bottom-12 duration-500">
           <button 
             onClick={() => setView('cart')}
             className="w-full bg-slate-900 p-6 rounded-[32px] shadow-2xl flex items-center justify-between group overflow-hidden relative"
           >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-transparent translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700"></div>
              <div className="flex items-center gap-4 relative z-10">
                 <div className="w-12 h-12 bg-[#FFC107] rounded-2xl flex items-center justify-center text-slate-900 font-black shadow-lg">
                    {state.cart.reduce((a,b) => a + b.quantity, 0)}
                 </div>
                 <div className="text-left">
                    <h4 className="text-white font-black text-sm uppercase tracking-widest">View Cart</h4>
                    <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Orix Healthy Kitchen</p>
                 </div>
              </div>
              <div className="flex items-center gap-4 relative z-10">
                 <span className="text-xl font-black text-[#FFC107]">${cartTotal.toFixed(2)}</span>
                 <ShoppingBag className="w-6 h-6 text-white" />
              </div>
           </button>
        </div>
      )}

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-[400px] bg-slate-900/90 backdrop-blur-2xl h-20 px-10 flex justify-between items-center z-40 shadow-2xl rounded-[32px] border border-white/10">
        <button onClick={() => setView('home')} className={`transition-all ${view === 'home' ? 'text-[#FFC107] scale-125' : 'text-white/40'}`}><Home className="w-6 h-6" /></button>
        <button className="text-white/40 hover:text-white transition-all"><Search className="w-6 h-6" /></button>
        <button className="text-white/40 hover:text-white transition-all"><Heart className="w-6 h-6" /></button>
        <button onClick={() => setView('profile')} className={`transition-all ${view === 'profile' ? 'text-[#FFC107] scale-125' : 'text-white/40'}`}><User className="w-6 h-6" /></button>
      </div>

      {/* Cart View Overlay */}
      {view === 'cart' && (
        <div className="fixed inset-0 z-50 bg-white animate-in slide-in-from-bottom duration-500 flex flex-col">
           <div className="p-8 border-b flex items-center justify-between">
              <button onClick={() => setView('home')} className="p-3 bg-slate-50 rounded-2xl"><ArrowLeft className="w-5 h-5" /></button>
              <h1 className="text-lg font-black text-slate-900">Your Cart</h1>
              <button className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Clear All</button>
           </div>
           
           <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {state.cart.map(item => (
                <div key={item.menuItem.id} className="flex items-center gap-5">
                   <div className="w-24 h-24 rounded-[32px] overflow-hidden shadow-lg border-4 border-slate-50">
                      <img src={item.menuItem.image} className="w-full h-full object-cover" />
                   </div>
                   <div className="flex-1">
                      <h4 className="font-black text-sm text-slate-900 mb-1">{item.menuItem.name}</h4>
                      <p className="text-lg font-black text-slate-900">${item.menuItem.price}</p>
                   </div>
                   <div className="bg-slate-50 p-1.5 rounded-full flex flex-col items-center gap-3">
                      <button onClick={() => addToCart(item.menuItem, 1)} className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-900 shadow-sm"><Plus className="w-3 h-3" /></button>
                      <span className="font-black text-sm">{item.quantity}</span>
                      <button onClick={() => removeFromCart(item.menuItem.id)} className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-300 shadow-sm"><Minus className="w-3 h-3" /></button>
                   </div>
                </div>
              ))}

              <div className="pt-8 space-y-4">
                 <div className="flex justify-between items-center text-slate-400 font-bold text-xs uppercase tracking-widest">
                    <span>Item Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between items-center text-slate-400 font-bold text-xs uppercase tracking-widest">
                    <span>Delivery Fee</span>
                    <span className="text-green-500">FREE</span>
                 </div>
                 <div className="flex justify-between items-center text-slate-400 font-bold text-xs uppercase tracking-widest">
                    <span>Taxes & GST</span>
                    <span>$2.50</span>
                 </div>
                 <div className="pt-4 border-t border-dashed border-slate-200 flex justify-between items-center">
                    <span className="text-xl font-black text-slate-900">Total Bill</span>
                    <span className="text-2xl font-black text-slate-900">${(cartTotal + 2.5).toFixed(2)}</span>
                 </div>
              </div>
           </div>

           <div className="p-8 space-y-4">
              <div className="bg-slate-50 p-6 rounded-[32px] flex items-center justify-between border border-slate-100">
                 <div className="flex items-center gap-4">
                    <div className="bg-white p-3 rounded-2xl shadow-sm text-orange-600"><CreditCard className="w-5 h-5" /></div>
                    <div>
                       <h4 className="text-xs font-black">Visa •••• 4242</h4>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Payment Method</p>
                    </div>
                 </div>
                 <button className="text-[10px] font-black text-orange-600 uppercase">Change</button>
              </div>
              <button 
                onClick={placeOrder}
                className="w-full bg-[#FFC107] text-slate-900 py-6 rounded-[32px] font-black text-sm uppercase tracking-widest shadow-xl shadow-yellow-100 active:scale-95 transition-all flex items-center justify-center gap-4"
              >
                {isLoading ? "Processing..." : "Place Order • " + (cartTotal + 2.5).toFixed(2)}
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default CustomerApp;
