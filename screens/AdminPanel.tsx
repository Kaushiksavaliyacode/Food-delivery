
import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Store, Bike, AlertCircle, DollarSign, Users, ShieldCheck, 
  Map, ArrowUpRight, TrendingUp, Globe, Zap, Search, Bell, Settings,
  LayoutDashboard, Utensils, Plus, Trash2, Edit3, Camera, X, CheckCircle2,
  Navigation, ChevronRight, Cloud, Phone, MapPin, User, Package, Clock
} from 'lucide-react';
import { MOCK_RESTAURANTS, CATEGORIES } from '../constants.tsx';
import { OrderStatus, MenuItem } from '../types.ts';
import { db } from '../firebase.ts';
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'catalogue' | 'orders'>('dashboard');
  const [showAddItem, setShowAddItem] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [liveOrders, setLiveOrders] = useState<any[]>([]);

  // Sync Menu from Firestore
  useEffect(() => {
    const q = query(collection(db, "menu"), orderBy("name", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem));
      setMenuItems(items);
    });
    return () => unsubscribe();
  }, []);

  // Sync Orders from Firestore
  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLiveOrders(orders);
    });
    return () => unsubscribe();
  }, []);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const newItem = {
      name: formData.get('name') as string,
      price: parseFloat(formData.get('price') as string),
      category: formData.get('category') as string,
      description: 'Added via Admin Hub.',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=300',
      isVeg: true,
      available: true
    };

    try {
      await addDoc(collection(db, "menu"), newItem);
      setShowAddItem(false);
    } catch (err) {
      console.error("Error adding menu item:", err);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await deleteDoc(doc(db, "menu", id));
    } catch (err) {
      console.error("Error deleting menu item:", err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'ON_WAY': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'DELIVERED': return 'bg-green-50 text-green-600 border-green-100';
      case 'CANCELLED': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 font-['Plus_Jakarta_Sans']">
      
      {/* Top Header */}
      <div className="p-8 bg-white border-b sticky top-0 z-40 rounded-b-[40px] shadow-sm">
        <div className="flex justify-between items-center mb-6">
           <div>
             <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Admin Hub</h1>
                <Cloud className="w-4 h-4 text-blue-400" />
             </div>
             <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Live Gondal Cloud Active</p>
           </div>
           <button className="relative w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center border">
              <Bell className="w-5 h-5 text-slate-400" />
              <div className="absolute top-3.5 right-3.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
           </button>
        </div>
        
        <div className="flex bg-slate-100 p-1.5 rounded-[24px]">
           {(['dashboard', 'catalogue', 'orders'] as const).map(tab => (
             <button 
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`flex-1 py-3.5 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
             >
               {tab}
             </button>
           ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 hide-scrollbar">
        
        {activeTab === 'dashboard' && (
          <div className="animate-in fade-in duration-500 space-y-8">
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900 p-6 rounded-[32px] text-white">
                   <div className="bg-white/10 w-10 h-10 rounded-xl flex items-center justify-center mb-4"><DollarSign className="w-5 h-5 text-yellow-400" /></div>
                   <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">Revenue</p>
                   <h3 className="text-2xl font-black mt-1">₹{liveOrders.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0).toFixed(0)}</h3>
                </div>
                <div className="bg-white p-6 rounded-[32px] border">
                   <div className="bg-blue-50 w-10 h-10 rounded-xl flex items-center justify-center mb-4"><Bike className="w-5 h-5 text-blue-500" /></div>
                   <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Active Orders</p>
                   <h3 className="text-2xl font-black mt-1 text-slate-900">{liveOrders.filter(o => o.status !== 'DELIVERED').length}</h3>
                </div>
             </div>

             <div className="bg-white p-8 rounded-[40px] border">
                <h3 className="font-black text-slate-900 mb-6 flex items-center gap-3"><Navigation className="w-5 h-5 text-[#E23744]" /> Live Operations</h3>
                <div className="space-y-4">
                   {liveOrders.slice(0, 5).map(order => (
                     <div key={order.id} onClick={() => setSelectedOrder(order)} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-300 transition-all cursor-pointer">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-[10px] border">#{order.id.slice(0,3)}</div>
                           <div>
                              <p className="text-xs font-black text-slate-900">{order.customerName || 'Anonymous'}</p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase">{order.status}</p>
                           </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300" />
                     </div>
                   ))}
                </div>
             </div>
          </div>
        )}

        {activeTab === 'catalogue' && (
          <div className="animate-in slide-in-from-right duration-500 space-y-6 pb-20">
             <div className="flex justify-between items-center px-2">
                <h2 className="font-black text-xl text-slate-900">Catalogue Master</h2>
                <button onClick={() => setShowAddItem(true)} className="bg-slate-900 text-white px-5 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2">
                   <Plus className="w-4 h-4 text-yellow-400" /> Add New Item
                </button>
             </div>
             <div className="space-y-4">
                {menuItems.map(item => (
                  <div key={item.id} className="bg-white p-4 rounded-3xl border flex items-center gap-4 group">
                     <div className="w-16 h-16 rounded-2xl overflow-hidden border flex-shrink-0">
                        <img src={item.image} className="w-full h-full object-cover" />
                     </div>
                     <div className="flex-1">
                        <h4 className="font-black text-xs text-slate-900 leading-tight">{item.name}</h4>
                        <p className="text-sm font-black text-[#E23744] mt-1">₹{item.price}</p>
                     </div>
                     <div className="flex gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleDeleteItem(item.id)} className="p-2.5 bg-red-50 rounded-xl text-red-400 border border-red-100"><Trash2 className="w-4 h-4" /></button>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="animate-in slide-in-from-bottom duration-500 space-y-6 pb-32">
             <div className="bg-red-50 p-6 rounded-[32px] border border-red-100">
                <h3 className="text-red-900 font-black text-sm mb-2 flex items-center gap-2"><AlertCircle className="w-4 h-4" /> Global Feed</h3>
                <p className="text-[10px] text-red-700 font-medium leading-relaxed">Live synchronization across all client apps in Gondal.</p>
             </div>
             <div className="space-y-4">
                {liveOrders.map(order => (
                  <div key={order.id} onClick={() => setSelectedOrder(order)} className="bg-white p-6 rounded-[32px] border shadow-sm flex justify-between items-center hover:shadow-md transition-all cursor-pointer">
                     <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Order #{order.id.slice(0,6)}</p>
                           <span className={`px-2 py-0.5 rounded-full text-[7px] font-black border ${getStatusColor(order.status)}`}>{order.status}</span>
                        </div>
                        <h4 className="font-black text-slate-900">{order.restaurantName || 'Gondal Store'}</h4>
                        <p className="text-[10px] font-bold text-green-600 mt-1">₹{order.totalAmount} • {order.customerName || 'Anonymous'}</p>
                     </div>
                     <ChevronRight className="w-5 h-5 text-slate-300" />
                  </div>
                ))}
             </div>
          </div>
        )}

      </div>

      {/* Nav Overlay Bottom */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-[420px] bg-white/80 backdrop-blur-2xl px-10 py-5 flex justify-between items-center z-[100] shadow-2xl rounded-[36px] border">
        <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'dashboard' ? 'text-slate-900 scale-105' : 'text-slate-300'}`}>
           <LayoutDashboard className="w-6 h-6" />
           <span className="text-[8px] font-black uppercase tracking-widest">Dashboard</span>
        </button>
        <button onClick={() => setActiveTab('catalogue')} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'catalogue' ? 'text-slate-900 scale-105' : 'text-slate-300'}`}>
           <Utensils className="w-6 h-6" />
           <span className="text-[8px] font-black uppercase tracking-widest">Menu</span>
        </button>
        <button onClick={() => setActiveTab('orders')} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'orders' ? 'text-slate-900 scale-105' : 'text-slate-300'}`}>
           <Navigation className="w-6 h-6" />
           <span className="text-[8px] font-black uppercase tracking-widest">Orders</span>
        </button>
      </div>

      {/* Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[600] bg-slate-900/60 backdrop-blur-sm flex items-end justify-center animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-[480px] rounded-t-[48px] p-8 animate-in slide-in-from-bottom duration-500 shadow-2xl flex flex-col max-h-[90vh]">
              <div className="flex justify-between items-center mb-8">
                 <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Order Detailed</h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">ID: #{selectedOrder.id}</p>
                 </div>
                 <button onClick={() => setSelectedOrder(null)} className="p-3 bg-slate-50 rounded-full border shadow-sm"><X className="w-5 h-5 text-slate-400" /></button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-8 hide-scrollbar pr-2">
                 {/* Customer Card */}
                 <div className="bg-slate-50 p-6 rounded-[32px] border">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><User className="w-4 h-4" /> Customer Profile</h4>
                    <div className="space-y-4">
                       <div className="flex justify-between items-center">
                          <span className="text-sm font-black text-slate-900">{selectedOrder.customerName || 'N/A'}</span>
                          <button className="p-2 bg-white rounded-xl border text-slate-400"><Phone className="w-4 h-4" /></button>
                       </div>
                       <div className="flex gap-3 items-start">
                          <MapPin className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                          <p className="text-xs font-medium text-slate-500 leading-relaxed">{selectedOrder.deliveryLocation?.address || 'Location Not Provided'}</p>
                       </div>
                       <p className="text-[10px] font-bold text-slate-400">Phone: {selectedOrder.phoneNumber || 'N/A'}</p>
                    </div>
                 </div>

                 {/* Items List */}
                 <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Package className="w-4 h-4" /> Order Details</h4>
                    <div className="bg-white border rounded-[32px] overflow-hidden">
                       {selectedOrder.items?.map((item: any, i: number) => (
                         <div key={i} className="flex justify-between p-4 border-b last:border-0 bg-white">
                            <div>
                               <p className="text-xs font-black text-slate-900">{item.name}</p>
                               <p className="text-[9px] font-bold text-slate-400">Qty: {item.qty} × ₹{item.price}</p>
                            </div>
                            <span className="text-xs font-black text-slate-900">₹{item.qty * item.price}</span>
                         </div>
                       ))}
                       <div className="p-4 bg-slate-50 flex justify-between items-center">
                          <span className="text-xs font-black text-slate-400 uppercase">Total Amount</span>
                          <span className="text-xl font-black text-green-600">₹{selectedOrder.totalAmount}</span>
                       </div>
                    </div>
                 </div>

                 {/* Logistics Info */}
                 <div className="bg-slate-900 p-6 rounded-[32px] text-white">
                    <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2"><Bike className="w-4 h-4" /> Logistics Status</h4>
                    <div className="space-y-4">
                       <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-white/60 uppercase">Order Status</span>
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black border ${getStatusColor(selectedOrder.status)}`}>{selectedOrder.status}</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-white/60 uppercase">Assigned Rider</span>
                          <span className="text-xs font-black">{selectedOrder.riderId || 'Awaiting Acceptance'}</span>
                       </div>
                       <div className="pt-4 border-t border-white/10">
                          <button className="w-full flex items-center justify-center gap-2 py-3 bg-white/10 hover:bg-white/20 transition-all rounded-2xl text-[10px] font-black uppercase tracking-widest">
                             <Navigation className="w-4 h-4 text-blue-400" /> View Live Location
                          </button>
                       </div>
                    </div>
                 </div>

                 {/* Order Timestamp */}
                 <div className="flex items-center gap-2 text-slate-400 px-4">
                    <Clock className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Ordered At: {selectedOrder.timestamp?.toDate ? selectedOrder.timestamp.toDate().toLocaleString() : 'Recently'}</span>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Add Item Modal */}
      {showAddItem && (
        <div className="fixed inset-0 z-[500] bg-slate-900/60 backdrop-blur-sm flex items-end justify-center animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-[440px] rounded-t-[48px] p-10 animate-in slide-in-from-bottom duration-500 shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                 <h2 className="text-2xl font-black text-slate-900">Add to Store</h2>
                 <button onClick={() => setShowAddItem(false)} className="p-3 bg-slate-50 rounded-full border shadow-sm"><X className="w-5 h-5 text-slate-400" /></button>
              </div>
              <form onSubmit={handleAddItem} className="space-y-5">
                 <input name="name" type="text" required placeholder="Item Name (e.g. Masala Dosa)" className="w-full bg-slate-50 rounded-2xl py-5 px-6 outline-none font-bold text-sm border focus:border-slate-900" />
                 <div className="grid grid-cols-2 gap-4">
                    <input name="price" type="number" required placeholder="Price (₹)" className="w-full bg-slate-50 rounded-2xl py-5 px-6 outline-none font-bold text-sm border focus:border-slate-900" />
                    <select name="category" className="w-full bg-slate-50 rounded-2xl py-5 px-6 outline-none font-bold text-sm border appearance-none">
                       {CATEGORIES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                 </div>
                 <div className="bg-slate-50 border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-100 transition-all cursor-pointer">
                    <Camera className="w-8 h-8 mb-2 opacity-50" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Upload Photo</span>
                 </div>
                 <button type="submit" className="w-full bg-slate-900 text-white py-6 rounded-[28px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all">
                    Finalize Item
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
