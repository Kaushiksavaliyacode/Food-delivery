
import React, { useState, useEffect, useMemo } from 'react';
import { AppState, MenuItem, Location, OrderStatus } from '../types.ts';
import { CATEGORIES, MOCK_RESTAURANTS } from '../constants.tsx';
import { 
  Search, MapPin, ShoppingBag, Clock, Star, ArrowLeft, Plus, Minus,
  CheckCircle, Navigation, Phone, MessageSquare, ChevronRight, Heart, 
  Filter, SlidersHorizontal, Bell, Flame, Map as MapIcon, 
  Home, Briefcase, Wallet, User, Zap, CreditCard as CardIcon, Compass, Loader2, List
} from 'lucide-react';

interface Props {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

type CustomerView = 'location' | 'home' | 'itemDetail' | 'cart' | 'checkout' | 'success' | 'tracking' | 'orders';

const CustomerApp: React.FC<Props> = ({ state, setState }) => {
  const [view, setView] = useState<CustomerView>(state.currentLocation ? 'home' : 'location');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [riderPos, setRiderPos] = useState({ lat: 34.0550, lng: -118.2450 });

  // Mock Active Orders for Customer
  const [customerOrders] = useState([
    { id: 'ORD-7721', amount: 485.00, status: 'ARRIVING', items: '2x Paneer Kadai, 1x Naan', time: '12 min' },
    { id: 'ORD-6612', amount: 120.00, status: 'DELIVERED', items: '1x Chole Bhature', time: 'Yesterday' }
  ]);

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

  // Sub-Views
  const LocationPicker = () => (
    <div className="h-full bg-white flex flex-col animate-in slide-in-from-bottom duration-500">
      <div className="flex-1 bg-slate-100 relative overflow-hidden flex items-center justify-center">
         <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/-118.2437,34.0522,13,0/600x600?access_token=pk.eyJ1IjoibW9ja3VzZXIiLCJhIjoiY2p4eCJ9')] bg-cover opacity-30" />
         <div className="relative">
            <div className="absolute -inset-12 bg-red-500/10 rounded-full animate-ping" />
            <MapPin className="w-20 h-20 text-[#E23744] drop-shadow-2xl relative z-10" />
         </div>
      </div>
      <div className="bg-white p-10 rounded-t-[48px] -mt-12 relative z-10 shadow-2xl">
        <h2 className="text-2xl font-black text-slate-900 mb-2">Delivery Address</h2>
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-10">Where should we drop your food?</p>
        <button onClick={detectLocation} className="w-full flex items-center gap-4 p-6 bg-red-50 rounded-[32px] border-2 border-red-100 hover:border-red-500 transition-all text-left mb-6">
          {isDetecting ? <Loader2 className="w-6 h-6 text-red-500 animate-spin" /> : <Compass className="w-6 h-6 text-red-500" />}
          <div>
            <h4 className="font-black text-slate-900 text-sm">Use Live Location</h4>
            <p className="text-[10px] text-red-400 font-black uppercase tracking-widest">Automatic Detection</p>
          </div>
        </button>
        <div className="relative">
           <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
           <input type="text" placeholder="Search area..." className="w-full bg-slate-50 rounded-[28px] py-6 pl-16 pr-6 outline-none font-bold text-sm border-2 border-transparent focus:border-slate-200" />
        </div>
      </div>
    </div>
  );

  if (view === 'location') return <LocationPicker />;

  return (
    <div className="h-full bg-white flex flex-col relative overflow-hidden font-['Plus_Jakarta_Sans']">
      
      {/* Dynamic Header */}
      <div className="px-6 pt-12 pb-4 sticky top-0 bg-white/80 backdrop-blur-xl z-40 border-b border-slate-50">
        <div className="flex items-center justify-between mb-6">
           <button onClick={() => setView('location')} className="flex items-center gap-2 max-w-[70%] text-left">
              <div className="bg-red-50 p-2 rounded-xl"><MapPin className="w-4 h-4 text-[#E23744]" /></div>
              <div className="truncate">
                 <h4 className="text-xs font-black text-slate-900">{state.currentLocation?.type || 'Select Location'}</h4>
                 <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest truncate">{state.currentLocation?.address || "Detecting..."}</p>
              </div>
           </button>
           <button className="relative w-11 h-11 rounded-2xl bg-slate-50 flex items-center justify-center border shadow-sm">
              <Bell className="w-5 h-5 text-slate-400" />
              <div className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
           </button>
        </div>
        <div className="relative">
           <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
           <input 
             type="text" 
             placeholder="Find cravings..." 
             className="w-full bg-slate-50 rounded-[20px] py-4 pl-12 pr-12 outline-none font-bold text-xs border border-slate-100 focus:bg-white transition-all"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
           />
           <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white rounded-xl shadow-sm border"><SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" /></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar pb-40">
        {view === 'home' && (
          <div className="animate-in fade-in duration-500">
            {/* Horizontal Categories */}
            {!searchQuery && (
              <div className="px-6 py-6 overflow-x-auto hide-scrollbar flex gap-4">
                 {CATEGORIES.map(cat => (
                   <button key={cat.id} onClick={() => setActiveCategory(activeCategory === cat.name ? null : cat.name)} className={`flex flex-col items-center gap-2 transition-all px-4 py-3 rounded-3xl border-2 ${activeCategory === cat.name ? 'bg-red-50 border-[#E23744]' : 'bg-slate-50 border-transparent'}`}>
                     <span className="text-xl">{cat.icon}</span>
                     <span className={`text-[9px] font-black uppercase tracking-tight ${activeCategory === cat.name ? 'text-[#E23744]' : 'text-slate-400'}`}>{cat.name}</span>
                   </button>
                 ))}
              </div>
            )}

            {/* Small Card Grid */}
            <div className="px-6 space-y-6 mt-4">
               <div className="flex justify-between items-center">
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">Top Recommendations</h3>
                  <button className="text-[10px] font-black text-red-500 uppercase tracking-widest">See All</button>
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                  {filteredItems.map(item => (
                    <div key={item.id} onClick={() => { setSelectedItem(item); setView('itemDetail'); }} className="group relative bg-white rounded-[28px] border border-slate-50 shadow-sm p-3 hover:shadow-xl transition-all">
                       <div className="relative aspect-square rounded-[22px] overflow-hidden mb-3">
                          <img src={item.image} className="w-full h-full object-cover" />
                          <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                             <Star className="w-2.5 h-2.5 text-yellow-500 fill-current" />
                             <span className="text-[9px] font-black">4.8</span>
                          </div>
                          <button className="absolute bottom-2 right-2 w-8 h-8 bg-[#E23744] rounded-xl flex items-center justify-center text-white shadow-lg active:scale-90 transition-transform">
                             <Plus className="w-4 h-4" />
                          </button>
                       </div>
                       <div>
                          <h4 className="text-[11px] font-black text-slate-900 leading-tight mb-1 truncate">{item.name}</h4>
                          <div className="flex justify-between items-center">
                             <span className="text-xs font-black text-slate-900">₹{item.price}</span>
                             <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">15-20 min</span>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        )}

        {view === 'orders' && (
          <div className="px-6 py-8 space-y-8 animate-in slide-in-from-right duration-500">
             <h2 className="text-2xl font-black text-slate-900">Your Orders</h2>
             <div className="space-y-4">
                {customerOrders.map(order => (
                  <div key={order.id} className="bg-white rounded-[32px] p-6 border shadow-sm relative overflow-hidden">
                     <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                           <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${order.status === 'ARRIVING' ? 'bg-orange-50 text-orange-500' : 'bg-green-50 text-green-500'}`}>
                              <ShoppingBag className="w-5 h-5" />
                           </div>
                           <div>
                              <h4 className="font-black text-slate-900 text-sm">{order.id}</h4>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{order.time}</p>
                           </div>
                        </div>
                        <span className="text-sm font-black text-slate-900">₹{order.amount.toFixed(2)}</span>
                     </div>
                     <p className="text-[10px] text-slate-500 mb-6 font-medium leading-relaxed">{order.items}</p>
                     <div className="flex gap-2">
                        {order.status === 'ARRIVING' ? (
                          <button onClick={() => setView('tracking')} className="flex-1 bg-slate-900 text-white py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                             <Navigation className="w-3.5 h-3.5" /> Track Live
                          </button>
                        ) : (
                          <button className="flex-1 bg-slate-50 text-slate-900 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest border">Reorder</button>
                        )}
                        <button className="px-5 bg-slate-50 rounded-2xl border text-slate-400"><MessageSquare className="w-4 h-4" /></button>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>

      {/* Redesigned Footer Menu */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-[420px] bg-white/80 backdrop-blur-2xl h-20 px-8 flex justify-between items-center z-[100] shadow-2xl rounded-[32px] border border-slate-100">
        <button onClick={() => setView('home')} className={`flex flex-col items-center gap-1.5 transition-all ${view === 'home' ? 'text-[#E23744]' : 'text-slate-300'}`}>
          <Home className={`w-6 h-6 ${view === 'home' ? 'fill-red-50' : ''}`} />
          <span className="text-[8px] font-black uppercase tracking-widest">Home</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 text-slate-300">
          <Search className="w-6 h-6" />
          <span className="text-[8px] font-black uppercase tracking-widest">Explore</span>
        </button>
        <button onClick={() => setView('orders')} className={`flex flex-col items-center gap-1.5 transition-all ${view === 'orders' ? 'text-[#E23744]' : 'text-slate-300'}`}>
          <List className="w-6 h-6" />
          <span className="text-[8px] font-black uppercase tracking-widest">Orders</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 text-slate-300">
          <User className="w-6 h-6" />
          <span className="text-[8px] font-black uppercase tracking-widest">Profile</span>
        </button>
      </div>

      {/* Cart Summary Bar */}
      {state.cart.length > 0 && view !== 'orders' && (
        <div className="fixed bottom-32 left-8 right-8 z-[110] animate-in slide-in-from-bottom duration-500">
           <button onClick={() => setView('cart')} className="w-full bg-[#E23744] p-4 rounded-[24px] shadow-2xl flex items-center justify-between overflow-hidden relative border-2 border-white/20">
              <div className="flex items-center gap-3 relative z-10">
                 <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-[#E23744] font-black text-sm">
                    {state.cart.reduce((a,b) => a + b.quantity, 0)}
                 </div>
                 <div className="text-left">
                    <h4 className="text-white font-black text-[9px] uppercase tracking-widest opacity-80">Cart Total</h4>
                    <p className="text-sm font-black text-white">₹{cartTotal.toFixed(2)}</p>
                 </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white" />
           </button>
        </div>
      )}

      {/* Detail Overlay */}
      {view === 'itemDetail' && selectedItem && (
        <div className="fixed inset-0 z-[200] bg-white animate-in slide-in-from-right duration-500 flex flex-col">
           <div className="relative h-[40%]">
              <img src={selectedItem.image} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <button onClick={() => setView('home')} className="absolute top-12 left-6 p-4 bg-white/20 backdrop-blur-xl rounded-2xl text-white border border-white/30 shadow-2xl"><ArrowLeft className="w-6 h-6" /></button>
              <div className="absolute bottom-8 left-8">
                 <h1 className="text-3xl font-black text-white leading-tight">{selectedItem.name}</h1>
                 <p className="text-xs font-bold text-white/70 uppercase tracking-widest mt-2">{selectedItem.category}</p>
              </div>
           </div>
           <div className="flex-1 bg-white rounded-t-[48px] -mt-10 relative z-10 px-8 pt-10 pb-8 overflow-y-auto">
              <div className="flex justify-between items-center mb-10">
                 <div className="flex items-center gap-6 bg-slate-50 p-2 rounded-2xl border">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm"><Minus className="w-4 h-4" /></button>
                    <span className="text-xl font-black text-slate-900">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#E23744] shadow-sm"><Plus className="w-4 h-4" /></button>
                 </div>
                 <span className="text-3xl font-black text-slate-900 tracking-tighter">₹{(selectedItem.price * quantity).toFixed(2)}</span>
              </div>
              <div className="space-y-6">
                 <div>
                    <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-3">About this dish</h3>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">{selectedItem.description}</p>
                 </div>
                 <div className="bg-orange-50 p-5 rounded-[28px] border border-orange-100 flex items-center gap-4">
                    <Flame className="w-6 h-6 text-orange-500" />
                    <div>
                       <h4 className="text-xs font-black text-orange-900 uppercase">Health Info</h4>
                       <p className="text-[10px] text-orange-700 font-bold uppercase mt-0.5">{selectedItem.calories || 320} Calories • 100% Organic</p>
                    </div>
                 </div>
              </div>
              <div className="mt-12">
                 <button onClick={() => { addToCart(selectedItem, quantity); setView('home'); }} className="w-full bg-slate-900 text-white py-6 rounded-[28px] font-black text-sm uppercase tracking-widest shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3">
                    <ShoppingBag className="w-5 h-5 text-[#E23744]" />
                    Add to order
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default CustomerApp;
