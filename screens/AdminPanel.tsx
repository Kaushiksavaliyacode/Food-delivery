
import React, { useState, useMemo } from 'react';
import { 
  BarChart3, Store, Bike, AlertCircle, DollarSign, Users, ShieldCheck, 
  Map, ArrowUpRight, TrendingUp, Globe, Zap, Search, Bell, Settings,
  LayoutDashboard, CloudUpload, Database, Loader2, CheckCircle, RefreshCcw,
  User, Package, ChevronRight, Edit3, Plus, Trash2, Eye, MapPin, 
  CreditCard, CheckCircle2, XCircle, Clock, Navigation, Phone, Save, X
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MOCK_RESTAURANTS } from '../constants.tsx';
import Button from '../components/ui/Button.tsx';
import Badge from '../components/ui/Badge.tsx';
import { Order, OrderStatus, Restaurant, MenuItem } from '../types.ts';

const chartData = [
  { name: 'Mon', rev: 2400 },
  { name: 'Tue', rev: 3398 },
  { name: 'Wed', rev: 9800 },
  { name: 'Thu', rev: 3908 },
  { name: 'Fri', rev: 4800 },
  { name: 'Sat', rev: 12800 },
  { name: 'Sun', rev: 11300 }
];

const MOCK_CUSTOMERS = [
  { id: 'c1', name: 'Rahul Sharma', phone: '+91 9876543210', totalOrders: 12, status: 'Active' },
  { id: 'c2', name: 'Anjali Gupta', phone: '+91 9123456789', totalOrders: 8, status: 'Active' },
  { id: 'c3', name: 'Vikram Singh', phone: '+91 9988776655', totalOrders: 0, status: 'New' },
];

const AdminPanel: React.FC<{orders: Order[]}> = ({ orders }) => {
  const [activeTab, setActiveTab] = useState<'dash' | 'orders' | 'restaurants' | 'delivery' | 'users' | 'finances'>('dash');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [isEditingMenu, setIsEditingMenu] = useState(false);
  const [paidRestaurants, setPaidRestaurants] = useState<Record<string, boolean>>({});

  const totalGMV = useMemo(() => orders.reduce((acc, o) => acc + o.totalAmount, 0), [orders]);
  const DELIVERY_FEE = 40;
  
  const restaurantFinances = useMemo(() => {
    const stats: Record<string, { gmv: number, orders: number, payable: number }> = {};
    MOCK_RESTAURANTS.forEach(r => {
      const resOrders = orders.filter(o => o.restaurantId === r.id);
      const gmv = resOrders.reduce((acc, o) => acc + o.totalAmount, 0);
      const deliveryFees = resOrders.length * DELIVERY_FEE;
      stats[r.id] = {
        gmv,
        orders: resOrders.length,
        payable: Math.max(0, gmv - deliveryFees),
      };
    });
    return stats;
  }, [orders]);

  const NavItem = ({ id, label, icon: Icon }: { id: typeof activeTab, label: string, icon: any }) => (
    <button onClick={() => { setActiveTab(id); setSelectedRestaurant(null); }} className={`flex flex-col items-center gap-0.5 transition-all ${activeTab === id ? 'text-[#F36E35]' : 'text-slate-400'}`}>
      <div className={`p-2 rounded-xl ${activeTab === id ? 'bg-orange-50' : 'hover:bg-slate-50'}`}><Icon className="w-5 h-5" /></div>
      <span className="text-[8px] font-black uppercase">{label}</span>
    </button>
  );

  return (
    <div className="flex flex-col h-full bg-[#F8F9FB]">
      
      {/* HEADER */}
      <div className="px-6 pt-10 pb-4 bg-white border-b rounded-b-[32px] shadow-sm">
        <div className="flex justify-between items-center mb-4">
           <div>
             <h1 className="text-xl font-black text-slate-900">Control Center</h1>
             <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Global Admin</p>
           </div>
           <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-white"><ShieldCheck className="w-5 h-5" /></div>
        </div>

        {activeTab === 'dash' && (
          <div className="bg-slate-900 rounded-2xl p-5 text-white relative overflow-hidden">
             <div className="relative z-10">
                <p className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-1">Total Platform GMV</p>
                <h2 className="text-2xl font-black">₹{totalGMV.toLocaleString()}</h2>
             </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar pb-24">
        {activeTab === 'dash' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-2 gap-3">
               <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                  <Package className="w-5 h-5 text-blue-500 mb-2" />
                  <p className="text-[8px] font-black text-slate-400 uppercase">Live Orders</p>
                  <h3 className="text-lg font-black text-slate-900">{orders.length}</h3>
               </div>
               <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                  <Bike className="w-5 h-5 text-green-500 mb-2" />
                  <p className="text-[8px] font-black text-slate-400 uppercase">Fleet</p>
                  <h3 className="text-lg font-black text-slate-900">14</h3>
               </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-100">
               <h3 className="font-black text-sm text-slate-900 mb-4">Growth Performance</h3>
               <div className="h-40 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <Area type="monotone" dataKey="rev" stroke="#F36E35" strokeWidth={3} fill="#F36E35" fillOpacity={0.1} />
                    </AreaChart>
                  </ResponsiveContainer>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-3 animate-in slide-in-from-right duration-500">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest px-1">Recent Tickets</h2>
            {orders.map(order => (
              <div key={order.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <div>
                    <h4 className="font-black text-slate-900 text-xs">#{order.id.slice(-6)}</h4>
                    <p className="text-[9px] font-bold text-slate-400">Total: ₹{order.totalAmount}</p>
                  </div>
                </div>
                <Badge variant={order.status === OrderStatus.DELIVERED ? 'success' : 'warning'} className="text-[7px]">{order.status}</Badge>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'finances' && (
          <div className="space-y-4 animate-in slide-in-from-bottom duration-500">
            {MOCK_RESTAURANTS.map(res => {
              const fin = restaurantFinances[res.id];
              const isPaid = paidRestaurants[res.id];
              return (
                <div key={res.id} className="bg-white p-5 rounded-3xl border border-slate-100">
                   <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                         <img src={res.image} className="w-10 h-10 rounded-lg object-cover" />
                         <h4 className="text-sm font-black text-slate-900">{res.name}</h4>
                      </div>
                      <Badge variant={isPaid ? 'success' : 'warning'} className="text-[7px]">{isPaid ? 'Settled' : 'Pending'}</Badge>
                   </div>
                   <div className="grid grid-cols-3 gap-2 text-center bg-slate-50 p-3 rounded-2xl">
                      <div><p className="text-[7px] font-black text-slate-400 uppercase">Rev</p><p className="text-xs font-black">₹{fin.gmv}</p></div>
                      <div><p className="text-[7px] font-black text-slate-400 uppercase">Fees</p><p className="text-xs font-black">₹{fin.orders * 40}</p></div>
                      <div><p className="text-[7px] font-black text-orange-500 uppercase">Payable</p><p className="text-xs font-black text-orange-500">₹{fin.payable}</p></div>
                   </div>
                   <button onClick={() => setPaidRestaurants(p => ({...p, [res.id]: !p[res.id]}))} className={`w-full mt-4 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${isPaid ? 'bg-green-600 text-white' : 'bg-slate-900 text-white'}`}>
                     {isPaid ? 'Settlement Done' : 'Mark Settle'}
                   </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 h-[72px] bg-white/95 backdrop-blur-xl border-t border-slate-100 flex items-center justify-around px-6 z-[200] rounded-t-[32px]">
        <NavItem id="dash" label="Home" icon={LayoutDashboard} />
        <NavItem id="orders" label="Orders" icon={Package} />
        <NavItem id="restaurants" label="Merchants" icon={Store} />
        <NavItem id="finances" label="Settle" icon={DollarSign} />
      </div>

    </div>
  );
};

export default AdminPanel;
