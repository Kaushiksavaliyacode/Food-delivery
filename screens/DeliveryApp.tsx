import React, { useState, useEffect } from 'react';
import { 
  Navigation, CheckCircle2, DollarSign, ListTodo, User, ShieldCheck, 
  Camera, Phone, MapPin, ChevronRight, Zap, History, TrendingUp,
  MessageSquare, Star, ArrowLeft, Loader2, Play
} from 'lucide-react';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase.ts';
import { Order, OrderStatus } from '../types.ts';

const DeliveryApp: React.FC = () => {
  const [view, setView] = useState<'kyc' | 'dashboard' | 'task'>('dashboard');
  const [isOnline, setIsOnline] = useState(true);
  const [tasks, setTasks] = useState<Order[]>([]);

  useEffect(() => {
    // Listen for orders ready for pickup
    const q = query(collection(db, 'orders'), where('status', '==', OrderStatus.READY_FOR_PICKUP));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      setTasks(orders);
    });
    return () => unsubscribe();
  }, []);

  const acceptTask = async (orderId: string) => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      await updateDoc(doc(db, 'orders', orderId), { 
        riderId: user.uid, 
        status: OrderStatus.PICKED_UP 
      });
      setView('task');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="h-full bg-slate-50 flex flex-col font-['Plus_Jakarta_Sans']">
      <div className="bg-slate-900 text-white p-10 pb-20 rounded-b-[56px] shadow-2xl relative">
        <h2 className="font-black text-xl">Rider Dashboard</h2>
        <div className="flex items-center gap-2 mt-2">
           <div className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-slate-500'}`} />
           <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest">{isOnline ? 'Online' : 'Offline'}</span>
        </div>
      </div>

      <div className="flex-1 p-10 pt-20 space-y-8 overflow-y-auto">
         {tasks.length > 0 ? (
           <div className="space-y-4">
              <h3 className="text-2xl font-black text-slate-900">New Opportunities</h3>
              {tasks.map(task => (
                <div key={task.id} className="bg-white rounded-[32px] p-8 shadow-xl border">
                   <div className="flex justify-between items-center mb-6">
                      <span className="bg-orange-600 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase">₹85 Pickup</span>
                      <p className="text-[10px] text-slate-300 font-black uppercase">Order #{task.id.slice(-4).toUpperCase()}</p>
                   </div>
                   <h4 className="font-black text-lg mb-8">Dreamland Hotel</h4>
                   <button onClick={() => acceptTask(task.id)} className="w-full bg-slate-900 text-white py-5 rounded-[24px] font-black uppercase text-xs">Accept Duty</button>
                </div>
              ))}
           </div>
         ) : (
           <div className="flex flex-col items-center justify-center pt-20 text-slate-300">
             <Zap className="w-16 h-16 mb-6" />
             <p className="font-black uppercase text-xs">Waiting for new orders...</p>
           </div>
         )}
      </div>

      <div className="bg-white border-t px-12 py-6 flex justify-between items-center rounded-t-[48px] shadow-2xl">
        <button className="text-slate-900 flex flex-col items-center gap-1">
          <ListTodo className="w-6 h-6" />
          <span className="text-[8px] font-black uppercase">Queue</span>
        </button>
        <button className="text-slate-300 flex flex-col items-center gap-1">
          <TrendingUp className="w-6 h-6" />
          <span className="text-[8px] font-black uppercase">Earnings</span>
        </button>
      </div>
    </div>
  );
};

export default DeliveryApp;