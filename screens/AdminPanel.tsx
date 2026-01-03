
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

// Mock Customers for Admin view
const MOCK_CUSTOMERS = [
  { id: 'c1', name: 'Rahul Sharma', phone: '+91 9876543210', totalOrders: 12, lastOrder: '2 hours ago', status: 'Active', joined: 'Jan 2024' },
  { id: 'c2', name: 'Anjali Gupta', phone: '+91 9123456789', totalOrders: 8, lastOrder: 'Yesterday', status: 'Active', joined: 'Feb 2024' },
  { id: 'c3', name: 'Vikram Singh', phone: '+91 9988776655', totalOrders: 0, lastOrder: 'Never', status: 'New', joined: 'Mar 2024' },
];

const AdminPanel: React.FC<{orders: Order[]}> = ({ orders }) => {
  const [activeTab, setActiveTab] = useState<'dash' | 'orders' | 'restaurants' | 'delivery' | 'users' | 'finances'>('dash');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [isEditingMenu, setIsEditingMenu] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<MenuItem> | null>(null);
  
  // Track paid status locally (simulation)
  const [paidRestaurants, setPaidRestaurants] = useState<Record<string, boolean>>({});

  // Stats Calculations
  const totalGMV = useMemo(() => orders.reduce((acc, o) => acc + o.totalAmount, 0), [orders]);
  const activeOrdersCount = useMemo(() => orders.filter(o => o.status !== OrderStatus.DELIVERED && o.status !== OrderStatus.CANCELLED).length, [orders]);
  
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

  const togglePaidStatus = (resId: string) => {
    setPaidRestaurants(prev => ({ ...prev, [resId]: !prev[resId] }));
  };

  const handleEditMenu = (item?: MenuItem) => {
    setEditingItem(item || { name: '', description: '', price: 0, isVeg: true, category: 'Main' });
    setIsEditingMenu(true);
  };

  const NavItem = ({ id, label, icon: Icon }: { id: typeof activeTab, label: string, icon: any }) => (
    <button 
      onClick={() => { setActiveTab(id); setSelectedRestaurant(null); setIsEditingMenu(false); }}
      className={`flex flex-col items-center gap-1 transition-all ${activeTab === id ? 'text-[#F36E35]' : 'text-slate-400'}`}
    >
      <div className={`p-3 rounded-2xl transition-all ${activeTab === id ? 'bg-orange-50' : 'hover:bg-slate-50'}`}>
        <Icon className="w-6 h-6" />
      </div>
      <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );

  return (
    <div className="flex flex-col h-full bg-[#F8F9FB] font-['Plus_Jakarta_Sans']">
      
      {/* HEADER SECTION */}
      <div className="px-10 pt-12 pb-6 bg-white border-b rounded-b-[48px] shadow-sm sticky top-0 z-50">
        <div className="flex justify-between items-center mb-8">
           <div>
             <h1 className="text-3xl font-black text-slate-900 tracking-tight">Control Center</h1>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Global Admin Instance</p>
           </div>
           <div className="flex gap-3">
             <button className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 relative">
               <Bell className="w-6 h-6" />
               <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
             </button>
             <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
               <ShieldCheck className="w-6 h-6" />
             </div>
           </div>
        </div>

        {activeTab === 'dash' && (
          <div className="bg-slate-900 rounded-[36px] p-8 text-white relative overflow-hidden group animate-in fade-in zoom-in duration-500">
             <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#F36E35]/10 rounded-full blur-3xl transition-colors duration-1000"></div>
             <div className="relative z-10 flex justify-between items-center">
                <div>
                   <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-2">Total Platform GMV</p>
                   <h2 className="text-4xl font-black tracking-tighter">₹{totalGMV.toLocaleString()}</h2>
                   <div className="flex items-center gap-3 mt-4">
                      <div className="bg-green-500/20 text-green-400 px-4 py-1.5 rounded-full text-[10px] font-black flex items-center gap-1.5">
                         <TrendingUp className="w-3.5 h-3.5" /> +22.4% vs last week
                      </div>
                   </div>
                </div>
                <div className="w-16 h-16 bg-white/10 backdrop-blur-2xl rounded-[24px] flex items-center justify-center border border-white/10 shadow-2xl">
                   <Globe className="w-8 h-8 text-orange-400" />
                </div>
             </div>
          </div>
        )}
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 overflow-y-auto p-10 space-y-10 hide-scrollbar pb-40">
        
        {/* DASHBOARD TAB */}
        {activeTab === 'dash' && (
          <div className="space-y-10 animate-in slide-in-from-bottom-8 duration-500">
            <div className="grid grid-cols-2 gap-6">
               <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 flex flex-col justify-between group">
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-[22px] flex items-center justify-center mb-6 transition-transform group-hover:scale-110">
                    <Package className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Live Orders</p>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">{activeOrdersCount}</h3>
                  </div>
               </div>
               <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 flex flex-col justify-between group">
                  <div className="w-14 h-14 bg-green-50 text-green-600 rounded-[22px] flex items-center justify-center mb-6 transition-transform group-hover:scale-110">
                    <Bike className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Fleet Active</p>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">42</h3>
                  </div>
               </div>
            </div>

            <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm overflow-hidden">
               <div className="flex justify-between items-center mb-8">
                  <div>
                     <h3 className="font-black text-xl text-slate-900 tracking-tight">Growth Revenue</h3>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">7 Day Performance Window</p>
                  </div>
               </div>
               <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorAdminRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#F36E35" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#F36E35" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 800, fill: '#94A3B8'}} />
                      <Tooltip 
                        contentStyle={{borderRadius: '24px', border: 'none', padding: '15px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)'}} 
                        itemStyle={{fontWeight: 800, color: '#F36E35'}}
                      />
                      <Area type="monotone" dataKey="rev" stroke="#F36E35" strokeWidth={5} fillOpacity={1} fill="url(#colorAdminRev)" />
                    </AreaChart>
                  </ResponsiveContainer>
               </div>
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-in slide-in-from-right duration-500">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Order Pipeline</h2>
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-orange-50 group-hover:text-[#F36E35] transition-colors">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900">#{order.id.slice(0, 8)}</h4>
                      <p className="text-[11px] font-bold text-slate-400">Total: ₹{order.totalAmount} • {order.items.length} items</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                     <div className="text-right">
                        <Badge variant={order.status === OrderStatus.DELIVERED ? 'success' : 'warning'}>{order.status}</Badge>
                        <p className="text-[9px] font-black text-slate-300 uppercase mt-1">{new Date(order.timestamp).toLocaleTimeString()}</p>
                     </div>
                     <button className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-slate-900"><Eye className="w-5 h-5" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CUSTOMERS TAB */}
        {activeTab === 'users' && (
          <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Customer Database</h2>
            <div className="grid grid-cols-1 gap-4">
              {MOCK_CUSTOMERS.map(customer => (
                <div key={customer.id} className="bg-white p-6 rounded-[36px] border border-slate-100 shadow-sm flex items-center justify-between group">
                   <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-slate-100 rounded-[22px] flex items-center justify-center text-slate-900">
                         <User className="w-7 h-7" />
                      </div>
                      <div>
                         <h4 className="font-black text-slate-900 text-lg tracking-tight">{customer.name}</h4>
                         <p className="text-[11px] font-bold text-slate-400">{customer.phone} • Joined {customer.joined}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-8">
                      <div className="text-center">
                         <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Orders</p>
                         <p className="text-sm font-black text-slate-900">{customer.totalOrders}</p>
                      </div>
                      <Badge variant={customer.status === 'Active' ? 'success' : 'neutral'}>{customer.status}</Badge>
                      <button className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400"><ChevronRight className="w-5 h-5" /></button>
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RESTAURANTS TAB (Menu Editing) */}
        {activeTab === 'restaurants' && (
          <div className="space-y-8 animate-in slide-in-from-left duration-500">
            {!selectedRestaurant ? (
              <>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Merchant Portfolio</h2>
                <div className="grid grid-cols-1 gap-4">
                  {MOCK_RESTAURANTS.map(res => (
                    <button 
                      key={res.id} 
                      onClick={() => setSelectedRestaurant(res)}
                      className="bg-white p-6 rounded-[36px] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-[#F36E35]/20 transition-all text-left"
                    >
                      <div className="flex items-center gap-5">
                        <img src={res.image} className="w-16 h-16 rounded-[22px] object-cover" />
                        <div>
                          <h4 className="font-black text-slate-900 text-lg">{res.name}</h4>
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{res.cuisine.join(', ')}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-6 h-6 text-slate-200 group-hover:text-[#F36E35] group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              </>
            ) : isEditingMenu ? (
              <div className="space-y-8 animate-in zoom-in duration-300">
                 <button onClick={() => setIsEditingMenu(false)} className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">
                    <X className="w-4 h-4" /> Cancel Editing
                 </button>
                 <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-2xl">
                    <h3 className="text-2xl font-black text-slate-900 mb-8">{editingItem?.id ? 'Edit Menu Item' : 'Add New Item'}</h3>
                    <div className="space-y-6">
                       <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Item Name</label>
                             <input type="text" value={editingItem?.name} onChange={e => setEditingItem(p => ({...p, name: e.target.value}))} className="w-full bg-slate-50 p-6 rounded-[24px] font-bold outline-none border-2 border-transparent focus:border-orange-500/20" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Price (₹)</label>
                             <input type="number" value={editingItem?.price} onChange={e => setEditingItem(p => ({...p, price: Number(e.target.value)}))} className="w-full bg-slate-50 p-6 rounded-[24px] font-bold outline-none border-2 border-transparent focus:border-orange-500/20" />
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Description</label>
                          <textarea rows={3} value={editingItem?.description} onChange={e => setEditingItem(p => ({...p, description: e.target.value}))} className="w-full bg-slate-50 p-6 rounded-[24px] font-bold outline-none border-2 border-transparent focus:border-orange-500/20 resize-none" />
                       </div>
                       <div className="flex items-center gap-6 p-4">
                          <button onClick={() => setEditingItem(p => ({...p, isVeg: true}))} className={`flex-1 py-4 rounded-[20px] font-black text-[10px] uppercase tracking-widest border-2 transition-all ${editingItem?.isVeg ? 'border-green-500 bg-green-50 text-green-600' : 'border-transparent bg-slate-50 text-slate-400'}`}>Veg</button>
                          <button onClick={() => setEditingItem(p => ({...p, isVeg: false}))} className={`flex-1 py-4 rounded-[20px] font-black text-[10px] uppercase tracking-widest border-2 transition-all ${!editingItem?.isVeg ? 'border-red-500 bg-red-50 text-red-600' : 'border-transparent bg-slate-50 text-slate-400'}`}>Non-Veg</button>
                       </div>
                       <Button fullWidth size="xl" leftIcon={<Save className="w-5 h-5" />} onClick={() => setIsEditingMenu(false)} style={{ backgroundColor: '#F36E35' }}>Save Changes</Button>
                    </div>
                 </div>
              </div>
            ) : (
              <div className="space-y-8">
                 <button onClick={() => setSelectedRestaurant(null)} className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">
                    <ArrowUpRight className="w-4 h-4 rotate-[225deg]" /> Back to Merchants
                 </button>
                 <div className="flex justify-between items-end">
                    <div>
                      <h2 className="text-3xl font-black text-slate-900 tracking-tight">{selectedRestaurant.name}</h2>
                      <p className="text-[11px] font-black text-[#F36E35] uppercase tracking-widest mt-1">Menu Management</p>
                    </div>
                    <Button size="sm" onClick={() => handleEditMenu()} leftIcon={<Plus className="w-4 h-4" />} style={{ backgroundColor: '#F36E35' }}>Add Item</Button>
                 </div>

                 <div className="bg-white rounded-[40px] overflow-hidden border border-slate-100 shadow-xl divide-y divide-slate-50">
                    {selectedRestaurant.menu.map(item => (
                      <div key={item.id} className="p-8 flex items-center justify-between group hover:bg-slate-50/50 transition-colors">
                        <div className="flex items-center gap-6">
                           <img src={item.image} className="w-16 h-16 rounded-2xl object-cover shadow-sm" />
                           <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-black text-slate-900">{item.name}</h4>
                                <div className={`w-3 h-3 rounded-sm border ${item.isVeg ? 'border-green-600 bg-green-50' : 'border-red-600 bg-red-50'}`} />
                              </div>
                              <p className="text-sm font-bold text-slate-400 max-w-xs truncate">{item.description}</p>
                              <p className="text-sm font-black text-[#F36E35] mt-1">₹{item.price}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-3">
                           <button onClick={() => handleEditMenu(item)} className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors shadow-sm"><Edit3 className="w-4 h-4" /></button>
                           <button className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-100 transition-colors shadow-sm"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
            )}
          </div>
        )}

        {/* DELIVERY FLEET TAB */}
        {activeTab === 'delivery' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Logistics Management</h2>
            
            <div className="h-64 bg-slate-900 rounded-[44px] relative overflow-hidden shadow-2xl border border-slate-800">
               <div className="absolute inset-0 opacity-10">
                 <div className="w-full h-full bg-[radial-gradient(#ffffff22_1px,transparent_1px)] [background-size:20px_20px]" />
               </div>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="relative w-80 h-40">
                    <div className="absolute top-10 left-10"><Navigation className="w-6 h-6 text-orange-400 rotate-45 animate-pulse" /></div>
                    <div className="absolute bottom-5 right-20"><Navigation className="w-6 h-6 text-orange-400 rotate-[180deg] animate-pulse" /></div>
                    <div className="absolute top-20 right-10"><Navigation className="w-6 h-6 text-orange-400 rotate-[270deg] animate-pulse" /></div>
                    <MapPin className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-white fill-orange-500" />
                  </div>
               </div>
               <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/5 shadow-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Live Fleet: 14 Riders Active</span>
                  </div>
               </div>
            </div>

            <div className="space-y-4">
               {[1, 2, 3].map(i => (
                 <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-900"><User className="w-6 h-6" /></div>
                      <div>
                        <h4 className="font-black text-slate-900">Rider #RD90{i}</h4>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Delivering • 85% Battery</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                       <button className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center"><Phone className="w-4 h-4" /></button>
                       <button className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center"><Navigation className="w-4 h-4" /></button>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {/* FINANCES TAB */}
        {activeTab === 'finances' && (
          <div className="space-y-8 animate-in slide-in-from-bottom-12 duration-500">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Financial Oversight</h2>
            <div className="space-y-6">
               {MOCK_RESTAURANTS.map(res => {
                 const fin = restaurantFinances[res.id];
                 const isPaid = paidRestaurants[res.id];
                 return (
                   <div key={res.id} className="bg-white p-8 rounded-[44px] border border-slate-100 shadow-sm relative overflow-hidden group">
                      <div className="flex justify-between items-start mb-8">
                         <div className="flex items-center gap-5">
                            <img src={res.image} className="w-16 h-16 rounded-[22px] object-cover" />
                            <div>
                               <h4 className="text-xl font-black text-slate-900">{res.name}</h4>
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{fin.orders} Successful Orders</p>
                            </div>
                         </div>
                         <Badge variant={isPaid ? 'success' : 'warning'}>{isPaid ? 'Settled' : 'Pending'}</Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-6 mb-8">
                         <div className="bg-slate-50 p-6 rounded-3xl">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Rev</p>
                            <h5 className="text-lg font-black text-slate-900">₹{fin.gmv}</h5>
                         </div>
                         <div className="bg-slate-50 p-6 rounded-3xl">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Deliv. Fees</p>
                            <h5 className="text-lg font-black text-slate-900">₹{fin.orders * DELIVERY_FEE}</h5>
                         </div>
                         <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100">
                            <p className="text-[10px] font-black text-[#F36E35] uppercase tracking-widest mb-1">Net Payable</p>
                            <h5 className="text-lg font-black text-[#F36E35]">₹{fin.payable}</h5>
                         </div>
                      </div>

                      <div className="flex gap-4">
                         <button className="flex-1 bg-slate-900 text-white py-5 rounded-[24px] text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                           <CreditCard className="w-4 h-4" /> Transactions
                         </button>
                         <button 
                          onClick={() => togglePaidStatus(res.id)}
                          className={`flex-1 py-5 rounded-[24px] text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${isPaid ? 'bg-green-600 text-white' : 'bg-[#F36E35] text-white'}`}
                        >
                           {isPaid ? <CheckCircle2 className="w-4 h-4" /> : <RefreshCcw className="w-4 h-4" />} {isPaid ? 'Paid & Done' : 'Mark Paid'}
                         </button>
                      </div>
                   </div>
                 );
               })}
            </div>
          </div>
        )}

      </div>

      {/* ADMIN BOTTOM NAV */}
      <div className="fixed bottom-0 left-0 right-0 h-[100px] bg-white/95 backdrop-blur-xl border-t border-slate-100 flex items-center justify-around px-8 z-[200] shadow-[0_-10px_40px_rgba(0,0,0,0.03)] rounded-t-[48px]">
        <NavItem id="dash" label="Home" icon={LayoutDashboard} />
        <NavItem id="orders" label="Orders" icon={Package} />
        <NavItem id="restaurants" label="Merchants" icon={Store} />
        <NavItem id="users" label="Users" icon={Users} />
        <NavItem id="delivery" label="Fleet" icon={Bike} />
        <NavItem id="finances" label="Money" icon={DollarSign} />
      </div>

    </div>
  );
};

export default AdminPanel;
