
import React, { useState, useEffect, useMemo } from 'react';
import { AppState, Restaurant, MenuItem, OrderStatus, Order, Location } from '../types';
import { CATEGORIES, MOCK_RESTAURANTS, COLORS } from '../constants';
// Added ChevronRight to the lucide-react imports to fix the missing component error
import { Search, MapPin, ShoppingBag, Clock, Star, ArrowLeft, Plus, Minus, X, CheckCircle, Navigation, Phone, MessageSquare, ChevronDown, Heart, Tag, User, Filter, SlidersHorizontal, Bell, Flame, ChevronUp, Image as ImageIcon, ChevronRight } from 'lucide-react';

interface Props {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const CustomerApp: React.FC<Props> = ({ state, setState }) => {
  const [view, setView] = useState<'onboarding' | 'login' | 'home' | 'restaurantDetail' | 'itemDetail' | 'cart' | 'success'>('home');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [selectedItem, setSelectedItem] = useState<(MenuItem & { calories?: number }) | null>(null);
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isSeeMore, setIsSeeMore] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isPureVeg, setIsPureVeg] = useState(false);

  useEffect(() => {
    if (view === 'home' && !state.currentLocation) {
      setIsLoading(true);
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          currentLocation: { lat: 21.9567, lng: 70.7932, address: "Gondal, Gujarat", type: 'Home' }
        }));
        setIsLoading(false);
      }, 800);
    }
  }, [view]);

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

  const filteredRestaurants = useMemo(() => {
    return MOCK_RESTAURANTS.filter(res => {
      const matchesSearch = res.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           res.cuisine.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesVeg = isPureVeg ? res.cuisine.includes('Pure Veg') : true;
      const matchesCategory = activeCategory ? res.menu.some(m => m.category === activeCategory) : true;
      return matchesSearch && matchesVeg && matchesCategory;
    });
  }, [searchQuery, isPureVeg, activeCategory]);

  const displayCategories = isSeeMore ? CATEGORIES : CATEGORIES.slice(0, 8);

  if (view === 'onboarding') {
    return (
      <div className="flex flex-col h-full bg-[#E23744] animate-in fade-in duration-500 relative">
        <div className="flex-1 flex flex-col items-center justify-center p-8">
           <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Zomato_Logo.svg/1280px-Zomato_Logo.svg.png" alt="Zomato" className="w-40 invert brightness-0 mb-12" />
           <div className="bg-white rounded-[40px] p-8 text-center shadow-2xl w-full max-w-sm">
             <h1 className="text-2xl font-black text-slate-900 mb-4">India's #1 Food App is now in Gondal</h1>
             <p className="text-slate-400 text-sm mb-8">Kaushik Food Delivery: Faster than your hunger.</p>
             <button onClick={() => setView('login')} className="w-full bg-[#E23744] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest active:scale-95 transition-all">Get Started</button>
           </div>
        </div>
      </div>
    );
  }

  if (view === 'login') {
    return (
      <div className="flex flex-col h-full bg-white p-8 justify-center animate-in fade-in duration-500">
        <div className="mb-12 flex flex-col items-center text-center">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Zomato_Logo.svg/1280px-Zomato_Logo.svg.png" alt="Zomato" className="w-32 mb-6" />
          <h1 className="text-xl font-black text-slate-900 mb-2">Login to Kaushik Food</h1>
        </div>
        <div className="space-y-4 mb-8">
          <div className="relative">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold">+91</span>
            <input 
              type="tel" 
              placeholder="Phone Number"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-16 pr-6 outline-none focus:border-[#E23744] transition-all font-bold text-sm"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>
        <button onClick={() => setView('home')} className="w-full bg-[#E23744] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-red-100">Send OTP</button>
      </div>
    );
  }

  if (view === 'restaurantDetail' && selectedRestaurant) {
    return (
      <div className="flex flex-col h-full bg-white animate-in slide-in-from-right duration-500 overflow-hidden">
        <div className="relative h-64 shrink-0">
          <img src={selectedRestaurant.image} alt={selectedRestaurant.name} className="w-full h-full object-cover" />
          <button onClick={() => setView('home')} className="absolute top-8 left-6 p-2.5 bg-white/90 backdrop-blur rounded-xl shadow-lg"><ArrowLeft className="w-5 h-5 text-slate-900" /></button>
          <div className="absolute bottom-6 left-6 right-6">
             <div className="bg-white p-5 rounded-[24px] shadow-2xl border border-slate-100">
                <div className="flex justify-between items-start mb-2">
                   <h1 className="text-xl font-black text-slate-900">{selectedRestaurant.name}</h1>
                   <div className="bg-green-600 text-white px-1.5 py-0.5 rounded-lg flex items-center gap-1 text-[10px] font-bold">
                      {selectedRestaurant.rating} <Star className="w-3 h-3 fill-white" />
                   </div>
                </div>
                <p className="text-xs text-slate-500 font-medium">{selectedRestaurant.cuisine.join(', ')} • {selectedRestaurant.deliveryTime} mins</p>
             </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 hide-scrollbar space-y-8">
           <div>
              <div className="flex justify-between items-center mb-4">
                 <h3 className="font-bold text-slate-900">Gallery</h3>
              </div>
              <div className="flex gap-3 overflow-x-auto hide-scrollbar">
                 {selectedRestaurant.photos.map((photo, i) => (
                   <img key={i} src={photo} alt="Gallery" className="w-24 h-24 rounded-2xl object-cover shrink-0 shadow-sm" />
                 ))}
              </div>
           </div>

           <div>
              <h3 className="font-bold text-slate-900 mb-6 text-lg">Menu</h3>
              <div className="space-y-8">
                 {selectedRestaurant.menu.map(item => (
                   <div key={item.id} onClick={() => { setSelectedItem(item); setView('itemDetail'); }} className="flex justify-between gap-6 group cursor-pointer">
                      <div className="flex-1">
                         <div className="flex items-center gap-2 mb-1">
                            <div className={`w-3 h-3 border-2 ${item.isVeg ? 'border-green-600' : 'border-red-600'} rounded-sm flex items-center justify-center p-0.5`}>
                               <div className={`w-1 h-1 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`}></div>
                            </div>
                            <h4 className="font-bold text-slate-900">{item.name}</h4>
                         </div>
                         <p className="text-xs text-slate-400 font-medium line-clamp-2 mb-2">{item.description}</p>
                         <p className="font-black text-slate-900">${item.price}</p>
                      </div>
                      <div className="relative shrink-0">
                         <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-md">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                         </div>
                         <button 
                          onClick={(e) => { e.stopPropagation(); addToCart(item, 1); }}
                          className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white text-red-600 px-4 py-1 rounded-xl text-[10px] font-black uppercase shadow-lg border border-red-50"
                         >
                            Add
                         </button>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    );
  }

  if (view === 'itemDetail' && selectedItem) {
    return (
      <div className="flex flex-col h-full bg-white animate-in slide-in-from-right duration-500 overflow-hidden">
        <div className="relative pt-12 flex flex-col items-center">
           <button onClick={() => setView('restaurantDetail')} className="absolute top-8 left-8 p-3 bg-slate-50 rounded-2xl text-slate-900"><ArrowLeft className="w-5 h-5" /></button>
           <div className="w-72 h-72 rounded-full overflow-hidden shadow-2xl ring-8 ring-slate-50 mb-8 relative">
              <img src={selectedItem.image} alt={selectedItem.name} className="w-full h-full object-cover" />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#E23744] px-4 py-1.5 rounded-full flex items-center gap-4 text-white shadow-xl border-4 border-white">
                 <button onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus className="w-4 h-4" /></button>
                 <span className="font-black text-lg">{quantity}</span>
                 <button onClick={() => setQuantity(quantity + 1)}><Plus className="w-4 h-4" /></button>
              </div>
           </div>
        </div>
        <div className="flex-1 px-8 py-6">
           <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-black text-slate-900 mb-1">{selectedItem.name}</h1>
                <p className="text-sm text-slate-400 font-medium">{selectedItem.description}</p>
              </div>
              <span className="text-2xl font-black text-[#E23744]">${selectedItem.price}</span>
           </div>
           <button 
             onClick={() => { addToCart(selectedItem, quantity); setView('restaurantDetail'); }}
             className="w-full bg-[#E23744] text-white py-5 rounded-[24px] font-black text-sm uppercase tracking-widest shadow-xl shadow-red-100 mt-8"
           >
             Add to Cart
           </button>
        </div>
      </div>
    );
  }

  if (view === 'cart') {
    return (
      <div className="flex flex-col h-full bg-white animate-in slide-in-from-bottom duration-500">
        <div className="p-8 bg-white border-b flex items-center justify-between">
          <button onClick={() => setView('home')} className="p-3 bg-slate-50 rounded-2xl"><ArrowLeft className="w-5 h-5" /></button>
          <h1 className="text-lg font-black text-slate-900">My Cart</h1>
        </div>
        <div className="flex-1 p-8 overflow-y-auto space-y-8">
          {state.cart.length > 0 ? state.cart.map(item => (
            <div key={item.menuItem.id} className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md">
                <img src={item.menuItem.image} alt={item.menuItem.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm text-slate-900">{item.menuItem.name}</h4>
                <p className="text-md font-black text-[#E23744]">${item.menuItem.price}</p>
              </div>
              <div className="bg-slate-50 rounded-full flex items-center gap-3 p-1">
                <button onClick={() => removeFromCart(item.menuItem.id)} className="w-8 h-8 rounded-full bg-white flex items-center justify-center"><Minus className="w-3 h-3 text-slate-400" /></button>
                <span className="font-black text-sm">{item.quantity}</span>
                <button onClick={() => addToCart(item.menuItem, 1)} className="w-8 h-8 rounded-full bg-[#E23744] flex items-center justify-center text-white"><Plus className="w-3 h-3" /></button>
              </div>
            </div>
          )) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <ShoppingBag className="w-16 h-16 text-slate-100 mb-4" />
              <p className="text-slate-400 font-bold uppercase text-[10px]">Your cart is empty</p>
            </div>
          )}
        </div>
        {state.cart.length > 0 && (
          <div className="p-8 bg-white border-t border-slate-100">
             <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-black text-[#E23744]">${cartTotal.toFixed(2)}</span>
             </div>
             <button onClick={() => setView('success')} className="w-full bg-[#E23744] text-white py-5 rounded-[24px] font-black shadow-xl shadow-red-100 uppercase">Place Order</button>
          </div>
        )}
      </div>
    );
  }

  if (view === 'success') {
    return (
      <div className="flex flex-col h-full bg-white animate-in zoom-in duration-300">
        <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
           <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-8">
              <CheckCircle className="w-12 h-12 text-green-500" />
           </div>
           <h2 className="text-3xl font-black text-slate-900 mb-4">Order Placed!</h2>
           <p className="text-slate-500 font-medium mb-12">Rider is at the restaurant picking up your meal.</p>
           
           <div className="w-full bg-slate-50 rounded-[32px] p-6 text-left space-y-4 mb-12 border border-slate-100">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600"><Clock className="w-6 h-6" /></div>
                 <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">ETA</p>
                    <p className="text-lg font-black">15 - 20 Mins</p>
                 </div>
              </div>
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600"><MapPin className="w-6 h-6" /></div>
                 <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Delivery to</p>
                    <p className="text-sm font-black">Home • Gondal, Gujarat</p>
                 </div>
              </div>
           </div>

           <button onClick={() => { setView('home'); setState(prev => ({ ...prev, cart: [] })); }} className="w-full bg-[#E23744] text-white py-5 rounded-[24px] font-black uppercase shadow-xl shadow-red-100">Back to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white animate-in fade-in duration-500">
      <div className="px-6 pt-8 pb-4 sticky top-0 bg-white z-20">
        <div className="flex items-center justify-between mb-4">
           <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#E23744]" />
              <h2 className="font-black text-slate-900 text-lg">Gondal</h2>
              <ChevronDown className="w-4 h-4 text-slate-400" />
           </div>
           <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-100 shadow-sm">
              <img src="https://picsum.photos/seed/user1/100/100" alt="Profile" />
           </div>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search for restaurants, items..."
            className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-14 pr-12 outline-none focus:border-[#E23744] transition-all font-medium text-sm shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
           <button onClick={() => setIsPureVeg(!isPureVeg)} className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all ${isPureVeg ? 'bg-green-600 text-white border-green-600' : 'bg-white text-slate-600 border-slate-200'}`}>Pure Veg</button>
           <button className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 flex items-center gap-2">Rating 4.0+ <ChevronDown className="w-3 h-3" /></button>
           <button className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">Fastest</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-32 hide-scrollbar">
        <div className="grid grid-cols-4 gap-y-6 gap-x-4 mt-4 mb-8">
           {displayCategories.map(cat => (
             <button key={cat.id} onClick={() => setActiveCategory(activeCategory === cat.name ? null : cat.name)} className="flex flex-col items-center gap-2">
                <div className={`w-16 h-16 rounded-full overflow-hidden border-2 transition-all ${activeCategory === cat.name ? 'border-[#E23744] scale-105 shadow-lg shadow-red-100' : 'border-slate-50'}`}>
                   <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                </div>
                <span className={`text-[10px] font-black text-center uppercase tracking-tighter ${activeCategory === cat.name ? 'text-[#E23744]' : 'text-slate-500'}`}>{cat.name}</span>
             </button>
           ))}
        </div>

        <div className="space-y-10 mt-6">
           <h3 className="text-xl font-black text-slate-900">{filteredRestaurants.length} outlets delivering to you</h3>
           
           {filteredRestaurants.map(res => (
             <div key={res.id} onClick={() => { setSelectedRestaurant(res); setView('restaurantDetail'); }} className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-100 group cursor-pointer transition-all hover:shadow-xl hover:shadow-slate-100">
                <div className="relative h-52">
                   <img src={res.image} alt={res.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                   <div className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-lg"><Heart className="w-4 h-4 text-slate-400" /></div>
                   <div className="absolute bottom-4 right-4 bg-white px-3 py-1.5 rounded-xl text-xs font-black text-slate-800 shadow-xl border border-slate-50">{res.deliveryTime} mins</div>
                </div>
                <div className="p-5">
                   <div className="flex justify-between items-start mb-2">
                      <h4 className="text-lg font-black text-slate-900">{res.name}</h4>
                      <div className="bg-green-600 text-white px-2 py-0.5 rounded-lg flex items-center gap-1 text-[10px] font-black">
                         {res.rating} <Star className="w-3 h-3 fill-white" />
                      </div>
                   </div>
                   <div className="flex justify-between text-xs text-slate-400 font-bold uppercase tracking-widest">
                      <span>{res.cuisine.join(', ')}</span>
                      <span className="text-slate-800">${res.priceRange * 200} for one</span>
                   </div>
                </div>
             </div>
           ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-50 px-8 py-3 flex justify-between items-center z-40 shadow-2xl max-w-[480px] mx-auto rounded-t-[32px]">
        <button className="flex flex-col items-center gap-1 text-[#E23744]"><ShoppingBag className="w-6 h-6" /><span className="text-[10px] font-black uppercase">Delivery</span></button>
        <button className="flex flex-col items-center gap-1 text-slate-300"><MessageSquare className="w-6 h-6" /><span className="text-[10px] font-black uppercase">Support</span></button>
        <button className="flex flex-col items-center gap-1 text-slate-300"><User className="w-6 h-6" /><span className="text-[10px] font-black uppercase">Account</span></button>
      </div>

      {state.cart.length > 0 && view === 'home' && (
        <div className="fixed bottom-24 left-4 right-4 z-50 animate-in slide-in-from-bottom-4 duration-300 max-w-[440px] mx-auto">
          <button onClick={() => setView('cart')} className="w-full bg-slate-900 text-white p-5 rounded-3xl flex items-center justify-between shadow-2xl shadow-slate-900/30">
             <div className="text-left">
                <p className="text-xs font-black">{state.cart.length} item{state.cart.length > 1 ? 's' : ''} added</p>
                <p className="text-[10px] text-white/50 uppercase font-bold">Total: ${cartTotal.toFixed(2)}</p>
             </div>
             <div className="flex items-center gap-2 font-black text-sm uppercase tracking-widest">View Cart <ChevronRight className="w-5 h-5" /></div>
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomerApp;
