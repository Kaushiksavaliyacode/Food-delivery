
import React, { useState, useMemo } from 'react';
import { 
  Navigation, CheckCircle2, DollarSign, ListTodo, User, ShieldCheck, 
  MapPin, ChevronRight, Zap, History, Bike, 
  Package, Clock, XCircle, Info, Bell,
  Phone, MessageSquare, ArrowLeft
} from 'lucide-react';
import { Order, OrderStatus } from '../types.ts';
import Badge from '../components/ui/Badge.tsx';
import { supabase } from '../supabase.ts';

interface Props {
    orders: Order[];
    setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
}

const DeliveryApp: React.FC<Props> = ({ orders, setOrders }) => {
  const [view, setView] = useState<'duty' | 'logs' | 'earnings' | 'task_details'>('duty');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);

  const availableTasks = useMemo(() => orders.filter(o => o.status === OrderStatus.READY_FOR_PICKUP && !o.riderId), [orders]);
  const myActiveTask = useMemo(() => orders.find(o => o.riderId === 'current-rider' && o.status !== OrderStatus.DELIVERED), [orders]);
  const completedTasks = useMemo(() => orders.filter(o => o.riderId === 'current-rider' && o.status === OrderStatus.DELIVERED), [orders]);

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    const { error } = await supabase.from('orders').update({ 
      status, 
      rider_id: 'current-rider' 
    }).eq('id', orderId);
    
    if (error) alert("Logistics Error: " + error.message);
  };

  const acceptTask = (order: Order) => {
    updateOrderStatus(order.id, OrderStatus.PICKED_UP);
    setSelectedOrderId(order.id);
    setView('task_details');
  };

  const NavItem = ({ id, label, icon: Icon }: any) => (
    <button onClick={() => setView(id)} className={`flex flex-col items-center gap-1 transition-all ${view === id ? 'text-blue-500' : 'text-slate-500'}`}>
      <div className={`p-2.5 rounded-2xl transition-all ${view === id ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'hover:bg-slate-100'}`}><Icon className="w-5 h-5" /></div>
      <span className="text-[7px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );

  return (
    <div className="h-full bg-[#F8F9FB] flex flex-col text-slate-900 font-['Plus_Jakarta_Sans']">
      
      {/* Header */}
      <div className="bg-slate-900 px-6 pt-12 pb-8 rounded-b-[48px] shadow-2xl relative overflow-hidden">
        <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
        
        <div className="flex justify-between items-center relative z-10 mb-6">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                <Bike className="w-6 h-6 text-blue-400" />
             </div>
             <div>
                <h2 className="font-black text-xl text-white tracking-tight italic">Rider Pro.</h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                   <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-slate-600'}`} />
                   <span className="text-[8px] text-white/40 uppercase font-black tracking-widest">{isOnline ? 'Active on Field' : 'Offline'}</span>
                </div>
             </div>
          </div>
          <button onClick={() => setIsOnline(!isOnline)} className={`w-12 h-6 rounded-full relative transition-all ${isOnline ? 'bg-blue-500' : 'bg-slate-700'}`}>
             <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isOnline ? 'left-7' : 'left-1'}`}></div>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 relative z-10">
           <div className="bg-white/5 backdrop-blur-md p-4 rounded-3xl border border-white/10">
              <span className="text-[7px] font-black text-white/30 uppercase tracking-[0.2em] block mb-1">Today's Pay</span>
              <span className="text-xl font-black text-white">₹1,240</span>
           </div>
           <div className="bg-white/5 backdrop-blur-md p-4 rounded-3xl border border-white/10">
              <span className="text-[7px] font-black text-white/30 uppercase tracking-[0.2em] block mb-1">Success Rate</span>
              <span className="text-xl font-black text-white">98%</span>
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 hide-scrollbar pb-24">
        {view === 'duty' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            {myActiveTask ? (
              <section className="space-y-3">
                <div className="flex items-center justify-between px-2">
                   <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-400">Current Mission</h3>
                   <Badge variant="primary" pulse className="text-[7px]">In Progress</Badge>
                </div>
                <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-xl shadow-slate-200/50">
                   <div className="flex gap-4 items-start mb-6">
                      <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                         <Package className="w-6 h-6 text-blue-500" />
                      </div>
                      <div className="min-w-0">
                         <h4 className="font-black text-slate-900 text-sm">Order #{myActiveTask.id.slice(-6)}</h4>
                         <p className="text-[10px] text-slate-400 font-bold uppercase truncate mt-0.5">{myActiveTask.deliveryLocation.address}</p>
                      </div>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => updateOrderStatus(myActiveTask.id, OrderStatus.DELIVERED)}
                        className="bg-blue-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
                      >
                         Complete Drop
                      </button>
                      <button className="bg-slate-50 text-slate-900 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-slate-100 flex items-center justify-center gap-2">
                         <Navigation className="w-3 h-3" /> Map
                      </button>
                   </div>
                </div>
              </section>
            ) : (
              <section className="space-y-4">
                <div className="flex items-center justify-between px-2">
                   <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-400">Available Pickups</h3>
                   <span className="text-[8px] font-black text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">{availableTasks.length} Near You</span>
                </div>
                
                <div className="space-y-3">
                  {availableTasks.map(task => (
                    <div key={task.id} className="bg-white border border-slate-100 rounded-[32px] p-5 shadow-sm hover:shadow-md transition-all">
                       <div className="flex justify-between items-start mb-4">
                          <div className="flex gap-3">
                             <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400"><Clock className="w-5 h-5" /></div>
                             <div>
                                <h4 className="text-xs font-black">₹{Math.floor(task.totalAmount * 0.15)} Payout</h4>
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">2.4 km • Est 12 mins</p>
                             </div>
                          </div>
                          <Badge variant="neutral" className="text-[6px]">Express</Badge>
                       </div>
                       <button 
                         onClick={() => acceptTask(task)}
                         disabled={!isOnline}
                         className="w-full bg-slate-900 text-white py-3.5 rounded-2xl font-black text-[9px] uppercase tracking-widest shadow-xl active:scale-95 transition-all disabled:opacity-50"
                       >
                         Start Duty
                       </button>
                    </div>
                  ))}

                  {availableTasks.length === 0 && (
                    <div className="py-20 text-center opacity-30 flex flex-col items-center">
                       <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4"><Zap className="w-8 h-8" /></div>
                       <p className="font-black text-[10px] uppercase tracking-[0.2em]">Searching for tasks...</p>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>
        )}

        {view === 'logs' && (
          <div className="space-y-3 animate-in slide-in-from-right-4 duration-500">
             <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-2">Delivery Logs</h3>
             {completedTasks.map(task => (
               <div key={task.id} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center text-green-500"><CheckCircle2 className="w-4 h-4" /></div>
                     <div>
                        <p className="text-[10px] font-black">#{task.id.slice(-6)}</p>
                        <p className="text-[8px] text-slate-400 font-bold uppercase">{new Date(task.timestamp).toLocaleTimeString()}</p>
                     </div>
                  </div>
                  <span className="text-[10px] font-black text-slate-900">+₹45.00</span>
               </div>
             ))}
             {completedTasks.length === 0 && (
                <div className="py-20 text-center opacity-20"><History className="w-12 h-12 mx-auto mb-2" /><p className="font-black text-[10px] uppercase tracking-widest">No logs yet</p></div>
             )}
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 h-20 bg-white/95 backdrop-blur-xl border-t border-slate-100 flex items-center justify-around px-8 z-[200] rounded-t-[40px] shadow-2xl">
        <NavItem id="duty" label="Duty" icon={ListTodo} />
        <NavItem id="logs" label="History" icon={History} />
        <NavItem id="earnings" label="Wallet" icon={DollarSign} />
        <NavItem id="profile" label="Rider" icon={User} />
      </div>
    </div>
  );
};

export default DeliveryApp;
