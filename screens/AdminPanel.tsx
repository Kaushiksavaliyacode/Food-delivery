
import React from 'react';
import { BarChart3, Store, Bike, AlertCircle, DollarSign, Users, ShieldAlert, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const orderData = [
  { name: '10 AM', orders: 120 },
  { name: '12 PM', orders: 450 },
  { name: '2 PM', orders: 380 },
  { name: '4 PM', orders: 290 },
  { name: '6 PM', orders: 610 },
  { name: '8 PM', orders: 850 },
  { name: '10 PM', orders: 400 }
];

const AdminPanel: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="p-8 bg-white border-b sticky top-0 z-20 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Platform Admin</h1>
          <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mt-1 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-600 rounded-full animate-ping"></span> Live Performance
          </p>
        </div>
        <button className="p-3 bg-slate-100 rounded-2xl"><Users className="w-5 h-5" /></button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-8 pb-32">
        <div className="grid grid-cols-2 gap-4">
           {[
             { label: 'Revenue', val: '$42,120', change: '+24%', icon: <DollarSign className="w-4 h-4" />, color: 'bg-green-500' },
             { label: 'Orders', val: '1,245', change: '+12%', icon: <BarChart3 className="w-4 h-4" />, color: 'bg-red-500' },
             { label: 'Riders', val: '84', change: 'Online', icon: <Bike className="w-4 h-4" />, color: 'bg-blue-500' },
             { label: 'Issues', val: '3', change: 'Pending', icon: <AlertCircle className="w-4 h-4" />, color: 'bg-orange-500' }
           ].map((stat, idx) => (
             <div key={idx} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm transition-all hover:shadow-lg">
                <div className={`${stat.color} w-10 h-10 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-current/20`}>
                   {stat.icon}
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <div className="flex items-end justify-between">
                   <h3 className="text-xl font-black">{stat.val}</h3>
                   <span className="text-[8px] font-black px-2 py-0.5 bg-slate-100 rounded-full text-slate-600">{stat.change}</span>
                </div>
             </div>
           ))}
        </div>

        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
           <div className="flex justify-between items-center mb-10">
              <h3 className="font-black text-lg">Order Volume (Today)</h3>
              <div className="bg-slate-50 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase text-slate-400">Gondal Zone</div>
           </div>
           <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={orderData}>
                  <defs>
                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#E23744" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#E23744" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 900, fill: '#CBD5E1'}} />
                  <Tooltip cursor={{stroke: '#E23744'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)', padding: '12px'}} />
                  <Area type="monotone" dataKey="orders" stroke="#E23744" strokeWidth={4} fillOpacity={1} fill="url(#colorOrders)" />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="space-y-6">
           <div className="flex justify-between items-center">
              <h3 className="font-black flex items-center gap-2 text-slate-900 uppercase tracking-widest text-xs">
                 <ShieldAlert className="w-5 h-5 text-red-600" />
                 Active Alerts
              </h3>
              <button className="text-[10px] font-black text-slate-400 uppercase">Clear All</button>
           </div>
           <div className="space-y-4">
              {[
                { type: 'Payment Error', desc: 'Order #4421 failed at gateway', time: '2m ago' },
                { type: 'Rider Delayed', desc: 'Rider Alex stuck in traffic for 15m', time: '10m ago' }
              ].map((alert, i) => (
                <div key={i} className="bg-white p-6 rounded-[32px] border-l-8 border-red-600 shadow-sm flex justify-between items-center">
                   <div>
                      <h4 className="font-black text-sm text-slate-900">{alert.type}</h4>
                      <p className="text-xs text-slate-400 font-medium">{alert.desc}</p>
                   </div>
                   <span className="text-[10px] font-black text-slate-300 uppercase">{alert.time}</span>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
