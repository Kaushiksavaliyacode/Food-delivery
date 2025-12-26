
import React, { useState, useEffect } from 'react';
import { 
  Navigation, CheckCircle2, DollarSign, ListTodo, User, ShieldCheck, 
  Camera, Phone, MapPin, ChevronRight, Zap, History, TrendingUp,
  MessageSquare, Star, ArrowLeft, Loader2, Play, Package, Clock, X, CheckCircle, Cloud
} from 'lucide-react';
import { OrderStatus } from '../types.ts';
import { db } from '../firebase.ts';
import { collection, onSnapshot, query, updateDoc, doc, orderBy } from 'firebase/firestore';

const DeliveryApp: React.FC = () => {
  const [view, setView] = useState<'dashboard' | 'map' | 'history'>('dashboard');
  const [isOnline, setIsOnline] = useState(true);
  const [activeFilter, setActiveFilter] = useState<OrderStatus | 'ALL'>(OrderStatus.PENDING);
  const [orders, setOrders] = useState<any[]>([]);
  const [trackingOrder, setTrackingOrder] = useState<any | null>(null);

  // Sync Orders from Firestore
  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const liveOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(liveOrders);
    });
    return () => unsubscribe();
  }, []);

  const filteredOrders = orders.filter(o => activeFilter === 'ALL' || o.status === activeFilter);

  const updateStatus = async (id: string, newStatus: OrderStatus) => {
    try {
      await updateDoc(doc(db, "orders", id), { status: newStatus });
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  if (view === 'map' && trackingOrder) return (
    <div className="h-full bg-slate-900 text-white flex flex-col animate-in slide-in-from-bottom duration-500 font-['Plus_Jakarta_Sans']">
      <div className="flex-1 bg-slate-200 relative">
          <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/navigation-day-v1/static/-118.245,34.055,14,0/600x600?access_token=pk.eyJ1IjoibW9ja3VzZXIiLCJhIjoiY2p4eCJ9')] bg-cover" />
          <button onClick={() => setView('dashboard')} className="absolute top-12 left-6 p-4 bg-white rounded-2xl shadow-2xl text-slate-900"><ArrowLeft className="w-6 h-6" /></button>
          <div className="absolute top-12 left-20 right-6 bg-slate-900 p-6 rounded-[32px] text-white flex items-center gap-4 shadow-2xl border border-white/10">
             <Navigation className="w-8 h-8 text-orange-500 animate-pulse" />
             <div>
                <h3 className="font-black text-sm">Target: {trackingOrder.deliveryLocation?.address}</h3>
                <p className="text-[8px] text-slate-400 uppercase tracking-widest font-black">{trackingOrder.customerName} • Live Location Tracking</p>
             </div>
          </div>
      </div>
      <div className="h-[35%] bg-white rounded-t-[48px] p-10 -mt-12 relative z-10 shadow-2xl">
         <div className="flex justify-between items-center mb-10">
            <div>
               <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Customer Delivery</p>
               <h2 className="text-2xl font-black text-slate-900 tracking-tight">{trackingOrder.customerName}</h2>
            </div>
            <div className="flex gap-3">
               <button className="bg-slate-50 p-4 rounded-2xl border text-slate-600 shadow-sm"><Phone className="w-6 h-6" /></button>
            </div>
         </div>
         <button onClick={() => { updateStatus(trackingOrder.id, OrderStatus.DELIVERED); setView('dashboard'); }} className="w-full bg-green-600 text-white py-6 rounded-[28px] font-black text-xs uppercase tracking-widest shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3">
            <CheckCircle2 className="w-5 h-5" /> Confirm Delivered
         </button>
      </div>
    </div>
  );

  return (
    <div className="h-full bg-slate-50 flex flex-col font-['Plus_Jakarta_Sans']">
      
      {/* Header Profile */}
      <div className="p-8 bg-slate-900 text-white rounded-b-[48px] shadow-2xl relative">
        <div className="flex justify-between items-center mb-10">
           <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white/20">
                 <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=RiderGondal" className="w-full h-full object-cover" />
              </div>
              <div>
                 <div className="flex items-center gap-2">
                    <h2 className="font-black text-lg">Gondal Fleet</h2>
                    <Cloud className="w-4 h-4 text-blue-400" />
                 </div>
                 <p className={`text-[8px] font-black uppercase tracking-widest ${isOnline ? 'text-green-400' : 'text-slate-400'}`}>
                    {isOnline ? 'Online • Live Cloud Sync' : 'Offline'}
                 </p>
              </div>
           </div>
           <button onClick={() => setIsOnline(!isOnline)} className={`px-4 py-2 rounded-xl text-[9px] font-black border transition-all ${isOnline ? 'bg-red-500/10 border-red-500/30 text-red-500' : 'bg-green-500 text-slate-900 border-transparent'}`}>
              {isOnline ? 'GO OFFLINE' : 'GO ONLINE'}
           </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
           <div className="bg-white/5 p-5 rounded-3xl border border-white/10 backdrop-blur-md">
              <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">Active Duties</p>
              <p className="text-xl font-black mt-1">{orders.filter(o => o.status === OrderStatus.ON_WAY).length}</p>
           </div>
           <div className="bg-white/5 p-5 rounded-3xl border border-white/10 backdrop-blur-md">
              <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">Global Queue</p>
              <p className="text-xl font-black mt-1">{orders.filter(o => o.status === OrderStatus.PENDING).length}</p>
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar pb-32">
         
         {/* Status Filters */}
         <div className="flex gap-3 overflow-x-auto hide-scrollbar py-2">
            {[OrderStatus.PENDING, OrderStatus.ON_WAY, OrderStatus.DELIVERED, OrderStatus.CANCELLED].map(status => (
              <button 
                key={status}
                onClick={() => setActiveFilter(status)}
                className={`flex-shrink-0 px-5 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest border transition-all ${activeFilter === status ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-400 border-slate-100'}`}
              >
                {status}
              </button>
            ))}
         </div>

         <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="py-20 text-center">
                 <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 opacity-50"><Package className="w-8 h-8 text-slate-300" /></div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No active cloud orders</p>
              </div>
            ) : (
              filteredOrders.map(order => (
                <div key={order.id} className="bg-white p-6 rounded-[36px] border border-slate-100 shadow-sm group">
                   <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                         <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-[10px] border">#{order.id.slice(0,3)}</div>
                         <div>
                            <h4 className="font-black text-sm text-slate-900">{order.customerName}</h4>
                            <p className="text-[9px] font-bold text-slate-400 truncate max-w-[150px]">{order.deliveryLocation?.address}</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-sm font-black text-slate-900">₹{order.totalAmount}</p>
                         <p className="text-[9px] font-black text-slate-300 uppercase mt-1">Gondal Hub</p>
                      </div>
                   </div>
                   <div className="bg-slate-50 p-4 rounded-2xl mb-6 border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-500">
                        {order.items?.map((i:any) => `${i.qty}x ${i.name}`).join(', ')}
                      </p>
                   </div>
                   <div className="flex gap-2">
                      {order.status === OrderStatus.PENDING && (
                        <button onClick={() => updateStatus(order.id, OrderStatus.ON_WAY)} className="flex-1 bg-slate-900 text-white py-4 rounded-2xl text-[10px] font-black uppercase shadow-xl active:scale-95 transition-all">Accept Duty</button>
                      )}
                      {order.status === OrderStatus.ON_WAY && (
                        <button onClick={() => { setTrackingOrder(order); setView('map'); }} className="flex-1 bg-orange-600 text-white py-4 rounded-2xl text-[10px] font-black uppercase flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all">
                           <Navigation className="w-4 h-4" /> Track Customer
                        </button>
                      )}
                      {order.status === OrderStatus.DELIVERED && (
                        <div className="flex-1 bg-green-50 text-green-600 py-4 rounded-2xl text-[10px] font-black uppercase text-center border border-green-100 flex items-center justify-center gap-2">
                           <CheckCircle className="w-4 h-4" /> Order Fulfilled
                        </div>
                      )}
                   </div>
                </div>
              ))
            )}
         </div>
      </div>

      {/* Footer Nav */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-[420px] bg-white/80 backdrop-blur-2xl px-12 py-5 flex justify-between items-center z-[100] shadow-2xl rounded-[36px] border">
        <button className="flex flex-col items-center gap-1.5 text-slate-900">
           <ListTodo className="w-6 h-6" />
           <span className="text-[8px] font-black uppercase tracking-widest">Tasks</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 text-slate-300">
           <TrendingUp className="w-6 h-6" />
           <span className="text-[8px] font-black uppercase tracking-widest">Fleet</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 text-slate-300">
           <User className="w-6 h-6" />
           <span className="text-[8px] font-black uppercase tracking-widest">Profile</span>
        </button>
      </div>
    </div>
  );
};

export default DeliveryApp;
