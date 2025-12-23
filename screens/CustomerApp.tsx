
import React, { useState, useEffect, useMemo } from 'react';
import { AppState, Restaurant, MenuItem, OrderStatus, Order, Location } from '../types.ts';
import { CATEGORIES, MOCK_RESTAURANTS, COLORS } from '../constants.tsx';
import { 
  Search, MapPin, ShoppingBag, Clock, Star, ArrowLeft, Plus, Minus, X, 
  CheckCircle, Navigation, Phone, MessageSquare, ChevronRight, Heart, 
  Tag, User, Filter, SlidersHorizontal, Bell, Flame, Map as MapIcon, 
  CreditCard, Wallet, Home, Briefcase, MoreHorizontal, History, Settings,
  Zap, ShieldCheck, CreditCard as CardIcon, Compass, Loader2
} from 'lucide-react';

interface Props {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

type CustomerView = 'location' | 'home' | 'itemDetail' | 'cart' | 'checkout' | 'success' | 'tracking' | 'profile';

const CustomerApp: React.FC<Props> = ({ state, setState }) => {
  const [view, setView] = useState<CustomerView>(state.currentLocation ? 'home' : 'location');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [locationResults, setLocationResults] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [riderPos, setRiderPos] = useState({ lat: 0.4, lng: 0.3 });

  useEffect(() => {
    if (view === 'tracking') {
      const interval = setInterval(() => {
        setRiderPos(prev => ({
          lat: prev.lat + (0.6 - prev.lat) * 0.05,
          lng: prev.lng + (0.7 - prev.lng) * 0.05
        }));
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [view]);

  // FREE LOCATION DETECTION (Browser API + OpenStreetMap)
  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        // Using OpenStreetMap Nominatim (100% Free, No Key Required)
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
        const data = await response.json();
        const address = data.display_name || "Detected Location";
        
        setIsDetectingLocation(false);
        confirmLocation({ lat: latitude, lng: longitude, address: address, type: 'Home' });
      } catch (error) {
        console.error("Geocoding failed", error);
        setIsDetectingLocation(false);
        // Fallback to manual if API fails
        confirmLocation({ lat: latitude, lng: longitude, address: "Detected Location", type: 'Home' });
      }
    }, (error) => {
      setIsDetectingLocation(false);
      alert("Could not get your location. Please search manually.");
    });
  };

  // FREE ADDRESS SEARCH (OpenStreetMap)
  const searchAddresses = async (query: string) => {
    setLocationSearch(query);
    if (query.length < 3) {
      setLocationResults([]);
      return;
    }

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`);
      const data = await response.json();
      setLocationResults(data);
    } catch (error) {
      console.error("Address search failed", error);
    }
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
  const finalTotal = cartTotal + 25 + 15;

  const placeOrder = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setView('success');
    }, 2000);
  };

  const LocationPicker = () => (
    <div className="flex flex-col h-full bg-white animate-in slide-in-from-bottom duration-500">
      <div className="flex-1 bg-slate-100 relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/-118.2437,34.0522,13,0/600x600?access_token=pk.eyJ1IjoibW9ja3VzZXIiLCJhIjoiY2p4eCJ9')] bg-cover bg-center opacity-40"></div>
         <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="absolute -inset-10 bg-[#E23744]/10 rounded-full animate-ping"></div>
              <MapPin className="w-16 h-16 text-[#E23744] drop-shadow-2xl relative z-10" />
            </div>
         </div>
      </div>
      <div className="bg-white p-10 rounded-t-[48px] -mt-12 relative z-10 shadow-2xl overflow-y-auto max-h-[70%] hide-scrollbar">
        <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">Set Delivery Location</h2>
        
        <div className="space-y-4 mb-8">
          <button 
            onClick={detectLocation}
            disabled={isDetectingLocation}
            className="w-full flex items-center gap-4 p-6 bg-red-50 rounded-[32px] border-2 border-red-100 hover:border-red-500 transition-all text-left shadow-sm"
          >
            {isDetectingLocation ? (
              <div className="flex items-center gap-4">
                <Loader2 className="w-6 h-6 text-[#E23744] animate-spin" />
                <span className="font-black text-sm text-[#E23744] uppercase tracking-widest">Detecting Location...</span>
              </div>
            ) : (
              <>
                <div className="bg-white p-3 rounded-2xl shadow-sm"><Compass className="w-6 h-6 text-[#E23744]" /></div>
                <div>
                  <h4 className="font-black text-slate-900 text-sm">Use current location</h4>
                  <p className="text-[10px] text-red-400 font-black uppercase tracking-widest">Free GPS Detection</p>
                </div>
              </>
            )}
          </button>
          
          <div className="relative">
             <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
             <input 
              type="text" 
              placeholder="Search for your area..." 
              value={locationSearch}
              onChange={(e) => searchAddresses(e.target.value)}
              className="w-full bg-slate-50 rounded-[28px] py-6 pl-16 pr-6 outline-none font-bold text-sm border-2 border-transparent focus:border-slate-200 transition-all" 
             />
          </div>

          {locationResults.length > 0 && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
               {locationResults.map((res, i) => (
                 <button 
                  key={i} 
                  onClick={() => confirmLocation({ lat: parseFloat(res.lat), lng: parseFloat(res.lon), address: res.display_name, type: 'Other' })}
                  className="w-full text-left p-4 hover:bg-slate-50 rounded-2xl border border-transparent hover:border-slate-100 transition-all flex items-start gap-3"
                 >
                    <MapPin className="w-4 h-4 text-slate-300 mt-1 flex-shrink-0" />
                    <span className="text-xs font-bold text-slate-600 leading-relaxed">{res.display_name}</span>
                 </button>
               ))}
            </div>
          )}
        </div>

        {!locationResults.length && !isDetectingLocation && (
          <p className="text-center text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] mb-4">Or choose from saved addresses</p>
        )}
      </div>
    </div>
  );

  const SuccessScreen = () => (
    <div className="flex flex-col h-full bg-[#E23744] items-center justify-center p-12 text-center animate-in zoom-in duration-500">
       <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center mb-8 shadow-2xl">
          <CheckCircle className="w-16 h-16 text-green-500" />
       </div>
       <h1 className="text-4xl font-black text-white mb-4">Order Placed!</h1>
       <p className="text-white/60 font-bold text-xs uppercase tracking-widest mb-12">Rider will be assigned shortly</p>
       <button onClick={() => setView('tracking')} className="w-full bg-white text-slate-900 py-6 rounded-[24px] font-black text-sm uppercase tracking-widest shadow-xl active:scale-95 transition-all">Track Order</button>
    </div>
  );

  const filteredItems = useMemo(() => {
    let items = MOCK_RESTAURANTS[0].menu;
    if (activeCategory) items = items.filter(i => i.category === activeCategory);
    if (searchQuery) items = items.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return items;
  }, [activeCategory, searchQuery]);

  if (view === 'location') return <LocationPicker />;
  if (view === 'success') return <SuccessScreen />;

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden relative font-['Plus_Jakarta_Sans']">
      
      {/* Search & Location Header */}
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
           <button onClick={() => setView('profile')} className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 shadow-sm border-2 border-white">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${state.phoneNumber}`} />
           </button>
        </div>

        <div className="relative">
           <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
           <input 
             type="text" 
             placeholder="Search for biryani, pizza, cakes..." 
             className="w-full bg-slate-50 rounded-[20px] py-4 pl-14 pr-12 outline-none focus:bg-white focus:ring-4 ring-red-500/5 transition-all font-bold text-sm border border-slate-100"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
           />
           <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-xl shadow-sm border text-slate-400"><Filter className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Main Content Scroll */}
      <div className="flex-1 overflow-y-auto hide-scrollbar pb-32">
        {/* Horizontal Categories */}
        {!searchQuery && (
          <div className="px-6 py-8 overflow-x-auto hide-scrollbar flex gap-5">
             {CATEGORIES.map(cat => (
               <button 
                 key={cat.id} 
                 onClick={() => setActiveCategory(activeCategory === cat.name ? null : cat.name)}
                 className="flex flex-col items-center gap-3 transition-transform active:scale-90"
               >
                 <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-sm transition-all ${activeCategory === cat.name ? 'bg-red-50 border-2 border-[#E23744]' : 'bg-slate-50 border-2 border-transparent'}`}>
                    {cat.icon}
                 </div>
                 <span className={`text-[10px] font-black uppercase tracking-widest ${activeCategory === cat.name ? 'text-[#E23744]' : 'text-slate-400'}`}>{cat.name}</span>
               </button>
             ))}
          </div>
        )}

        {/* Restaurant / Food Listing */}
        <div className="px-6 space-y-10">
           <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">{activeCategory || "Eat what excites you"}</h3>
              <div className="flex items-center gap-3">
                 <span className="text-[10px] font-black text-slate-300 uppercase">Sort</span>
                 <SlidersHorizontal className="w-4 h-4 text-slate-300" />
              </div>
           </div>

           <div className="grid grid-cols-1 gap-12 pb-10">
              {filteredItems.map(item => (
                <div key={item.id} onClick={() => { setSelectedItem(item); setView('itemDetail'); }} className="group">
                   <div className="relative mb-4">
                      <div className="aspect-[16/9] rounded-[32px] overflow-hidden shadow-2xl border-4 border-slate-50 transition-transform duration-500 group-hover:scale-[1.02]">
                         <img src={item.image} className="w-full h-full object-cover" />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60"></div>
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
                      <button className="absolute -bottom-4 right-8 w-14 h-14 bg-white rounded-3xl flex items-center justify-center text-slate-900 shadow-2xl border-2 border-slate-50 group-hover:bg-[#E23744] group-hover:text-white transition-all">
                         <Plus className="w-6 h-6" />
                      </button>
                   </div>
                   <div className="px-2">
                      <div className="flex justify-between items-center mb-1">
                         <h4 className="text-lg font-black text-slate-900 tracking-tight">{item.name}</h4>
                         <span className="text-xl font-black text-slate-900">₹{item.price}</span>
                      </div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-relaxed">{item.category} • {item.description.slice(0, 40)}...</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Floating Bottom Navigation */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-[420px] bg-slate-900/95 backdrop-blur-2xl h-22 px-12 flex justify-between items-center z-[100] shadow-2xl rounded-[32px] border border-white/10">
        <button onClick={() => setView('home')} className={`transition-all ${view === 'home' ? 'text-[#E23744] scale-125' : 'text-white/40'}`}><Home className="w-7 h-7" /></button>
        <button className="text-white/40"><Search className="w-7 h-7" /></button>
        <button className="text-white/40"><ShoppingBag className="w-7 h-7" /></button>
        <button onClick={() => setView('profile')} className={`transition-all ${view === 'profile' ? 'text-[#E23744] scale-125' : 'text-white/40'}`}><User className="w-7 h-7" /></button>
      </div>

      {/* Cart & Sticky Footer Integration */}
      {state.cart.length > 0 && view === 'home' && (
        <div className="fixed bottom-36 left-8 right-8 z-[110] animate-in slide-in-from-bottom duration-500">
           <button 
             onClick={() => setView('cart')}
             className="w-full bg-[#E23744] p-5 rounded-[24px] shadow-2xl flex items-center justify-between group overflow-hidden relative"
           >
              <div className="flex items-center gap-4 relative z-10">
                 <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-[#E23744] font-black shadow-lg">
                    {state.cart.reduce((a,b) => a + b.quantity, 0)}
                 </div>
                 <div className="text-left">
                    <h4 className="text-white font-black text-xs uppercase tracking-widest">Cart Total</h4>
                    <p className="text-lg font-black text-white">₹{cartTotal.toFixed(2)}</p>
                 </div>
              </div>
              <div className="flex items-center gap-2 text-white relative z-10 font-black text-xs uppercase tracking-widest">
                 View Cart <ChevronRight className="w-4 h-4" />
              </div>
           </button>
        </div>
      )}

      {/* Sub-Views Modals (Overlay) */}
      {(view === 'cart' || view === 'checkout') && (
        <div className="fixed inset-0 z-[200] bg-white animate-in slide-in-from-bottom duration-500 flex flex-col">
           <div className="p-8 border-b flex items-center justify-between">
              <button onClick={() => setView('home')} className="p-3 bg-slate-50 rounded-2xl"><ArrowLeft className="w-5 h-5" /></button>
              <h1 className="text-lg font-black text-slate-900 tracking-tight">{view === 'cart' ? 'My Cart' : 'Final Step'}</h1>
              <div className="w-10" />
           </div>

           <div className="flex-1 overflow-y-auto p-8 space-y-10 hide-scrollbar">
              {view === 'cart' ? (
                <>
                  <div className="space-y-6">
                    {state.cart.map(item => (
                      <div key={item.menuItem.id} className="flex items-center gap-5">
                        <div className="w-20 h-20 rounded-[20px] overflow-hidden border-4 border-slate-50 shadow-lg">
                            <img src={item.menuItem.image} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-black text-slate-900 text-sm leading-tight mb-1">{item.menuItem.name}</h4>
                            <p className="text-lg font-black text-slate-900">₹{item.menuItem.price}</p>
                        </div>
                        <div className="bg-slate-50 p-1.5 rounded-full flex flex-col items-center gap-3 border">
                            <button onClick={() => addToCart(item.menuItem, 1)} className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-900 shadow-sm"><Plus className="w-4 h-4" /></button>
                            <span className="font-black text-sm">{item.quantity}</span>
                            <button onClick={() => removeFromCart(item.menuItem.id)} className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-300 shadow-sm"><Minus className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-8 space-y-4">
                    <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest">Bill Details</h3>
                    <div className="space-y-3 bg-slate-50 p-6 rounded-[32px] border">
                      <div className="flex justify-between items-center text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                        <span>Items Total</span>
                        <span>₹{cartTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                        <span>Delivery Fee</span>
                        <span className="text-green-500">FREE</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                        <span>Govt Taxes & GST</span>
                        <span>₹25.00</span>
                      </div>
                      <div className="pt-4 border-t border-dashed flex justify-between items-center">
                        <span className="text-xl font-black text-slate-900 tracking-tighter">Grand Total</span>
                        <span className="text-2xl font-black text-slate-900">₹{finalTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-10">
                   <div className="space-y-4">
                      <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest">Choose Address</h3>
                      <div className="grid grid-cols-3 gap-4">
                         {['Home', 'Work', 'Other'].map(type => (
                           <button key={type} className={`py-4 rounded-[20px] font-black text-[10px] uppercase tracking-widest border-2 transition-all ${type === 'Home' ? 'bg-red-50 border-[#E23744] text-[#E23744]' : 'bg-slate-50 border-transparent text-slate-400'}`}>
                             {type === 'Home' ? <Home className="w-4 h-4 mx-auto mb-2" /> : type === 'Work' ? <Briefcase className="w-4 h-4 mx-auto mb-2" /> : <MapIcon className="w-4 h-4 mx-auto mb-2" />}
                             {type}
                           </button>
                         ))}
                      </div>
                      <div className="p-6 bg-slate-50 rounded-[32px] border flex gap-4">
                         <MapPin className="w-6 h-6 text-[#E23744] flex-shrink-0" />
                         <div>
                            <h4 className="font-black text-sm text-slate-900">{state.currentLocation?.address.split(',')[0]}</h4>
                            <p className="text-[10px] text-slate-400 font-bold leading-relaxed mt-1 uppercase truncate max-w-[200px]">{state.currentLocation?.address}</p>
                         </div>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest">Payment Method</h3>
                      <div className="space-y-3">
                         {[
                           { name: 'UPI (GPay/PhonePe)', icon: <Zap className="w-5 h-5" />, color: 'bg-purple-100 text-purple-600' },
                           { name: 'Credit/Debit Cards', icon: <CardIcon className="w-5 h-5" />, color: 'bg-blue-100 text-blue-600' },
                           { name: 'Cash on Delivery', icon: <Wallet className="w-5 h-5" />, color: 'bg-green-100 text-green-600' }
                         ].map((m, i) => (
                           <div key={i} className={`p-6 rounded-[24px] border flex items-center justify-between cursor-pointer hover:border-[#E23744] transition-all ${i === 0 ? 'bg-slate-50 border-[#E23744]/20' : 'bg-white'}`}>
                              <div className="flex items-center gap-4">
                                 <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${m.color}`}>{m.icon}</div>
                                 <span className="text-sm font-black text-slate-900">{m.name}</span>
                              </div>
                              <div className={`w-5 h-5 rounded-full border-2 ${i === 0 ? 'border-[#E23744] bg-[#E23744]' : 'border-slate-200'}`} />
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
              )}
           </div>

           <div className="p-8 space-y-4 border-t">
              <button 
                onClick={() => view === 'cart' ? setView('checkout') : placeOrder()}
                disabled={isLoading}
                className="w-full bg-[#E23744] text-white py-6 rounded-[24px] font-black text-sm uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center gap-4"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <> {view === 'cart' ? 'Proceed to Checkout' : `Pay ₹${finalTotal.toFixed(2)}`} <ChevronRight className="w-4 h-4" /></>
                )}
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default CustomerApp;
