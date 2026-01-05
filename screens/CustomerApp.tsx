
import React, { useState, useEffect } from 'react';
import { AppState, Location, Order, Restaurant, CartItem, OrderStatus, MenuItem } from '../types.ts';
import { CATEGORIES, MOCK_RESTAURANTS } from '../constants.tsx';
import Button from '../components/ui/Button.tsx';
import { Card, CardContent } from '../components/ui/Card.tsx';
import { 
  Search, MapPin, ShoppingBag, Star, 
  Bell, Home, ChevronRight, 
  Scan, Clock, User, Heart, Minus, Plus, 
  Globe, LogOut, Trash2, ArrowLeft, CheckCircle2
} from 'lucide-react';
import { supabase } from '../supabase.ts';

interface Props {
  state: AppState;
  // Added React. prefix to SetStateAction to fix "Cannot find name 'SetStateAction'" error.
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  orders: Order[];
}

const CustomerApp: React.FC<Props> = ({ state, setState, orders }) => {
  const [view, setView] = useState<'location' | 'home' | 'restaurant' | 'cart' | 'profile' | 'addresses'>('location');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);

  const isGujarati = state.language === 'gu';
  const selectedRestaurant = MOCK_RESTAURANTS.find(r => r.id === selectedRestaurantId);

  const t = {
    deliverTo: isGujarati ? 'અહીં' : 'To',
    hungry: isGujarati ? 'ભૂખ લાગી?' : 'Hungry?',
    orderFav: isGujarati ? 'ઓર્ડર' : 'Order Now',
    searchPlaceholder: isGujarati ? 'શોધો...' : 'Search...',
    restaurantsNear: isGujarati ? 'નજીકના' : 'Nearby',
    all: isGujarati ? 'બધું' : 'All',
    profile: isGujarati ? 'પ્રોફાઇલ' : 'Me',
    checkout: isGujarati ? 'ચેકઆઉટ' : 'Checkout',
    placeOrder: isGujarati ? 'ઓર્ડર આપો' : 'Order Now',
    viewCart: isGujarati ? 'કાર્ટ' : 'Cart',
    add: isGujarati ? 'ઉમેરો' : 'Add'
  };

  useEffect(() => {
    if (state.currentLocation) setView('home');
    if (state.savedAddresses.length > 0) setSelectedAddressId(state.savedAddresses[0].id);
  }, []);

  const placeOrder = async () => {
    if (!state.currentLocation || state.cart.length === 0 || isPlacingOrder) return;
    
    let rId = selectedRestaurantId;
    if (!rId && state.cart.length > 0) {
      const firstItem = state.cart[0].menuItem;
      const res = MOCK_RESTAURANTS.find(r => r.menu.some(m => m.id === firstItem.id));
      rId = res?.id || '550e8400-e29b-41d4-a716-446655440000';
    }

    setIsPlacingOrder(true);
    const orderId = `ORD-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    const payload = {
      id: orderId,
      customer_id: state.phoneNumber || '9999999999',
      restaurant_id: rId,
      items: state.cart,
      total_amount: cartTotal,
      status: OrderStatus.PENDING,
      timestamp: Date.now(),
      delivery_location: state.currentLocation,
    };

    const { error } = await supabase.from('orders').insert([payload]);

    if (!error) {
      setState(prev => ({ ...prev, cart: [], activeOrder: payload as any }));
      setView('home');
      alert('Order placed successfully!');
    } else {
      console.error('Order placing failed:', error);
      alert(`Order Failed: ${error.message || 'Check if restaurants are synced in Admin panel'}`);
    }
    setIsPlacingOrder(false);
  };

  const addToCart = (item: MenuItem) => {
    setState(prev => {
      const existing = prev.cart.find(c => c.menuItem.id === item.id);
      if (existing) {
        return { ...prev, cart: prev.cart.map(c => c.menuItem.id === item.id ? { ...c, quantity: c.quantity + 1 } : c) };
      }
      return { ...prev, cart: [...prev.cart, { menuItem: item, quantity: 1 }] };
    });
  };

  const removeFromCart = (itemId: string) => {
    setState(prev => {
      const existing = prev.cart.find(c => c.menuItem.id === itemId);
      if (existing && existing.quantity > 1) {
        return { ...prev, cart: prev.cart.map(c => c.menuItem.id === itemId ? { ...c, quantity: c.quantity - 1 } : c) };
      }
      return { ...prev, cart: prev.cart.filter(c => c.menuItem.id !== itemId) };
    });
  };

  const detectLocation = () => {
    setIsDetecting(true);
    setTimeout(() => {
      const loc: Location = { id: 'l-0', lat: 19.07, lng: 72.87, address: "Bandra, Mumbai", type: 'Home' };
      setState(p => ({ ...p, currentLocation: loc, savedAddresses: [loc] }));
      setView('home');
      setIsDetecting(false);
    }, 800);
  };

  const cartTotal = state.cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);

  if (view === 'location') return (
    <div className="h-full bg-white flex flex-col items-center justify-center p-6 text-center">
       <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-4">
          <MapPin className="w-8 h-8 text-[#F36E35]" />
       </div>
       <h1 className="text-xl font-black mb-1">Set Delivery Location</h1>
       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-8">To see nearby restaurants</p>
       <Button variant="primary" fullWidth size="md" onClick={detectLocation} isLoading={isDetecting}>Detect My Location</Button>
    </div>
  );

  return (
    <div className="h-full bg-white flex flex-col relative overflow-hidden text-[11px]">
      {/* COMPACT HEADER */}
      {view !== 'restaurant' && (
        <div className="px-4 pt-6 pb-2 bg-white sticky top-0 z-[100] border-b border-slate-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-[#F36E35] rounded-full flex items-center justify-center text-white"><MapPin className="w-3.5 h-3.5" /></div>
              <div className="flex flex-col">
                <span className="text-[8px] font-bold text-slate-400 leading-none">{t.deliverTo}</span>
                <span className="text-[11px] font-black text-slate-900 truncate max-w-[100px]">{state.currentLocation?.address || "Mumbai"}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button onClick={() => setState(p => ({...p, language: p.language === 'en' ? 'gu' : 'en'}))} className="px-1.5 py-0.5 bg-orange-50 text-[#F36E35] rounded text-[8px] font-black uppercase border border-orange-100">{state.language}</button>
              <div className="w-7 h-7 bg-slate-50 rounded-full flex items-center justify-center"><Bell className="w-3.5 h-3.5 text-slate-400" /></div>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto hide-scrollbar pb-16">
        {view === 'home' && (
          <div className="animate-in fade-in duration-300">
            <div className="px-4 py-2">
              <div className="bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53] p-4 rounded-2xl min-h-[90px] relative overflow-hidden">
                <div className="relative z-10">
                  <h2 className="text-lg font-black text-white leading-tight">{t.hungry}</h2>
                  <p className="text-[8px] text-white/80 font-bold uppercase tracking-widest mb-2">Flat 50% Off Today</p>
                  <div className="inline-block bg-white/20 px-2 py-0.5 rounded text-[7px] font-black text-white">PROMO: FIRST50</div>
                </div>
                <img src="https://img.freepik.com/premium-photo/isolated-burger-with-cheese-vegtables-white-background_1253400-34.jpg?w=150" className="absolute -right-2 -bottom-2 w-20 h-20 object-contain opacity-90" />
              </div>
            </div>

            <div className="px-4 py-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                <input type="text" placeholder={t.searchPlaceholder} className="w-full bg-slate-50 h-8 pl-8 pr-3 rounded-lg text-[10px] outline-none" />
              </div>
            </div>

            <div className="px-4 py-2 flex gap-2 overflow-x-auto hide-scrollbar">
              <button onClick={() => setActiveCategory('All')} className={`flex flex-col items-center justify-center min-w-[50px] h-[64px] rounded-xl transition-all ${activeCategory === 'All' ? 'bg-[#F36E35] text-white shadow-sm' : 'bg-slate-50 text-slate-400'}`}>
                <div className="text-lg">🍱</div>
                <span className="text-[7px] font-black uppercase mt-1">All</span>
              </button>
              {CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => setActiveCategory(cat.name)} className={`flex flex-col items-center justify-center min-w-[50px] h-[64px] rounded-xl transition-all ${activeCategory === cat.name ? 'bg-[#F36E35] text-white shadow-sm' : 'bg-slate-50 text-slate-400'}`}>
                  <div className="text-lg">{cat.icon}</div>
                  <span className="text-[7px] font-black uppercase mt-1">{cat.name}</span>
                </button>
              ))}
            </div>

            <div className="px-4 pt-2 space-y-3">
              {MOCK_RESTAURANTS.map(res => (
                <div key={res.id} onClick={() => { setSelectedRestaurantId(res.id); setView('restaurant'); }} className="flex gap-3 bg-white p-2 rounded-xl border border-slate-50 shadow-sm active:scale-98 transition-all">
                  <img src={res.image} className="w-20 h-20 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0 py-1">
                    <div className="flex justify-between items-start">
                      <h4 className="text-[12px] font-black text-slate-900 truncate">{res.name}</h4>
                      <div className="flex items-center gap-0.5 bg-green-50 px-1 py-0.5 rounded">
                        <Star className="w-2 h-2 text-green-600 fill-green-600" />
                        <span className="text-[8px] font-black text-green-600">{res.rating}</span>
                      </div>
                    </div>
                    <p className="text-[9px] text-slate-400 font-bold truncate mb-2">{res.cuisine.join(', ')}</p>
                    <div className="flex gap-3 text-slate-500 text-[9px] font-black">
                      <span className="flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" /> {res.deliveryTime}m</span>
                      <span className="flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" /> {res.distance}km</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'restaurant' && selectedRestaurant && (
          <div className="animate-in slide-in-from-right duration-300">
            <div className="relative h-32">
               <img src={selectedRestaurant.image} className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-black/40" />
               <button onClick={() => setView('home')} className="absolute top-4 left-4 w-7 h-7 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white"><ArrowLeft className="w-4 h-4" /></button>
               <div className="absolute bottom-3 left-4 text-white">
                  <h2 className="text-base font-black">{selectedRestaurant.name}</h2>
                  <p className="text-[8px] font-bold opacity-80 uppercase tracking-widest">{selectedRestaurant.cuisine.join(' • ')}</p>
               </div>
            </div>
            <div className="p-4 space-y-4">
               {selectedRestaurant.menu.map(item => {
                 const cartItem = state.cart.find(c => c.menuItem.id === item.id);
                 return (
                   <div key={item.id} className="flex gap-3 items-center">
                     <div className="flex-1">
                       <h4 className="text-[11px] font-black text-slate-900">{item.name}</h4>
                       <p className="text-[9px] text-slate-400 leading-tight mb-1">{item.description}</p>
                       <p className="text-[11px] font-black text-slate-900">₹{item.price}</p>
                     </div>
                     <div className="relative w-16 h-16 flex-shrink-0">
                        <img src={item.image} className="w-full h-full object-cover rounded-lg" />
                        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-12">
                           {cartItem ? (
                             <div className="bg-white border border-orange-500 rounded h-5 flex items-center justify-around shadow-sm text-[10px]">
                                <button onClick={() => removeFromCart(item.id)} className="text-[#F36E35]"><Minus className="w-2.5 h-2.5" /></button>
                                <span className="font-black text-[9px]">{cartItem.quantity}</span>
                                <button onClick={() => addToCart(item)} className="text-[#F36E35]"><Plus className="w-2.5 h-2.5" /></button>
                             </div>
                           ) : (
                             <button onClick={() => addToCart(item)} className="w-full bg-white border border-slate-200 text-[#F36E35] font-black text-[8px] uppercase h-5 rounded shadow-sm">Add</button>
                           )}
                        </div>
                     </div>
                   </div>
                 );
               })}
            </div>
          </div>
        )}

        {view === 'cart' && (
          <div className="p-4 animate-in slide-in-from-bottom duration-300">
            <h1 className="text-lg font-black mb-4">{t.checkout}</h1>
            {state.cart.length > 0 ? (
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-xl p-3">
                  {state.cart.map(item => (
                    <div key={item.menuItem.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                       <div className="flex items-center gap-2">
                          <img src={item.menuItem.image} className="w-7 h-7 rounded object-cover" />
                          <div>
                             <h4 className="text-[10px] font-black">{item.menuItem.name}</h4>
                             <p className="text-[8px] text-slate-400">₹{item.menuItem.price} x {item.quantity}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-1.5">
                          <button onClick={() => removeFromCart(item.menuItem.id)} className="w-5 h-5 flex items-center justify-center bg-white rounded border border-slate-100 text-slate-400"><Minus className="w-2 h-2" /></button>
                          <span className="text-[9px] font-black">{item.quantity}</span>
                          <button onClick={() => addToCart(item.menuItem)} className="w-5 h-5 flex items-center justify-center bg-white rounded border border-slate-100 text-slate-400"><Plus className="w-2 h-2" /></button>
                       </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-[8px] font-black text-slate-400 uppercase tracking-widest px-1">Deliver To</h3>
                  {state.savedAddresses.map(addr => (
                    <button key={addr.id} onClick={() => setSelectedAddressId(addr.id)} className={`w-full p-2.5 text-left rounded-lg border transition-all flex items-center justify-between ${selectedAddressId === addr.id ? 'border-[#F36E35] bg-orange-50' : 'border-slate-100 bg-slate-50'}`}>
                      <div className="flex items-center gap-2 min-w-0">
                        <MapPin className={`w-3.5 h-3.5 flex-shrink-0 ${selectedAddressId === addr.id ? 'text-[#F36E35]' : 'text-slate-300'}`} />
                        <span className="text-[10px] font-black truncate">{addr.address}</span>
                      </div>
                      {selectedAddressId === addr.id && <CheckCircle2 className="w-3.5 h-3.5 text-[#F36E35]" />}
                    </button>
                  ))}
                </div>

                <div className="bg-slate-900 rounded-2xl p-4 text-white">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[9px] font-bold opacity-60 uppercase">Total Bill</span>
                    <span className="text-base font-black">₹{cartTotal}</span>
                  </div>
                  <Button variant="primary" fullWidth size="md" onClick={placeOrder} isLoading={isPlacingOrder} disabled={!selectedAddressId}>{t.placeOrder}</Button>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center opacity-30 flex flex-col items-center">
                 <ShoppingBag className="w-8 h-8 mb-2" />
                 <p className="font-black text-[10px] uppercase">Bag is empty</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 h-14 bg-white/95 backdrop-blur-xl border-t border-slate-100 flex items-center justify-around px-2 z-[200] rounded-t-2xl shadow-lg">
        <button onClick={() => setView('home')} className={`flex flex-col items-center gap-0.5 ${view === 'home' || view === 'restaurant' ? 'text-[#F36E35]' : 'text-slate-300'}`}>
          <Home className="w-4 h-4" />
          <span className="text-[8px] font-black uppercase">Home</span>
        </button>
        <button onClick={() => setView('cart')} className={`flex flex-col items-center gap-0.5 ${view === 'cart' ? 'text-[#F36E35]' : 'text-slate-300'}`}>
          <ShoppingBag className="w-4 h-4" />
          <span className="text-[8px] font-black uppercase">Cart</span>
        </button>
        <button onClick={() => setView('profile')} className={`flex flex-col items-center gap-0.5 ${view === 'profile' ? 'text-[#F36E35]' : 'text-slate-300'}`}>
          <User className="w-4 h-4" />
          <span className="text-[8px] font-black uppercase">Me</span>
        </button>
      </div>
    </div>
  );
};

export default CustomerApp;
