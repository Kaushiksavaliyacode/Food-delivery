import React, { useState, useEffect, useMemo } from 'react';
import { AppState, MenuItem, Location, OrderStatus, Order } from '../types.ts';
import { CATEGORIES, MOCK_RESTAURANTS } from '../constants.tsx';
import { 
  Search, MapPin, ShoppingBag, Clock, Star, ArrowLeft, Plus, Minus,
  CheckCircle, Navigation, Phone, MessageSquare, ChevronRight, Heart, 
  Filter, SlidersHorizontal, Bell, Flame, Map as MapIcon, 
  Home, Briefcase, Wallet, User, Zap, CreditCard as CardIcon, Compass, Loader2, List
} from 'lucide-react';
import { collection, addDoc, onSnapshot, query, where, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase.ts';

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
  const [liveOrders, setLiveOrders] = useState<Order[]>([]);

  // Listen for live orders in Firestore
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, 'orders'), where('customerId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      setLiveOrders(orders);
    });
    return () => unsubscribe();
  }, []);

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

  const placeOrder = async () => {
    const user = auth.currentUser;
    if (!user || state.cart.length === 0) return;
    setIsLoading(true);
    try {
      await addDoc(collection(db, 'orders'), {
        customerId: user.uid,
        restaurantId: 'r1', // Mocking first restaurant
        items: state.cart,
        totalAmount: state.cart.reduce((a,b) => a + (b.menuItem.price * b.quantity), 0),
        status: OrderStatus.PENDING,
        timestamp: serverTimestamp(),
        deliveryLocation: state.currentLocation
      });
      setState(p => ({ ...p, cart: [] }));
      setView('success');
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
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
           </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar pb-40">
        {view === 'home' && (
          <div className="animate-in fade-in duration-500">
            <div className="px-6 py-6 overflow-x-auto hide-scrollbar flex gap-4">
                 {CATEGORIES.map(cat => (
                   <button key={cat.id} onClick={() => setActiveCategory(activeCategory === cat.name ? null : cat.name)} className={`flex flex-col items-center gap-2 transition-all px-4 py-3 rounded-3xl border-2 ${activeCategory === cat.name ? 'bg-red-50 border-[#E23744]' : 'bg-slate-50 border-transparent'}`}>
                     <span className="text-xl">{cat.icon}</span>
                     <span className={`text-[9px] font-black uppercase tracking-tight ${activeCategory === cat.name ? 'text-[#E23744]' : 'text-slate-400'}`}>{cat.name}</span>
                   </button>
                 ))}
            </div>

            <div className="px-6 grid grid-cols-2 gap-4 mt-4">
                  {filteredItems.map(item => (
                    <div key={item.id} onClick={() => { setSelectedItem(item); setView('itemDetail'); }} className="bg-white rounded-[28px] border border-slate-50 shadow-sm p-3">
                       <div className="relative aspect-square rounded-[22px] overflow-hidden mb-3">
                          <img src={item.image} className="w-full h-full object-cover" />
                       </div>
                       <div>
                          <h4 className="text-[11px] font-black text-slate-900 leading-tight mb-1 truncate">{item.name}</h4>
                          <span className="text-xs font-black text-slate-900">₹{item.price}</span>
                       </div>
                    </div>
                  ))}
            </div>
          </div>
        )}

        {view === 'orders' && (
          <div className="px-6 py-8 space-y-8 animate-in slide-in-from-right duration-500">
             <h2 className="text-2xl font-black text-slate-900">Your Orders</h2>
             <div className="space-y-4">
                {liveOrders.map(order => (
                  <div key={order.id} className="bg-white rounded-[32px] p-6 border shadow-sm relative overflow-hidden">
                     <div className="flex justify-between items-start mb-4">
                        <h4 className="font-black text-slate-900 text-sm">{order.id.slice(-6).toUpperCase()}</h4>
                        <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                          {order.status}
                        </span>
                     </div>
                     <p className="text-sm font-black text-slate-900">₹{order.totalAmount.toFixed(2)}</p>
                  </div>
                ))}
             </div>
          </div>
        )}
        
        {view === 'success' && (
           <div className="flex flex-col items-center justify-center p-12 text-center animate-in zoom-in duration-500">
             <CheckCircle className="w-24 h-24 text-green-500 mb-8" />
             <h2 className="text-3xl font-black mb-4">Order Placed!</h2>
             <p className="text-slate-500 mb-8">Your food will be arriving soon.</p>
             <button onClick={() => setView('orders')} className="bg-slate-900 text-white px-8 py-4 rounded-3xl font-black uppercase text-xs">Track Order</button>
           </div>
        )}
      </div>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-[420px] bg-white/80 backdrop-blur-2xl h-20 px-8 flex justify-between items-center z-[100] shadow-2xl rounded-[32px] border border-slate-100">
        <button onClick={() => setView('home')} className={`flex flex-col items-center gap-1.5 ${view === 'home' ? 'text-[#E23744]' : 'text-slate-300'}`}>
          <Home className="w-6 h-6" />
          <span className="text-[8px] font-black uppercase">Home</span>
        </button>
        <button onClick={() => setView('orders')} className={`flex flex-col items-center gap-1.5 ${view === 'orders' ? 'text-[#E23744]' : 'text-slate-300'}`}>
          <List className="w-6 h-6" />
          <span className="text-[8px] font-black uppercase">Orders</span>
        </button>
      </div>

      {state.cart.length > 0 && view === 'home' && (
        <div className="fixed bottom-32 left-8 right-8 z-[110] animate-in slide-in-from-bottom duration-500">
           <button onClick={placeOrder} disabled={isLoading} className="w-full bg-[#E23744] p-4 rounded-[24px] shadow-2xl flex items-center justify-between text-white font-black">
              {isLoading ? <Loader2 className="animate-spin mx-auto" /> : <>
                <span>Place Order (₹{cartTotal.toFixed(2)})</span>
                <ChevronRight className="w-5 h-5" />
              </>}
           </button>
        </div>
      )}

      {view === 'itemDetail' && selectedItem && (
        <div className="fixed inset-0 z-[200] bg-white animate-in slide-in-from-right duration-500 flex flex-col">
           <div className="relative h-[40%]">
              <img src={selectedItem.image} className="w-full h-full object-cover" />
              <button onClick={() => setView('home')} className="absolute top-12 left-6 p-4 bg-white/20 backdrop-blur-xl rounded-2xl text-white border border-white/30"><ArrowLeft className="w-6 h-6" /></button>
           </div>
           <div className="flex-1 bg-white rounded-t-[48px] -mt-10 p-10">
              <h1 className="text-3xl font-black text-slate-900 mb-4">{selectedItem.name}</h1>
              <p className="text-slate-500 mb-10">{selectedItem.description}</p>
              <div className="flex items-center gap-6 mb-10">
                 <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 border rounded-xl flex items-center justify-center"><Minus className="w-5 h-5" /></button>
                 <span className="text-2xl font-black">{quantity}</span>
                 <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-12 border rounded-xl flex items-center justify-center"><Plus className="w-5 h-5" /></button>
              </div>
              <button onClick={() => { addToCart(selectedItem, quantity); setView('home'); }} className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black uppercase tracking-widest">
                 Add to order • ₹{(selectedItem.price * quantity).toFixed(2)}
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default CustomerApp;