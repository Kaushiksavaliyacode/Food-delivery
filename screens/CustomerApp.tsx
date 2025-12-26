
import React, { useState, useEffect, useMemo } from 'react';
import { AppState, MenuItem, Location, OrderStatus, CartItem, Restaurant } from '../types.ts';
import { CATEGORIES, MOCK_RESTAURANTS } from '../constants.tsx';
import { db } from '../firebase.ts';
import { collection, onSnapshot, query, addDoc, Timestamp, orderBy } from 'firebase/firestore';
import { 
  Search, MapPin, ShoppingBag, Clock, Star, ArrowLeft, Plus, Minus,
  CheckCircle, Navigation, Phone, MessageSquare, ChevronRight, Heart, 
  Filter, SlidersHorizontal, Bell, Flame, Map as MapIcon, 
  Home, Briefcase, Wallet, User, Zap, CreditCard as CardIcon, Compass, Loader2, List, LayoutGrid, Trash2, ReceiptText, Languages, Cloud
} from 'lucide-react';

interface Props {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

type CustomerView = 'location' | 'home' | 'restaurantDetail' | 'itemDetail' | 'cart' | 'checkout' | 'success' | 'tracking' | 'orders';
type DisplayMode = 'grid' | 'list';
type Language = 'en' | 'gu';

const CustomerApp: React.FC<Props> = ({ state, setState }) => {
  const [view, setView] = useState<CustomerView>(state.currentLocation ? 'home' : 'location');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('grid');
  const [lang, setLang] = useState<Language>('en');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [cloudMenu, setCloudMenu] = useState<MenuItem[]>([]);
  const [myOrders, setMyOrders] = useState<any[]>([]);

  const isGujarati = lang === 'gu';

  // Sync Menu from Firestore
  useEffect(() => {
    const q = query(collection(db, "menu"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem));
      setCloudMenu(items);
    });
    return () => unsubscribe();
  }, []);

  // Sync My Orders from Firestore
  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMyOrders(orders);
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

  const updateCartQty = (id: string, delta: number) => {
    setState(prev => ({
      ...prev,
      cart: prev.cart.map(c => 
        c.menuItem.id === id 
          ? { ...c, quantity: Math.max(0, c.quantity + delta) } 
          : c
      ).filter(c => c.quantity > 0)
    }));
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

  const placeOrder = async () => {
    if (state.cart.length === 0) return;
    
    const newOrder = {
      customerName: "Alex User",
      phoneNumber: state.phoneNumber || "9876543210",
      items: state.cart.map(c => ({ name: c.menuItem.name, qty: c.quantity, price: c.menuItem.price })),
      totalAmount: grandTotal,
      status: OrderStatus.PENDING,
      timestamp: Timestamp.now(),
      deliveryLocation: state.currentLocation || { lat: 21.96, lng: 70.79, address: "Gondal Main Center" },
      restaurantName: selectedRestaurant?.name || "Global Store"
    };

    try {
      await addDoc(collection(db, "orders"), newOrder);
      setState(p => ({ ...p, cart: [] }));
      setView('success');
    } catch (err) {
      console.error("Order failed:", err);
    }
  };

  // Combine Mock and Cloud Menu
  const displayedMenu = useMemo(() => {
    const combined = [...cloudMenu];
    if (selectedRestaurant) {
      // In a real app, we'd query by restaurantId
      // For this demo, we merge the static mock menu with dynamic cloud items
      combined.push(...selectedRestaurant.menu.filter(m => !cloudMenu.find(cm => cm.name === m.name)));
    }
    
    let items = combined;
    if (activeCategory) items = items.filter(i => i.category === activeCategory);
    if (searchQuery) items = items.filter(i => {
      const name = isGujarati ? (i.nameGujarati || i.name) : i.name;
      return name.toLowerCase().includes(searchQuery.toLowerCase());
    });
    return items;
  }, [cloudMenu, selectedRestaurant, activeCategory, searchQuery, isGujarati]);

  const subtotal = state.cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
  const tax = subtotal * 0.05;
  const deliveryFee = subtotal > 0 ? 30 : 0;
  const grandTotal = subtotal + tax + deliveryFee;

  const t = (en: string, gu?: string) => (isGujarati && gu ? gu : en);

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

  if (view === 'cart') return (
    <div className="h-full bg-slate-50 flex flex-col animate-in slide-in-from-right duration-500">
       <div className="bg-white px-6 pt-12 pb-6 flex items-center gap-4 sticky top-0 z-50 border-b border-slate-100">
          <button onClick={() => setView('restaurantDetail')} className="p-3 bg-slate-50 rounded-2xl border"><ArrowLeft className="w-5 h-5" /></button>
          <div className="flex-1">
             <h2 className={`text-xl font-black text-slate-900 tracking-tight ${isGujarati ? 'font-gujarati' : ''}`}>{t("Checkout", "તમારું કાર્ટ")}</h2>
             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{state.cart.length} Items</p>
          </div>
       </div>
       <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-44 hide-scrollbar">
          {state.cart.map(item => (
            <div key={item.menuItem.id} className="bg-white p-5 rounded-[32px] border shadow-sm flex items-center gap-5">
               <div className="w-20 h-20 rounded-[22px] overflow-hidden border flex-shrink-0">
                  <img src={item.menuItem.image} className="w-full h-full object-cover" />
               </div>
               <div className="flex-1">
                  <h4 className="font-black text-slate-900 text-sm mb-1">{item.menuItem.name}</h4>
                  <p className="text-xs font-black text-[#E23744]">₹{item.menuItem.price}</p>
                  <div className="mt-3 flex items-center gap-3">
                     <button onClick={() => updateCartQty(item.menuItem.id, -1)} className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center"><Minus className="w-3 h-3" /></button>
                     <span className="text-xs font-black">{item.quantity}</span>
                     <button onClick={() => updateCartQty(item.menuItem.id, 1)} className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center"><Plus className="w-3 h-3" /></button>
                  </div>
               </div>
            </div>
          ))}
          <div className="bg-white rounded-[40px] p-8 border shadow-sm">
             <h4 className="text-sm font-black text-slate-900 mb-6 flex items-center gap-2"><ReceiptText className="w-5 h-5 text-slate-400" /> Bill Summary</h4>
             <div className="space-y-4">
                <div className="flex justify-between text-xs font-medium text-slate-500"><span>Item Total</span><span className="font-black text-slate-900">₹{subtotal}</span></div>
                <div className="flex justify-between text-xs font-medium text-slate-500"><span>Delivery Fee</span><span className="font-black text-slate-900">₹{deliveryFee}</span></div>
                <div className="flex justify-between text-xs font-medium text-slate-500"><span>Taxes (GST)</span><span className="font-black text-slate-900">₹{tax.toFixed(2)}</span></div>
                <div className="pt-4 border-t-2 border-dashed flex justify-between items-center"><span className="text-base font-black text-slate-900">To Pay</span><span className="text-2xl font-black text-slate-900">₹{grandTotal.toFixed(0)}</span></div>
             </div>
          </div>
       </div>
       <div className="fixed bottom-0 left-0 right-0 p-8 bg-white/80 backdrop-blur-2xl border-t rounded-t-[48px] shadow-2xl z-[110]">
          <button onClick={placeOrder} className="w-full bg-[#E23744] text-white py-6 rounded-[28px] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-4">
             Place Live Order <ChevronRight className="w-5 h-5" />
          </button>
       </div>
    </div>
  );

  if (view === 'success') return (
    <div className="h-full bg-white flex flex-col items-center justify-center p-12 text-center animate-in fade-in duration-500">
       <div className="w-32 h-32 bg-green-50 rounded-[48px] flex items-center justify-center mb-10 shadow-2xl">
          <CheckCircle className="w-16 h-16 text-green-500 animate-bounce" />
       </div>
       <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Order Placed!</h2>
       <p className="text-xs font-medium text-slate-400 leading-loose mb-12 uppercase tracking-widest">Your meal is synced to our Gondal fleet.</p>
       <button onClick={() => setView('home')} className="w-full bg-slate-900 text-white py-6 rounded-[28px] font-black text-[10px] uppercase tracking-widest">Return Home</button>
    </div>
  );

  return (
    <div className="h-full bg-white flex flex-col relative overflow-hidden">
      
      {/* Header */}
      <div className="px-6 pt-12 pb-4 sticky top-0 bg-white/80 backdrop-blur-xl z-40 border-b border-slate-50">
        <div className="flex items-center justify-between mb-6">
           <button onClick={() => setView('location')} className="flex items-center gap-2 max-w-[50%] text-left">
              <div className="bg-red-50 p-2 rounded-xl"><MapPin className="w-4 h-4 text-[#E23744]" /></div>
              <div className="truncate">
                 <h4 className="text-xs font-black text-slate-900">{state.currentLocation?.type || 'Location'}</h4>
                 <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest truncate">{state.currentLocation?.address || "Gondal Service Area"}</p>
              </div>
           </button>
           <div className="flex gap-2">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-200 shadow-sm text-blue-600">
                <Cloud className="w-5 h-5" />
              </div>
              <button 
                onClick={() => setLang(lang === 'en' ? 'gu' : 'en')}
                className="w-11 h-11 rounded-2xl bg-orange-50 flex items-center justify-center border border-orange-200 shadow-sm text-orange-600"
              >
                <Languages className="w-5 h-5" />
              </button>
           </div>
        </div>
        <div className="relative">
           <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
           <input 
             type="text" 
             placeholder={t("Find cravings...", "ખાવાનું શોધો...")}
             className="w-full bg-slate-50 rounded-[20px] py-4 pl-12 pr-12 outline-none font-bold text-xs border border-slate-100"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
           />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar pb-40">
        {view === 'home' && (
          <div className="px-6 py-6 space-y-8 animate-in fade-in duration-500">
             <h2 className={`text-2xl font-black text-slate-900 tracking-tight ${isGujarati ? 'font-gujarati' : ''}`}>
               {t("All Restaurants", "બધી હોટેલ")}
             </h2>
             <div className="space-y-6">
                {MOCK_RESTAURANTS.map(res => (
                  <div key={res.id} onClick={() => { setSelectedRestaurant(res); setView('restaurantDetail'); }} className="group relative bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden active:scale-[0.98] transition-all cursor-pointer">
                     <div className="h-48 relative">
                        <img src={res.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl flex items-center gap-1.5 shadow-xl">
                           <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                           <span className="text-[11px] font-black">{res.rating}</span>
                        </div>
                        <div className="absolute bottom-4 left-6">
                           <h3 className={`text-xl font-black text-white ${isGujarati ? 'font-gujarati' : ''}`}>{t(res.name, res.nameGujarati)}</h3>
                           <p className="text-white/60 text-[10px] font-black uppercase mt-1">{res.cuisine.join(' • ')}</p>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {view === 'restaurantDetail' && selectedRestaurant && (
          <div className="animate-in slide-in-from-bottom duration-500">
            <button onClick={() => setView('home')} className="px-6 py-4 flex items-center gap-2 text-[#E23744] font-black text-xs uppercase tracking-widest">
               <ArrowLeft className="w-4 h-4" /> Back to Hotels
            </button>
            <div className="px-6 mb-6">
               <h1 className={`text-3xl font-black text-slate-900 ${isGujarati ? 'font-gujarati' : ''}`}>{t(selectedRestaurant.name, selectedRestaurant.nameGujarati)}</h1>
            </div>
            
            <div className="px-6 grid grid-cols-2 gap-4">
               {displayedMenu.map(item => (
                 <div key={item.id} onClick={() => { setSelectedItem(item); setView('itemDetail'); }} className="bg-white rounded-[28px] border border-slate-50 shadow-sm p-3 hover:shadow-xl transition-all cursor-pointer">
                    <div className="relative aspect-square rounded-[22px] overflow-hidden mb-3">
                       <img src={item.image} className="w-full h-full object-cover" />
                       <button onClick={(e) => { e.stopPropagation(); addToCart(item, 1); }} className="absolute bottom-2 right-2 w-8 h-8 bg-[#E23744] rounded-xl flex items-center justify-center text-white shadow-lg"><Plus className="w-4 h-4" /></button>
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
          <div className="px-6 py-8 space-y-8 animate-in slide-in-from-right duration-500 pb-32">
             <h2 className="text-2xl font-black text-slate-900 tracking-tight">Cloud Sync Orders</h2>
             <div className="space-y-5">
                {myOrders.map(order => (
                  <div key={order.id} className="bg-white rounded-[40px] p-8 border shadow-sm group">
                     <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                           <div className="w-14 h-14 rounded-3xl flex items-center justify-center bg-orange-50 text-orange-500">
                              <ShoppingBag className="w-7 h-7" />
                           </div>
                           <div>
                              <h4 className="font-black text-slate-900 text-lg">#{order.id.slice(0,6)}</h4>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{order.restaurantName}</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <span className="text-xl font-black text-slate-900">₹{order.totalAmount}</span>
                           <p className={`text-[9px] font-black uppercase mt-1 ${order.status === 'DELIVERED' ? 'text-green-500' : 'text-orange-500'}`}>{order.status}</p>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>

      {/* Item Detail Overlay */}
      {view === 'itemDetail' && selectedItem && (
        <div className="fixed inset-0 z-[200] bg-white animate-in slide-in-from-right duration-500 flex flex-col">
           <div className="relative h-[40%]">
              <img src={selectedItem.image} className="w-full h-full object-cover" />
              <button onClick={() => setView('restaurantDetail')} className="absolute top-12 left-6 p-4 bg-white/20 backdrop-blur-xl rounded-2xl text-white border border-white/30 shadow-2xl"><ArrowLeft className="w-6 h-6" /></button>
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
              <p className="text-sm text-slate-500 leading-relaxed font-medium mb-12">{selectedItem.description}</p>
              <button onClick={() => { addToCart(selectedItem, quantity); setView('restaurantDetail'); setQuantity(1); }} className="w-full bg-slate-900 text-white py-6 rounded-[28px] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all">
                Add to Cart
              </button>
           </div>
        </div>
      )}

      {/* Cart Summary Bar */}
      {/* Fix: Removed redundant checks for 'cart' and 'success' views because they are already handled by early returns above */}
      {state.cart.length > 0 && (
        <div className="fixed bottom-36 left-8 right-8 z-[110] animate-in slide-in-from-bottom duration-500">
           <button onClick={() => setView('cart')} className="w-full bg-[#E23744] p-5 rounded-[28px] shadow-2xl flex items-center justify-between border-2 border-white/20 active:scale-[0.98] transition-all">
              <div className="flex items-center gap-4 relative z-10">
                 <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-[#E23744] font-black text-sm">{state.cart.length}</div>
                 <p className="text-lg font-black text-white">₹{grandTotal.toFixed(0)}</p>
              </div>
              <ChevronRight className="w-6 h-6 text-white" />
           </button>
        </div>
      )}

      {/* Footer Nav */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-[420px] bg-white/80 backdrop-blur-2xl h-22 px-10 flex justify-between items-center z-[100] shadow-2xl rounded-[36px] border border-slate-100">
        <button onClick={() => setView('home')} className={`flex flex-col items-center gap-2 transition-all ${view === 'home' || view === 'restaurantDetail' ? 'text-[#E23744] scale-110' : 'text-slate-300'}`}>
          <Home className="w-7 h-7" />
          <span className="text-[9px] font-black uppercase tracking-widest">Home</span>
        </button>
        <button onClick={() => setView('orders')} className={`flex flex-col items-center gap-2 transition-all ${view === 'orders' ? 'text-[#E23744] scale-110' : 'text-slate-300'}`}>
          <List className="w-7 h-7" />
          <span className="text-[9px] font-black uppercase tracking-widest">Orders</span>
        </button>
        <button className="flex flex-col items-center gap-2 text-slate-300">
          <User className="w-7 h-7" />
          <span className="text-[9px] font-black uppercase tracking-widest">Profile</span>
        </button>
      </div>
    </div>
  );
};

export default CustomerApp;
