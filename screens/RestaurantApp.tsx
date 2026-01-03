
import React, { useState } from 'react';
import { 
  ChefHat, UtensilsCrossed, Clock, CheckCircle, Bell, 
  Settings, Power, Info, ChevronRight, X, Layout, 
  BarChart, ListTodo, Zap
} from 'lucide-react';
import { Order, OrderStatus } from '../types.ts';
import { supabase } from '../supabase.ts';

interface Props {
    orders: Order[];
}

const RestaurantApp: React.FC<Props> = ({ orders }) => {
  const [activeTab, setActiveTab] = useState('orders');
  const [isOpen, setIsOpen] = useState(true);

  const updateStatus = async (orderId: string, status: string) => {
    await supabase.from('orders').update({ status }).eq('id', orderId);
  };

  const pendingCount = orders.filter(o => o.status === 'PENDING').length;
  const cookingCount = orders.filter(o => o.status === 'PREPARING' || o.status === 'ACCEPTED').length;

  return (
    <div className="h-full bg-slate-50 flex flex-col">
      <div className="p-10 bg-white border-b rounded-b-[56px] shadow-sm">
        <div className="flex justify-between items-center mb-10">
           <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Kitchen Hub</h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Live Management Suite</p>
           </div>
           <button onClick={() => setIsOpen(!isOpen)} className={`px-6 py-3 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest bouncy-click ${isOpen ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
             {isOpen ? 'ONLINE' : 'OFFLINE'}
           </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 flex flex-col justify-between">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">New Requests</span>
              <div className="flex items-end justify-between mt-4">
                <span className="text-4xl font-black text-[#E23744]">{pendingCount}</span>
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center"><Bell className="w-5 h-5 text-[#E23744] animate-pulse" /></div>
              </div>
           </div>
           <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">In Progress</span>
              <div className="flex items-end justify-between mt-4">
                <span className="text-4xl font-black text-slate-900">{cookingCount}</span>
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center"><ChefHat className="w-5 h-5 text-orange-500" /></div>
              </div>
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-6 hide-scrollbar pb-32">
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-12 duration-500">
             {orders.map(order => (
               <div key={order.id} className="bg-white rounded-[40px] p-8 shadow-xl border border-slate-50 relative overflow-hidden group">
                  <div className={`absolute top-0 left-0 w-2 h-full ${order.status === 'PENDING' ? 'bg-[#E23744]' : 'bg-orange-400'}`}></div>
                  <div className="flex justify-between items-start mb-6">
                     <div>
                        <h4 className="font-black text-slate-900 text-lg">Order {order.id.split('-')[1]}</h4>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{order.items.length} Items • ₹{order.totalAmount.toFixed(0)}</span>
                     </div>
                     <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${order.status === 'PENDING' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'}`}>
                       {order.status}
                     </span>
                  </div>
                  
                  <div className="space-y-3 mb-8 bg-slate-50 p-6 rounded-[28px]">
                    {order.items.map((it: any, i: number) => (
                      <div key={i} className="flex justify-between items-center">
                        <p className="text-sm font-black text-slate-700">{it.quantity}x {it.menuItem.name}</p>
                        {it.menuItem.isVeg && <div className="w-2 h-2 bg-green-500 rounded-full" />}
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-4">
                     {order.status === 'PENDING' && (
                       <button onClick={() => updateStatus(order.id, 'ACCEPTED')} className="flex-1 bg-slate-900 text-white py-5 rounded-[24px] text-[10px] font-black uppercase tracking-widest shadow-2xl bouncy-click">Accept Order</button>
                     )}
                     {order.status === 'ACCEPTED' && (
                       <button onClick={() => updateStatus(order.id, 'PREPARING')} className="flex-1 bg-orange-500 text-white py-5 rounded-[24px] text-[10px] font-black uppercase tracking-widest bouncy-click shadow-orange-500/20 shadow-xl">Start Prep</button>
                     )}
                     {order.status === 'PREPARING' && (
                       <button onClick={() => updateStatus(order.id, 'READY_FOR_PICKUP')} className="flex-1 bg-green-600 text-white py-5 rounded-[24px] text-[10px] font-black uppercase tracking-widest bouncy-click shadow-green-600/20 shadow-xl">Mark Ready</button>
                     )}
                     <button className="w-16 h-16 bg-slate-50 rounded-[24px] flex items-center justify-center text-slate-300 hover:text-red-500 transition-colors"><X className="w-6 h-6" /></button>
                  </div>
               </div>
             ))}
             {orders.length === 0 && (
                 <div className="text-center py-32 opacity-20 font-black uppercase text-xs tracking-[0.4em] flex flex-col items-center">
                    <Zap className="w-12 h-12 mb-6" />
                    Waiting for tickets
                 </div>
             )}
          </div>
        )}
      </div>

      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[90%] max-w-[420px] bg-white/90 backdrop-blur-2xl h-24 px-12 py-5 flex justify-around items-center rounded-[48px] shadow-2xl border border-white/40">
        <button onClick={() => setActiveTab('orders')} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'orders' ? 'text-slate-900 scale-110' : 'text-slate-300'}`}>
          <ListTodo className="w-7 h-7" />
          <span className="text-[9px] font-black uppercase tracking-widest">Live</span>
        </button>
        <button onClick={() => setActiveTab('menu')} className={`flex flex-col items-center gap-1.5 ${activeTab === 'menu' ? 'text-slate-900' : 'text-slate-300'}`}>
          <UtensilsCrossed className="w-7 h-7" />
          <span className="text-[9px] font-black uppercase tracking-widest">Menu</span>
        </button>
        <button onClick={() => setActiveTab('stats')} className={`flex flex-col items-center gap-1.5 ${activeTab === 'stats' ? 'text-slate-900' : 'text-slate-300'}`}>
          <BarChart className="w-7 h-7" />
          <span className="text-[9px] font-black uppercase tracking-widest">Stats</span>
        </button>
      </div>
    </div>
  );
};

export default RestaurantApp;
