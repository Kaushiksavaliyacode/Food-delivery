
import React from 'react';
import { BarChart3, Store, Bike, AlertCircle, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
    <div className="flex flex-col h-full bg-slate-50">
      <div className="p-6 bg-white border-b sticky top-0 z-10">
        <h1 className="text-2xl font-black text-slate-800">Platform Admin</h1>
        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Global Overview</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-24">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
           {[
             { label: 'Revenue', val: '$1.2M', icon: <DollarSign className="w-4 h-4" />, color: 'bg-green-500' },
             { label: 'Orders', val: '45.2K', icon: <BarChart3 className="w-4 h-4" />, color: 'bg-orange-500' },
             { label: 'Vendors', val: '1,204', icon: <Store className="w-4 h-4" />, color: 'bg-blue-500' },
             { label: 'Riders', val: '8,421', icon: <Bike className="w-4 h-4" />, color: 'bg-purple-500' }
           ].map((stat, idx) => (
             <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className={`${stat.color} w-8 h-8 rounded-lg flex items-center justify-center text-white mb-3 shadow-lg`}>
                   {stat.icon}
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <div className="flex items-center gap-2">
                   <h3 className="text-lg font-black">{stat.val}</h3>
                   <span className="text-[10px] text-green-600 font-bold">+12%</span>
                </div>
             </div>
           ))}
        </div>

        {/* Chart View */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
           <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold">Growth Trends</h3>
              <select className="text-xs bg-slate-50 border p-1 rounded font-bold">
                 <option>Last 7 Days</option>
                 <option>Last 30 Days</option>
              </select>
           </div>
           <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700}} />
                  <Tooltip cursor={{fill: '#F8FAFC'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                  <Bar dataKey="orders" fill="#FF4B3A" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Urgent Issues */}
        <div className="space-y-4">
           <h3 className="font-bold flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              Critical Disputes (3)
           </h3>
           <div className="space-y-3">
              {[1, 2].map(i => (
                <div key={i} className="bg-white p-4 rounded-2xl border-l-4 border-red-500 shadow-sm">
                   <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-sm">Late Delivery - Order #4421</h4>
                      <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded">HIGH</span>
                   </div>
                   <p className="text-xs text-slate-500 mb-3">Customer requesting full refund for cold food after 45m delay.</p>
                   <div className="flex gap-2">
                      <button className="text-[10px] font-bold bg-slate-100 px-3 py-1.5 rounded-lg">View Logs</button>
                      <button className="text-[10px] font-bold bg-red-600 text-white px-3 py-1.5 rounded-lg">Resolve</button>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
