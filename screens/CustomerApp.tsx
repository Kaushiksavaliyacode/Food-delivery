
import React, { useState, useEffect } from 'react';
import { AppState, Location, Order, Restaurant, CartItem, OrderStatus, MenuItem } from '../types.ts';
import { CATEGORIES, MOCK_RESTAURANTS, COLORS } from '../constants.tsx';
import Button from '../components/ui/Button.tsx';
import { Card, CardContent } from '../components/ui/Card.tsx';
import { 
  Search, MapPin, ShoppingBag, Star, 
  Bell, Home, ChevronRight, 
  Scan, Clock, User, QrCode, Heart, X, Plus, Minus,
  Globe, ShieldCheck, Settings, HelpCircle, CreditCard, LogOut, Trash2, ArrowLeft, CheckCircle2
} from 'lucide-react';
import { supabase } from '../supabase.ts';

interface Props {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  orders: Order[];
}

const CustomerApp: React.FC<Props> = ({ state, setState, orders }) => {
  const [view, setView] = useState<'location' | 'home' | 'restaurant' | 'cart' | 'tracking' | 'profile' | 'addresses' | 'favorites' | 'help' | 'settings'>('location');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);

  const isGujarati = state.language === 'gu';
  const selectedRestaurant = MOCK_RESTAURANTS.find(r => r.id === selectedRestaurantId);

  // Translations
  const t = {
    deliverTo: isGujarati ? 'અહીં પહોંચાડો' : 'Deliver to',
    hungry: isGujarati ? 'ભૂખ લાગી છે?' : 'Hungry?',
    orderFav: isGujarati ? 'તમારી મનપસંદ રેસ્ટોરન્ટમાંથી ઓર્ડર કરો' : 'Order from favorites',
    searchPlaceholder: isGujarati ? 'રેસ્ટોરન્ટ, વાનગી શોધો' : 'Search food...',
    restaurantsNear: isGujarati ? 'તમારી નજીકની રેસ્ટોરન્ટ્સ' : 'Nearby Places',
    places: isGujarati ? 'જગ્યાઓ' : 'places',
    all: isGujarati ? 'બધું' : 'All',
    profile: isGujarati ? 'પ્રોફાઇલ' : 'Profile',
    savedAddresses: isGujarati ? 'સાચવેલા સરનામાં' : 'Addresses',
    favorites: isGujarati ? 'મનપસંદ' : 'Favorites',
    helpSupport: isGujarati ? 'મદદ અને સપોર્ટ' : 'Support',
    settings: isGujarati ? 'સેટિંગ્સ' : 'Settings',
    logout: isGujarati ? 'લૉગ આઉટ' : 'Logout',
    checkout: isGujarati ? 'ચેકઆઉટ' : 'Checkout',
    selectAddress: isGujarati ? 'સરનામું પસંદ કરો' : 'Select Address',
    placeOrder: isGujarati ? 'ઓર્ડર આપો' : 'Place Order',
    viewCart: isGujarati ? 'કાર્ટ જુઓ' : 'View Cart',
    add: isGujarati ? 'ઉમેરો' : 'Add'
  };

  useEffect(() => {
    if (state.currentLocation) setView('home');
  }, []);

  const placeOrder = async () => {
    if (!state.currentLocation || state.cart.length === 0 || isPlacingOrder) return;
    setIsPlacingOrder(true);

    const newOrder: Order = {
      id: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      customerId: state.phoneNumber || 'anonymous-user',
      restaurantId: selectedRestaurantId || 'unknown-restaurant',
      items: state.cart,
      totalAmount: cartTotal,
      status: OrderStatus.PENDING,
      timestamp: Date.now(),
      deliveryLocation: state.currentLocation,
    };

    const { error } = await supabase.from('orders').insert([newOrder]);

    if (!error) {
      setState(prev => ({
        ...prev,
        cart: [],
        activeOrder: newOrder
      }));
      setView('home');
      alert('Order placed successfully! Track it in your history.');
    } else {
      console.error('Order error:', error);
      alert('Failed to place order.');
    }
    setIsPlacingOrder(false);
  };

  const toggleLanguage = () => {
    setState(prev => ({ ...prev, language: prev.language === 'en' ? 'gu' : 'en' }));
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setState(prev => {
      const favorites = prev.favorites || [];
      const newFavorites = favorites.includes(id) 
        ? favorites.filter(f => f !== id) 
        : [...favorites, id];
      return { ...prev, favorites: newFavorites };
    });
  };

  const addToCart = (item: MenuItem) => {
    setState(prev => {
      const existing = prev.cart.find(c => c.menuItem.id === item.id);
      if (existing) {
        return {
          ...prev,
          cart: prev.cart.map(c => c.menuItem.id === item.id ? { ...c, quantity: c.quantity + 1 } : c)
        };
      }
      return { ...prev, cart: [...prev.cart, { menuItem: item, quantity: 1 }] };
    });
  };

  const removeFromCart = (itemId: string) => {
    setState(prev => {
      const existing = prev.cart.find(c => c.menuItem.id === itemId);
      if (existing && existing.quantity > 1) {
        return {
          ...prev,
          cart: prev.cart.map(c => c.menuItem.id === itemId ? { ...c, quantity: c.quantity - 1 } : c)
        };
      }
      return { ...prev, cart: prev.cart.filter(c => c.menuItem.id !== itemId) };
    });
  };

  const addAddress = () => {
    const newAddr: Location = {
      id: Math.random().toString(36).substr(2, 9),
      lat: 19.0760,
      lng: 72.8777,
      address: "Bandra West, Mumbai",
      type: 'Home'
    };
    setState(prev => ({ ...prev, savedAddresses: [...(prev.savedAddresses || []), newAddr] }));
  };

  const removeAddress = (id: string) => {
    setState(prev => ({ ...prev, savedAddresses: prev.savedAddresses.filter(a => a.id !== id) }));
  };

  const detectLocation = () => {
    setIsDetecting(true);
    setTimeout(() => {
      const loc: Location = { 
        id: 'initial-loc',
        lat: 19.0760, 
        lng: 72.8777, 
        address: "Mumbai, Maharashtra",
        type: 'Home' 
      };
      setState(p => ({ ...p, currentLocation: loc, savedAddresses: [loc] }));
      setView('home');
      setIsDetecting(false);
    }, 1200);
  };

  const NavButton = ({ label, icon: Icon, active, onClick }: any) => (
    <button onClick={onClick} className={`flex flex-col items-center gap-0.5 transition-all ${active ? 'text-[#F36E35]' : 'text-[#8E8E93]'}`}>
      <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
      <span className={`text-[10px] font-bold`}>{label}</span>
    </button>
  );

  const displayRestaurants = activeCategory === 'All' 
    ? MOCK_RESTAURANTS 
    : MOCK_RESTAURANTS.filter(r => r.cuisine.some(c => c.includes(activeCategory)));

  const cartTotal = state.cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
  const cartCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);

  if (view === 'location') return (
    <div className="h-full bg-white flex flex-col">
      <div className="flex-1 bg-slate-50 relative flex items-center justify-center p-8 text-center">
         <div className="absolute inset-0 bg-gradient-to-b from-orange-50 to-white" />
         <div className="relative">
            <div className="w-24 h-24 bg-white rounded-[32px] shadow-xl flex items-center justify-center mx-auto mb-8">
               <MapPin className="w-12 h-12 text-[#F36E35] animate-bounce" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Ready to eat?</h1>
            <p className="text-xs text-slate-400 font-medium">Set your delivery address to explore.</p>
         </div>
      </div>
      <div className="bg-white p-8 rounded-t-[40px] -mt-12 relative z-10 shadow-xl">
        <Button variant="primary" style={{ backgroundColor: '#F36E35' }} size="lg" fullWidth onClick={detectLocation} isLoading={isDetecting}>
          Find My Location
        </Button>
      </div>
    </div>
  );

  return (
    <div className="h-full bg-white flex flex-col relative overflow-hidden">
      
      {/* HEADER */}
      {view !== 'restaurant' && view !== 'tracking' && (
        <div className="px-5 pt-10 pb-3 bg-white sticky top-0 z-[100]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-[#F36E35] rounded-full flex items-center justify-center text-white shadow-md">
                <MapPin className="w-5 h-5" fill="currentColor" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-[#8E8E93] leading-tight">{t.deliverTo}</span>
                <button className="flex items-center gap-1" onClick={() => setView('addresses')}>
                  <span className="text-[13px] font-black text-[#1C1C1E] truncate max-w-[120px]">{state.currentLocation?.address || "Mumbai"}</span>
                  <ChevronRight className="w-3 h-3 text-[#8E8E93] rotate-90" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={toggleLanguage} className="px-2 py-1 bg-orange-50 text-[#F36E35] rounded-lg text-[9px] font-black border border-orange-100">{isGujarati ? 'EN' : 'GU'}</button>
              <button className="w-9 h-9 bg-[#F5F5F7] rounded-full flex items-center justify-center relative text-[#1C1C1E]">
                <Bell className="w-4 h-4" />
                <span className="absolute top-[8px] right-[8px] w-2 h-2 bg-[#F36E35] rounded-full border border-white" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEWPORT */}
      <div className="flex-1 overflow-y-auto hide-scrollbar pb-24">
        {view === 'home' && (
          <div className="animate-in fade-in duration-500">
            <div className="px-5 py-3">
              <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53] p-6 min-h-[140px] shadow-lg shadow-orange-100/40">
                <div className="relative z-10 max-w-[65%]">
                  <h2 className="text-2xl font-black text-white mb-0.5 leading-tight">{t.hungry}</h2>
                  <p className="text-[11px] text-white/90 font-bold mb-4">{t.orderFav}</p>
                  <div className="inline-flex bg-white/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/40 text-[9px] font-black text-white">🎉 50% OFF TODAY</div>
                </div>
                <div className="absolute right-[-5px] bottom-[0px] w-32 h-32 animate-float">
                  <img src="https://img.freepik.com/premium-photo/isolated-burger-with-cheese-vegtables-white-background_1253400-34.jpg?w=300" className="w-full h-full object-contain mix-blend-multiply" />
                </div>
              </div>
            </div>

            <div className="px-5 py-1 flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E93]" />
                <input 
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-[#F5F5F7] border-none h-[48px] pl-10 pr-4 rounded-xl text-[14px] font-bold outline-none"
                />
              </div>
              <button className="w-[48px] h-[48px] bg-[#F0FDF4] rounded-xl flex items-center justify-center text-[#34C759] border border-[#DCFCE7]">
                <Scan className="w-5 h-5" />
              </button>
            </div>

            <div className="px-5 py-4">
               <div className="flex gap-3 overflow-x-auto hide-scrollbar">
                <button onClick={() => setActiveCategory('All')} className={`flex flex-col items-center justify-center gap-1 rounded-[20px] min-w-[70px] h-[85px] transition-all ${activeCategory === 'All' ? 'bg-[#F36E35] text-white shadow-md' : 'bg-[#F9F9F9] text-[#8E8E93]'}`}>
                  <div className="text-2xl">🍽️</div>
                  <span className="text-[10px] font-black">{t.all}</span>
                </button>
                {CATEGORIES.map(cat => (
                  <button key={cat.id} onClick={() => setActiveCategory(cat.name)} className={`flex flex-col items-center justify-center gap-1 rounded-[20px] min-w-[70px] h-[85px] transition-all ${activeCategory === cat.name ? 'bg-[#F36E35] text-white shadow-md' : 'bg-[#F9F9F9] text-[#8E8E93]'}`}>
                    <div className="text-2xl">{cat.icon}</div>
                    <span className="text-[10px] font-black">{cat.name}</span>
                  </button>
                ))}
               </div>
            </div>

            <div className="px-5 flex items-center justify-between mb-3">
               <h3 className="text-[17px] font-black text-[#1C1C1E]">{t.restaurantsNear}</h3>
               <span className="text-[11px] font-bold text-[#8E8E93]">{displayRestaurants.length} places</span>
            </div>

            <div className="px-5 space-y-5">
              {displayRestaurants.map(res => (
                <Card 
                  key={res.id} 
                  className="rounded-[28px] overflow-hidden bg-white shadow-md border-slate-100"
                  onClick={() => { setSelectedRestaurantId(res.id); setView('restaurant'); }}
                >
                  <div className="relative h-44">
                    <img src={res.image} className="w-full h-full object-cover" />
                    <div className="absolute bottom-2 left-2 bg-[#F36E35] text-white text-[9px] font-black px-2 py-1 rounded-lg">50% OFF</div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="text-[16px] font-black text-[#1C1C1E]">{res.name}</h4>
                      <div className="flex items-center gap-0.5 bg-[#F2FBF6] px-1.5 py-0.5 rounded-md">
                        <Star className="w-3 h-3 text-[#34C759] fill-[#34C759]" />
                        <span className="text-[11px] font-black text-[#34C759]">{res.rating}</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-[#8E8E93] font-bold truncate mb-3">{res.cuisine.join(' • ')}</p>
                    <div className="flex gap-4 text-[#1C1C1E] text-[11px] font-black">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-orange-500" /> {res.deliveryTime}m</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-orange-500" /> {res.distance}km</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {view === 'restaurant' && selectedRestaurant && (
          <div className="animate-in slide-in-from-right duration-500 pb-20">
            <div className="relative h-56">
               <img src={selectedRestaurant.image} className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-black/30" />
               <button onClick={() => setView('home')} className="absolute top-10 left-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white"><ArrowLeft className="w-5 h-5" /></button>
               <div className="absolute bottom-5 left-6 right-6 text-white">
                  <h2 className="text-2xl font-black">{selectedRestaurant.name}</h2>
                  <p className="text-[11px] font-bold opacity-80">{selectedRestaurant.cuisine.join(' • ')}</p>
               </div>
            </div>

            <div className="p-5 space-y-6">
               {selectedRestaurant.menu.map(item => {
                 const cartItem = state.cart.find(c => c.menuItem.id === item.id);
                 return (
                   <div key={item.id} className="flex gap-4">
                     <div className="flex-1">
                       <div className={`w-3 h-3 rounded-sm border ${item.isVeg ? 'border-green-600' : 'border-red-600'} flex items-center justify-center mb-1`}>
                         <div className={`w-1 h-1 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                       </div>
                       <h4 className="text-[14px] font-black text-slate-900">{item.name}</h4>
                       <p className="text-[11px] text-slate-400 mb-2 leading-tight">{item.description}</p>
                       <p className="text-[14px] font-black text-slate-900">₹{item.price}</p>
                     </div>
                     <div className="relative w-24 h-24 flex-shrink-0">
                        <img src={item.image} className="w-full h-full object-cover rounded-2xl shadow-sm" />
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20">
                           {cartItem ? (
                             <div className="bg-white border-2 border-orange-500 rounded-lg h-8 flex items-center justify-around shadow-md">
                                <button onClick={() => removeFromCart(item.id)} className="text-[#F36E35] px-1"><Minus className="w-3.5 h-3.5" /></button>
                                <span className="text-[11px] font-black">{cartItem.quantity}</span>
                                <button onClick={() => addToCart(item)} className="text-[#F36E35] px-1"><Plus className="w-3.5 h-3.5" /></button>
                             </div>
                           ) : (
                             <button onClick={() => addToCart(item)} className="w-full bg-white border border-slate-200 text-[#F36E35] font-black text-[10px] uppercase h-8 rounded-lg shadow-md active:scale-95 transition-all">Add</button>
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
          <div className="p-5 pt-8 animate-in slide-in-from-bottom duration-500">
            <h1 className="text-2xl font-black mb-6">{t.checkout}</h1>
            
            {state.cart.length > 0 ? (
              <div className="space-y-6">
                <div className="bg-[#F9F9F9] rounded-2xl p-4">
                  {state.cart.map(item => (
                    <div key={item.menuItem.id} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                       <div className="flex items-center gap-3">
                          <img src={item.menuItem.image} className="w-10 h-10 rounded-lg object-cover" />
                          <div>
                             <h4 className="text-[12px] font-black">{item.menuItem.name}</h4>
                             <p className="text-[10px] text-slate-400">₹{item.menuItem.price} x {item.quantity}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-2">
                          <button onClick={() => removeFromCart(item.menuItem.id)} className="w-6 h-6 flex items-center justify-center bg-white rounded border border-slate-100 text-slate-400"><Minus className="w-3 h-3" /></button>
                          <span className="text-[11px] font-black">{item.quantity}</span>
                          <button onClick={() => addToCart(item.menuItem)} className="w-6 h-6 flex items-center justify-center bg-white rounded border border-slate-100 text-slate-400"><Plus className="w-3 h-3" /></button>
                       </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-2">{t.selectAddress}</h3>
                  {state.savedAddresses?.map(addr => (
                    <button 
                      key={addr.id} 
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`w-full p-4 text-left rounded-2xl border-2 transition-all flex items-center justify-between ${selectedAddressId === addr.id ? 'border-[#F36E35] bg-orange-50' : 'border-slate-50 bg-[#F9F9F9]'}`}
                    >
                      <div className="flex items-center gap-3">
                        <MapPin className={`w-5 h-5 ${selectedAddressId === addr.id ? 'text-[#F36E35]' : 'text-slate-300'}`} />
                        <div>
                          <h4 className="font-black text-[13px]">{addr.type}</h4>
                          <p className="text-[10px] text-slate-400 truncate max-w-[200px]">{addr.address}</p>
                        </div>
                      </div>
                      {selectedAddressId === addr.id && <CheckCircle2 className="w-5 h-5 text-[#F36E35]" />}
                    </button>
                  ))}
                </div>

                <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[12px] font-bold opacity-70">Total Payable</span>
                    <span className="text-xl font-black">₹{cartTotal}</span>
                  </div>
                  <Button variant="primary" fullWidth size="lg" style={{ backgroundColor: '#F36E35' }} onClick={placeOrder} isLoading={isPlacingOrder} disabled={!selectedAddressId}>
                    Confirm & Place Order
                  </Button>
                </div>
              </div>
            ) : (
              <div className="py-20 text-center opacity-30 flex flex-col items-center">
                 <ShoppingBag className="w-12 h-12 mb-4" />
                 <p className="font-black text-sm">Cart is Empty</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* BOTTOM NAV */}
      <div className="fixed bottom-0 left-0 right-0 h-[72px] bg-white/95 backdrop-blur-xl border-t border-slate-100 flex items-center justify-around px-6 z-[200] shadow-[0_-5px_20px_rgba(0,0,0,0.03)] rounded-t-[32px]">
        <NavButton label="Home" icon={Home} active={view === 'home' || view === 'restaurant'} onClick={() => setView('home')} />
        <NavButton label="Search" icon={Search} active={false} onClick={() => {}} />
        <NavButton label="Cart" icon={ShoppingBag} active={view === 'cart'} onClick={() => setView('cart')} />
        <NavButton label="Me" icon={User} active={view === 'profile'} onClick={() => setView('profile')} />
      </div>

    </div>
  );
};

export default CustomerApp;
