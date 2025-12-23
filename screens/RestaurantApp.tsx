
import React, { useState } from 'react';
import { 
  LayoutDashboard, UtensilsCrossed, Package, TrendingUp, Settings, 
  ChevronRight, Power, Clock, Plus, Trash2, Edit3, Eye 
} from 'lucide-react';
import { MOCK_RESTAURANTS } from '../constants';

const RestaurantApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <div className="p-8 bg-white border-b sticky top-0 z-20">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Orix Kitchen</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Restaurant Management</p>
          </div>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center gap-3 px-5 py-2.5 rounded-2xl transition-all border-2 ${isOpen ? 'bg-green-50 border-green-500 text-green-600' : 'bg-red-50 border-red-500 text-red-600'}`}
          >
            <Power className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">{isOpen ? 'OPEN' : 'CLOSED'}</span>
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
           <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100 flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-orange-500 shadow-sm"><TrendingUp className="w-5 h-5" /></div>
              <div>
                 <p className="text-[10px] font-bold text-slate-400 uppercase">Revenue</p>
                 <p className="text-lg font-black text-slate-900">$1.2k</p>
              </div>
           </div>
           <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100 flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-500 shadow-sm"><Package className="w-5 h-5" /></div>
              <div>
                 <p className="text-[10px] font-bold text-slate-400 uppercase">Orders</p>
                 <p className="text-lg font-black text-slate-900">42</p>
              </div>
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-8 hide-scrollbar">
        {activeTab === 'orders' && (
          <div className="space-y-6">
             <div className="flex justify-between items-center">
                <h2 className="font-black text-xl text-slate-900">Live Orders <span className="text-orange-500 font-bold">(3)</span></h2>
                <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest">History</button>
             </div>
             
             <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100">
                     <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-3">
                           <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-lg">#{i}</div>
                           <div>
                              <h4 className="font-black text-slate-900">Client {i}</h4>
                              <p className="text-[10px] font-bold text-slate-400 uppercase">Scheduled Delivery • 12:45</p>
                           </div>
                        </div>
                        <div className="bg-orange-100 text-orange-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-orange-200">
                          Preparing
                        </div>
                     </div>
                     <div className="bg-slate-50 p-4 rounded-2xl mb-6">
                        <p className="text-xs text-slate-600 font-bold mb-2 uppercase tracking-widest opacity-50">Items</p>
                        <ul className="space-y-1">
                           <li className="text-sm font-bold text-slate-800">1x Egg Pasta (Extra Spicy)</li>
                           <li className="text-sm font-bold text-slate-800">2x Dimsum Steamed</li>
                        </ul>
                     </div>
                     <div className="flex gap-4">
                        <button className="flex-1 bg-slate-100 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400">View Map</button>
                        <button className="flex-[2] bg-slate-900 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">Mark Ready</button>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="space-y-6">
             <div className="flex justify-between items-center">
                <h2 className="font-black text-xl text-slate-900">Manage Menu</h2>
                <button className="bg-orange-500 text-white p-2 rounded-xl shadow-lg shadow-orange-500/20"><Plus className="w-5 h-5" /></button>
             </div>
             <div className="space-y-4">
                {MOCK_RESTAURANTS[0].menu.map(item => (
                  <div key={item.id} className="bg-white p-4 rounded-3xl border border-slate-100 flex items-center gap-4 group">
                     <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md">
                        <img src={item.image} className="w-full h-full object-cover" />
                     </div>
                     <div className="flex-1">
                        <h4 className="font-black text-sm text-slate-900">{item.name}</h4>
                        <p className="text-[10px] font-bold text-slate-400">${item.price}</p>
                     </div>
                     <div className="flex gap-2">
                        <button className="p-2 bg-slate-50 rounded-xl text-slate-400 hover:text-orange-600"><Edit3 className="w-4 h-4" /></button>
                        <button className="p-2 bg-slate-50 rounded-xl text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                        <div className="flex items-center gap-2 ml-2">
                           <div className="w-10 h-6 bg-slate-200 rounded-full relative p-1 cursor-pointer">
                              <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                           </div>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div className="bg-white border-t px-10 py-4 flex justify-between items-center rounded-t-[40px] shadow-2xl">
        <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center gap-1 ${activeTab === 'dashboard' ? 'text-orange-600' : 'text-slate-400'}`}>
          <LayoutDashboard className="w-6 h-6" />
          <span className="text-[10px] font-black uppercase tracking-widest">Home</span>
        </button>
        <button onClick={() => setActiveTab('orders')} className={`flex flex-col items-center gap-1 ${activeTab === 'orders' ? 'text-orange-600' : 'text-slate-400'}`}>
          <Package className="w-6 h-6" />
          <span className="text-[10px] font-black uppercase tracking-widest">Orders</span>
        </button>
        <button onClick={() => setActiveTab('menu')} className={`flex flex-col items-center gap-1 ${activeTab === 'menu' ? 'text-orange-600' : 'text-slate-400'}`}>
          <UtensilsCrossed className="w-6 h-6" />
          <span className="text-[10px] font-black uppercase tracking-widest">Menu</span>
        </button>
        <button onClick={() => setActiveTab('settings')} className={`flex flex-col items-center gap-1 ${activeTab === 'settings' ? 'text-orange-600' : 'text-slate-400'}`}>
          <Settings className="w-6 h-6" />
          <span className="text-[10px] font-black uppercase tracking-widest">Settings</span>
        </button>
      </div>
    </div>
  );
};

export default RestaurantApp;
