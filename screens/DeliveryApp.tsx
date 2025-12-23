
import React, { useState } from 'react';
// Added MessageSquare to the lucide-react imports to fix the missing component error
import { Map, Navigation, CheckCircle2, DollarSign, ListTodo, User, ShieldCheck, Camera, Phone, MapPin, ChevronRight, Package, ArrowLeft, MessageSquare } from 'lucide-react';

const DeliveryApp: React.FC = () => {
  const [view, setView] = useState<'kyc' | 'dashboard' | 'task' | 'navigation'>('kyc');
  const [isOnline, setIsOnline] = useState(false);
  const [kycStep, setKycStep] = useState(0);

  if (view === 'kyc') {
    return (
      <div className="flex flex-col h-full bg-[#111] text-white p-10 animate-in fade-in duration-500">
        <div className="flex-1 flex flex-col justify-center">
          <div className="w-20 h-20 bg-red-600 rounded-[28px] flex items-center justify-center mb-10 shadow-2xl shadow-red-600/30">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black mb-4">Onboarding</h1>
          <p className="text-slate-500 font-medium mb-12">Verify your identity to start delivering in Gondal.</p>
          
          <div className="space-y-4">
            {['Selfie Verification', 'Driving License', 'RC Book'].map((step, i) => (
              <div key={i} className={`flex items-center gap-4 p-6 rounded-[32px] border-2 transition-all ${kycStep === i ? 'bg-slate-900 border-red-600' : 'bg-slate-900/50 border-transparent'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${kycStep > i ? 'bg-green-500' : 'bg-slate-800'}`}>
                  {kycStep > i ? <CheckCircle2 className="w-6 h-6" /> : i + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm">{step}</h4>
                  <p className="text-[10px] text-slate-600 font-bold uppercase">{kycStep === i ? 'Ready' : 'Pending'}</p>
                </div>
                {kycStep === i && <button onClick={() => setKycStep(i + 1)} className="p-3 bg-red-600 rounded-2xl"><Camera className="w-4 h-4" /></button>}
              </div>
            ))}
          </div>
        </div>

        <button 
          disabled={kycStep < 3}
          onClick={() => { setView('dashboard'); setIsOnline(true); }}
          className="w-full bg-white text-slate-900 py-6 rounded-[32px] font-black text-sm uppercase tracking-widest active:scale-95 disabled:opacity-10 transition-all mt-10"
        >
          Finish Setup
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 animate-in fade-in duration-500">
      <div className="bg-slate-900 text-white p-8 pb-20 rounded-b-[48px] shadow-2xl">
        <div className="flex justify-between items-center mb-10">
           <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-[24px] overflow-hidden border-2 border-white/10">
                 <img src="https://picsum.photos/seed/deliveryman/100/100" alt="Rider" />
              </div>
              <div>
                <h2 className="font-black text-xl">Rider Alex</h2>
                <div className="flex items-center gap-2">
                   <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-slate-500'}`}></div>
                   <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{isOnline ? 'Online' : 'Offline'}</span>
                </div>
              </div>
           </div>
           <button onClick={() => setIsOnline(!isOnline)} className={`px-6 py-3 rounded-2xl text-[10px] font-black tracking-widest transition-all ${isOnline ? 'bg-white/10 text-white' : 'bg-red-600 text-white shadow-xl shadow-red-600/20'}`}>
             {isOnline ? 'GO OFFLINE' : 'GO ONLINE'}
           </button>
        </div>

        <div className="grid grid-cols-2 gap-4 translate-y-12">
           <div className="bg-white rounded-[32px] p-6 shadow-xl">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2"><DollarSign className="w-4 h-4 text-green-500" /> Today</p>
              <p className="text-2xl font-black text-slate-900">$120.50</p>
           </div>
           <div className="bg-white rounded-[32px] p-6 shadow-xl">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2"><Package className="w-4 h-4 text-red-500" /> Deliveries</p>
              <p className="text-2xl font-black text-slate-900">14</p>
           </div>
        </div>
      </div>

      <div className="flex-1 p-8 pt-24 space-y-10 overflow-y-auto hide-scrollbar">
         <div>
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-black text-slate-900">New Request</h3>
               <div className="w-10 h-10 rounded-full border-4 border-red-600 border-t-transparent animate-spin"></div>
            </div>

            <div className="bg-white rounded-[40px] p-8 shadow-2xl border border-slate-100 ring-8 ring-slate-100/30">
               <div className="flex justify-between items-center mb-10">
                  <div className="bg-red-50 p-4 rounded-3xl text-red-600 font-black text-xl">1.2km</div>
                  <div className="text-right">
                     <p className="text-3xl font-black text-slate-900">$9.50</p>
                     <p className="text-[10px] text-green-600 font-black uppercase">Incl. Bonus</p>
                  </div>
               </div>
               
               <div className="space-y-8 mb-10 relative">
                  <div className="absolute left-6 top-8 bottom-8 w-1 bg-slate-100"></div>
                  <div className="flex items-center gap-4 relative">
                     <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white z-10 shadow-lg"><MapPin className="w-6 h-6" /></div>
                     <div>
                        <h4 className="font-black text-sm">Govardhan Thal</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Pickup Location</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4 relative">
                     <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-white z-10 shadow-lg"><User className="w-6 h-6" /></div>
                     <div>
                        <h4 className="font-black text-sm">Customer: Kaushik</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Delivery Location</p>
                     </div>
                  </div>
               </div>

               <div className="flex gap-4">
                  <button className="flex-1 py-5 rounded-[24px] text-xs font-black uppercase text-slate-300">Decline</button>
                  <button onClick={() => setView('navigation')} className="flex-[2] bg-red-600 text-white py-5 rounded-[24px] text-xs font-black uppercase shadow-xl shadow-red-600/30 active:scale-95 transition-all">Accept Order</button>
               </div>
            </div>
         </div>
      </div>

      <div className="bg-white border-t border-slate-50 px-10 py-5 flex justify-between items-center rounded-t-[40px] shadow-2xl">
        <button className="text-red-600"><ListTodo className="w-7 h-7" /></button>
        <button className="text-slate-300"><Map className="w-7 h-7" /></button>
        <button className="text-slate-300"><DollarSign className="w-7 h-7" /></button>
        <button className="text-slate-300"><User className="w-7 h-7" /></button>
      </div>

      {view === 'navigation' && (
        <div className="fixed inset-0 z-[100] bg-slate-900 animate-in slide-in-from-bottom duration-500">
          <div className="h-[65%] relative">
             <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                <Navigation className="w-20 h-20 text-red-600 animate-pulse rotate-45" />
             </div>
             <div className="absolute top-10 left-6 right-6 p-5 bg-white rounded-3xl shadow-2xl flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white"><ArrowLeft className="w-6 h-6" /></div>
                <div>
                   <h3 className="font-black text-lg">Turn Right in 300m</h3>
                   <p className="text-xs text-slate-400 font-bold uppercase">Onto Highway Road</p>
                </div>
             </div>
          </div>
          <div className="h-[35%] bg-white rounded-t-[48px] p-10 -mt-12 relative z-10 shadow-2xl flex flex-col justify-between">
             <div className="flex justify-between items-center">
                <div>
                   <h2 className="text-2xl font-black">Govardhan Thal</h2>
                   <p className="text-sm font-bold text-slate-400 uppercase">Order #1209 • 1.2 km away</p>
                </div>
                <div className="flex gap-3">
                   <button className="p-4 bg-slate-50 rounded-2xl border border-slate-100"><MessageSquare className="w-6 h-6" /></button>
                   <button className="p-4 bg-green-50 rounded-2xl border border-green-100"><Phone className="w-6 h-6 text-green-600" /></button>
                </div>
             </div>
             <button onClick={() => setView('dashboard')} className="w-full bg-slate-900 text-white py-6 rounded-[32px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/20 active:scale-95 transition-all">I've Arrived</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryApp;
