
import React from 'react';
import { X, BookOpen, Database, Globe, CheckCircle, Navigation, Zap, ListChecks, Server, Code } from 'lucide-react';

interface Props {
  onClose: () => void;
}

const DesignDocs: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="flex flex-col h-full bg-white overflow-y-auto hide-scrollbar">
      <div className="p-10 border-b sticky top-0 bg-white z-50 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Kaushik Food</h1>
          <p className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em] mt-2">Production Blueprint v3.0</p>
        </div>
        <button onClick={onClose} className="p-4 bg-slate-50 rounded-full hover:bg-slate-100 transition shadow-sm"><X className="w-6 h-6" /></button>
      </div>

      <div className="p-10 space-y-16 pb-32">
        <section>
          <h2 className="text-xl font-black mb-8 flex items-center gap-3"><Server className="text-red-600" /> API Endpoints</h2>
          <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100 space-y-6">
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase mb-3">Auth Service</p>
               <ul className="space-y-2 font-mono text-[11px]">
                  <li className="flex gap-2"><span className="text-green-600 font-bold">POST</span> /v1/auth/otp/send</li>
                  <li className="flex gap-2"><span className="text-green-600 font-bold">POST</span> /v1/auth/otp/verify</li>
               </ul>
            </div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase mb-3">Core Engine</p>
               <ul className="space-y-2 font-mono text-[11px]">
                  <li className="flex gap-2"><span className="text-blue-600 font-bold">GET</span> /v1/restaurants/nearby</li>
                  <li className="flex gap-2"><span className="text-blue-600 font-bold">GET</span> /v1/restaurants/:id/menu</li>
                  <li className="flex gap-2"><span className="text-green-600 font-bold">POST</span> /v1/orders/create</li>
                  <li className="flex gap-2"><span className="text-blue-600 font-bold">GET</span> /v1/orders/:id/track</li>
               </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-black mb-8 flex items-center gap-3"><Database className="text-blue-600" /> Database Schema</h2>
          <div className="bg-slate-900 rounded-[40px] p-10 text-slate-400 font-mono text-[11px] overflow-x-auto shadow-2xl">
            <pre className="whitespace-pre">
{`// User Profile Collection
{
  id: ObjectId,
  phone: String (Unique),
  roles: Array["CUSTOMER", "RIDER"],
  addresses: [{
    type: Enum["Home", "Work"],
    loc: { type: "Point", coordinates: [Lng, Lat] }
  }],
  walletBalance: Decimal
}

// Order State (Real-time)
{
  orderId: UUID,
  status: Enum["CONFIRMED", "PREPARING", ...],
  liveLocation: { lat: Float, lng: Float },
  riderId: ObjectId,
  eta: Int (Seconds),
  updatedAt: Timestamp
}`}
            </pre>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-black mb-8 flex items-center gap-3"><Navigation className="text-green-600" /> Live Location Logic</h2>
          <div className="grid grid-cols-1 gap-6">
            <div className="p-8 bg-white border-2 border-slate-50 rounded-[40px] shadow-sm">
               <h4 className="font-black text-slate-900 mb-2">Sync Algorithm</h4>
               <p className="text-xs text-slate-500 leading-relaxed">Rider app pushes location delta every 3s via Socket.io. Backend calculates distance using Haversine formula and publishes update to Customer's specific channel. Frontend uses interpolation for smooth map animations.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-black mb-8 flex items-center gap-3"><ListChecks className="text-purple-600" /> Launch Checklist</h2>
          <div className="space-y-4">
            {[
              "Integration with Razorpay/UPI Sandbox.",
              "Rider background check API implementation.",
              "Cloudinary setup for restaurant menu images.",
              "Geo-sharding MongoDB for Gondal specific traffic.",
              "Firebase Cloud Messaging for push status alerts."
            ].map((check, i) => (
              <div key={i} className="flex items-center gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100 text-[11px] font-black text-slate-700 uppercase tracking-widest">
                <div className="w-8 h-8 rounded-xl bg-green-500 flex items-center justify-center text-white text-xs">✓</div>
                {check}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DesignDocs;
