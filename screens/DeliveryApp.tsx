
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

  // Filter orders
  const availableTasks = orders.filter(o => o.status === OrderStatus.READY_FOR_PICKUP && !o.riderId);
  const takenByOthers = orders.filter(o => o.riderId && o.riderId !== 'current-rider' && o.status !== OrderStatus.DELIVERED);
  const myActiveTasks = orders.filter(o => o.riderId === 'current-rider' && o.status !== OrderStatus.DELIVERED);
  const completedTasks = orders.filter(o => o.riderId === 'current-rider' && o.status === OrderStatus.DELIVERED);

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status, riderId: 'current-rider' } : o));
    // If we're updating the status of the currently selected order, update the local ref
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, status, riderId: 'current-rider' } : null);
    }
  };

  const acceptTask = (order: Order) => {
    updateOrderStatus(order.id, OrderStatus.PICKED_UP);
    setSelectedOrder({ ...order, status: OrderStatus.PICKED_UP, riderId: 'current-rider' });
    setView('task');
  };

  const rejectTask = (orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: OrderStatus.CANCELLED } : o));
  };

  const StatusIcon = ({ status }: { status: OrderStatus }) => {
    switch (status) {
      case OrderStatus.PENDING: return <Clock className="w-4 h-4 text-amber-500" />;
      case OrderStatus.PICKED_UP: return <Package className="w-4 h-4 text-blue-500" />;
      case OrderStatus.ARRIVING: return <Navigation className="w-4 h-4 text-purple-500" />;
      case OrderStatus.DELIVERED: return <CheckCircle className="w-4 h-4 text-green-500" />;
      case OrderStatus.CANCELLED: return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Info className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="h-full bg-[#0F172A] flex flex-col font-['Plus_Jakarta_Sans'] text-slate-200">
      
      {/* Header */}
      <div className="bg-[#1E293B] p-8 pt-12 rounded-b-[48px] shadow-2xl relative border-b border-slate-800">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="font-black text-2xl text-white tracking-tight">Rider Central</h2>
            <div className="flex items-center gap-2 mt-1">
               <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-slate-500'}`} />
               <span className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em]">{isOnline ? 'Ready for duty' : 'Offline'}</span>
            </div>
          </div>
          <button 
            onClick={() => setIsOnline(!isOnline)}
            className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${isOnline ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}
          >
            {isOnline ? 'Go Offline' : 'Go Online'}
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
           <div className="bg-slate-900/50 p-4 rounded-3xl border border-slate-800">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Earnings</span>
              <span className="text-lg font-black text-white">₹1,240</span>
           </div>
           <div className="bg-slate-900/50 p-4 rounded-3xl border border-slate-800">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Rating</span>
              <div className="flex items-center gap-1">
                <span className="text-lg font-black text-white">4.9</span>
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              </div>
           </div>
           <div className="bg-slate-900/50 p-4 rounded-3xl border border-slate-800">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Trips</span>
              <span className="text-lg font-black text-white">{completedTasks.length}</span>
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 hide-scrollbar">
        
        {/* DASHBOARD VIEW */}
        {view === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* My Active Duty */}
            {myActiveTasks.length > 0 && (
              <section className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500 px-2">Active Duty</h3>
                {myActiveTasks.map(task => (
                  <div 
                    key={task.id} 
                    onClick={() => { setSelectedOrder(task); setView('task'); }}
                    className="bg-[#1E293B] rounded-[32px] p-6 border border-slate-800 shadow-xl relative overflow-hidden group cursor-pointer active:scale-95 transition-all"
                  >
                    <div className="absolute top-0 right-0 p-4">
                      <Badge variant="primary" pulse>Active</Badge>
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center">
                        <Navigation className="w-6 h-6 text-orange-500" />
                      </div>
                      <div>
                        <h4 className="font-black text-white">Order #{task.id.slice(0, 5)}</h4>
                        <p className="text-[10px] font-bold text-slate-500">{task.items.length} Items • {task.deliveryLocation.address}</p>
                      </div>
                    </div>
                    <Button variant="primary" fullWidth size="sm" className="bg-orange-500">Resume Tracking</Button>
                  </div>
                ))}
              </section>
            )}

            {/* Available Tasks */}
            <section className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500 px-2">New Opportunities</h3>
              <div className="space-y-4">
                {availableTasks.map(task => (
                  <div key={task.id} className="bg-slate-900 border border-slate-800 rounded-[32px] p-6 shadow-lg group hover:border-blue-500/50 transition-all">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center"><Package className="w-5 h-5 text-blue-400" /></div>
                        <div>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Available Now</p>
                          <h4 className="font-black text-white text-lg tracking-tight">₹85.00 Payout</h4>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Distance</p>
                        <p className="text-sm font-black text-white">2.4 km</p>
                      </div>
                    </div>
                    <div className="space-y-3 mb-6 bg-[#1E293B] p-4 rounded-2xl border border-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                        <p className="text-[11px] font-bold text-slate-300">Pickup: Dreamland Hotel</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                        <p className="text-[11px] font-bold text-slate-300 truncate">Drop: {task.deliveryLocation.address}</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => acceptTask(task)} className="flex-1 bg-white text-slate-900 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest bouncy-click">Accept Duty</button>
                      <button onClick={() => rejectTask(task.id)} className="w-14 bg-slate-800 rounded-2xl flex items-center justify-center text-red-400 hover:bg-red-400/10 transition-colors"><XCircle className="w-6 h-6" /></button>
                    </div>
                  </div>
                ))}
                
                {/* Taken by others */}
                {takenByOthers.map(task => (
                  <div key={task.id} className="bg-slate-900/30 border border-dashed border-slate-800 rounded-[32px] p-6 opacity-60 grayscale">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Order #{task.id.slice(0, 5)}</span>
                      <Badge variant="neutral">Taken</Badge>
                    </div>
                    <p className="text-[11px] font-bold text-slate-500">This order has been picked up by another rider.</p>
                  </div>
                ))}

                {availableTasks.length === 0 && takenByOthers.length === 0 && (
                  <div className="py-20 text-center flex flex-col items-center">
                    <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 animate-pulse">
                      <Zap className="w-8 h-8 text-slate-600" />
                    </div>
                    <p className="text-xs font-black text-slate-600 uppercase tracking-[0.4em]">Searching for orders...</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {/* TASK DETAIL / LIVE TRACKING VIEW */}
        {view === 'task' && selectedOrder && (
          <div className="animate-in slide-in-from-right duration-500 flex flex-col gap-6">
            <button onClick={() => setView('dashboard')} className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest mb-2">
              <ArrowLeft className="w-4 h-4" /> Back to List
            </button>

            {/* Simulated Live Map */}
            <div className="h-64 bg-slate-800 rounded-[40px] relative overflow-hidden border border-slate-700 shadow-2xl">
               <div className="absolute inset-0 opacity-20">
                 <div className="w-full h-full bg-[radial-gradient(#ffffff22_1px,transparent_1px)] [background-size:20px_20px]" />
               </div>
               {/* Grid Map Background Simulation */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                     {/* Rider Icon */}
                     <div className="absolute top-10 left-10 animate-float">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                          <Navigation className="w-4 h-4 text-white rotate-45" />
                        </div>
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-1 bg-blue-500/30 blur-sm rounded-full" />
                     </div>
                     {/* Customer Icon */}
                     <div className="absolute -top-10 -right-10">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg animate-pulse">
                          <MapPin className="w-5 h-5 text-white" />
                        </div>
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-center">
                           <p className="text-[10px] font-black text-green-400 bg-slate-900/80 px-2 py-0.5 rounded-full backdrop-blur-md">Customer</p>
                        </div>
                     </div>
                     {/* Path Simulation */}
                     <svg className="w-40 h-40 overflow-visible" viewBox="0 0 100 100">
                        <path d="M 10 10 L 50 10 L 50 80 L 90 80" stroke="white" strokeWidth="2" strokeDasharray="4 4" fill="none" className="opacity-10" />
                        <circle cx="10" cy="10" r="3" fill="blue" className="opacity-50" />
                        <circle cx="90" cy="80" r="3" fill="green" className="opacity-50" />
                     </svg>
                  </div>
               </div>
               <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between bg-slate-900/90 backdrop-blur-md p-4 rounded-3xl border border-white/10 shadow-xl">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center"><Navigation className="w-4 h-4 text-blue-400" /></div>
                     <span className="text-[11px] font-black text-white uppercase tracking-widest">Live Nav Active</span>
                  </div>
                  <span className="text-xl font-black text-white">4 min</span>
               </div>
            </div>

            {/* Task Info */}
            <div className="bg-[#1E293B] rounded-[40px] p-8 border border-slate-800 shadow-xl">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight">Delivery Details</h3>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-1">ID: {selectedOrder.id}</p>
                </div>
                <div className="flex gap-2">
                  <button className="w-12 h-12 bg-blue-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 active:scale-90 transition-all"><Phone className="w-5 h-5" /></button>
                  <button className="w-12 h-12 bg-slate-800 text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-all"><MessageSquare className="w-5 h-5" /></button>
                </div>
              </div>

              <div className="space-y-6 mb-8">
                 <div className="flex gap-4">
                    <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center flex-shrink-0 border border-slate-800"><MapPin className="w-5 h-5 text-slate-500" /></div>
                    <div>
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Drop Point</p>
                       <p className="text-sm font-black text-white leading-relaxed">{selectedOrder.deliveryLocation.address}</p>
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center flex-shrink-0 border border-slate-800"><Package className="w-5 h-5 text-slate-500" /></div>
                    <div>
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Consignment</p>
                       <p className="text-sm font-black text-white leading-relaxed">{selectedOrder.items.length} Food Packages</p>
                    </div>
                 </div>
              </div>

              <div className="space-y-4">
                 {selectedOrder.status === OrderStatus.PICKED_UP && (
                   <Button 
                    variant="primary" 
                    fullWidth 
                    size="xl" 
                    className="bg-purple-600 hover:bg-purple-700 shadow-purple-500/20"
                    onClick={() => updateOrderStatus(selectedOrder.id, OrderStatus.ARRIVING)}
                    leftIcon={<Play className="w-5 h-5 fill-current" />}
                  >
                    Start Out for Delivery
                  </Button>
                 )}
                 {selectedOrder.status === OrderStatus.ARRIVING && (
                   <Button 
                    variant="primary" 
                    fullWidth 
                    size="xl" 
                    className="bg-green-600 hover:bg-green-700 shadow-green-500/20"
                    onClick={() => { updateOrderStatus(selectedOrder.id, OrderStatus.DELIVERED); setView('history'); }}
                    leftIcon={<CheckCircle2 className="w-5 h-5" />}
                  >
                    Confirm Delivery
                  </Button>
                 )}
              </div>
            </div>
          </div>
        )}

        {/* HISTORY VIEW */}
        {view === 'history' && (
          <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-6">
            <h3 className="text-2xl font-black text-white tracking-tight px-2">History</h3>
            <div className="space-y-4 pb-20">
              {completedTasks.length > 0 ? completedTasks.map(task => (
                <div key={task.id} className="bg-slate-900 border border-slate-800 rounded-[32px] p-6 flex justify-between items-center group">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center"><CheckCircle className="w-6 h-6 text-green-500" /></div>
                      <div>
                         <h4 className="font-black text-white">₹85.00 Earned</h4>
                         <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Order ID: {task.id.slice(0, 5)}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Completed</p>
                      <p className="text-[10px] font-black text-slate-500">{new Date(task.timestamp).toLocaleTimeString()}</p>
                   </div>
                </div>
              )) : (
                <div className="py-20 text-center opacity-20 flex flex-col items-center">
                  <History className="w-16 h-16 mb-6" />
                  <p className="font-black uppercase text-xs">No records found</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Bar */}
      <div className="bg-[#1E293B]/80 backdrop-blur-2xl border-t border-slate-800 px-10 py-6 flex justify-around items-center rounded-t-[48px] shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-50 fixed bottom-0 left-0 right-0 sm:static">
        <button 
          onClick={() => setView('dashboard')}
          className={`flex flex-col items-center gap-2 transition-all ${view === 'dashboard' ? 'text-blue-400 scale-110' : 'text-slate-500'}`}
        >
          <div className={`p-2 rounded-xl ${view === 'dashboard' ? 'bg-blue-400/10' : ''}`}><ListTodo className="w-6 h-6" /></div>
          <span className="text-[8px] font-black uppercase tracking-[0.2em]">Live Duty</span>
        </button>
        <button 
          onClick={() => setView('history')}
          className={`flex flex-col items-center gap-2 transition-all ${view === 'history' ? 'text-green-400 scale-110' : 'text-slate-500'}`}
        >
          <div className={`p-2 rounded-xl ${view === 'history' ? 'bg-green-400/10' : ''}`}><History className="w-6 h-6" /></div>
          <span className="text-[8px] font-black uppercase tracking-[0.2em]">Logs</span>
        </button>
        <button className="flex flex-col items-center gap-2 text-slate-500">
          <div className="p-2 rounded-xl"><TrendingUp className="w-6 h-6" /></div>
          <span className="text-[8px] font-black uppercase tracking-[0.2em]">Payer</span>
        </button>
        <button className="flex flex-col items-center gap-2 text-slate-500">
          <div className="p-2 rounded-xl"><User className="w-6 h-6" /></div>
          <span className="text-[8px] font-black uppercase tracking-[0.2em]">Me</span>
        </button>
      </div>
    </div>
  );
};

export default DeliveryApp;
