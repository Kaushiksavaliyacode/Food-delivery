
import React, { useState } from 'react';
import { 
  LayoutDashboard, UtensilsCrossed, Package, TrendingUp, Settings, 
  ChevronRight, Power, Clock, Plus, Trash2, Edit3, Eye, Bell, 
  ChefHat, Flame, Star, CheckCircle
} from 'lucide-react';
import { MOCK_RESTAURANTS } from '../constants.tsx';

const RestaurantApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex flex-col h-full bg-slate-50 font-['Plus_Jakarta_Sans']">
      
      {/* Premium Header */}
      <div className="p-10 bg-white border-b border-slate-100 sticky top-0 z-40 rounded-b-[48px] shadow-sm">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dreamland Hotel</h1>
            <div className="flex items-center gap-2 mt-2">
               <div className="flex text-yellow-500"><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /></div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">4.8 Rating • Master Chef</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center gap-3 px-6 py-3 rounded-[20px] transition-all border-2 ${isOpen ? 'bg-green-50 border-green-500 text-green-600' : 'bg-red-50 border-red-500 text-red-600'}`}
          >
            <Power className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">{isOpen ? 'OPEN' : 'CLOSED'}</span>
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-5">
           <div className="bg-slate-50 rounded-[32px] p-6 border border-slate-100 flex items-center gap-5 group hover:bg-white hover:border-orange-500 transition-all cursor-pointer">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-orange-500 shadow-xl group-hover:scale-110 transition-transform"><TrendingUp className="w-6 h-6" /></div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Revenue</p>
                 <p className="text-2xl font-black text-slate-900">₹4.2k</p>
              </div>
           </div>
           <div className="bg-slate-50 rounded-[32px] p-6 border border-slate-100 flex items-center gap-5 group hover:bg-white hover:border-blue-500 transition-all cursor-pointer">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-500 shadow-xl group-hover:scale-110 transition-transform"><Package className="w-6 h-6" /></div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Orders</p>
                 <p className="text-2xl font-black text-slate-900">08</p>
              </div>
           </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-10 space-y-10 hide-scrollbar">
        
        {activeTab === 'orders' && (
          <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
             <div className="flex justify-between items-center px-2">
                <h2 className="font-black text-2xl text-slate-900">Live Kitchen <span className="text-orange-600 opacity-50 ml-1">(3)</span></h2>
                <button className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 shadow-sm border border-slate-100"><Bell className="w-5 h-5" /></button>
             </div>
             
             <div className="space-y-6">
                {[
                  { id: 'FG-102', items: ['2x Paneer Kadai', '4x Butter Naan'], table: 'D-12', time: '20:45' },
                  { id: 'FG-104', items: ['1x Chole Bhature', '1x Fresh Lime'], table: 'D-08', time: '20:52' },
                  { id: 'FG-108', items: ['1x Hyderabadi Biryani'], table: 'D-15', time: '21:05' }
                ].map((order, i) => (
                  <div key={order.id} className="bg-white rounded-[44px] p-10 shadow-2xl border border-slate-100 relative group">
                     <div className="flex justify-between items-start mb-10">
                        <div className="flex items-center gap-5">
                           <div className="w-16 h-16 bg-slate-900 rounded-[20px] flex items-center justify-center text-white font-black text-xl shadow-2xl">#{order.id.split('-')[1]}</div>
                           <div>
                              <h4 className="font-black text-slate-900 text-lg">Table {order.table}</h4>
                              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1">Ordered at {order.time}</p>
                           </div>
                        </div>
                        <div className="bg-orange-50 text-orange-600 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-orange-100">
                          {i === 0 ? 'Urgent' : 'In Queue'}
                        </div>
                     </div>
                     <div className="bg-slate-50 p-8 rounded-[32px] mb-10 border border-slate-100">
                        <div className="flex items-center gap-3 mb-4 text-slate-300">
                           <ChefHat className="w-5 h-5" />
                           <span className="text-[10px] font-black uppercase tracking-widest">Order List</span>
                        </div>
                        <ul className="space-y-3">
                           {order.items.map((it, idx) => (
                             <li key={idx} className="text-sm font-black text-slate-800 flex items-center gap-3">
                               <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                               {it}
                             </li>
                           ))}
                        </ul>
                     </div>
                     <div className="flex gap-4">
                        <button className="flex-1 bg-slate-50 py-6 rounded-[24px] text-[10px] font-black uppercase tracking-widest text-slate-400 active:scale-95 transition">Postpone</button>
                        <button className="flex-[2] bg-slate-900 text-white py-6 rounded-[24px] text-[10px] font-black uppercase tracking-widest shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3">
                           <CheckCircle className="w-5 h-5" />
                           Ready For Pickup
                        </button>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="space-y-8 animate-in slide-in-from-right duration-500">
             <div className="flex justify-between items-center px-2">
                <h2 className="font-black text-2xl text-slate-900">Digital Menu</h2>
                <button className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl active:scale-90 transition"><Plus className="w-6 h-6" /></button>
             </div>
             <div className="grid grid-cols-1 gap-5">
                {MOCK_RESTAURANTS[0].menu.map(item => (
                  <div key={item.id} className="bg-white p-6 rounded-[36px] border border-slate-100 flex items-center gap-6 group hover:border-orange-200 transition-all">
                     <div className="w-20 h-20 rounded-[20px] overflow-hidden shadow-xl border-4 border-slate-50">
                        <img src={item.image} className="w-full h-full object-cover" />
                     </div>
                     <div className="flex-1">
                        <h4 className="font-black text-sm text-slate-900 mb-1">{item.name}</h4>
                        <p className="text-lg font-black text-orange-500">₹{item.price}</p>
                     </div>
                     <div className="flex items-center gap-4">
                        <button className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 hover:text-slate-900 transition-colors"><Edit3 className="w-5 h-5" /></button>
                        <div className="flex items-center gap-2">
                           <div className="w-12 h-7 bg-slate-900 rounded-full relative p-1.5 cursor-pointer">
                              <div className="w-4 h-4 bg-[#FFC107] rounded-full shadow-sm ml-auto"></div>
                           </div>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>

      {/* Floating Bottom Navigation */}
      <div className="bg-white border-t border-slate-100 px-12 py-6 flex justify-between items-center rounded-t-[48px] shadow-[0_-20px_60px_rgba(0,0,0,0.05)] sticky bottom-0">
        <button onClick={() => setActiveTab('orders')} className={`flex flex-col items-center gap-2 ${activeTab === 'orders' ? 'text-slate-900' : 'text-slate-300'}`}>
          <div className={`${activeTab === 'orders' ? 'bg-[#FFC107] text-slate-900' : 'bg-transparent text-slate-300'} p-4 rounded-[22px] transition-all`}>
             <Package className="w-7 h-7" />
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest">Kitchen</span>
        </button>
        <button onClick={() => setActiveTab('menu')} className={`flex flex-col items-center gap-2 ${activeTab === 'menu' ? 'text-slate-900' : 'text-slate-300'}`}>
          <UtensilsCrossed className="w-7 h-7" />
          <span className="text-[9px] font-black uppercase tracking-widest">Items</span>
        </button>
        <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center gap-2 ${activeTab === 'dashboard' ? 'text-slate-900' : 'text-slate-300'}`}>
          <TrendingUp className="w-7 h-7" />
          <span className="text-[9px] font-black uppercase tracking-widest">Stats</span>
        </button>
        <button onClick={() => setActiveTab('settings')} className={`flex flex-col items-center gap-2 ${activeTab === 'settings' ? 'text-slate-900' : 'text-slate-300'}`}>
          <Settings className="w-7 h-7" />
          <span className="text-[9px] font-black uppercase tracking-widest">Configs</span>
        </button>
      </div>
    </div>
  );
};

export default RestaurantApp;
