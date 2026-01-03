
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
    <div className="h-full bg-white flex flex-col">
      <div className="px-6 pt-10 pb-5 bg-white border-b border-slate-100">
        <div className="flex justify-between items-center mb-6">
           <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">Kitchen Hub</h1>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Live Orders</p>
           </div>
           <button onClick={() => setIsOpen(!isOpen)} className={`px-4 py-2 rounded-xl border text-[9px] font-black tracking-widest ${isOpen ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
             {isOpen ? 'ONLINE' : 'OFFLINE'}
           </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
           <div className="bg-[#F9F9F9] p-4 rounded-2xl flex flex-col justify-between">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Pending</span>
              <div className="flex items-end justify-between mt-2">
                <span className="text-2xl font-black text-[#E23744]">{pendingCount}</span>
                <Bell className="w-4 h-4 text-[#E23744] animate-pulse" />
              </div>
           </div>
           <div className="bg-[#F9F9F9] p-4 rounded-2xl">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Cooking</span>
              <div className="flex items-end justify-between mt-2">
                <span className="text-2xl font-black text-slate-900">{cookingCount}</span>
                <ChefHat className="w-4 h-4 text-orange-500" />
              </div>
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4 hide-scrollbar pb-24">
         {orders.map(order => (
           <div key={order.id} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-1.5 h-full ${order.status === 'PENDING' ? 'bg-[#E23744]' : 'bg-orange-400'}`}></div>
              <div className="flex justify-between items-start mb-4">
                 <div>
                    <h4 className="font-black text-slate-900 text-sm">Order #{order.id.slice(-4)}</h4>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{order.items.length} Items • ₹{order.totalAmount}</span>
                 </div>
                 <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${order.status === 'PENDING' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'}`}>
                   {order.status}
                 </span>
              </div>
              
              <div className="space-y-1.5 mb-5 bg-[#F9F9F9] p-3 rounded-xl">
                {order.items.map((it: any, i: number) => (
                  <div key={i} className="flex justify-between items-center">
                    <p className="text-[11px] font-bold text-slate-700">{it.quantity}x {it.menuItem.name}</p>
                    {it.menuItem.isVeg && <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />}
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                 {order.status === 'PENDING' && (
                   <button onClick={() => updateStatus(order.id, 'ACCEPTED')} className="flex-1 bg-slate-900 text-white py-3 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg">Accept</button>
                 )}
                 {order.status === 'ACCEPTED' && (
                   <button onClick={() => updateStatus(order.id, 'PREPARING')} className="flex-1 bg-orange-500 text-white py-3 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg">Prepare</button>
                 )}
                 {order.status === 'PREPARING' && (
                   <button onClick={() => updateStatus(order.id, 'READY_FOR_PICKUP')} className="flex-1 bg-green-600 text-white py-3 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg">Ready</button>
                 )}
                 <button className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300"><X className="w-4 h-4" /></button>
              </div>
           </div>
         ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 h-[72px] bg-white/95 backdrop-blur-xl border-t border-slate-100 flex items-center justify-around px-6 z-[200] rounded-t-[32px]">
        <button onClick={() => setActiveTab('orders')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'orders' ? 'text-slate-900' : 'text-slate-300'}`}>
          <ListTodo className="w-5 h-5" />
          <span className="text-[9px] font-black">Live</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-300">
          <UtensilsCrossed className="w-5 h-5" />
          <span className="text-[9px] font-black">Menu</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-300">
          <BarChart className="w-5 h-5" />
          <span className="text-[9px] font-black">Stats</span>
        </button>
      </div>
    </div>
  );
};

export default RestaurantApp;
