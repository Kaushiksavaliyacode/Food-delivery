
import React, { useState } from 'react';
import { 
  Package, TrendingUp, Settings, Power, Star, Bell, 
  ChefHat, CheckCircle, UtensilsCrossed, Plus, Edit3, Loader2, Clock
} from 'lucide-react';
import { MOCK_RESTAURANTS } from '../constants.tsx';

const RestaurantApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="h-full bg-slate-50 flex flex-col font-['Plus_Jakarta_Sans']">
      
      {/* Header */}
      <div className="p-8 bg-white border-b sticky top-0 z-40 rounded-b-[40px] shadow-sm">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dreamland Hub</h1>
            <div className="flex items-center gap-2 mt-2">
               <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">4.8 • Top Merchant</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all border-2 ${isOpen ? 'bg-green-50 border-green-500 text-green-600' : 'bg-red-50 border-red-500 text-red-600'}`}
          >
            <Power className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">{isOpen ? 'OPEN' : 'CLOSED'}</span>
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
           <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100 flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-orange-500 shadow-sm"><TrendingUp className="w-5 h-5" /></div>
              <div><p className="text-[8px] font-black text-slate-400 uppercase">Sales</p><p className="text-xl font-black text-slate-900">₹4.2k</p></div>
           </div>
           <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100 flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-500 shadow-sm"><Package className="w-5 h-5" /></div>
              <div><p className="text-[8px] font-black text-slate-400 uppercase">Orders</p><p className="text-xl font-black text-slate-900">08</p></div>
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-8 hide-scrollbar">
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
             <div className="flex justify-between items-center px-2">
                <h2 className="font-black text-2xl text-slate-900">Live Kitchen</h2>
                <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center text-white animate-pulse"><Bell className="w-5 h-5" /></div>
             </div>
             {[
               { id: '102', items: ['2x Paneer Kadai', '4x Butter Naan'], status: 'PREPARING', time: '12 min left' },
               { id: '104', items: ['1x Chole Bhature'], status: 'PENDING', time: 'New Order' }
             ].map((order, i) => (
               <div key={order.id} className="bg-white rounded-[40px] p-8 shadow-xl border border-slate-100 group">
                  <div className="flex justify-between items-start mb-8">
                     <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-xl">#{order.id}</div>
                        <div>
                           <h4 className="font-black text-slate-900">Order from John</h4>
                           <p className="text-[10px] font-black text-slate-300 uppercase mt-0.5">{order.time}</p>
                        </div>
                     </div>
                     <div className={`px-4 py-2 rounded-full text-[9px] font-black uppercase ${order.status === 'PREPARING' ? 'bg-orange-100 text-orange-600' : 'bg-red-50 text-red-600 animate-pulse border border-red-100'}`}>
                        {order.status}
                     </div>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-3xl mb-8 border border-slate-100">
                     <div className="flex items-center gap-2 mb-4 text-slate-300">
                        <ChefHat className="w-4 h-4" />
                        <span className="text-[9px] font-black uppercase">Preparation List</span>
                     </div>
                     <ul className="space-y-2">
                        {order.items.map((it, idx) => (
                          <li key={idx} className="text-xs font-black text-slate-700 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500" /> {it}
                          </li>
                        ))}
                     </ul>
                  </div>
                  <div className="flex gap-3">
                     <button className="flex-1 bg-slate-50 py-5 rounded-2xl text-[10px] font-black uppercase text-slate-400">Delay</button>
                     <button className="flex-[2] bg-slate-900 text-white py-5 rounded-2xl text-[10px] font-black uppercase shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all">
                        <CheckCircle className="w-4 h-4" /> Ready for Pickup
                     </button>
                  </div>
               </div>
             ))}
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="space-y-6 animate-in slide-in-from-right duration-500">
             <div className="flex justify-between items-center px-2">
                <h2 className="font-black text-2xl text-slate-900">Digital Menu</h2>
                <button className="bg-slate-900 text-white p-4 rounded-2xl shadow-xl active:scale-90 transition"><Plus className="w-6 h-6" /></button>
             </div>
             <div className="grid grid-cols-1 gap-4">
                {MOCK_RESTAURANTS[0].menu.slice(0, 5).map(item => (
                  <div key={item.id} className="bg-white p-5 rounded-[32px] border border-slate-100 flex items-center gap-5 group">
                     <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg border-2 border-slate-50 flex-shrink-0">
                        <img src={item.image} className="w-full h-full object-cover" />
                     </div>
                     <div className="flex-1">
                        <h4 className="font-black text-sm text-slate-900 mb-0.5">{item.name}</h4>
                        <p className="text-lg font-black text-orange-500">₹{item.price}</p>
                     </div>
                     <div className="flex items-center gap-3">
                        <button className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900"><Edit3 className="w-5 h-5" /></button>
                        <div className="w-10 h-6 bg-slate-900 rounded-full relative p-1 cursor-pointer">
                           <div className="w-4 h-4 bg-green-400 rounded-full shadow-sm ml-auto" />
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div className="bg-white border-t px-12 py-6 flex justify-between items-center rounded-t-[40px] shadow-2xl sticky bottom-0">
        <button onClick={() => setActiveTab('orders')} className={`flex flex-col items-center gap-2 transition-all ${activeTab === 'orders' ? 'text-slate-900 scale-110' : 'text-slate-300'}`}>
          <div className={`${activeTab === 'orders' ? 'bg-[#FFC107] text-slate-900' : 'bg-transparent'} p-4 rounded-2xl`}>
             <Clock className="w-6 h-6" />
          </div>
          <span className="text-[9px] font-black uppercase">Live</span>
        </button>
        <button onClick={() => setActiveTab('menu')} className={`flex flex-col items-center gap-2 transition-all ${activeTab === 'menu' ? 'text-slate-900 scale-110' : 'text-slate-300'}`}>
          <UtensilsCrossed className="w-6 h-6" />
          <span className="text-[9px] font-black uppercase tracking-widest">Menu</span>
        </button>
        <button className="flex flex-col items-center gap-2 text-slate-300">
          <TrendingUp className="w-6 h-6" />
          <span className="text-[9px] font-black uppercase tracking-widest">Stats</span>
        </button>
        <button className="flex flex-col items-center gap-2 text-slate-300">
          <Settings className="w-6 h-6" />
          <span className="text-[9px] font-black uppercase tracking-widest">Setup</span>
        </button>
      </div>
    </div>
  );
};

export default RestaurantApp;
