
import React from 'react';
import { X, BookOpen, Database, Globe, CheckCircle, Navigation, Zap, ListChecks, Server, Map } from 'lucide-react';

interface Props {
  onClose: () => void;
}

const DesignDocs: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="flex flex-col h-full bg-white overflow-y-auto">
      <div className="p-8 border-b sticky top-0 bg-white z-50 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900">FoodGo Specs</h1>
          <p className="text-xs font-black text-orange-600 uppercase tracking-widest mt-1">Platform Blueprint v1.0</p>
        </div>
        <button onClick={onClose} className="p-3 bg-slate-50 rounded-full hover:bg-slate-100 transition shadow-sm"><X className="w-6 h-6" /></button>
      </div>

      <div className="p-8 space-y-12 pb-32">
        {/* Core Architecture */}
        <section>
          <h2 className="text-xl font-black mb-6 flex items-center gap-3"><Server className="text-blue-500" /> Backend Infrastructure</h2>
          <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 space-y-6">
             <div>
                <h4 className="font-black text-slate-900 text-sm uppercase mb-3">API Endpoints (RESTful)</h4>
                <div className="space-y-2 font-mono text-[10px] text-slate-500">
                   <p className="bg-white p-2 rounded-lg border">POST /auth/login - OTP initiation</p>
                   <p className="bg-white p-2 rounded-lg border">POST /auth/verify - JWT issue</p>
                   <p className="bg-white p-2 rounded-lg border">GET /restaurants - Geo-filtered listing</p>
                   <p className="bg-white p-2 rounded-lg border">POST /orders/place - Transaction orchestration</p>
                   <p className="bg-white p-2 rounded-lg border">PUT /orders/:id/status - State machine update</p>
                </div>
             </div>
             <div>
                <h4 className="font-black text-slate-900 text-sm uppercase mb-3">Real-time Layer</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">Socket.io cluster for location broadcasting. Delivery partners emit 'location_update' every 3s. Subscribers (Customers) join rooms based on 'orderId'.</p>
             </div>
          </div>
        </section>

        {/* Database Schema */}
        <section>
          <h2 className="text-xl font-black mb-6 flex items-center gap-3"><Database className="text-purple-500" /> Database Schema (MongoDB)</h2>
          <div className="bg-slate-900 rounded-[32px] p-6 text-slate-400 font-mono text-[11px] overflow-x-auto shadow-2xl">
            <pre className="whitespace-pre">
{`// User Profile
{
  _id: ObjectId,
  phone: String,
  addresses: [{ type: String, loc: Point }],
  savedCards: [CardToken],
  role: 'CUSTOMER' | 'RIDER' | 'OWNER'
}

// Order Management
{
  _id: ObjectId,
  customerId: ObjectId,
  items: [{ itemId: ObjectId, qty: Number }],
  status: Enum,
  delivery: {
    riderId: ObjectId,
    liveLoc: Point,
    eta: Number
  },
  paymentStatus: 'PAID' | 'PENDING'
}`}
            </pre>
          </div>
        </section>

        {/* Location Logic */}
        <section>
          <h2 className="text-xl font-black mb-6 flex items-center gap-3"><Map className="text-green-500" /> Live Location Workflow</h2>
          <div className="grid grid-cols-2 gap-4">
             <div className="p-5 bg-white border-2 border-slate-50 rounded-3xl shadow-sm">
                <h4 className="text-lg font-black text-slate-900">Rider Polling</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 leading-relaxed">Background GPS updates every 30m distance or 5s interval to save battery.</p>
             </div>
             <div className="p-5 bg-white border-2 border-slate-50 rounded-3xl shadow-sm">
                <h4 className="text-lg font-black text-slate-900">Geo-Fencing</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 leading-relaxed">Automated 'Arrived' status when within 100m of restaurant/customer.</p>
             </div>
          </div>
        </section>

        {/* Launch Checklist */}
        <section>
          <h2 className="text-xl font-black mb-6 flex items-center gap-3"><ListChecks className="text-orange-500" /> Launch Checklist</h2>
          <div className="space-y-4">
            {[
              { task: "Stripe/Razorpay Webhook verification", status: "Ready" },
              { task: "Rider KYC automated upload pipeline", status: "In Progress" },
              { task: "Push Notification deep-linking", status: "Ready" },
              { task: "Load testing (10k concurrent/min)", status: "Pending" },
              { task: "App Store / Play Store asset creation", status: "Ready" }
            ].map((check, i) => (
              <div key={i} className="flex items-center gap-4 p-5 bg-slate-50 rounded-3xl border border-slate-100">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${check.status === 'Ready' ? 'bg-green-500' : 'bg-slate-300'}`}>
                   <CheckCircle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                   <h4 className="text-sm font-black text-slate-900">{check.task}</h4>
                   <p className={`text-[10px] font-black uppercase tracking-widest ${check.status === 'Ready' ? 'text-green-500' : 'text-slate-400'}`}>{check.status}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DesignDocs;
