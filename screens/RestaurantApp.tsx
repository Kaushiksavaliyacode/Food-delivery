import React, { useState, useEffect } from 'react';
import { 
  Package, TrendingUp, Settings, Power, Star, Bell, 
  ChefHat, CheckCircle, UtensilsCrossed, Plus, Edit3, Loader2, Clock,
  ArrowLeft, Camera, Phone, X, Trash2
} from 'lucide-react';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase.ts';
import { Order, OrderStatus } from '../types.ts';

const RestaurantApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [isOpen, setIsOpen] = useState(true);
  const [liveOrders, setLiveOrders] = useState<Order[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'orders'), where('restaurantId', '==', 'r1'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      setLiveOrders(orders.sort((a,b) => b.timestamp - a.timestamp));
    });
    return () => unsubscribe();
  }, []);

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="h-full bg-slate-50 flex flex-col font-['Plus_Jakarta_Sans']">
      <div className="p-8 bg-white border-b rounded-b-[40px] shadow-sm">
        <h1 className="text-2xl font-black text-slate-900">Restaurant Hub</h1>
        <div className="flex gap-4 mt-6">
           <div className="flex-1 bg-slate-50 p-4 rounded-3xl border border-slate-100">
              <p className="text-[8px] font-black text-slate-400 uppercase">Live Orders</p>
              <p className="text-xl font-black text-slate-900">{liveOrders.length}</p>
           </div>
           <button onClick={() => setIsOpen(!isOpen)} className={`px-6 py-3 rounded-2xl border-2 font-black text-[9px] uppercase tracking-widest ${isOpen ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
             {isOpen ? 'OPEN' : 'CLOSED'}
           </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {activeTab === 'orders' && (
          <div className="space-y-4 animate-in slide-in-from-bottom duration-500">
             {liveOrders.map(order => (
               <div key={order.id} className="bg-white rounded-[32px] p-6 shadow-sm border">
                  <div className="flex justify-between items-start mb-4">
                     <div>
                        <h4 className="font-black text-slate-900 text-sm">Order #{order.id.slice(-4).toUpperCase()}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${order.status === 'PENDING' ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-orange-50 text-orange-600'}`}>
                          {order.status}
                        </span>
                     </div>
                     <span className="text-sm font-black text-slate-900">₹{order.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="space-y-1 mb-6">
                    {order.items.map((it: any, i: number) => (
                      <p key={i} className="text-[10px] text-slate-500">{it.quantity}x {it.menuItem.name}</p>
                    ))}
                  </div>
                  <div className="flex gap-2">
                     {order.status === OrderStatus.PENDING && (
                       <button onClick={() => updateStatus(order.id, OrderStatus.ACCEPTED)} className="flex-1 bg-slate-900 text-white py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest">Accept Order</button>
                     )}
                     {order.status === OrderStatus.ACCEPTED && (
                       <button onClick={() => updateStatus(order.id, OrderStatus.PREPARING)} className="flex-1 bg-orange-500 text-white py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest">Mark Preparing</button>
                     )}
                     {order.status === OrderStatus.PREPARING && (
                       <button onClick={() => updateStatus(order.id, OrderStatus.READY_FOR_PICKUP)} className="flex-1 bg-green-500 text-white py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest">Ready for Pickup</button>
                     )}
                  </div>
               </div>
             ))}
          </div>
        )}
      </div>

      <div className="bg-white border-t px-12 py-5 flex justify-around items-center rounded-t-[40px] shadow-2xl">
        <button onClick={() => setActiveTab('orders')} className={`flex flex-col items-center gap-1.5 ${activeTab === 'orders' ? 'text-slate-900' : 'text-slate-300'}`}>
          <Clock className="w-5 h-5" />
          <span className="text-[8px] font-black uppercase">Active</span>
        </button>
        <button onClick={() => setActiveTab('menu')} className={`flex flex-col items-center gap-1.5 ${activeTab === 'menu' ? 'text-slate-900' : 'text-slate-300'}`}>
          <UtensilsCrossed className="w-5 h-5" />
          <span className="text-[8px] font-black uppercase">Menu</span>
        </button>
      </div>
    </div>
  );
};

export default RestaurantApp;