
import React from 'react';
import { 
  BarChart3, Store, Bike, AlertCircle, DollarSign, Users, ShieldCheck, 
  Map, ArrowUpRight, TrendingUp, Globe, Zap, Search, Bell, Settings,
  LayoutDashboard
} from 'lucide-react';
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const data = [
  { name: 'Mon', orders: 4000, rev: 2400 },
  { name: 'Tue', orders: 3000, rev: 1398 },
  { name: 'Wed', orders: 2000, rev: 9800 },
  { name: 'Thu', orders: 2780, rev: 3908 },
  { name: 'Fri', orders: 1890, rev: 4800 },
  { name: 'Sat', orders: 2390, rev: 3800 },
  { name: 'Sun', orders: 3490, rev: 4300 }
];

const AdminPanel: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-slate-50 font-['Plus_Jakarta_Sans']">
      
      {/* Admin Top Bar */}
      <div className="p-10 bg-white border-b border-slate-100 sticky top-0 z-40 rounded-b-[48px] shadow-sm">
        <div className="flex justify-between items-center mb-10">
           <div>
             <h1 className="text-3xl font-black text-slate-900 tracking-tight">Platform Hub</h1>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Real-time Global Overseer</p>
           </div>
           <div className="flex gap-3">
              <button className="w-14 h-14 bg-slate-50 rounded-[20px] flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm"><Search className="w-6 h-6" /></button>
              <button className="w-14 h-14 bg-slate-900 rounded-[20px] flex items-center justify-center text-white shadow-2xl relative">
                 <Bell className="w-6 h-6" />
                 <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-red-500 rounded-full ring-4 ring-slate-900"></span>
              </button>
           </div>
        </div>

        <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 -rotate-45 translate-x-24 -translate-y-24 rounded-full"></div>
           <div className="relative z-10 flex justify-between items-center">
              <div>
                 <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-2">Total Platform GMV</p>
                 <h2 className="text-4xl font-black">₹8,42,100</h2>
                 <div className="flex items-center gap-2 mt-4">
                    <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1">
                       <TrendingUp className="w-3 h-3" /> +24.8%
                    </div>
                    <span className="text-[10px] font-bold text-white/20 uppercase">vs Last Month</span>
                 </div>
              </div>
              <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-[28px] flex items-center justify-center shadow-2xl border border-white/10"><Globe className="w-10 h-10 text-[#FFC107]" /></div>
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-10 space-y-10 pb-32 hide-scrollbar">
        
        {/* Statistics Grid */}
        <div className="grid grid-cols-2 gap-6">
           {[
             { label: 'Live Orders', val: '42', icon: <Zap />, color: 'bg-orange-500', trend: '+8%' },
             { label: 'Active Fleet', val: '156', icon: <Bike />, color: 'bg-blue-500', trend: '+12%' },
             { label: 'Vendors', val: '18', icon: <Store />, color: 'bg-purple-500', trend: 'Stable' },
             { label: 'Users', val: '12k', icon: <Users />, color: 'bg-green-500', trend: '+3%' }
           ].map((stat, idx) => (
             <div key={idx} className="bg-white p-7 rounded-[40px] border border-slate-100 shadow-xl group hover:border-slate-900 transition-all cursor-pointer">
                <div className={`${stat.color} w-12 h-12 rounded-[18px] flex items-center justify-center text-white mb-6 shadow-2xl shadow-slate-900/10 transition-transform group-hover:rotate-12`}>
                   {React.cloneElement(stat.icon as React.ReactElement, { className: "w-6 h-6" })}
                </div>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">{stat.label}</p>
                <div className="flex items-end justify-between">
                   <h3 className="text-2xl font-black text-slate-900 tracking-tight">{stat.val}</h3>
                   <span className="text-[9px] font-black text-green-600 mb-1">{stat.trend}</span>
                </div>
             </div>
           ))}
        </div>

        {/* Visual Analytics */}
        <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-2xl overflow-hidden">
           <div className="flex justify-between items-center mb-10">
              <div>
                 <h3 className="font-black text-xl text-slate-900">Revenue Flow</h3>
                 <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1">Platform Performance Chart</p>
              </div>
              <div className="flex gap-2">
                 {['D', 'W', 'M'].map(t => (
                   <button key={t} className={`w-10 h-10 rounded-xl font-black text-[10px] transition-all ${t === 'W' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400'}`}>{t}</button>
                 ))}
              </div>
           </div>
           <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FFC107" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#FFC107" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 800, fill: '#CBD5E1'}} />
                  <Tooltip cursor={{fill: '#F8FAFC'}} contentStyle={{borderRadius: '24px', border: 'none', padding: '15px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)'}} />
                  <Area type="monotone" dataKey="rev" stroke="#FFC107" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Critical Disputes Overlay Mock */}
        <div className="space-y-6">
           <div className="flex justify-between items-center px-2">
              <h3 className="font-black text-xl text-slate-900 flex items-center gap-3">
                 <AlertCircle className="w-6 h-6 text-red-500" />
                 Escalations
              </h3>
              <span className="text-[10px] font-black text-red-500 bg-red-50 px-4 py-1.5 rounded-full border border-red-100">Action Required</span>
           </div>
           <div className="space-y-4">
              {[
                { id: '#4421', type: 'Late Delivery', level: 'URGENT', desc: 'Customer MG Road complaining about 45m delay.' },
                { id: '#4425', type: 'Missing Item', level: 'HIGH', desc: 'Vendor Dreamland missed beverages in order.' }
              ].map((issue, i) => (
                <div key={i} className="bg-white p-8 rounded-[40px] border-l-8 border-red-500 shadow-xl group hover:scale-[1.02] transition-all">
                   <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-black text-slate-900">{issue.type}</h4>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Ticket {issue.id}</p>
                      </div>
                      <span className="text-[9px] font-black bg-red-50 text-red-600 px-3 py-1 rounded-full border border-red-100">{issue.level}</span>
                   </div>
                   <p className="text-xs text-slate-500 mb-6 font-medium leading-loose">{issue.desc}</p>
                   <div className="flex gap-3">
                      <button className="flex-1 text-[10px] font-black uppercase tracking-widest bg-slate-50 text-slate-400 py-4 rounded-2xl hover:bg-slate-100 transition">View Details</button>
                      <button className="flex-[2] text-[10px] font-black uppercase tracking-widest bg-slate-900 text-white py-4 rounded-2xl shadow-xl active:scale-95 transition">Resolve Ticket</button>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Admin Quick Nav */}
      <div className="bg-white border-t border-slate-100 px-12 py-6 flex justify-between items-center rounded-t-[48px] shadow-[0_-20px_60px_rgba(0,0,0,0.05)] sticky bottom-0">
        <button className="flex flex-col items-center gap-2 text-slate-900">
          <div className="bg-slate-900 text-white p-4 rounded-[22px] shadow-2xl scale-110"><LayoutDashboard className="w-7 h-7" /></div>
          <span className="text-[9px] font-black uppercase tracking-widest mt-1">Global</span>
        </button>
        <button className="flex flex-col items-center gap-2 text-slate-300"><Users className="w-7 h-7" /><span className="text-[9px] font-black uppercase tracking-widest">Users</span></button>
        <button className="flex flex-col items-center gap-2 text-slate-300"><Map className="w-7 h-7" /><span className="text-[9px] font-black uppercase tracking-widest">Tracking</span></button>
        <button className="flex flex-col items-center gap-2 text-slate-300"><Settings className="w-7 h-7" /><span className="text-[9px] font-black uppercase tracking-widest">Setup</span></button>
      </div>
    </div>
  );
};

export default AdminPanel;
