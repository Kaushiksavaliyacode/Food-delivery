
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
    orderFav: isGujarati ? 'ઓર્ડર કરો' : 'Order now',
    searchPlaceholder: isGujarati ? 'શોધો...' : 'Search...',
    restaurantsNear: isGujarati ? 'નજીકના સ્થળો' : 'Nearby',
    places: isGujarati ? 'જગ્યાઓ' : 'places',
    all: isGujarati ? 'બધું' : 'All',
    profile: isGujarati ? 'પ્રોફાઇલ' : 'Me',
    savedAddresses: isGujarati ? 'સરનામાં' : 'Addresses',
    favorites: isGujarati ? 'મનપસંદ' : 'Favorites',
    helpSupport: isGujarati ? 'મદદ' : 'Help',
    settings: isGujarati ? 'સેટિંગ્સ' : 'Settings',
    logout: isGujarati ? 'લૉગ આઉટ' : 'Logout',
    checkout: isGujarati ? 'ચેકઆઉટ' : 'Checkout',
    selectAddress: isGujarati ? 'સરનામું' : 'Address',
    placeOrder: isGujarati ? 'ઓર્ડર આપો' : 'Confirm Order',
    viewCart: isGujarati ? 'કાર્ટ' : 'Cart',
    add: isGujarati ? 'ઉમેરો' : 'Add'
  };

  useEffect(() => {
    if (state.currentLocation) setView('home');
  }, []);

  const placeOrder = async () => {
    if (!state.currentLocation || state.cart.length === 0 || isPlacingOrder) return;
    
    // Find restaurant ID from items if not set
    let rId = selectedRestaurantId;
    if (!rId && state.cart.length > 0) {
      const firstItem = state.cart[0].menuItem;
      const res = MOCK_RESTAURANTS.find(r => r.menu.some(m => m.id === firstItem.id));
      rId = res?.id || '550e8400-e29b-41d4-a716-446655440000'; // fallback
    }

    setIsPlacingOrder(true);

    const orderId = `ORD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const payload = {
      id: orderId,
      customer_id: state.phoneNumber || 'anonymous-user',
      restaurant_id: rId,
      items: state.cart,
      total_amount: cartTotal,
      status: OrderStatus.PENDING,
      timestamp: Date.now(),
      delivery_location: state.currentLocation,
    };

    const { error } = await supabase.from('orders').insert([payload]);

    if (!error) {
      setState(prev => ({
        ...prev,
        cart: [],
        activeOrder: {
          id: payload.id,
          customerId: payload.customer_id,
          restaurantId: payload.restaurant_id,
          items: payload.items,
          totalAmount: payload.total_amount,
          status: payload.status as OrderStatus,
          timestamp: payload.timestamp,
          deliveryLocation: payload.delivery_location
        }
      }));
      setView('home');
      alert('Order placed!');
    } else {
      console.error('Order error:', error);
      alert('Error: ' + (error.message || 'Unknown error'));
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
        id: 'loc-main',
        lat: 19.0760, 
        lng: 72.8777, 
        address: "Mumbai, India",
        type: 'Home' 
      };
      setState(p => ({ ...p, currentLocation: loc, savedAddresses: [loc] }));
      setView('home');
      setIsDetecting(false);
    }, 1000);
  };

  const NavButton = ({ label, icon: Icon, active, onClick }: any) => (
    <button onClick={onClick} className={`flex flex-col items-center gap-0.5 transition-all ${active ? 'text-[#F36E35]' : 'text-[#8E8E93]'}`}>
      <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
      <span className={`text-[9px] font-bold`}>{label}</span>
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
            <div className="w-20 h-20 bg-white rounded-[28px] shadow-lg flex items-center justify-center mx-auto mb-6">
               <MapPin className="w-10 h-10 text-[#F36E35] animate-bounce" />
            </div>
            <h1 className="text-xl font-black text-slate-900 mb-1 tracking-tight">FoodGo</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Premium Delivery</p>
         </div>
      </div>
      <div className="bg-white p-8 rounded-t-[40px] -mt-10 relative z-10 shadow-xl">
        <Button variant="primary" style={{ backgroundColor: '#F36E35' }} size="lg" fullWidth onClick={detectLocation} isLoading={isDetecting}>
          Set Location
        </Button>
      </div>
    </div>
  );

  return (
    <div className="h-full bg-white flex flex-col relative overflow-hidden">
      
      {/* HEADER */}
      {view !== 'restaurant' && (
        <div className="px-4 pt-8 pb-2 bg-white sticky top-0 z-[100]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#F36E35] rounded-full flex items-center justify-center text-white shadow-sm">
                <MapPin className="w-4 h-4" fill="currentColor" />
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] font-bold text-[#8E8E93] leading-tight uppercase tracking-widest">{t.deliverTo}</span>
                <button className="flex items-center gap-0.5" onClick={() => setView('addresses')}>
                  <span className="text-[11px] font-black text-[#1C1C1E] truncate max-w-[100px]">{state.currentLocation?.address || "Mumbai"}</span>
                  <ChevronRight className="w-2.5 h-2.5 text-[#8E8E93] rotate-90" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={toggleLanguage} className="px-2 py-0.5 bg-orange-50 text-[#F36E35] rounded-md text-[8px] font-black border border-orange-100">{isGujarati ? 'EN' : 'GU'}</button>
              <button className="w-8 h-8 bg-[#F5F5F7] rounded-full flex items-center justify-center relative text-[#1C1C1E]">
                <Bell className="w-3.5 h-3.5" />
                <span className="absolute top-[6px] right-[6px] w-1.5 h-1.5 bg-[#F36E35] rounded-full border border-white" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEWPORT */}
      <div className="flex-1 overflow-y-auto hide-scrollbar pb-20">
        
        {view === 'home' && (
          <div className="animate-in fade-in duration-500">
            <div className="px-4 py-2">
              <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53] p-5 min-h-[120px] shadow-md">
                <div className="relative z-10 max-w-[60%]">
                  <h2 className="text-xl font-black text-white mb-0 leading-tight">{t.hungry}</h2>
                  <p className="text-[9px] text-white/90 font-bold mb-3 uppercase tracking-wider">{t.orderFav}</p>
                  <div className="inline-flex bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/30 text-[8px] font-black text-white">50% OFF TODAY</div>
                </div>
                <div className="absolute right-[-10px] bottom-[-10px] w-28 h-28 animate-float opacity-90">
                  <img src="https://img.freepik.com/premium-photo/isolated-burger-with-cheese-vegtables-white-background_1253400-34.jpg?w=300" className="w-full h-full object-contain mix-blend-multiply" />
                </div>
              </div>
            </div>

            <div className="px-4 py-1 flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8E8E93]" />
                <input 
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-[#F5F5F7] h-[40px] pl-9 pr-3 rounded-lg text-[12px] font-bold outline-none"
                />
              </div>
              <button className="w-[40px] h-[40px] bg-[#F0FDF4] rounded-lg flex items-center justify-center text-[#34C759] border border-[#DCFCE7]">
                <Scan className="w-4 h-4" />
              </button>
            </div>

            <div className="px-4 py-3">
               <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                <button onClick={() => setActiveCategory('All')} className={`flex flex-col items-center justify-center gap-0.5 rounded-[16px] min-w-[60px] h-[75px] transition-all ${activeCategory === 'All' ? 'bg-[#F36E35] text-white shadow-sm' : 'bg-[#F9F9F9] text-[#8E8E93]'}`}>
                  <div className="text-xl">🍽️</div>
                  <span className="text-[9px] font-black uppercase tracking-tighter">{t.all}</span>
                </button>
                {CATEGORIES.map(cat => (
                  <button key={cat.id} onClick={() => setActiveCategory(cat.name)} className={`flex flex-col items-center justify-center gap-0.5 rounded-[16px] min-w-[60px] h-[75px] transition-all ${activeCategory === cat.name ? 'bg-[#F36E35] text-white shadow-sm' : 'bg-[#F9F9F9] text-[#8E8E93]'}`}>
                    <div className="text-xl">{cat.icon}</div>
                    <span className="text-[9px] font-black uppercase tracking-tighter">{cat.name}</span>
                  </button>
                ))}
               </div>
            </div>

            <div className="px-4 flex items-center justify-between mb-2">
               <h3 className="text-[14px] font-black text-[#1C1C1E]">{t.restaurantsNear}</h3>
               <span className="text-[10px] font-bold text-[#8E8E93]">{displayRestaurants.length} {t.places}</span>
            </div>

            <div className="px-4 space-y-4">
              {displayRestaurants.map(res => (
                <Card 
                  key={res.id} 
                  className="rounded-[20px] overflow-hidden bg-white shadow-sm border-slate-100"
                  onClick={() => { setSelectedRestaurantId(res.id); setView('restaurant'); }}
                >
                  <div className="relative h-36">
                    <img src={res.image} className="w-full h-full object-cover" />
                    <div className="absolute bottom-2 left-2 bg-[#F36E35] text-white text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase">Hot Deal</div>
                  </div>
                  <CardContent className="p-3">
                    <div className="flex justify-between items-center mb-0.5">
                      <h4 className="text-[13px] font-black text-[#1C1C1E]">{res.name}</h4>
                      <div className="flex items-center gap-0.5 bg-[#F2FBF6] px-1 py-0.5 rounded-md">
                        <Star className="w-2.5 h-2.5 text-[#34C759] fill-[#34C759]" />
                        <span className="text-[10px] font-black text-[#34C759]">{res.rating}</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-[#8E8E93] font-bold truncate mb-2">{res.cuisine.join(' • ')}</p>
                    <div className="flex gap-3 text-[#1C1C1E] text-[10px] font-black uppercase tracking-tighter">
                      <span className="flex items-center gap-1 opacity-70"><Clock className="w-3 h-3 text-orange-500" /> {res.deliveryTime}m</span>
                      <span className="flex items-center gap-1 opacity-70"><MapPin className="w-3 h-3 text-orange-500" /> {res.distance}km</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {view === 'restaurant' && selectedRestaurant && (
          <div className="animate-in slide-in-from-right duration-500 pb-16">
            <div className="relative h-48">
               <img src={selectedRestaurant.image} className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-black/40" />
               <button onClick={() => setView('home')} className="absolute top-8 left-4 w-9 h-9 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white"><ArrowLeft className="w-4 h-4" /></button>
               <div className="absolute bottom-4 left-5 right-5 text-white">
                  <h2 className="text-xl font-black">{selectedRestaurant.name}</h2>
                  <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">{selectedRestaurant.cuisine.join(' • ')}</p>
               </div>
            </div>

            <div className="p-4 space-y-5">
               {selectedRestaurant.menu.map(item => {
                 const cartItem = state.cart.find(c => c.menuItem.id === item.id);
                 return (
                   <div key={item.id} className="flex gap-3">
                     <div className="flex-1">
                       <div className={`w-3 h-3 rounded-sm border ${item.isVeg ? 'border-green-600' : 'border-red-600'} flex items-center justify-center mb-1`}>
                         <div className={`w-1 h-1 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                       </div>
                       <h4 className="text-[12px] font-black text-slate-900">{item.name}</h4>
                       <p className="text-[10px] text-slate-400 mb-1.5 leading-tight">{item.description}</p>
                       <p className="text-[12px] font-black text-slate-900">₹{item.price}</p>
                     </div>
                     <div className="relative w-20 h-20 flex-shrink-0">
                        <img src={item.image} className="w-full h-full object-cover rounded-xl shadow-sm border border-slate-50" />
                        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-16">
                           {cartItem ? (
                             <div className="bg-white border border-orange-500 rounded-md h-7 flex items-center justify-around shadow-sm">
                                <button onClick={() => removeFromCart(item.id)} className="text-[#F36E35] px-1"><Minus className="w-3 h-3" /></button>
                                <span className="text-[10px] font-black">{cartItem.quantity}</span>
                                <button onClick={() => addToCart(item)} className="text-[#F36E35] px-1"><Plus className="w-3 h-3" /></button>
                             </div>
                           ) : (
                             <button onClick={() => addToCart(item)} className="w-full bg-white border border-slate-200 text-[#F36E35] font-black text-[9px] uppercase h-7 rounded-md shadow-sm active:scale-95">Add</button>
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
          <div className="p-4 pt-6 animate-in slide-in-from-bottom duration-400">
            <h1 className="text-xl font-black mb-5">{t.checkout}</h1>
            
            {state.cart.length > 0 ? (
              <div className="space-y-5">
                <div className="bg-[#F9F9F9] rounded-xl p-3 border border-slate-50">
                  {state.cart.map(item => (
                    <div key={item.menuItem.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                       <div className="flex items-center gap-2">
                          <img src={item.menuItem.image} className="w-8 h-8 rounded-md object-cover" />
                          <div>
                             <h4 className="text-[11px] font-black">{item.menuItem.name}</h4>
                             <p className="text-[9px] text-slate-400">₹{item.menuItem.price} x {item.quantity}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-1.5">
                          <button onClick={() => removeFromCart(item.menuItem.id)} className="w-5 h-5 flex items-center justify-center bg-white rounded border border-slate-100 text-slate-400"><Minus className="w-2.5 h-2.5" /></button>
                          <span className="text-[10px] font-black">{item.quantity}</span>
                          <button onClick={() => addToCart(item.menuItem)} className="w-5 h-5 flex items-center justify-center bg-white rounded border border-slate-100 text-slate-400"><Plus className="w-2.5 h-2.5" /></button>
                       </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{t.selectAddress}</h3>
                  {state.savedAddresses?.map(addr => (
                    <button 
                      key={addr.id} 
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`w-full p-3 text-left rounded-xl border transition-all flex items-center justify-between ${selectedAddressId === addr.id ? 'border-[#F36E35] bg-orange-50' : 'border-slate-100 bg-[#F9F9F9]'}`}
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className={`w-4 h-4 ${selectedAddressId === addr.id ? 'text-[#F36E35]' : 'text-slate-300'}`} />
                        <div>
                          <h4 className="font-black text-[11px]">{addr.type}</h4>
                          <p className="text-[9px] text-slate-400 truncate max-w-[180px]">{addr.address}</p>
                        </div>
                      </div>
                      {selectedAddressId === addr.id && <CheckCircle2 className="w-4 h-4 text-[#F36E35]" />}
                    </button>
                  ))}
                </div>

                <div className="bg-slate-900 rounded-2xl p-5 text-white shadow-lg">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-bold opacity-70 uppercase tracking-wider">Total Amount</span>
                    <span className="text-lg font-black">₹{cartTotal}</span>
                  </div>
                  <Button variant="primary" fullWidth size="md" style={{ backgroundColor: '#F36E35' }} onClick={placeOrder} isLoading={isPlacingOrder} disabled={!selectedAddressId}>
                    {t.placeOrder}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="py-20 text-center opacity-30 flex flex-col items-center">
                 <ShoppingBag className="w-10 h-10 mb-2" />
                 <p className="font-black text-xs uppercase tracking-widest">Bag is Empty</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* BOTTOM NAV */}
      <div className="fixed bottom-0 left-0 right-0 h-[64px] bg-white/95 backdrop-blur-xl border-t border-slate-100 flex items-center justify-around px-4 z-[200] shadow-[0_-5px_20px_rgba(0,0,0,0.02)] rounded-t-[28px]">
        <NavButton label="Home" icon={Home} active={view === 'home' || view === 'restaurant'} onClick={() => setView('home')} />
        <NavButton label="Search" icon={Search} active={false} onClick={() => {}} />
        <NavButton label="Cart" icon={ShoppingBag} active={view === 'cart'} onClick={() => setView('cart')} />
        <NavButton label="Me" icon={User} active={view === 'profile'} onClick={() => setView('profile')} />
      </div>

    </div>
  );
};

export default CustomerApp;
