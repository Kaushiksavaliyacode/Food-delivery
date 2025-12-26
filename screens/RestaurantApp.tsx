
import React, { useState } from 'react';
import { 
  Package, TrendingUp, Settings, Power, Star, Bell, 
  ChefHat, CheckCircle, UtensilsCrossed, Plus, Edit3, Loader2, Clock,
  ArrowLeft, Camera, Phone, X, Trash2
} from 'lucide-react';
import { MOCK_RESTAURANTS } from '../constants.tsx';

const RestaurantApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [isOpen, setIsOpen] = useState(true);
  const [showAddItem, setShowAddItem] = useState(false);
  
  // Local state for dynamic menu management demo
  const [menuItems, setMenuItems] = useState(MOCK_RESTAURANTS[0].menu.slice(0, 5));
  const [newOrderQueue] = useState([
    { id: 'ORD-7721', customer: 'John Doe', items: '2x Paneer Kadai, 4x Naan', status: 'PREPARING', time: '12m', rider: 'Alex R.' },
    { id: 'ORD-8810', customer: 'Sarah Khan', items: '1x Chole Bhature', status: 'PENDING', time: 'New', rider: null }
  ]);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const newItem = {
      id: Math.random().toString(),
      name: formData.get('name') as string,
      price: parseFloat(formData.get('price') as string),
      category: formData.get('category') as string,
      description: 'Newly added fresh preparation.',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=300',
      isVeg: true,
      available: true
    };
    setMenuItems([newItem, ...menuItems]);
    setShowAddItem(false);
  };

  return (
    <div className="h-full bg-slate-50 flex flex-col font-['Plus_Jakarta_Sans']">
      
      {/* Header */}
      <div className="p-8 bg-white border-b sticky top-0 z-40 rounded-b-[40px] shadow-sm">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Dreamland Hub</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Merchant ID: DL-992</p>
          </div>
          <button onClick={() => setIsOpen(!isOpen)} className={`flex items-center gap-3 px-5 py-3 rounded-2xl transition-all border-2 ${isOpen ? 'bg-green-50 border-green-500 text-green-600' : 'bg-red-50 border-red-500 text-red-600'}`}>
            <Power className="w-4 h-4" />
            <span className="text-[9px] font-black uppercase tracking-widest">{isOpen ? 'OPEN' : 'CLOSED'}</span>
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
           <div className="bg-slate-50 rounded-3xl p-4 border border-slate-100 flex items-center gap-3">
              <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-orange-500 shadow-sm"><TrendingUp className="w-4 h-4" /></div>
              <div><p className="text-[8px] font-black text-slate-400 uppercase">Sales</p><p className="text-lg font-black text-slate-900">₹4.2k</p></div>
           </div>
           <div className="bg-slate-50 rounded-3xl p-4 border border-slate-100 flex items-center gap-3">
              <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-blue-500 shadow-sm"><Package className="w-4 h-4" /></div>
              <div><p className="text-[8px] font-black text-slate-400 uppercase">Orders</p><p className="text-lg font-black text-slate-900">08</p></div>
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar">
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
             <div className="flex justify-between items-center px-2">
                <h2 className="font-black text-xl text-slate-900">Live Queue</h2>
                <div className="relative">
                   <Bell className="w-5 h-5 text-slate-300" />
                   <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
                </div>
             </div>
             {newOrderQueue.map(order => (
               <div key={order.id} className="bg-white rounded-[32px] p-6 shadow-sm border group">
                  <div className="flex justify-between items-start mb-6">
                     <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-sm">#{order.id.split('-')[1]}</div>
                        <div>
                           <h4 className="font-black text-slate-900 text-sm">{order.customer}</h4>
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{order.time}</p>
                        </div>
                     </div>
                     <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase ${order.status === 'PREPARING' ? 'bg-orange-100 text-orange-600' : 'bg-red-50 text-red-600 animate-pulse'}`}>{order.status}</span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl mb-6">
                     <p className="text-[10px] font-bold text-slate-600 leading-relaxed">{order.items}</p>
                  </div>
                  <div className="flex gap-2">
                     {order.rider ? (
                       <button className="flex-1 bg-blue-50 text-blue-600 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 border border-blue-100">
                          <Phone className="w-3.5 h-3.5" /> Call Rider ({order.rider})
                       </button>
                     ) : (
                       <button className="flex-1 bg-slate-50 py-3 rounded-2xl text-[9px] font-black uppercase text-slate-400 border">Assign Rider</button>
                     )}
                     <button className="flex-1 bg-slate-900 text-white py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all">
                        Mark Ready
                     </button>
                  </div>
               </div>
             ))}
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="space-y-6 animate-in slide-in-from-right duration-500 pb-32">
             <div className="flex justify-between items-center px-2">
                <h2 className="font-black text-xl text-slate-900">Manage Menu</h2>
                <button onClick={() => setShowAddItem(true)} className="bg-slate-900 text-white px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2 transition active:scale-95">
                   <Plus className="w-4 h-4" /> Add Item
                </button>
             </div>
             <div className="grid grid-cols-1 gap-4">
                {menuItems.map(item => (
                  <div key={item.id} className="bg-white p-4 rounded-[28px] border flex items-center gap-4">
                     <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md flex-shrink-0">
                        <img src={item.image} className="w-full h-full object-cover" />
                     </div>
                     <div className="flex-1">
                        <h4 className="font-black text-xs text-slate-900 mb-0.5">{item.name}</h4>
                        <p className="text-sm font-black text-orange-500">₹{item.price}</p>
                     </div>
                     <div className="flex gap-2">
                        <button className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400"><Edit3 className="w-4 h-4" /></button>
                        <button className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center text-red-400"><Trash2 className="w-4 h-4" /></button>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div className="bg-white/80 backdrop-blur-xl border-t px-12 py-5 flex justify-between items-center rounded-t-[40px] shadow-2xl sticky bottom-0">
        <button onClick={() => setActiveTab('orders')} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'orders' ? 'text-slate-900 scale-105' : 'text-slate-300'}`}>
          <div className={`${activeTab === 'orders' ? 'bg-[#FFC107] text-slate-900 shadow-lg' : 'bg-transparent'} p-3 rounded-2xl`}>
             <Clock className="w-5 h-5" />
          </div>
          <span className="text-[8px] font-black uppercase">Active</span>
        </button>
        <button onClick={() => setActiveTab('menu')} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'menu' ? 'text-slate-900 scale-105' : 'text-slate-300'}`}>
          <div className={`${activeTab === 'menu' ? 'bg-[#FFC107] text-slate-900 shadow-lg' : 'bg-transparent'} p-3 rounded-2xl`}>
             <UtensilsCrossed className="w-5 h-5" />
          </div>
          <span className="text-[8px] font-black uppercase">Menu</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 text-slate-300">
           <div className="p-3 rounded-2xl"><Settings className="w-5 h-5" /></div>
           <span className="text-[8px] font-black uppercase">Setup</span>
        </button>
      </div>

      {/* Add Item Modal */}
      {showAddItem && (
        <div className="fixed inset-0 z-[500] bg-slate-900/60 backdrop-blur-sm flex items-end justify-center animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-[420px] rounded-t-[48px] p-10 animate-in slide-in-from-bottom duration-500 shadow-2xl">
              <div className="flex justify-between items-center mb-10">
                 <h2 className="text-2xl font-black text-slate-900">New Menu Item</h2>
                 <button onClick={() => setShowAddItem(false)} className="p-3 bg-slate-50 rounded-full"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleAddItem} className="space-y-6">
                 <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-2">Item Name</label>
                    <input name="name" type="text" required placeholder="e.g. Garlic Naan" className="w-full bg-slate-50 rounded-2xl py-4 px-6 outline-none font-bold text-sm border focus:border-slate-900" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-2">Price (₹)</label>
                       <input name="price" type="number" required placeholder="149" className="w-full bg-slate-50 rounded-2xl py-4 px-6 outline-none font-bold text-sm border focus:border-slate-900" />
                    </div>
                    <div>
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-2">Category</label>
                       <select name="category" className="w-full bg-slate-50 rounded-2xl py-4 px-6 outline-none font-bold text-sm border focus:border-slate-900 appearance-none">
                          <option>Main Course</option>
                          <option>Starters</option>
                          <option>Chinese</option>
                          <option>Tandoor</option>
                       </select>
                    </div>
                 </div>
                 <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-100 transition cursor-pointer">
                    <Camera className="w-8 h-8 mb-2" />
                    <span className="text-[10px] font-black uppercase">Upload Food Photo</span>
                 </div>
                 <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-[24px] font-black text-sm uppercase tracking-widest shadow-2xl active:scale-95 transition-all">Create Item</button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantApp;
