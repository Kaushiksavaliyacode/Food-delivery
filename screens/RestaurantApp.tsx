
import React, { useState, useMemo } from 'react';
import { 
  ChefHat, UtensilsCrossed, Clock, CheckCircle, Bell, 
  Settings, Power, Info, ChevronRight, X, Layout, 
  BarChart, ListTodo, Zap, Store, ArrowLeft
} from 'lucide-react';
import { Order, OrderStatus } from '../types.ts';
import { MOCK_RESTAURANTS } from '../constants.tsx';
import { supabase } from '../supabase.ts';
import Button from '../components/ui/Button.tsx';

interface Props {
    orders: Order[];
}

const RestaurantApp: React.FC<Props> = ({ orders }) => {
  const [managedRestaurantId, setManagedRestaurantId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('orders');
  const [isOpen, setIsOpen] = useState(true);

  const managedRestaurant = useMemo(() => 
    MOCK_RESTAURANTS.find(r => r.id === managedRestaurantId), 
    [managedRestaurantId]
  );

  // Filter orders to ONLY show those belonging to the managed restaurant
  const restaurantOrders = useMemo(() => 
    orders.filter(o => o.restaurantId === managedRestaurantId),
    [orders, managedRestaurantId]
  );

  const updateStatus = async (orderId: string, status: string) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
    if (error) alert("Status update failed: " + error.message);
  };

  const pendingCount = restaurantOrders.filter(o => o.status === OrderStatus.PENDING).length;
  const cookingCount = restaurantOrders.filter(o => o.status === OrderStatus.PREPARING || o.status === OrderStatus.ACCEPTED).length;

  if (!managedRestaurantId) {
    return (
      <div className="h-full bg-[#F8F9FB] flex flex-col p-6 animate-in fade-in duration-500">
        <div className="mt-12 mb-8">
           <h1 className="text-2xl font-black text-slate-900 tracking-tight">Merchant Login</h1>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Select your store to manage</p>
        </div>
        
        <div className="space-y-3">
           {MOCK_RESTAURANTS.map(res => (
             <button 
               key={res.id}
               onClick={() => setManagedRestaurantId(res.id)}
               className="w-full flex items-center gap-4 p-4 bg-white rounded-3xl border border-slate-100 shadow-sm hover:border-[#F36E35]/30 transition-all text-left group"
             >
                <img src={res.image} className="w-12 h-12 rounded-2xl object-cover" />
                <div className="flex-1">
                   <h4 className="text-[12px] font-black text-slate-900">{res.name}</h4>
                   <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">{res.cuisine.join(' • ')}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-200 group-hover:text-[#F36E35]" />
             </button>
           ))}
        </div>

        <div className="mt-auto pt-10 text-center">
           <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-widest">
              <Store className="w-3 h-3" /> Partner Portal 2024
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white flex flex-col text-[11px]">
      <div className="px-6 pt-10 pb-5 bg-white border-b border-slate-50">
        <div className="flex justify-between items-start mb-6">
           <div className="flex items-center gap-3">
              <button onClick={() => setManagedRestaurantId(null)} className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h1 className="text-lg font-black text-slate-900 leading-tight">{managedRestaurant?.name}</h1>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Kitchen Terminal</p>
              </div>
           </div>
           <button onClick={() => setIsOpen(!isOpen)} className={`px-3 py-1.5 rounded-xl border text-[8px] font-black tracking-widest transition-colors ${isOpen ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
             {isOpen ? 'ONLINE' : 'OFFLINE'}
           </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
           <div className="bg-[#F9F9F9] p-3 rounded-2xl border border-slate-50">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">New Orders</span>
              <div className="flex items-end justify-between mt-1">
                <span className={`text-xl font-black ${pendingCount > 0 ? 'text-[#E23744]' : 'text-slate-900'}`}>{pendingCount}</span>
                <Bell className={`w-3.5 h-3.5 ${pendingCount > 0 ? 'text-[#E23744] animate-pulse' : 'text-slate-300'}`} />
              </div>
           </div>
           <div className="bg-[#F9F9F9] p-3 rounded-2xl border border-slate-50">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">In Preparation</span>
              <div className="flex items-end justify-between mt-1">
                <span className="text-xl font-black text-slate-900">{cookingCount}</span>
                <ChefHat className="w-3.5 h-3.5 text-orange-400" />
              </div>
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 hide-scrollbar pb-24 bg-slate-50/30">
         {restaurantOrders.length > 0 ? (
           restaurantOrders.map(order => (
             <div key={order.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 relative overflow-hidden animate-in slide-in-from-bottom-2 duration-300">
                <div className={`absolute top-0 left-0 w-1 h-full ${order.status === OrderStatus.PENDING ? 'bg-[#E23744]' : 'bg-orange-400'}`}></div>
                <div className="flex justify-between items-start mb-3">
                   <div>
                      <h4 className="font-black text-slate-900 text-xs">Order #{order.id.slice(-5)}</h4>
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{order.items.length} Items • ₹{order.totalAmount}</span>
                   </div>
                   <span className={`px-2 py-0.5 rounded-md text-[7px] font-black uppercase tracking-widest ${order.status === OrderStatus.PENDING ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'}`}>
                     {order.status}
                   </span>
                </div>
                
                <div className="space-y-1 mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100/50">
                  {order.items.map((it: any, i: number) => (
                    <div key={i} className="flex justify-between items-center">
                      <p className="text-[10px] font-bold text-slate-700">{it.quantity}x {it.menuItem.name}</p>
                      {it.menuItem.isVeg ? (
                        <div className="w-2 h-2 rounded-full border border-green-600 flex items-center justify-center"><div className="w-1 h-1 bg-green-600 rounded-full" /></div>
                      ) : (
                        <div className="w-2 h-2 rounded-full border border-red-600 flex items-center justify-center"><div className="w-1 h-1 bg-red-600 rounded-full" /></div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                   {order.status === OrderStatus.PENDING && (
                     <button onClick={() => updateStatus(order.id, OrderStatus.ACCEPTED)} className="flex-1 bg-slate-900 text-white py-2.5 rounded-xl text-[8px] font-black uppercase tracking-widest shadow-md active:scale-95 transition-all">Accept Order</button>
                   )}
                   {order.status === OrderStatus.ACCEPTED && (
                     <button onClick={() => updateStatus(order.id, OrderStatus.PREPARING)} className="flex-1 bg-orange-500 text-white py-2.5 rounded-xl text-[8px] font-black uppercase tracking-widest shadow-md active:scale-95 transition-all">Start Cooking</button>
                   )}
                   {order.status === OrderStatus.PREPARING && (
                     <button onClick={() => updateStatus(order.id, OrderStatus.READY_FOR_PICKUP)} className="flex-1 bg-green-600 text-white py-2.5 rounded-xl text-[8px] font-black uppercase tracking-widest shadow-md active:scale-95 transition-all">Mark Ready</button>
                   )}
                   <button className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors"><X className="w-4 h-4" /></button>
                </div>
             </div>
           ))
         ) : (
           <div className="h-full flex flex-col items-center justify-center opacity-30 py-20">
              <ChefHat className="w-12 h-12 mb-3" />
              <p className="font-black text-[10px] uppercase tracking-widest">No active orders</p>
           </div>
         )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 h-14 bg-white/95 backdrop-blur-xl border-t border-slate-50 flex items-center justify-around px-6 z-[200] rounded-t-2xl shadow-lg">
        <button onClick={() => setActiveTab('orders')} className={`flex flex-col items-center gap-0.5 transition-all ${activeTab === 'orders' ? 'text-slate-900' : 'text-slate-300'}`}>
          <ListTodo className="w-4 h-4" />
          <span className="text-[8px] font-black uppercase">Active</span>
        </button>
        <button className="flex flex-col items-center gap-0.5 text-slate-300">
          <UtensilsCrossed className="w-4 h-4" />
          <span className="text-[8px] font-black uppercase">Menu</span>
        </button>
        <button className="flex flex-col items-center gap-0.5 text-slate-300">
          <BarChart className="w-4 h-4" />
          <span className="text-[8px] font-black uppercase">Stats</span>
        </button>
        <button className="flex flex-col items-center gap-0.5 text-slate-300">
          <Settings className="w-4 h-4" />
          <span className="text-[8px] font-black uppercase">Settings</span>
        </button>
      </div>
    </div>
  );
};

export default RestaurantApp;
