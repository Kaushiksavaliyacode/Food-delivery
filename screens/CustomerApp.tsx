
import React, { useState, useEffect } from 'react';
import { AppState, Location, Order, Restaurant, CartItem, OrderStatus, MenuItem } from '../types.ts';
import { CATEGORIES, MOCK_RESTAURANTS, COLORS } from '../constants.tsx';
import Button from '../components/ui/Button.tsx';
import { Card, CardContent } from '../components/ui/Card.tsx';
import { 
  Search, MapPin, ShoppingBag, Star, 
  Bell, Home, ChevronRight, 
  Scan, Clock, User, QrCode, Heart, X, Plus, Minus,
  Globe, ShieldCheck, Settings, HelpCircle, CreditCard, LogOut, Trash2, ArrowLeft
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
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);

  const isGujarati = state.language === 'gu';

  const selectedRestaurant = MOCK_RESTAURANTS.find(r => r.id === selectedRestaurantId);

  // Translations
  const t = {
    deliverTo: isGujarati ? 'અહીં પહોંચાડો' : 'Deliver to',
    hungry: isGujarati ? 'ભૂખ લાગી છે?' : 'Hungry?',
    orderFav: isGujarati ? 'તમારી મનપસંદ રેસ્ટોરન્ટમાંથી ઓર્ડર કરો' : 'Order food from favorite restaurants',
    searchPlaceholder: isGujarati ? 'રેસ્ટોરન્ટ, વાનગી શોધો' : 'Search restaurants, cuisine',
    restaurantsNear: isGujarati ? 'તમારી નજીકની રેસ્ટોરન્ટ્સ' : 'Restaurants Near You',
    places: isGujarati ? 'જગ્યાઓ' : 'places',
    all: isGujarati ? 'બધું' : 'All',
    profile: isGujarati ? 'પ્રોફાઇલ' : 'Profile',
    savedAddresses: isGujarati ? 'સાચવેલા સરનામાં' : 'Saved Addresses',
    favorites: isGujarati ? 'મનપસંદ' : 'Favorites',
    helpSupport: isGujarati ? 'મદદ અને સપોર્ટ' : 'Help & Support',
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
      address: "Bandra West, Mumbai, Maharashtra 400050",
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
    }, 1500);
  };

  const NavButton = ({ label, icon: Icon, active, onClick }: any) => (
    <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-all ${active ? 'text-[#F36E35]' : 'text-[#8E8E93]'}`}>
      <Icon className="w-6 h-6" strokeWidth={active ? 2.5 : 2} />
      <span className={`text-[11px] font-bold`}>{label}</span>
    </button>
  );

  const displayRestaurants = activeCategory === 'All' 
    ? MOCK_RESTAURANTS 
    : MOCK_RESTAURANTS.filter(r => r.cuisine.some(c => c.includes(activeCategory)));

  const cartTotal = state.cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
  const cartCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);

  if (view === 'location') return (
    <div className="h-full bg-white flex flex-col">
      <div className="flex-1 bg-slate-50 relative flex items-center justify-center p-12 text-center">
         <div className="absolute inset-0 bg-gradient-to-b from-orange-50 to-white" />
         <div className="relative">
            <div className="w-32 h-32 bg-white rounded-[40px] shadow-2xl flex items-center justify-center mx-auto mb-12">
               <MapPin className="w-16 h-16 text-[#F36E35] animate-bounce" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">Ready to eat?</h1>
            <p className="text-slate-400 font-medium">Set your delivery address to explore the best food nearby.</p>
         </div>
      </div>
      <div className="bg-white p-12 rounded-t-[56px] -mt-16 relative z-10 shadow-[0_-20px_60px_rgba(0,0,0,0.05)]">
        <Button variant="primary" style={{ backgroundColor: '#F36E35' }} size="xl" fullWidth onClick={detectLocation} isLoading={isDetecting}>
          Find My Location
        </Button>
      </div>
    </div>
  );

  return (
    <div className="h-full bg-white flex flex-col relative overflow-hidden">
      
      {/* HEADER - Only show if not in restaurant or tracking view */}
      {view !== 'restaurant' && view !== 'tracking' && (
        <div className="px-6 pt-12 pb-4 bg-white sticky top-0 z-[100]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-[#F36E35] rounded-full flex items-center justify-center text-white shadow-lg shadow-orange-100">
                <MapPin className="w-6 h-6" fill="currentColor" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-[#8E8E93] leading-tight">{t.deliverTo}</span>
                <button className="flex items-center gap-1" onClick={() => setView('addresses')}>
                  <span className="text-[14px] font-black text-[#1C1C1E] truncate max-w-[140px]">{state.currentLocation?.address || "Mumbai"}</span>
                  <ChevronRight className="w-4 h-4 text-[#8E8E93] rotate-90" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={toggleLanguage}
                className="px-3 py-1.5 bg-orange-50 text-[#F36E35] rounded-full text-[10px] font-black border border-orange-100 flex items-center gap-1"
              >
                <Globe className="w-3 h-3" />
                {isGujarati ? 'ENGLISH' : 'ગુજરાતી'}
              </button>
              <button className="w-11 h-11 bg-[#F5F5F7] rounded-full flex items-center justify-center relative text-[#1C1C1E]">
                <Bell className="w-5 h-5" />
                <span className="absolute top-[10px] right-[10px] w-2.5 h-2.5 bg-[#F36E35] rounded-full border-2 border-white" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEWPORT */}
      <div className="flex-1 overflow-y-auto hide-scrollbar pb-32">
        
        {/* HOME VIEW */}
        {view === 'home' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="px-6 py-4">
              <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53] p-8 min-h-[175px] shadow-xl shadow-orange-100/40">
                <div className="relative z-10 max-w-[65%]">
                  <h2 className="text-[32px] font-black text-white mb-1 leading-tight tracking-tight">{t.hungry}</h2>
                  <p className="text-[13px] text-white/90 font-bold mb-5 leading-snug">{t.orderFav}</p>
                  <div className="inline-flex bg-white/30 backdrop-blur-md px-5 py-2 rounded-full border border-white/40 text-[10px] font-black text-white">
                    🎉 50% OFF on first order
                  </div>
                </div>
                <div className="absolute right-[-10px] bottom-[5px] w-40 h-40 animate-float">
                  <img src="https://img.freepik.com/premium-photo/isolated-burger-with-cheese-vegtables-white-background_1253400-34.jpg?w=300" className="w-full h-full object-contain mix-blend-multiply" alt="Burger" />
                </div>
              </div>
            </div>

            <div className="px-6 py-2 flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8E8E93]" />
                <input 
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-[#E5E5EA] h-[60px] pl-14 pr-6 rounded-[22px] text-[15px] font-bold outline-none focus:border-orange-500/20 transition-all placeholder:text-[#8E8E93] shadow-sm"
                />
              </div>
              <button className="w-[60px] h-[60px] bg-[#F0FDF4] rounded-[22px] flex items-center justify-center text-[#34C759] border border-[#DCFCE7] shadow-sm">
                <Scan className="w-6 h-6" />
              </button>
            </div>

            <div className="px-6 mb-8 mt-6">
               <div className="flex gap-4 overflow-x-auto hide-scrollbar py-2">
                <button 
                  onClick={() => setActiveCategory('All')} 
                  className={`flex flex-col items-center justify-center gap-2 rounded-[28px] min-w-[88px] h-[105px] transition-all shadow-sm ${activeCategory === 'All' ? 'bg-[#F36E35] text-white shadow-lg shadow-orange-500/30' : 'bg-white border border-[#F2F2F7] text-[#8E8E93]'}`}
                >
                  <div className="text-3xl h-10 flex items-center justify-center">🍽️</div>
                  <span className={`text-[12px] font-black ${activeCategory === 'All' ? 'text-white' : 'text-[#8E8E93]'}`}>{t.all}</span>
                </button>
                {CATEGORIES.map(cat => (
                  <button 
                    key={cat.id} 
                    onClick={() => setActiveCategory(cat.name)} 
                    className={`flex flex-col items-center justify-center gap-2 rounded-[28px] min-w-[88px] h-[105px] transition-all shadow-sm ${activeCategory === cat.name ? 'bg-[#F36E35] text-white shadow-lg shadow-orange-500/30' : 'bg-white border border-[#F2F2F7] text-[#8E8E93]'}`}
                  >
                    <div className="text-3xl h-10 flex items-center justify-center">{cat.icon}</div>
                    <span className={`text-[12px] font-black ${activeCategory === cat.name ? 'text-white' : 'text-[#1C1C1E]'}`}>{isGujarati ? cat.name : cat.name}</span>
                  </button>
                ))}
               </div>
            </div>

            <div className="px-6 flex items-center justify-between mb-5">
               <h3 className="text-[20px] font-black text-[#1C1C1E] tracking-tight">{t.restaurantsNear}</h3>
               <span className="text-[12px] font-bold text-[#8E8E93]">{displayRestaurants.length} {t.places}</span>
            </div>

            <div className="px-6 space-y-8 pb-10">
              {displayRestaurants.map(res => (
                <Card 
                  key={res.id} 
                  className="rounded-[40px] border-none shadow-xl overflow-hidden bg-white relative"
                  onClick={() => {
                    setSelectedRestaurantId(res.id);
                    setView('restaurant');
                  }}
                >
                  <div className="relative h-60">
                    <img src={res.image} className="w-full h-full object-cover" alt={res.name} />
                    <div className="absolute bottom-4 left-4 bg-[#F36E35] text-white text-[11px] font-black px-4 py-2 rounded-xl shadow-lg uppercase">
                      50% off up to ₹100
                    </div>
                    <button 
                      onClick={(e) => toggleFavorite(res.id, e)}
                      className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-md border border-white/50 transition-transform active:scale-90"
                    >
                      <Heart className={`w-5 h-5 ${state.favorites?.includes(res.id) ? 'text-red-500 fill-red-500' : 'text-slate-400'}`} />
                    </button>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-[19px] font-black text-[#1C1C1E] tracking-tight">{res.name}</h4>
                      <div className="flex items-center gap-1 bg-[#F2FBF6] px-2.5 py-1 rounded-lg">
                        <Star className="w-3.5 h-3.5 text-[#34C759] fill-[#34C759]" />
                        <span className="text-[12px] font-black text-[#34C759]">{res.rating}</span>
                      </div>
                    </div>
                    <p className="text-[13px] text-[#8E8E93] font-bold uppercase tracking-widest truncate mb-5">{res.cuisine.join(' • ')}</p>
                    <div className="flex items-center gap-6 pt-5 border-t border-[#F2F2F7] text-[#8E8E93]">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4.5 h-4.5 text-[#F36E35]" />
                        <span className="text-[12px] font-black text-[#1C1C1E]">{res.deliveryTime} mins</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4.5 h-4.5 text-[#F36E35]" />
                        <span className="text-[12px] font-black text-[#1C1C1E]">{res.distance} km</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* RESTAURANT DETAIL VIEW */}
        {view === 'restaurant' && selectedRestaurant && (
          <div className="animate-in slide-in-from-right duration-500 pb-40">
            <div className="relative h-72">
               <img src={selectedRestaurant.image} className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
               <button 
                  onClick={() => setView('home')}
                  className="absolute top-12 left-6 w-12 h-12 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white"
               >
                  <ArrowLeft className="w-6 h-6" />
               </button>
               <button 
                  onClick={(e) => toggleFavorite(selectedRestaurant.id, e)}
                  className="absolute top-12 right-6 w-12 h-12 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white"
               >
                  <Heart className={`w-6 h-6 ${state.favorites?.includes(selectedRestaurant.id) ? 'fill-red-500 text-red-500' : ''}`} />
               </button>
               
               <div className="absolute bottom-8 left-8 right-8 text-white">
                  <h2 className="text-[32px] font-black tracking-tight leading-tight">{selectedRestaurant.name}</h2>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-[14px] font-black">{selectedRestaurant.rating}</span>
                    </div>
                    <span className="text-[13px] font-bold opacity-80">{selectedRestaurant.deliveryTime} mins • {selectedRestaurant.distance} km</span>
                  </div>
               </div>
            </div>

            <div className="p-8">
               <div className="flex gap-4 overflow-x-auto hide-scrollbar mb-8">
                  {['All', 'Starters', 'Main Course', 'Desserts', 'Drinks'].map(cat => (
                    <button key={cat} className="px-6 py-2.5 rounded-full bg-slate-50 border border-slate-100 text-[12px] font-black text-slate-500 whitespace-nowrap active:bg-orange-50 active:text-[#F36E35] transition-colors">
                      {cat}
                    </button>
                  ))}
               </div>

               <div className="space-y-8">
                  {selectedRestaurant.menu.length > 0 ? selectedRestaurant.menu.map(item => {
                    const cartItem = state.cart.find(c => c.menuItem.id === item.id);
                    return (
                      <div key={item.id} className="flex gap-6 group">
                        <div className="flex-1">
                          <div className={`w-4 h-4 rounded-sm border ${item.isVeg ? 'border-green-600 bg-green-50' : 'border-red-600 bg-red-50'} flex items-center justify-center mb-2`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                          </div>
                          <h4 className="text-[17px] font-black text-slate-900 mb-1">{item.name}</h4>
                          <p className="text-[12px] font-bold text-slate-400 mb-2 leading-relaxed">{item.description}</p>
                          <p className="text-[16px] font-black text-slate-900">₹{item.price}</p>
                        </div>
                        <div className="relative w-32 h-32 flex-shrink-0">
                           <img src={item.image} className="w-full h-full object-cover rounded-[28px] shadow-md border border-slate-100" />
                           <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-24">
                              {cartItem ? (
                                <div className="bg-white border-2 border-orange-500 rounded-xl h-10 flex items-center justify-around shadow-lg">
                                   <button onClick={() => removeFromCart(item.id)} className="w-8 flex items-center justify-center text-[#F36E35]"><Minus className="w-4 h-4" /></button>
                                   <span className="text-[13px] font-black text-slate-900">{cartItem.quantity}</span>
                                   <button onClick={() => addToCart(item)} className="w-8 flex items-center justify-center text-[#F36E35]"><Plus className="w-4 h-4" /></button>
                                </div>
                              ) : (
                                <button 
                                  onClick={() => addToCart(item)}
                                  className="w-full bg-white border-2 border-slate-100 text-[#F36E35] font-black text-[12px] uppercase h-10 rounded-xl shadow-lg active:scale-95 transition-all"
                                >
                                  {t.add}
                                </button>
                              )}
                           </div>
                        </div>
                      </div>
                    );
                  }) : (
                    <div className="py-20 text-center flex flex-col items-center">
                       <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4"><ShoppingBag className="w-8 h-8 text-slate-300" /></div>
                       <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No items available yet</p>
                    </div>
                  )}
               </div>
            </div>
          </div>
        )}

        {/* PROFILE VIEW */}
        {view === 'profile' && (
          <div className="p-6 pt-6 animate-in slide-in-from-right duration-500">
             <h1 className="text-[28px] font-black text-[#1C1C1E] mb-8">{t.profile}</h1>
             
             <div className="bg-white rounded-[32px] border border-[#F2F2F7] shadow-sm divide-y divide-[#F2F2F7] overflow-hidden mb-8">
                {[
                  { label: t.savedAddresses, sub: `${state.savedAddresses?.length || 0} addresses saved`, icon: <MapPin className="w-5 h-5" />, view: 'addresses' },
                  { label: t.favorites, sub: `${state.favorites?.length || 0} restaurants`, icon: <Heart className="w-5 h-5" />, view: 'favorites' },
                  { label: isGujarati ? 'ચુકવણી પદ્ધતિઓ' : 'Payment Methods', sub: 'UPI, Cards', icon: <CreditCard className="w-5 h-5" /> },
                  { label: isGujarati ? 'સૂચનાઓ' : 'Notifications', sub: 'Enabled', icon: <Bell className="w-5 h-5" /> },
                  { label: t.helpSupport, sub: 'FAQs, Contact', icon: <HelpCircle className="w-5 h-5" />, view: 'help' },
                  { label: t.settings, sub: 'App preferences', icon: <Settings className="w-5 h-5" />, view: 'settings' }
                ].map((item, i) => (
                  <button key={i} onClick={() => item.view && setView(item.view as any)} className="w-full p-6 flex items-center justify-between group active:bg-slate-50 transition-colors">
                     <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-[#F2F2F7] rounded-2xl flex items-center justify-center text-slate-900 group-hover:scale-110 transition-transform">
                           {item.icon}
                        </div>
                        <div className="text-left">
                           <h4 className="text-[15px] font-black text-[#1C1C1E]">{item.label}</h4>
                           <p className="text-[12px] text-[#8E8E93] font-bold tracking-tight">{item.sub}</p>
                        </div>
                     </div>
                     <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
             </div>

             <button className="w-full flex items-center justify-center gap-3 py-5 rounded-[24px] border-2 border-[#FFE9E9] text-[#E23744] font-black uppercase tracking-widest text-[11px] active:bg-[#FFE9E9] transition-colors">
                <LogOut className="w-5 h-5" /> {t.logout}
             </button>
          </div>
        )}

        {/* SAVED ADDRESSES VIEW */}
        {view === 'addresses' && (
          <div className="p-6 pt-6 animate-in slide-in-from-left duration-500">
            <div className="flex items-center gap-4 mb-8">
              <button onClick={() => setView('profile')} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center"><ChevronRight className="rotate-180 w-5 h-5" /></button>
              <h1 className="text-[24px] font-black text-[#1C1C1E]">{t.savedAddresses}</h1>
            </div>

            <div className="space-y-4 mb-10">
              {state.savedAddresses?.map(addr => (
                <div key={addr.id} className="p-6 bg-white border border-[#F2F2F7] rounded-[28px] shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-orange-50 text-[#F36E35] rounded-full flex items-center justify-center"><MapPin className="w-5 h-5" /></div>
                    <div>
                      <h4 className="font-black text-[15px] text-[#1C1C1E]">{addr.type || 'Location'}</h4>
                      <p className="text-[12px] text-[#8E8E93] font-bold truncate max-w-[200px]">{addr.address}</p>
                    </div>
                  </div>
                  <button onClick={() => removeAddress(addr.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-5 h-5" /></button>
                </div>
              ))}
            </div>

            <Button variant="primary" fullWidth onClick={addAddress} style={{ backgroundColor: '#F36E35' }} leftIcon={<Plus className="w-5 h-5" />}>
              Add New Address
            </Button>
          </div>
        )}

        {/* CART / CHECKOUT VIEW */}
        {view === 'cart' && (
          <div className="p-6 pt-6 animate-in slide-in-from-bottom duration-500 pb-40">
            <h1 className="text-[28px] font-black text-[#1C1C1E] mb-8">{t.checkout}</h1>
            
            {state.cart.length > 0 ? (
              <div className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-[14px] font-black text-[#8E8E93] uppercase tracking-widest">{isGujarati ? 'આઇટમ્સ' : 'Items'}</h3>
                  <div className="bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-sm">
                    {state.cart.map(item => (
                      <div key={item.menuItem.id} className="p-6 flex items-center justify-between border-b border-slate-50 last:border-0">
                         <div className="flex items-center gap-4">
                            <img src={item.menuItem.image} className="w-14 h-14 rounded-2xl object-cover" />
                            <div>
                               <h4 className="text-[15px] font-black text-slate-900">{item.menuItem.name}</h4>
                               <p className="text-[12px] font-bold text-slate-400">₹{item.menuItem.price} x {item.quantity}</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-1">
                            <button onClick={() => removeFromCart(item.menuItem.id)} className="w-8 h-8 flex items-center justify-center text-slate-400"><Minus className="w-4 h-4" /></button>
                            <span className="text-[13px] font-black">{item.quantity}</span>
                            <button onClick={() => addToCart(item.menuItem)} className="w-8 h-8 flex items-center justify-center text-slate-400"><Plus className="w-4 h-4" /></button>
                         </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[14px] font-black text-[#8E8E93] uppercase tracking-widest">{t.selectAddress}</h3>
                  <div className="space-y-4">
                    {state.savedAddresses?.map(addr => (
                      <button 
                        key={addr.id} 
                        onClick={() => {
                          setSelectedAddressId(addr.id);
                          setState(prev => ({ ...prev, currentLocation: addr }));
                        }}
                        className={`w-full p-6 text-left rounded-[28px] border-2 transition-all flex items-center justify-between ${selectedAddressId === addr.id ? 'border-[#F36E35] bg-orange-50/30' : 'border-[#F2F2F7] bg-white'}`}
                      >
                        <div className="flex items-center gap-4">
                          <MapPin className={`w-6 h-6 ${selectedAddressId === addr.id ? 'text-[#F36E35]' : 'text-slate-300'}`} />
                          <div>
                            <h4 className="font-black text-[15px]">{addr.type || 'Other'}</h4>
                            <p className="text-[12px] font-bold text-[#8E8E93]">{addr.address}</p>
                          </div>
                        </div>
                        {selectedAddressId === addr.id && <div className="w-6 h-6 bg-[#F36E35] rounded-full flex items-center justify-center"><div className="w-2 h-2 bg-white rounded-full" /></div>}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900 rounded-[36px] p-8 text-white">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[14px] font-bold opacity-60">{isGujarati ? 'કુલ બિલ' : 'Total Bill'}</span>
                    <span className="text-[24px] font-black">₹{cartTotal.toFixed(2)}</span>
                  </div>
                  <Button 
                    variant="primary" 
                    fullWidth 
                    size="lg" 
                    style={{ backgroundColor: '#F36E35' }}
                    disabled={!selectedAddressId}
                  >
                    {t.placeOrder}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="py-20 text-center flex flex-col items-center">
                 <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-200">
                    <ShoppingBag className="w-12 h-12" />
                 </div>
                 <h2 className="text-xl font-black text-slate-900 mb-2">Your cart is empty</h2>
                 <p className="text-sm font-bold text-slate-400 mb-8 max-w-[240px]">Explore top restaurants and add some tasty food to your cart!</p>
                 <Button variant="outline" onClick={() => setView('home')}>Start Browsing</Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* STICKY CART BUTTON */}
      {view !== 'cart' && state.cart.length > 0 && (
         <div className="fixed bottom-[110px] left-6 right-6 z-[250] animate-in slide-in-from-bottom-8 duration-500">
            <button 
              onClick={() => setView('cart')}
              className="w-full bg-slate-900 h-16 rounded-2xl flex items-center justify-between px-6 shadow-2xl active:scale-95 transition-all"
            >
               <div className="flex items-center gap-3">
                  <div className="bg-[#F36E35] w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-xs">{cartCount}</div>
                  <span className="text-white text-[13px] font-black uppercase tracking-widest">{t.viewCart}</span>
               </div>
               <div className="flex items-center gap-2">
                  <span className="text-white font-black text-lg">₹{cartTotal}</span>
                  <ChevronRight className="w-5 h-5 text-white/40" />
               </div>
            </button>
         </div>
      )}

      {/* BOTTOM NAVIGATION */}
      <div className="fixed bottom-0 left-0 right-0 h-[92px] bg-white/95 backdrop-blur-xl border-t border-[#F2F2F7] flex items-center justify-around px-8 z-[200] shadow-[0_-10px_40px_rgba(0,0,0,0.03)] rounded-t-[44px]">
        <NavButton label={isGujarati ? 'હોમ' : 'Home'} icon={Home} active={view === 'home' || view === 'restaurant'} onClick={() => setView('home')} />
        <NavButton label={isGujarati ? 'શોધો' : 'Search'} icon={Search} active={false} onClick={() => {}} />
        <NavButton label={isGujarati ? 'ઓર્ડર' : 'Orders'} icon={ShoppingBag} active={view === 'cart'} onClick={() => setView('cart')} />
        <NavButton label={isGujarati ? 'પ્રોફાઇલ' : 'Profile'} icon={User} active={view === 'profile' || view === 'addresses'} onClick={() => setView('profile')} />
      </div>

    </div>
  );
};

export default CustomerApp;
