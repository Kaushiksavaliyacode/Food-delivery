
import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, Package, Store, DollarSign, ShieldCheck, 
  RefreshCcw, AlertTriangle, CheckCircle2, XCircle, 
  ChevronRight, BarChart3, TrendingUp, Users, Map
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { MOCK_RESTAURANTS } from '../constants.tsx';
import Badge from '../components/ui/Badge.tsx';
import { Order, OrderStatus } from '../types.ts';
import { supabase } from '../supabase.ts';

const chartData = [
  { name: 'Mon', rev: 4000 }, { name: 'Tue', rev: 3000 }, { name: 'Wed', rev: 2000 },
  { name: 'Thu', rev: 2780 }, { name: 'Fri', rev: 1890 }, { name: 'Sat', rev: 2390 }, { name: 'Sun', rev: 3490 }
];

const AdminPanel: React.FC<{orders: Order[]}> = ({ orders }) => {
  const [activeTab, setActiveTab] = useState<'dash' | 'orders' | 'merchants' | 'fleet'>('dash');
  const [isSyncing, setIsSyncing] = useState(false);

  const totalGMV = useMemo(() => orders.reduce((acc, o) => acc + o.totalAmount, 0), [orders]);

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
    if (error) alert("Admin Error: " + error.message);
  };

  const NavItem = ({ id, label, icon: Icon }: any) => (
    <button onClick={() => setActiveTab(id)} className={`flex flex-col items-center gap-1 transition-all ${activeTab === id ? 'text-slate-900' : 'text-slate-400'}`}>
      <div className={`p-2.5 rounded-2xl transition-all ${activeTab === id ? 'bg-slate-900 text-white shadow-lg' : 'hover:bg-slate-50'}`}><Icon className="w-5 h-5" /></div>
      <span className="text-[7px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );

  return (
    <div className="flex flex-col h-full bg-[#F8F9FB] font-['Plus_Jakarta_Sans']">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 border-b border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-6">
           <div>
             <h1 className="text-xl font-black text-slate-900 leading-none tracking-tight">Admin Console</h1>
             <p className="text-[7px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Enterprise Resource Planning</p>
           </div>
           <button 
             onClick={() => { setIsSyncing(true); setTimeout(() => setIsSyncing(false), 1000); }} 
             className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 active:scale-95 transition-all"
           >
             <RefreshCcw className={`w-4 h-4 text-slate-500 ${isSyncing ? 'animate-spin' : ''}`} />
           </button>
        </div>
        
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
           <div className="bg-slate-900 min-w-[140px] p-4 rounded-[24px] text-white">
              <p className="text-[7px] font-black text-white/40 uppercase mb-1">Total Revenue</p>
              <h2 className="text-lg font-black tracking-tight">₹{totalGMV.toLocaleString()}</h2>
           </div>
           <div className="bg-white min-w-[140px] p-4 rounded-[24px] border border-slate-100">
              <p className="text-[7px] font-black text-slate-400 uppercase mb-1">Live Fleet</p>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">12 Online</h2>
           </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 hide-scrollbar pb-24">
        {activeTab === 'dash' && (
          <div className="space-y-4 animate-in fade-in duration-500">
             <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="font-black text-[9px] uppercase tracking-widest text-slate-400">Sales Velocity</h3>
                   <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
                <div className="h-32 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <Area type="monotone" dataKey="rev" stroke="#0F172A" strokeWidth={3} fill="#0F172A" fillOpacity={0.05} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-[32px] border border-slate-100">
                   <Users className="w-5 h-5 text-blue-500 mb-2" />
                   <p className="text-[7px] font-black text-slate-400 uppercase">New Users</p>
                   <h4 className="text-lg font-black text-slate-900">+48</h4>
                </div>
                <div className="bg-white p-5 rounded-[32px] border border-slate-100">
                   <Package className="w-5 h-5 text-orange-500 mb-2" />
                   <p className="text-[7px] font-black text-slate-400 uppercase">Orders</p>
                   <h4 className="text-lg font-black text-slate-900">{orders.length}</h4>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-3 animate-in slide-in-from-right-4 duration-500">
             {orders.map(o => (
               <div key={o.id} className="bg-white p-5 rounded-[32px] border border-slate-100 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                     <div>
                        <h4 className="font-black text-slate-900 text-xs tracking-tight">#{o.id.slice(-6)}</h4>
                        <p className="text-[8px] text-slate-400 font-bold uppercase mt-0.5 truncate max-w-[150px]">{o.deliveryLocation.address}</p>
                     </div>
                     <Badge variant={o.status === 'DELIVERED' ? 'success' : 'primary'}>{o.status}</Badge>
                  </div>
                  <div className="flex gap-2">
                     <button onClick={() => updateOrderStatus(o.id, OrderStatus.ACCEPTED)} className="flex-1 bg-slate-900 text-white py-3 rounded-2xl text-[8px] font-black uppercase tracking-widest shadow-lg">Manual Accept</button>
                     <button className="px-4 bg-slate-50 text-slate-400 rounded-2xl border border-slate-100"><XCircle className="w-4 h-4" /></button>
                  </div>
               </div>
             ))}
          </div>
        )}

        {activeTab === 'merchants' && (
          <div className="space-y-3 animate-in slide-in-from-left-4 duration-500">
             {MOCK_RESTAURANTS.map(res => (
               <div key={res.id} className="bg-white p-4 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-4">
                  <img src={res.image} className="w-14 h-14 rounded-2xl object-cover" />
                  <div className="flex-1">
                     <h4 className="text-[12px] font-black text-slate-900 leading-tight">{res.name}</h4>
                     <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Rating: {res.rating} • {res.cuisine[0]}</p>
                  </div>
                  <button className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300">
                    <ChevronRight className="w-4 h-4" />
                  </button>
               </div>
             ))}
          </div>
        )}
      </div>

      {/* Persistent Navigation */}
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-slate-100 flex items-center justify-around px-8 z-[200] rounded-t-[40px] shadow-2xl">
        <NavItem id="dash" label="Insights" icon={BarChart3} />
        <NavItem id="orders" label="Control" icon={LayoutDashboard} />
        <NavItem id="merchants" label="Stores" icon={Store} />
        <NavItem id="fleet" label="Fleet" icon={Map} />
      </div>
    </div>
  );
};

export default AdminPanel;
