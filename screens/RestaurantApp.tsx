
import React, { useState } from 'react';
import { 
  Package, TrendingUp, Settings, Power, Star, Bell, 
  ChefHat, CheckCircle, UtensilsCrossed, Plus, Edit3, Loader2, Clock,
  ArrowLeft, Camera, Phone, X, Trash2, Smartphone
} from 'lucide-react';
import { MOCK_RESTAURANTS } from '../constants.tsx';

const RestaurantApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [isOpen, setIsOpen] = useState(true);
  const [showAddItem, setShowAddItem] = useState(false);
  
  // Local state for dynamic menu management demo
  const [menuItems, setMenuItems] = useState(MOCK_RESTAURANTS[0].menu.slice(0, 8));
  const [newOrderQueue] = useState([
    { id: 'ORD-7721', customer: 'John Doe', items: '1x Paneer Tufani, 4x Butter Nan', amount: 480.00, status: 'PREPARING', time: '12m', rider: 'Alex R.' },
    { id: 'ORD-8810', customer: 'Sarah Khan', items: '2x Veg Biryani, 1x Chhash', amount: 255.00, status: 'PENDING', time: 'New', rider: null }
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
      <div className="p-8 bg-white border-b sticky top-0 z-40 rounded-b-[48px] shadow-sm">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Jalaram Hub</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Merchant ID: JL-2024</p>
          </div>
          <button onClick={() => setIsOpen(!isOpen)} className={`flex items-center gap-3 px-5 py-3 rounded-2xl transition-all border-2 ${isOpen ? 'bg-green-50 border-green-500 text-green-600' : 'bg-red-50 border-red-500 text-red-600'}`}>
            <Power className="w-4 h-4" />
            <span className="text-[9px] font-black uppercase tracking-widest">{isOpen ? 'OPEN' : 'CLOSED'}</span>
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
           <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100 flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-orange-500 shadow-sm"><TrendingUp className="w-5 h-5" /></div>
              <div><p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Revenue Today</p><p className="text-xl font-black text-slate-900">₹6.8k</p></div>
           </div>
           <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100 flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-500 shadow-sm"><Package className="w-5 h-5" /></div>
              <div><p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Order Count</p><p className="text-xl font-black text-slate-900">12</p></div>
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 hide-scrollbar">
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-in slide-in-from-bottom duration-500 pb-24">
             <div className="flex justify-between items-center px-2">
                <h2 className="font-black text-2xl text-slate-900 tracking-tight">Live Kitchen</h2>
                <div className="relative w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center border">
                   <Bell className="w-6 h-6 text-slate-300" />
                   <div className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full animate-ping" />
                </div>
             </div>
             {newOrderQueue.map(order => (
               <div key={order.id} className="bg-white rounded-[48px] p-8 shadow-sm border border-slate-100 group">
                  <div className="flex justify-between items-start mb-8">
                     <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-slate-900 rounded-[28px] flex items-center justify-center text-white font-black text-lg shadow-xl shadow-slate-900/10">#{order.id.split('-')[1]}</div>
                        <div>
                           <h4 className="font-black text-slate-900 text-lg leading-tight">{order.customer}</h4>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Placed {order.time} ago</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <span className="text-xl font-black text-slate-900">₹{order.amount.toFixed(2)}</span>
                        <div className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase mt-2 border ${order.status === 'PREPARING' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-red-50 text-red-600 border-red-100 animate-pulse'}`}>{order.status}</div>
                     </div>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-[32px] mb-8 border border-slate-100">
                     <p className="text-xs font-bold text-slate-600 leading-relaxed tracking-tight">{order.items}</p>
                  </div>
                  <div className="flex gap-3">
                     {order.rider ? (
                       <button className="flex-1 bg-blue-600 text-white py-5 rounded-[24px] text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-blue-600/10 active:scale-95 transition-all">
                          <Smartphone className="w-4 h-4" /> Call Rider ({order.rider})
                       </button>
                     ) : (
                       <button className="flex-1 bg-slate-100 text-slate-400 py-5 rounded-[24px] text-[10px] font-black uppercase tracking-widest border border-dashed">Assigning Rider...</button>
                     )}
                     <button className="flex-1 bg-slate-900 text-white py-5 rounded-[24px] text-[10px] font-black uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all">
                        <CheckCircle className="w-4 h-4 text-green-400" /> Mark Ready
                     </button>
                  </div>
               </div>
             ))}
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="space-y-6 animate-in slide-in-from-right duration-500 pb-32">
             <div className="flex justify-between items-center px-2">
                <h2 className="font-black text-2xl text-slate-900 tracking-tight">Menu Store</h2>
                <button onClick={() => setShowAddItem(true)} className="bg-slate-900 text-white px-6 py-4 rounded-3xl text-[10px] font-black uppercase tracking-widest shadow-2xl flex items-center gap-3 transition active:scale-95">
                   <Plus className="w-5 h-5 text-[#FFC107]" /> Add Item
                </button>
             </div>
             <div className="grid grid-cols-1 gap-4">
                {menuItems.map(item => (
                  <div key={item.id} className="bg-white p-5 rounded-[36px] border flex items-center gap-5 group shadow-sm">
                     <div className="w-20 h-20 rounded-[24px] overflow-hidden shadow-md flex-shrink-0 border">
                        <img src={item.image} className="w-full h-full object-cover" />
                     </div>
                     <div className="flex-1">
                        <h4 className="font-black text-sm text-slate-900 mb-1 leading-tight">{item.name}</h4>
                        <p className="text-lg font-black text-[#E23744]">₹{item.price}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{item.category}</p>
                     </div>
                     <div className="flex gap-2">
                        <button className="w-11 h-11 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border"><Edit3 className="w-5 h-5" /></button>
                        <button className="w-11 h-11 bg-red-50 rounded-2xl flex items-center justify-center text-red-400 border border-red-100"><Trash2 className="w-5 h-5" /></button>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div className="bg-white/90 backdrop-blur-xl border-t px-12 py-6 flex justify-between items-center rounded-t-[56px] shadow-2xl sticky bottom-0 z-50">
        <button onClick={() => setActiveTab('orders')} className={`flex flex-col items-center gap-2 transition-all ${activeTab === 'orders' ? 'text-slate-900 scale-110' : 'text-slate-300'}`}>
          <div className={`${activeTab === 'orders' ? 'bg-[#FFC107] text-slate-900 shadow-xl' : 'bg-transparent'} p-4 rounded-3xl transition-all`}>
             <ChefHat className="w-6 h-6" />
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest">Kitchen</span>
        </button>
        <button onClick={() => setActiveTab('menu')} className={`flex flex-col items-center gap-2 transition-all ${activeTab === 'menu' ? 'text-slate-900 scale-110' : 'text-slate-300'}`}>
          <div className={`${activeTab === 'menu' ? 'bg-[#FFC107] text-slate-900 shadow-xl' : 'bg-transparent'} p-4 rounded-3xl transition-all`}>
             <UtensilsCrossed className="w-6 h-6" />
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest">Catalogue</span>
        </button>
        <button className="flex flex-col items-center gap-2 text-slate-300">
           <div className="p-4 rounded-3xl transition-all"><Settings className="w-6 h-6" /></div>
           <span className="text-[9px] font-black uppercase tracking-widest">Store</span>
        </button>
      </div>

      {/* Add Item Modal */}
      {showAddItem && (
        <div className="fixed inset-0 z-[500] bg-slate-900/60 backdrop-blur-sm flex items-end justify-center animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-[440px] rounded-t-[64px] p-12 animate-in slide-in-from-bottom duration-500 shadow-2xl">
              <div className="flex justify-between items-center mb-10">
                 <h2 className="text-3xl font-black text-slate-900 tracking-tight">Publish Item</h2>
                 <button onClick={() => setShowAddItem(false)} className="p-4 bg-slate-50 rounded-full border shadow-sm"><X className="w-6 h-6 text-slate-400" /></button>
              </div>
              <form onSubmit={handleAddItem} className="space-y-6">
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3 px-2">Item Designation</label>
                    <input name="name" type="text" required placeholder="e.g. Paneer Angara Sp." className="w-full bg-slate-50 rounded-3xl py-5 px-8 outline-none font-bold text-sm border focus:border-slate-900 shadow-sm" />
                 </div>
                 <div className="grid grid-cols-2 gap-5">
                    <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3 px-2">Market Price (₹)</label>
                       <input name="price" type="number" required placeholder="240" className="w-full bg-slate-50 rounded-3xl py-5 px-8 outline-none font-bold text-sm border focus:border-slate-900 shadow-sm" />
                    </div>
                    <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3 px-2">Category Port</label>
                       <select name="category" className="w-full bg-slate-50 rounded-3xl py-5 px-8 outline-none font-bold text-sm border focus:border-slate-900 shadow-sm appearance-none cursor-pointer">
                          <option>Main Course</option>
                          <option>Chinese</option>
                          <option>Soups</option>
                          <option>Tandoor</option>
                          <option>Rice & Dal</option>
                          <option>Drinks</option>
                       </select>
                    </div>
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3 px-2">Stock Inventory (Qty)</label>
                    <input name="qty" type="number" required placeholder="99" defaultValue="50" className="w-full bg-slate-50 rounded-3xl py-5 px-8 outline-none font-bold text-sm border focus:border-slate-900 shadow-sm" />
                 </div>
                 <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[40px] p-12 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-100 transition-all cursor-pointer shadow-inner">
                    <Camera className="w-10 h-10 mb-3 text-slate-300" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Snap or Upload Media</span>
                 </div>
                 <button type="submit" className="w-full bg-slate-900 text-white py-6 rounded-[32px] font-black text-sm uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3">
                    <Plus className="w-5 h-5 text-[#FFC107]" /> Finalize & Sync
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantApp;
