
import React, { useState, useEffect, useMemo } from 'react';
import { AppState, MenuItem, Location, OrderStatus } from '../types.ts';
import { CATEGORIES, MOCK_RESTAURANTS } from '../constants.tsx';
import { 
  Search, MapPin, ShoppingBag, Clock, Star, ArrowLeft, Plus, Minus,
  CheckCircle, Navigation, Phone, MessageSquare, ChevronRight, Heart, 
  Filter, SlidersHorizontal, Bell, Flame, Map as MapIcon, 
  Home, Briefcase, Wallet, User, Zap, CreditCard as CardIcon, Compass, Loader2
} from 'lucide-react';

interface Props {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

type CustomerView = 'location' | 'home' | 'itemDetail' | 'cart' | 'checkout' | 'success' | 'tracking';

const CustomerApp: React.FC<Props> = ({ state, setState }) => {
  const [view, setView] = useState<CustomerView>(state.currentLocation ? 'home' : 'location');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [riderPos, setRiderPos] = useState({ lat: 34.0550, lng: -118.2450 });

  // Simulate Rider Movement
  useEffect(() => {
    if (view === 'tracking') {
      const interval = setInterval(() => {
        setRiderPos(prev => ({
          lat: prev.lat + (34.0600 - prev.lat) * 0.1,
          lng: prev.lng + (-118.2500 - prev.lng) * 0.1
        }));
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [view]);

  const detectLocation = () => {
    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
        const data = await res.json();
        const loc: Location = { 
          lat: pos.coords.latitude, 
          lng: pos.coords.longitude, 
          address: data.display_name.split(',').slice(0,3).join(','),
          type: 'Home' 
        };
        setState(p => ({ ...p, currentLocation: loc }));
        setView('home');
      } catch (e) {
        console.error(e);
      } finally {
        setIsDetecting(false);
      }
    }, () => setIsDetecting(false));
  };

  const addToCart = (item: MenuItem, q: number) => {
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

  const filteredItems = useMemo(() => {
    let items = MOCK_RESTAURANTS[0].menu;
    if (activeCategory) items = items.filter(i => i.category === activeCategory);
    if (searchQuery) items = items.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return items;
  }, [activeCategory, searchQuery]);

  const cartTotal = state.cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);

  if (view === 'location') return (
    <div className="h-full bg-white flex flex-col animate-in slide-in-from-bottom duration-500">
      <div className="flex-1 bg-slate-100 relative overflow-hidden flex items-center justify-center">
         <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/-118.2437,34.0522,13,0/600x600?access_token=pk.eyJ1IjoibW9ja3VzZXIiLCJhIjoiY2p4eCJ9')] bg-cover opacity-30" />
         <div className="relative">
            <div className="absolute -inset-12 bg-red-500/10 rounded-full animate-ping" />
            <MapPin className="w-20 h-20 text-[#E23744] drop-shadow-2xl relative z-10" />
         </div>
      </div>
      <div className="bg-white p-10 rounded-t-[48px] -mt-12 relative z-10 shadow-2xl">
        <h2 className="text-2xl font-black text-slate-900 mb-2">Hello, hungry!</h2>
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-10">Set your delivery location to start</p>
        <button 
          onClick={detectLocation}
          className="w-full flex items-center gap-4 p-6 bg-red-50 rounded-[32px] border-2 border-red-100 hover:border-red-500 transition-all text-left mb-6"
        >
          {isDetecting ? <Loader2 className="w-6 h-6 text-red-500 animate-spin" /> : <Compass className="w-6 h-6 text-red-500" />}
          <div>
            <h4 className="font-black text-slate-900 text-sm">Detect current location</h4>
            <p className="text-[10px] text-red-400 font-black uppercase tracking-widest">Free GPS Service</p>
          </div>
        </button>
        <div className="relative">
           <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
           <input type="text" placeholder="Search building, street, area..." className="w-full bg-slate-50 rounded-[28px] py-6 pl-16 pr-6 outline-none font-bold text-sm border-2 border-transparent focus:border-slate-200" />
        </div>
      </div>
    </div>
  );

  if (view === 'tracking') return (
    <div className="h-full bg-white flex flex-col animate-in fade-in duration-500">
       <div className="h-[60%] bg-slate-200 relative">
          <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s-restaurant+E23744(-118.24,34.05),pin-s-home+22C55E(-118.25,34.06)/-118.245,34.055,14,0/600x600?access_token=pk.eyJ1IjoibW9ja3VzZXIiLCJhIjoiY2p4eCJ9')] bg-cover" />
          <button onClick={() => setView('home')} className="absolute top-10 left-6 p-4 bg-white rounded-2xl shadow-2xl"><ArrowLeft className="w-6 h-6" /></button>
          {/* Animated Rider Dot */}
          <div className="absolute transition-all duration-1000" style={{ top: '45%', left: '48%' }}>
             <div className="w-10 h-10 bg-[#E23744] rounded-full border-4 border-white shadow-2xl flex items-center justify-center animate-bounce">
                <Navigation className="w-5 h-5 text-white fill-current" />
             </div>
          </div>
       </div>
       <div className="flex-1 bg-white p-10 rounded-t-[56px] -mt-16 relative z-10 shadow-2xl overflow-y-auto hide-scrollbar">
          <div className="flex justify-between items-start mb-10">
             <div>
                <h3 className="text-3xl font-black text-slate-900 mb-1">Arriving in 12 min</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Delivery Partner: Alex Rider</p>
             </div>
             <div className="flex gap-3">
                <button className="p-5 bg-slate-50 rounded-2xl text-slate-600"><Phone className="w-6 h-6" /></button>
                <button className="p-5 bg-slate-50 rounded-2xl text-slate-600"><MessageSquare className="w-6 h-6" /></button>
             </div>
          </div>
          <div className="space-y-8">
             <div className="flex gap-5">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white"><CheckCircle className="w-5 h-5" /></div>
                <div><h4 className="text-sm font-black">Order Picked Up</h4><p className="text-xs text-slate-400">2 min ago</p></div>
             </div>
             <div className="flex gap-5">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-300"><Clock className="w-5 h-5" /></div>
                <div><h4 className="text-sm font-black text-slate-400">Arriving Soon</h4><p className="text-xs text-slate-300">Tracking live</p></div>
             </div>
          </div>
       </div>
    </div>
  );

  return (
    <div className="h-full bg-white flex flex-col relative overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-10 pb-4 sticky top-0 bg-white z-40 border-b border-slate-50">
        <div className="flex items-center justify-between mb-6">
           <button onClick={() => setView('location')} className="flex items-center gap-2 max-w-[70%] text-left">
              <MapPin className="w-5 h-5 text-[#E23744]" />
              <div className="truncate">
                 <h4 className="text-sm font-black text-slate-900">{state.currentLocation?.type || 'Home'}</h4>
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate">{state.currentLocation?.address || "Detecting..."}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
           </button>
           <button onClick={() => setView('home')} className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${state.phoneNumber}`} />
           </button>
        </div>
        <div className="relative">
           <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
           <input 
             type="text" 
             placeholder="Search for biryani, pizza, cakes..." 
             className="w-full bg-slate-50 rounded-[24px] py-5 pl-14 pr-12 outline-none font-bold text-sm border border-slate-100 focus:bg-white transition-all"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
           />
           <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-xl shadow-sm border"><Filter className="w-4 h-4 text-slate-400" /></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar pb-32">
        {/* Categories */}
        {!searchQuery && (
          <div className="px-6 py-8 overflow-x-auto hide-scrollbar flex gap-5">
             {CATEGORIES.map(cat => (
               <button 
                 key={cat.id} 
                 onClick={() => setActiveCategory(activeCategory === cat.name ? null : cat.name)}
                 className="flex flex-col items-center gap-3 transition-transform active:scale-90"
               >
                 <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-sm transition-all ${activeCategory === cat.name ? 'bg-red-50 border-2 border-[#E23744]' : 'bg-slate-50'}`}>
                    {cat.icon}
                 </div>
                 <span className={`text-[10px] font-black uppercase tracking-widest ${activeCategory === cat.name ? 'text-[#E23744]' : 'text-slate-400'}`}>{cat.name}</span>
               </button>
             ))}
          </div>
        )}

        {/* Restaurant / Item Listing */}
        <div className="px-6 space-y-10">
           <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">{activeCategory || "Eat what excites you"}</h3>
              <SlidersHorizontal className="w-5 h-5 text-slate-300" />
           </div>
           <div className="grid grid-cols-1 gap-12">
              {filteredItems.map(item => (
                <div key={item.id} onClick={() => { setSelectedItem(item); setView('itemDetail'); }} className="group">
                   <div className="relative mb-5">
                      <div className="aspect-[16/9] rounded-[40px] overflow-hidden shadow-2xl border-4 border-slate-50 transition-transform group-hover:scale-[1.02]">
                         <img src={item.image} className="w-full h-full object-cover" />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
                      </div>
                      <div className="absolute top-6 left-6 flex flex-col gap-2">
                         <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-xl">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            <span className="text-[10px] font-black">4.8</span>
                         </div>
                      </div>
                      <div className="absolute bottom-6 left-6">
                         <div className="bg-[#E23744] text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2">
                            <Clock className="w-3 h-3" /> 25 MINS
                         </div>
                      </div>
                      <button className="absolute -bottom-4 right-10 w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-slate-900 shadow-2xl border-2 border-slate-50 group-hover:bg-[#E23744] group-hover:text-white transition-all">
                         <Plus className="w-7 h-7" />
                      </button>
                   </div>
                   <div className="px-2">
                      <div className="flex justify-between items-center mb-1">
                         <h4 className="text-lg font-black text-slate-900 tracking-tight">{item.name}</h4>
                         <span className="text-xl font-black text-slate-900">₹{item.price}</span>
                      </div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-relaxed line-clamp-1">{item.category} • {item.description}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Sticky Bottom Navigation */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-[420px] bg-slate-900/95 backdrop-blur-2xl h-22 px-12 flex justify-between items-center z-[100] shadow-2xl rounded-[32px] border border-white/10">
        <button onClick={() => setView('home')} className={`transition-all ${view === 'home' ? 'text-[#E23744] scale-125' : 'text-white/40'}`}><Home className="w-7 h-7" /></button>
        <button className="text-white/40"><Search className="w-7 h-7" /></button>
        <button onClick={() => setView('cart')} className={`transition-all ${view === 'cart' ? 'text-[#E23744] scale-125' : 'text-white/40'}`}><ShoppingBag className="w-7 h-7" /></button>
        <button className="text-white/40"><User className="w-7 h-7" /></button>
      </div>

      {/* Sticky Quick Cart Bar */}
      {state.cart.length > 0 && view === 'home' && (
        <div className="fixed bottom-36 left-8 right-8 z-[110] animate-in slide-in-from-bottom duration-500">
           <button 
             onClick={() => setView('cart')}
             className="w-full bg-[#E23744] p-5 rounded-[24px] shadow-2xl flex items-center justify-between group overflow-hidden"
           >
              <div className="flex items-center gap-4 relative z-10">
                 <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-[#E23744] font-black shadow-lg">
                    {state.cart.reduce((a,b) => a + b.quantity, 0)}
                 </div>
                 <div className="text-left">
                    <h4 className="text-white font-black text-[10px] uppercase tracking-widest">Cart Total</h4>
                    <p className="text-lg font-black text-white">₹{cartTotal.toFixed(2)}</p>
                 </div>
              </div>
              <div className="flex items-center gap-2 text-white relative z-10 font-black text-xs uppercase tracking-widest">
                 View Cart <ChevronRight className="w-4 h-4" />
              </div>
           </button>
        </div>
      )}

      {/* Item Detail Overlay */}
      {view === 'itemDetail' && selectedItem && (
        <div className="fixed inset-0 z-[200] bg-white animate-in slide-in-from-right duration-500 flex flex-col">
           <div className="relative h-[45%] overflow-hidden">
              <img src={selectedItem.image} className="w-full h-full object-cover scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute top-12 left-8 flex items-center gap-4">
                 <button onClick={() => setView('home')} className="p-4 bg-white/20 backdrop-blur-xl border border-white/30 rounded-[22px] text-white"><ArrowLeft className="w-6 h-6" /></button>
              </div>
              <div className="absolute bottom-12 left-10 right-10">
                 <h1 className="text-4xl font-black text-white mb-4 leading-tight">{selectedItem.name}</h1>
                 <div className="flex gap-4">
                    <div className="bg-[#E23744] px-5 py-2 rounded-full text-white text-[10px] font-black uppercase tracking-widest">Premium Selection</div>
                    <div className="bg-white/20 backdrop-blur-md px-5 py-2 rounded-full text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><Flame className="w-4 h-4 text-orange-400" /> {selectedItem.calories || 240} Cal</div>
                 </div>
              </div>
           </div>
           <div className="flex-1 px-10 py-12 bg-white rounded-t-[64px] -mt-16 relative z-10 overflow-y-auto">
              <div className="flex justify-between items-center mb-10">
                 <div className="bg-slate-50 px-6 py-3 rounded-[24px] flex items-center gap-8 text-slate-900 font-black border">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2"><Minus className="w-5 h-5" /></button>
                    <span className="text-2xl w-6 text-center">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="p-2"><Plus className="w-5 h-5" /></button>
                 </div>
                 <span className="text-4xl font-black text-slate-900 tracking-tighter">₹{(selectedItem.price * quantity).toFixed(2)}</span>
              </div>
              <div className="mb-12">
                 <h3 className="text-xs font-black text-slate-300 mb-4 uppercase tracking-widest">The Recipe</h3>
                 <p className="text-sm text-slate-500 leading-loose font-medium">{selectedItem.description}</p>
              </div>
              <button 
                onClick={() => { addToCart(selectedItem, quantity); setView('home'); }}
                className="w-full bg-slate-900 text-white py-7 rounded-[32px] font-black text-sm uppercase tracking-widest shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4"
              >
                <ShoppingBag className="w-6 h-6 text-[#E23744]" />
                Add To Cart
              </button>
           </div>
        </div>
      )}

      {/* Success Modal */}
      {view === 'success' && (
        <div className="fixed inset-0 z-[300] bg-[#E23744] flex flex-col items-center justify-center p-12 text-center animate-in zoom-in duration-500">
           <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-10 shadow-2xl">
              <CheckCircle className="w-16 h-16 text-green-500" />
           </div>
           <h1 className="text-4xl font-black text-white mb-4">Order Placed!</h1>
           <p className="text-white/60 font-bold text-xs uppercase tracking-widest mb-16">Chef is working on your magic.</p>
           <button onClick={() => setView('tracking')} className="w-full bg-white text-slate-900 py-6 rounded-[28px] font-black text-sm uppercase tracking-widest shadow-xl">Track Order</button>
        </div>
      )}
    </div>
  );
};

export default CustomerApp;
