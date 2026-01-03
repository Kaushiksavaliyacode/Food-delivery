
import React, { useState } from 'react';
import { 
  Navigation, CheckCircle2, DollarSign, ListTodo, User, ShieldCheck, 
  Camera, Phone, MapPin, ChevronRight, Zap, History, TrendingUp,
  MessageSquare, Star, ArrowLeft, Loader2, Play, Package, 
  Clock, CheckCircle, XCircle, Map as MapIcon, Info
} from 'lucide-react';
import { Order, OrderStatus } from '../types.ts';
import Button from '../components/ui/Button.tsx';
import Badge from '../components/ui/Badge.tsx';

interface Props {
    orders: Order[];
    setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
}

const DeliveryApp: React.FC<Props> = ({ orders, setOrders }) => {
  const [view, setView] = useState<'dashboard' | 'task' | 'history' | 'profile'>('dashboard');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOnline, setIsOnline] = useState(true);

  const availableTasks = orders.filter(o => o.status === OrderStatus.READY_FOR_PICKUP && !o.riderId);
  const myActiveTasks = orders.filter(o => o.riderId === 'current-rider' && o.status !== OrderStatus.DELIVERED);
  const completedTasks = orders.filter(o => o.riderId === 'current-rider' && o.status === OrderStatus.DELIVERED);

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status, riderId: 'current-rider' } : o));
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, status, riderId: 'current-rider' } : null);
    }
  };

  const acceptTask = (order: Order) => {
    updateOrderStatus(order.id, OrderStatus.PICKED_UP);
    setSelectedOrder({ ...order, status: OrderStatus.PICKED_UP, riderId: 'current-rider' });
    setView('task');
  };

  return (
    <div className="h-full bg-[#0F172A] flex flex-col text-slate-200">
      
      {/* Header */}
      <div className="bg-[#1E293B] p-6 pt-10 rounded-b-[32px] border-b border-slate-800">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="font-black text-xl text-white tracking-tight">Rider Central</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
               <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-slate-500'}`} />
               <span className="text-[8px] text-slate-400 uppercase font-black tracking-widest">{isOnline ? 'Ready' : 'Offline'}</span>
            </div>
          </div>
          <button onClick={() => setIsOnline(!isOnline)} className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase border transition-all ${isOnline ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-green-500/10 text-green-500 border-green-500/20'}`}>
            {isOnline ? 'Go Off' : 'Go On'}
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
           <div className="bg-slate-900/50 p-3 rounded-2xl border border-slate-800">
              <span className="text-[8px] font-black text-slate-500 uppercase block mb-0.5">Earnings</span>
              <span className="text-sm font-black text-white">₹1.2k</span>
           </div>
           <div className="bg-slate-900/50 p-3 rounded-2xl border border-slate-800 text-center">
              <span className="text-[8px] font-black text-slate-500 uppercase block mb-0.5">Rating</span>
              <span className="text-sm font-black text-white">4.9 ⭐</span>
           </div>
           <div className="bg-slate-900/50 p-3 rounded-2xl border border-slate-800 text-right">
              <span className="text-[8px] font-black text-slate-500 uppercase block mb-0.5">Trips</span>
              <span className="text-sm font-black text-white">{completedTasks.length}</span>
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 hide-scrollbar pb-24">
        {view === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {myActiveTasks.length > 0 && (
              <section className="space-y-3">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Active Duty</h3>
                {myActiveTasks.map(task => (
                  <div key={task.id} onClick={() => { setSelectedOrder(task); setView('task'); }} className="bg-[#1E293B] rounded-2xl p-4 border border-slate-800 shadow-md">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Navigation className="w-5 h-5 text-orange-500" />
                        <h4 className="font-black text-white text-xs">#{task.id.slice(-5)}</h4>
                      </div>
                      <Badge variant="primary" className="text-[7px]">Active</Badge>
                    </div>
                    <Button variant="primary" fullWidth size="sm" className="bg-orange-500 text-[9px] h-8">Track Location</Button>
                  </div>
                ))}
              </section>
            )}

            <section className="space-y-3">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Available</h3>
              <div className="space-y-3">
                {availableTasks.map(task => (
                  <div key={task.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-blue-400" />
                        <h4 className="font-black text-white text-sm">₹85.00 Payout</h4>
                      </div>
                      <span className="text-[9px] font-black text-slate-500">2.4 km away</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => acceptTask(task)} className="flex-1 bg-white text-slate-900 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest">Accept Duty</button>
                      <button className="w-10 bg-slate-800 rounded-xl flex items-center justify-center text-red-400"><XCircle className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 h-[72px] bg-[#1E293B]/95 backdrop-blur-xl border-t border-slate-800 flex items-center justify-around px-6 z-[200] rounded-t-[32px]">
        <button onClick={() => setView('dashboard')} className={`flex flex-col items-center gap-1 ${view === 'dashboard' ? 'text-blue-400' : 'text-slate-500'}`}>
          <ListTodo className="w-5 h-5" />
          <span className="text-[8px] font-black uppercase">Duty</span>
        </button>
        <button onClick={() => setView('history')} className={`flex flex-col items-center gap-1 ${view === 'history' ? 'text-green-400' : 'text-slate-500'}`}>
          <History className="w-5 h-5" />
          <span className="text-[8px] font-black uppercase">Logs</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-500">
          <User className="w-5 h-5" />
          <span className="text-[8px] font-black uppercase">Me</span>
        </button>
      </div>
    </div>
  );
};

export default DeliveryApp;
