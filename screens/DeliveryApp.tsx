
import React, { useState } from 'react';
import { Map, Navigation, CheckCircle2, DollarSign, ListTodo, User, ShieldCheck, Camera, Phone, MapPin, ChevronRight } from 'lucide-react';

const DeliveryApp: React.FC = () => {
  const [view, setView] = useState<'kyc' | 'dashboard' | 'task' | 'map'>('kyc');
  const [isOnline, setIsOnline] = useState(false);
  const [kycStep, setKycStep] = useState(0);

  if (view === 'kyc') {
    return (
      <div className="flex flex-col h-full bg-slate-900 text-white p-8 animate-in fade-in duration-500">
        <div className="flex-1 flex flex-col justify-center">
          <div className="w-20 h-20 bg-orange-600 rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-orange-600/30">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black mb-4">Verification Needed</h1>
          <p className="text-slate-400 font-medium mb-12">Complete your KYC to start earning with FoodGo Delivery Fleet.</p>
          
          <div className="space-y-4">
            {['Selfie Verification', 'Driving License', 'Vehicle Documents'].map((step, i) => (
              <div key={i} className={`flex items-center gap-4 p-5 rounded-3xl border-2 transition-all ${kycStep === i ? 'bg-slate-800 border-orange-500' : 'bg-slate-800/50 border-slate-800'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${kycStep > i ? 'bg-green-500' : 'bg-slate-700'}`}>
                  {kycStep > i ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm">{step}</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{kycStep === i ? 'Action Required' : 'Pending'}</p>
                </div>
                {kycStep === i && <button onClick={() => setKycStep(i + 1)} className="p-2 bg-orange-600 rounded-xl"><Camera className="w-4 h-4" /></button>}
              </div>
            ))}
          </div>
        </div>

        <button 
          disabled={kycStep < 3}
          onClick={() => { setView('dashboard'); setIsOnline(true); }}
          className="w-full bg-white text-slate-900 py-5 rounded-3xl font-black text-lg shadow-2xl shadow-white/10 active:scale-[0.98] transition-all disabled:opacity-20 mt-8"
        >
          GO TO DASHBOARD
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 animate-in fade-in duration-500">
      {/* Top Profile Strip */}
      <div className="bg-slate-900 text-white p-6 pb-20 rounded-b-[40px]">
        <div className="flex justify-between items-center mb-10">
           <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white/10 shadow-xl">
                 <img src="https://picsum.photos/seed/deliveryman/100/100" alt="Avatar" />
              </div>
              <div>
                <h2 className="font-black text-lg">Alex Rider</h2>
                <div className="flex items-center gap-1.5">
                   <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-slate-500'}`}></div>
                   <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{isOnline ? 'Live Now' : 'Off Duty'}</span>
                </div>
              </div>
           </div>
           <button 
            onClick={() => setIsOnline(!isOnline)}
            className={`px-5 py-2.5 rounded-2xl text-[10px] font-black tracking-widest transition-all ${isOnline ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500 text-white shadow-xl shadow-green-500/20'}`}
           >
             {isOnline ? 'GO OFFLINE' : 'GO ONLINE'}
           </button>
        </div>

        <div className="grid grid-cols-2 gap-4 translate-y-12">
           <div className="bg-white rounded-[32px] p-6 shadow-2xl">
              <div className="flex items-center gap-2 mb-2 text-slate-400"><DollarSign className="w-4 h-4 text-orange-600" /> <span className="text-[10px] font-black uppercase tracking-widest">Earnings</span></div>
              <p className="text-2xl font-black text-slate-900">$142.50</p>
           </div>
           <div className="bg-white rounded-[32px] p-6 shadow-2xl">
              <div className="flex items-center gap-2 mb-2 text-slate-400"><CheckCircle2 className="w-4 h-4 text-green-600" /> <span className="text-[10px] font-black uppercase tracking-widest">Completed</span></div>
              <p className="text-2xl font-black text-slate-900">12 Tasks</p>
           </div>
        </div>
      </div>

      <div className="flex-1 p-6 pt-20 space-y-8 overflow-y-auto hide-scrollbar">
         <div>
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-black text-slate-900">Active Task</h3>
               <span className="text-orange-600 font-black text-[10px] uppercase tracking-widest animate-pulse">Incoming Order</span>
            </div>

            {/* Premium Task Card */}
            <div className="bg-white rounded-[40px] p-8 shadow-2xl border border-slate-100 ring-8 ring-orange-500/5 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/5 -rotate-12 translate-x-12 -translate-y-12 rounded-full"></div>
               
               <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-3">
                     <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg shadow-orange-600/20">P</div>
                     <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Restaurant Pickup</p>
                       <h4 className="font-black text-slate-900">La Piazza Autentica</h4>
                       <p className="text-[10px] text-slate-500 font-bold">1.2 KM AWAY</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <span className="text-2xl font-black text-slate-900">$8.50</span>
                     <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest">+ $1.20 TIP</p>
                  </div>
               </div>
               
               <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-lg">D</div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer Delivery</p>
                    <h4 className="font-black text-slate-900">John Wick</h4>
                    <p className="text-[10px] text-slate-500 font-bold">75 WALL ST, NY</p>
                  </div>
               </div>

               <div className="flex gap-4">
                  <button className="flex-1 bg-slate-100 py-5 rounded-[24px] text-xs font-black uppercase tracking-widest text-slate-400 active:scale-95 transition">Reject</button>
                  <button onClick={() => setView('map')} className="flex-[2] bg-orange-600 text-white py-5 rounded-[24px] text-xs font-black uppercase tracking-widest shadow-xl shadow-orange-600/20 active:scale-95 transition-all">Accept Task</button>
               </div>
            </div>
         </div>

         {/* Stats Mini Banner */}
         <div className="bg-blue-600 rounded-[32px] p-6 text-white flex items-center justify-between">
            <div>
               <h4 className="font-black text-lg">Weekly Goal</h4>
               <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">45 / 50 Orders Delivered</p>
            </div>
            <div className="w-14 h-14 rounded-full border-4 border-white/20 flex items-center justify-center font-black">90%</div>
         </div>
      </div>

      {/* Modern Bottom Tab Bar */}
      <div className="bg-white border-t border-slate-50 px-10 py-5 flex justify-between items-center rounded-t-[40px] shadow-[0_-20px_60px_rgba(0,0,0,0.04)]">
        <button className="flex flex-col items-center gap-1.5 text-orange-600 scale-110">
          <div className="bg-orange-50 p-3 rounded-2xl"><ListTodo className="w-6 h-6" /></div>
          <span className="text-[10px] font-black uppercase tracking-widest">Tasks</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 text-slate-300">
          <Map className="w-6 h-6" />
          <span className="text-[10px] font-black uppercase tracking-widest">Map</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 text-slate-300">
          <DollarSign className="w-6 h-6" />
          <span className="text-[10px] font-black uppercase tracking-widest">Payout</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 text-slate-300">
          <User className="w-6 h-6" />
          <span className="text-[10px] font-black uppercase tracking-widest">Account</span>
        </button>
      </div>

      {/* Navigation Overlay Mock */}
      {view === 'map' && (
        <div className="fixed inset-0 z-[100] bg-slate-100 animate-in slide-in-from-bottom duration-500">
          <div className="h-[60%] bg-slate-300 relative flex items-center justify-center">
             <MapPin className="w-16 h-16 text-orange-600 animate-bounce" />
             <div className="absolute top-10 left-6 right-6 bg-slate-900 p-4 rounded-2xl text-white flex items-center gap-4">
                <Navigation className="w-10 h-10 text-orange-500" />
                <div>
                   <h3 className="font-black">Turn Left in 200m</h3>
                   <p className="text-xs text-slate-400">Onto Wall Street towards Pickup</p>
                </div>
             </div>
          </div>
          <div className="h-[40%] bg-white rounded-t-[40px] p-8 -mt-10 relative z-10 shadow-2xl">
             <div className="flex justify-between items-center mb-8">
                <div>
                   <h2 className="text-2xl font-black">Pickup Order</h2>
                   <p className="text-sm font-bold text-slate-400">At La Piazza Autentica</p>
                </div>
                <button className="bg-slate-50 p-4 rounded-2xl border border-slate-100"><Phone className="w-6 h-6 text-slate-600" /></button>
             </div>
             <button onClick={() => setView('dashboard')} className="w-full bg-green-600 text-white py-5 rounded-[24px] font-black text-lg shadow-xl shadow-green-600/20 active:scale-95 transition-all">
                I'VE ARRIVED AT RESTAURANT
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryApp;
