
import React, { useState } from 'react';
import { 
  Navigation, CheckCircle2, DollarSign, ListTodo, User, ShieldCheck, 
  Camera, Phone, MapPin, ChevronRight, Zap, History, TrendingUp,
  MessageSquare, Star, ArrowLeft, Loader2, Play
} from 'lucide-react';

const DeliveryApp: React.FC = () => {
  const [view, setView] = useState<'kyc' | 'dashboard' | 'task' | 'map'>('kyc');
  const [isOnline, setIsOnline] = useState(false);
  const [kycStep, setKycStep] = useState(0);

  if (view === 'kyc') return (
    <div className="h-full bg-slate-900 text-white p-10 flex flex-col animate-in fade-in duration-500 font-['Plus_Jakarta_Sans']">
      <div className="flex-1 flex flex-col justify-center">
        <div className="w-24 h-24 bg-[#E23744] rounded-[36px] flex items-center justify-center mb-10 shadow-2xl shadow-red-500/20">
          <ShieldCheck className="w-12 h-12" />
        </div>
        <h1 className="text-4xl font-black mb-4 leading-tight">Elite Fleet <br/>Onboarding</h1>
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-16 leading-loose">Verify documents to start earning <br/>with FoodGo delivery network.</p>
        <div className="space-y-4">
          {['Selfie ID Scan', 'Driving License', 'Vehicle Registration'].map((step, i) => (
            <div key={i} className={`flex items-center gap-5 p-6 rounded-[32px] border-2 transition-all ${kycStep === i ? 'bg-white/5 border-red-500' : 'bg-white/5 border-transparent opacity-50'}`}>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black ${kycStep > i ? 'bg-green-500' : 'bg-white/10'}`}>
                {kycStep > i ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
              </div>
              <div className="flex-1">
                <h4 className="font-black text-sm">{step}</h4>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Required</p>
              </div>
              {kycStep === i && <button onClick={() => setKycStep(i + 1)} className="p-3 bg-white text-slate-900 rounded-xl active:scale-90 transition"><Camera className="w-5 h-5" /></button>}
            </div>
          ))}
        </div>
      </div>
      <button 
        disabled={kycStep < 3}
        onClick={() => { setView('dashboard'); setIsOnline(true); }}
        className="w-full bg-[#E23744] text-white py-7 rounded-[32px] font-black text-sm uppercase tracking-widest shadow-2xl active:scale-95 transition-all disabled:opacity-20 mt-10"
      >
        Complete & Start Earning
      </button>
    </div>
  );

  return (
    <div className="h-full bg-slate-50 flex flex-col animate-in fade-in duration-500 font-['Plus_Jakarta_Sans']">
      <div className="bg-slate-900 text-white p-10 pb-24 rounded-b-[56px] shadow-2xl relative">
        <div className="flex justify-between items-center mb-12">
           <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-[24px] overflow-hidden border-2 border-white/10 shadow-2xl">
                 <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=DeliveryAlex" className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="font-black text-xl">Captain Alex</h2>
                <div className="flex items-center gap-2 mt-1">
                   <div className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-green-500' : 'bg-slate-500'} animate-pulse`} />
                   <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest">{isOnline ? 'Live • Fleet Online' : 'Offline'}</span>
                </div>
              </div>
           </div>
           <button 
            onClick={() => setIsOnline(!isOnline)}
            className={`px-6 py-3 rounded-2xl text-[10px] font-black tracking-widest transition-all ${isOnline ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-[#FFC107] text-slate-900'}`}
           >
             {isOnline ? 'GO OFFLINE' : 'GO ONLINE'}
           </button>
        </div>
        <div className="grid grid-cols-2 gap-5 absolute bottom-0 left-10 right-10 translate-y-1/2">
           <div className="bg-white rounded-[32px] p-8 shadow-2xl border border-slate-100">
              <div className="flex items-center gap-3 mb-3 text-slate-300"><DollarSign className="w-5 h-5 text-orange-600" /> <span className="text-[9px] font-black uppercase">Earnings</span></div>
              <p className="text-3xl font-black text-slate-900">₹1,420</p>
           </div>
           <div className="bg-white rounded-[32px] p-8 shadow-2xl border border-slate-100">
              <div className="flex items-center gap-3 mb-3 text-slate-300"><Zap className="w-5 h-5 text-green-600" /> <span className="text-[9px] font-black uppercase">Tasks</span></div>
              <p className="text-3xl font-black text-slate-900">12</p>
           </div>
        </div>
      </div>

      <div className="flex-1 p-10 pt-28 space-y-12 overflow-y-auto hide-scrollbar">
         <div className="animate-in slide-in-from-bottom duration-700">
            <div className="flex justify-between items-center mb-8 px-2">
               <h3 className="text-2xl font-black text-slate-900">Active Duty</h3>
               <span className="bg-orange-100 text-orange-600 px-4 py-2 rounded-full font-black text-[9px] uppercase tracking-widest border border-orange-200 animate-pulse">New Task</span>
            </div>
            <div className="bg-white rounded-[48px] p-10 shadow-2xl border border-slate-100 relative group overflow-hidden">
               <div className="flex justify-between items-start mb-12">
                  <div className="flex items-center gap-5">
                     <div className="w-16 h-16 bg-orange-600 rounded-3xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-orange-600/20">D</div>
                     <div>
                       <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Pickup At</p>
                       <h4 className="font-black text-slate-900 text-lg">Dreamland Hotel</h4>
                       <p className="text-[10px] text-orange-600 font-black uppercase mt-1">1.2 KM AWAY</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <span className="text-3xl font-black text-slate-900">₹85</span>
                     <p className="text-[9px] text-green-600 font-bold uppercase mt-1">+ ₹10 BONUS</p>
                  </div>
               </div>
               <div className="flex gap-4">
                  <button className="flex-1 bg-slate-50 py-6 rounded-[28px] text-[10px] font-black uppercase text-slate-400">Reject</button>
                  <button onClick={() => setView('map')} className="flex-[2] bg-slate-900 text-white py-6 rounded-[28px] text-[10px] font-black uppercase shadow-2xl active:scale-95 transition-all">Accept Duty</button>
               </div>
            </div>
         </div>
      </div>

      {/* Nav */}
      <div className="bg-white border-t px-12 py-6 flex justify-between items-center rounded-t-[48px] shadow-2xl sticky bottom-0">
        <button className="flex flex-col items-center gap-2 text-slate-900">
          <div className="bg-[#E23744] p-4 rounded-2xl text-white shadow-xl shadow-red-500/20 scale-110"><ListTodo className="w-7 h-7" /></div>
          <span className="text-[9px] font-black uppercase mt-1">Queue</span>
        </button>
        <button className="flex flex-col items-center gap-2 text-slate-300"><TrendingUp className="w-7 h-7" /><span className="text-[9px] font-black uppercase">Payouts</span></button>
        <button className="flex flex-col items-center gap-2 text-slate-300"><User className="w-7 h-7" /><span className="text-[9px] font-black uppercase">Profile</span></button>
      </div>

      {/* Navigation Overlay */}
      {view === 'map' && (
        <div className="fixed inset-0 z-[1000] bg-white animate-in slide-in-from-bottom duration-500 flex flex-col">
          <div className="flex-1 bg-slate-200 relative">
             <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/navigation-day-v1/static/-118.245,34.055,14,0/600x600?access_token=pk.eyJ1IjoibW9ja3VzZXIiLCJhIjoiY2p4eCJ9')] bg-cover" />
             <div className="absolute top-12 left-6 right-6 bg-slate-900 p-8 rounded-[40px] text-white flex items-center gap-6 shadow-2xl">
                <Navigation className="w-14 h-14 text-orange-500 animate-pulse" />
                <div>
                   <h3 className="font-black text-xl">Head North</h3>
                   <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">200m to Dreamland Hotel</p>
                </div>
             </div>
          </div>
          <div className="h-[35%] bg-white rounded-t-[56px] p-12 -mt-16 relative z-10 shadow-2xl">
             <div className="flex justify-between items-center mb-12">
                <div>
                   <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Vendor Contact</p>
                   <h2 className="text-3xl font-black text-slate-900">Dreamland Hub</h2>
                </div>
                <div className="flex gap-4">
                   <button className="bg-slate-50 p-6 rounded-3xl border shadow-sm text-slate-600"><Phone className="w-8 h-8" /></button>
                </div>
             </div>
             <button onClick={() => setView('dashboard')} className="w-full bg-green-600 text-white py-7 rounded-[32px] font-black text-sm uppercase shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4">
                <CheckCircle2 className="w-7 h-7" /> I HAVE PICKED UP ORDER
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryApp;
