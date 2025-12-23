
import React from 'react';
import { X, BookOpen, Database, Globe, CheckCircle, Navigation, Zap, ListChecks, Server, Map, Lock, MapPin } from 'lucide-react';

interface Props {
  onClose: () => void;
}

const DesignDocs: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="flex flex-col h-full bg-white overflow-y-auto">
      <div className="p-8 border-b sticky top-0 bg-white z-50 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">FoodGo Specs</h1>
          <p className="text-xs font-black text-[#E23744] uppercase tracking-widest mt-1">Free Tier Strategy v1.1</p>
        </div>
        <button onClick={onClose} className="p-3 bg-slate-50 rounded-full hover:bg-slate-100 transition shadow-sm"><X className="w-6 h-6" /></button>
      </div>

      <div className="p-8 space-y-12 pb-32">
        {/* FREE APIs Guide */}
        <section>
          <h2 className="text-xl font-black mb-6 flex items-center gap-3"><Globe className="text-blue-500" /> 100% Free Service Stack</h2>
          <div className="space-y-6">
             <div className="bg-blue-50 p-6 rounded-[32px] border border-blue-100">
                <h4 className="font-black text-blue-900 text-sm uppercase mb-3 flex items-center gap-2">
                   <MapPin className="w-4 h-4" /> Free Location (OpenStreetMap)
                </h4>
                <p className="text-xs text-blue-700 leading-loose font-medium mb-4">Instead of Google Maps ($$$), we use OpenStreetMap's Nominatim API. It requires NO API KEY.</p>
                <div className="space-y-2 font-mono text-[9px] text-blue-800 break-all">
                   {/* Fix: Replaced undefined variable placeholders {lat}, {lon}, {query} with string representations to resolve build errors */}
                   <p className="bg-white/50 p-2 rounded-lg border">Reverse Geo: https://nominatim.openstreetmap.org/reverse?format=json&lat=[lat]&lon=[lon]</p>
                   <p className="bg-white/50 p-2 rounded-lg border">Search: https://nominatim.openstreetmap.org/search?format=json&q=[query]</p>
                </div>
             </div>

             <div className="bg-orange-50 p-6 rounded-[32px] border border-orange-100">
                <h4 className="font-black text-orange-900 text-sm uppercase mb-3 flex items-center gap-2">
                   <Lock className="w-4 h-4" /> Free OTP (Firebase Auth)
                </h4>
                <p className="text-xs text-orange-700 leading-loose font-medium">Firebase provides 10,000 free Phone Verifications/month for most regions. This is the industry standard for starting free.</p>
                <ul className="mt-4 space-y-2 text-[10px] font-bold text-orange-800 uppercase list-disc ml-5">
                   <li>Native SDK integration</li>
                   <li>Built-in reCAPTCHA for spam</li>
                   <li>Zero upfront server cost</li>
                </ul>
             </div>
          </div>
        </section>

        {/* Core Architecture */}
        <section>
          <h2 className="text-xl font-black mb-6 flex items-center gap-3"><Server className="text-slate-900" /> Backend Infrastructure</h2>
          <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 space-y-6">
             <div>
                <h4 className="font-black text-slate-900 text-sm uppercase mb-3">API Endpoints (RESTful)</h4>
                <div className="space-y-2 font-mono text-[10px] text-slate-500">
                   <p className="bg-white p-2 rounded-lg border">POST /auth/login - OTP initiation</p>
                   <p className="bg-white p-2 rounded-lg border">POST /auth/verify - JWT issue</p>
                   <p className="bg-white p-2 rounded-lg border">GET /restaurants - Geo-filtered listing</p>
                   <p className="bg-white p-2 rounded-lg border">POST /orders/place - Transaction orchestration</p>
                </div>
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
  addresses: [{ 
    label: 'Home' | 'Work', 
    coord: Point,
    raw: String 
  }],
  role: Enum
}

// Order State
{
  _id: ObjectId,
  customerId: ObjectId,
  status: 'PREPARING' | 'PICKED_UP'...,
  payment: { method: 'UPI', status: 'SUCCESS' }
}`}
            </pre>
          </div>
        </section>

        {/* Launch Checklist */}
        <section>
          <h2 className="text-xl font-black mb-6 flex items-center gap-3"><ListChecks className="text-orange-500" /> 0-Cost Launch Checklist</h2>
          <div className="space-y-4">
            {[
              { task: "Setup Firebase Phone Auth (Free Tier)", status: "Ready" },
              { task: "Implement Nominatim API with Rate Limiting", status: "Ready" },
              { task: "Connect Socket.io on Free Tier Heroku/Railway", status: "In Progress" },
              { task: "UI Optimization for One-Hand Usage", status: "Ready" }
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
