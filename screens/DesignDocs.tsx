import React from 'react';
import { X, BookOpen, Database, Globe, CheckCircle, Navigation, Zap, ListChecks, Server, Map, Lock, MapPin, Code, Layers } from 'lucide-react';

interface Props {
  onClose: () => void;
}

const DesignDocs: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="flex flex-col h-full bg-white overflow-y-auto font-['Plus_Jakarta_Sans']">
      <div className="p-8 border-b sticky top-0 bg-white z-50 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Architecture</h1>
          <p className="text-xs font-black text-[#E23744] uppercase tracking-widest mt-1">Production Blueprint v1.0</p>
        </div>
        <button onClick={onClose} className="p-4 bg-slate-50 rounded-full hover:bg-slate-100 transition shadow-sm"><X className="w-6 h-6" /></button>
      </div>

      <div className="p-8 space-y-16 pb-40">
        {/* Tech Stack */}
        <section>
          <h2 className="text-xl font-black mb-8 flex items-center gap-4"><Layers className="text-blue-500" /> Technology Stack</h2>
          <div className="grid grid-cols-2 gap-4">
             {[
               { title: 'Frontend', desc: 'React 19 / Tailwind / Lucide' },
               { title: 'Backend', desc: 'Node.js / Express' },
               { title: 'Realtime', desc: 'Socket.io (WebSockets)' },
               { title: 'Database', desc: 'MongoDB Atlas' },
               { title: 'Auth', desc: 'Custom OTP Simulation' },
               { title: 'Maps', desc: 'Nominatim / Leaflet' }
             ].map((item, i) => (
               <div key={i} className="bg-slate-50 p-6 rounded-[32px] border">
                  <h4 className="font-black text-xs text-slate-400 uppercase tracking-widest mb-1">{item.title}</h4>
                  <p className="text-sm font-black text-slate-900">{item.desc}</p>
               </div>
             ))}
          </div>
        </section>

        {/* API Structure */}
        <section>
          <h2 className="text-xl font-black mb-8 flex items-center gap-4"><Code className="text-green-500" /> Backend API Structure</h2>
          <div className="bg-slate-900 rounded-[32px] p-8 text-slate-400 font-mono text-xs space-y-4">
             <div className="pb-4 border-b border-slate-800">
                <span className="text-blue-400">POST</span> /api/v1/auth/otp-send <span className="text-slate-600">// Init login</span>
             </div>
             <div className="pb-4 border-b border-slate-800">
                <span className="text-blue-400">POST</span> /api/v1/orders/place <span className="text-slate-600">// Transaction</span>
             </div>
             <div className="pb-4 border-b border-slate-800">
                <span className="text-green-400">GET</span> /api/v1/restaurants/nearby <span className="text-slate-600">// Geo-spatial query</span>
             </div>
             <div className="pb-4 border-b border-slate-800">
                <span className="text-yellow-400">PATCH</span> /api/v1/rider/location <span className="text-slate-600">// Tracking update</span>
             </div>
          </div>
        </section>

        {/* Database Schema */}
        <section>
          <h2 className="text-xl font-black mb-8 flex items-center gap-4"><Database className="text-purple-500" /> Database Schema (Mongoose)</h2>
          <div className="bg-slate-50 rounded-[40px] p-10 border border-slate-200">
             <div className="space-y-8">
                <div>
                   <h4 className="font-black text-slate-900 text-sm mb-4 uppercase">Order Model</h4>
                   <pre className="text-[10px] bg-white p-6 rounded-3xl border text-slate-600 leading-relaxed">
{`{
  customerId: { type: ObjectId, ref: 'User' },
  items: [{ itemId: ObjectId, qty: Number }],
  status: { type: String, enum: OrderStatus },
  payment: { status: String, txId: String },
  deliveryLoc: { type: Point, coordinates: [Number] }
}`}
                   </pre>
                </div>
                <div>
                   <h4 className="font-black text-slate-900 text-sm mb-4 uppercase">Rider Tracker</h4>
                   <pre className="text-[10px] bg-white p-6 rounded-3xl border text-slate-600 leading-relaxed">
{`{
  riderId: ObjectId,
  currentPos: { type: Point, index: '2dsphere' },
  activeTask: ObjectId,
  isOnline: Boolean
}`}
                   </pre>
                </div>
             </div>
          </div>
        </section>

        {/* Real-time Tracking Logic */}
        <section>
          <h2 className="text-xl font-black mb-8 flex items-center gap-4"><Navigation className="text-red-500" /> Tracking Logic</h2>
          <div className="p-8 bg-red-50 rounded-[40px] border border-red-100">
             <ul className="space-y-6">
                <li className="flex gap-4">
                   <Zap className="w-5 h-5 text-red-500 flex-shrink-0" />
                   <p className="text-xs text-red-700 font-medium leading-loose">Rider client emits <code className="bg-white px-2 py-0.5 rounded border">location_update</code> every 5s via Socket.io.</p>
                </li>
                <li className="flex gap-4">
                   <Zap className="w-5 h-5 text-red-500 flex-shrink-0" />
                   <p className="text-xs text-red-700 font-medium leading-loose">Server calculates ETA using Haversine formula + average urban speed coefficients.</p>
                </li>
                <li className="flex gap-4">
                   <Zap className="w-5 h-5 text-red-500 flex-shrink-0" />
                   <p className="text-xs text-red-700 font-medium leading-loose">Customer client listens to room <code className="bg-white px-2 py-0.5 rounded border">order_[ID]</code> for seamless map movement.</p>
                </li>
             </ul>
          </div>
        </section>

        {/* Launch Checklist */}
        <section>
          <h2 className="text-xl font-black mb-8 flex items-center gap-4"><ListChecks className="text-green-600" /> Production Checklist</h2>
          <div className="space-y-4">
             {[
               { task: 'Enable CORS for Merchant Domains', status: 'Ready' },
               { task: 'Configure MongoDB TTL Index for Sessions', status: 'Pending' },
               { task: 'CDN Implementation for Food Imagery', status: 'Ready' },
               { task: 'SSL Certificate for API Endpoints', status: 'Ready' },
               { task: 'Rate Limiting for SMS Gateway Calls', status: 'Ready' }
             ].map((item, i) => (
               <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-[32px] border border-slate-100">
                  <span className="text-sm font-black text-slate-900">{item.task}</span>
                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${item.status === 'Ready' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>{item.status}</div>
               </div>
             ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DesignDocs;