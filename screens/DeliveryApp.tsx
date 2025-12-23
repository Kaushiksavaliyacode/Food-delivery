
import React, { useState } from 'react';
import { 
  Map, Navigation, CheckCircle2, DollarSign, ListTodo, User, ShieldCheck, 
  Camera, Phone, MapPin, ChevronRight, Zap, ArrowLeft, History, TrendingUp,
  MessageSquare, Star
} from 'lucide-react';

const DeliveryApp: React.FC = () => {
  const [view, setView] = useState<'kyc' | 'dashboard' | 'task' | 'map'>('kyc');
  const [isOnline, setIsOnline] = useState(false);
  const [kycStep, setKycStep] = useState(0);

  if (view === 'kyc') {
    return (
      <div className="flex flex-col h-full bg-slate-900 text-white p-10 animate-in fade-in duration-500 font-['Plus_Jakarta_Sans']">
        <div className="flex-1 flex flex-col justify-center">
          <div className="w-24 h-24 bg-orange-600 rounded-[36px] flex items-center justify-center mb-10 shadow-2xl shadow-orange-600/30">
            <ShieldCheck className="w-12 h-12" />
          </div>
          <h1 className="text-4xl font-black mb-4 leading-tight">Identity <br/>Verification</h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-16 leading-loose">Upload your documents to join <br/>the FoodGo elite fleet.</p>
          
          <div className="space-y-5">
            {[
              { label: 'Selfie Verification', desc: 'Real-time face scan' },
              { label: 'Driving License', desc: 'Front & Back image' },
              { label: 'Vehicle Documents', desc: 'Registration & Insurance' }
            ].map((step, i) => (
              <div key={i} className={`flex items-center gap-5 p-6 rounded-[32px] border-2 transition-all ${kycStep === i ? 'bg-white/5 border-orange-500' : 'bg-white/5 border-transparent opacity-60'}`}>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black ${kycStep > i ? 'bg-green-500' : kycStep === i ? 'bg-orange-500' : 'bg-white/10'}`}>
                  {kycStep > i ? <CheckCircle2 className="w-6 h-6" /> : i + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-sm">{step.label}</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{step.desc}</p>
                </div>
                {kycStep === i && <button onClick={() => setKycStep(i + 1)} className="p-3 bg-white text-slate-900 rounded-xl shadow-lg active:scale-90 transition"><Camera className="w-5 h-5" /></button>}
              </div>
            ))}
          </div>
        </div>

        <button 
          disabled={kycStep < 3}
          onClick={() => { setView('dashboard'); setIsOnline(true); }}
          className="w-full bg-orange-600 text-white py-7 rounded-[32px] font-black text-sm uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all disabled:opacity-20 mt-10"
        >
          Activate Fleet Access
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 animate-in fade-in duration-500 font-['Plus_Jakarta_Sans']">
      
      {/* Dynamic Header */}
      <div className="bg-slate-900 text-white p-8 pb-20 rounded-b-[56px] shadow-2xl">
        <div className="flex justify-between items-center mb-10">
           <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-[24px] overflow-hidden border-2 border-white/10 shadow-2xl">
                 <img src="https://picsum.photos/seed/deliveryman/100/100" className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="font-black text-xl">Alex Rider</h2>
                <div className="flex items-center gap-2 mt-1">
                   <div className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-green-500' : 'bg-slate-500'} animate-pulse`}></div>
                   <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{isOnline ? 'Online • MG Road' : 'Offline'}</span>
                </div>
              </div>
           </div>
           <button 
            onClick={() => setIsOnline(!isOnline)}
            className={`px-6 py-3 rounded-2xl text-[10px] font-black tracking-widest transition-all ${isOnline ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-[#FFC107] text-slate-900 shadow-xl'}`}
           >
             {isOnline ? 'GO OFFLINE' : 'GO ONLINE'}
           </button>
        </div>

        <div className="grid grid-cols-2 gap-5 translate-y-12">
           <div className="bg-white rounded-[32px] p-7 shadow-2xl border border-white/10">
              <div className="flex items-center gap-3 mb-3 text-slate-400"><DollarSign className="w-5 h-5 text-orange-600" /> <span className="text-[10px] font-black uppercase tracking-widest">Today</span></div>
              <p className="text-3xl font-black text-slate-900">₹1,420</p>
           </div>
           <div className="bg-white rounded-[32px] p-7 shadow-2xl border border-white/10">
              <div className="flex items-center gap-3 mb-3 text-slate-400"><Zap className="w-5 h-5 text-green-600" /> <span className="text-[10px] font-black uppercase tracking-widest">Orders</span></div>
              <p className="text-3xl font-black text-slate-900">12</p>
           </div>
        </div>
      </div>

      <div className="flex-1 p-8 pt-24 space-y-10 overflow-y-auto hide-scrollbar">
         
         {/* Active Task Section */}
         <div className="animate-in slide-in-from-bottom duration-700">
            <div className="flex justify-between items-center mb-8 px-2">
               <h3 className="text-2xl font-black text-slate-900">Incoming Task</h3>
               <span className="bg-orange-100 text-orange-600 px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest animate-pulse border border-orange-200">New Request</span>
            </div>

            <div className="bg-white rounded-[48px] p-10 shadow-2xl border border-slate-100 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-48 h-48 bg-orange-600/5 -rotate-12 translate-x-16 -translate-y-16 rounded-full"></div>
               
               <div className="flex justify-between items-start mb-10">
                  <div className="flex items-center gap-5">
                     <div className="w-14 h-14 bg-orange-600 rounded-[20px] flex items-center justify-center text-white font-black text-xl shadow-xl shadow-orange-600/20">D</div>
                     <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pickup From</p>
                       <h4 className="font-black text-slate-900 text-lg">Dreamland Hotel</h4>
                       <p className="text-[10px] text-orange-600 font-black uppercase">1.2 KM AWAY</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <span className="text-3xl font-black text-slate-900">₹85</span>
                     <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest mt-1">+ ₹10 BONUS</p>
                  </div>
               </div>
               
               <div className="flex items-center gap-5 mb-12">
                  <div className="w-14 h-14 bg-slate-900 rounded-[20px] flex items-center justify-center text-white font-black text-xl shadow-xl shadow-slate-900/10">C</div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Deliver To</p>
                    <h4 className="font-black text-slate-900 text-lg">John Wick</h4>
                    <p className="text-[10px] text-slate-500 font-black uppercase">MG ROAD, SECTOR 4</p>
                  </div>
               </div>

               <div className="flex gap-4">
                  <button className="flex-1 bg-slate-50 py-6 rounded-[28px] text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-100 active:scale-95 transition">Reject</button>
                  <button onClick={() => setView('map')} className="flex-[2] bg-slate-900 text-white py-6 rounded-[28px] text-[10px] font-black uppercase tracking-widest shadow-2xl active:scale-95 transition-all">Accept Task</button>
               </div>
            </div>
         </div>

         {/* History / Performance */}
         <div className="space-y-6">
            <h3 className="text-xl font-black text-slate-900 px-2">Recent Payouts</h3>
            <div className="space-y-4">
               {[
                 { id: '#4421', amount: '₹120', time: '14:20', status: 'Settled' },
                 { id: '#4419', amount: '₹95', time: '12:05', status: 'Settled' }
               ].map(item => (
                 <div key={item.id} className="bg-white p-6 rounded-[32px] border border-slate-100 flex items-center justify-between group hover:border-orange-200 transition-all">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-orange-50 group-hover:text-orange-600 transition-colors"><History className="w-6 h-6" /></div>
                       <div>
                          <h4 className="font-black text-slate-900">Order {item.id}</h4>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.time} • {item.status}</p>
                       </div>
                    </div>
                    <span className="text-lg font-black text-slate-900">{item.amount}</span>
                 </div>
               ))}
            </div>
         </div>
      </div>

      {/* Modern Bottom Navigation */}
      <div className="bg-white border-t border-slate-100 px-12 py-6 flex justify-between items-center rounded-t-[48px] shadow-[0_-20px_50px_rgba(0,0,0,0.05)]">
        <button className="flex flex-col items-center gap-2 text-slate-900">
          <div className="bg-orange-500 p-4 rounded-[22px] text-white shadow-xl shadow-orange-500/20 scale-110"><ListTodo className="w-6 h-6" /></div>
          <span className="text-[9px] font-black uppercase tracking-widest mt-1">Tasks</span>
        </button>
        <button className="flex flex-col items-center gap-2 text-slate-300 hover:text-slate-500 transition-colors">
          <TrendingUp className="w-6 h-6" />
          <span className="text-[9px] font-black uppercase tracking-widest">Earnings</span>
        </button>
        <button className="flex flex-col items-center gap-2 text-slate-300 hover:text-slate-500 transition-colors">
          <History className="w-6 h-6" />
          <span className="text-[9px] font-black uppercase tracking-widest">History</span>
        </button>
        <button className="flex flex-col items-center gap-2 text-slate-300 hover:text-slate-500 transition-colors">
          <User className="w-6 h-6" />
          <span className="text-[9px] font-black uppercase tracking-widest">Profile</span>
        </button>
      </div>

      {/* Navigation Overlay Mock */}
      {view === 'map' && (
        <div className="fixed inset-0 z-[1000] bg-slate-100 animate-in slide-in-from-bottom duration-500">
          <div className="h-[65%] bg-slate-200 relative">
             <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/navigation-day-v1/static/-118.245,34.055,14,0/600x600?access_token=pk.eyJ1IjoibW9ja3VzZXIiLCJhIjoiY2p4eCJ9')] bg-cover bg-center"></div>
             <div className="absolute top-12 left-6 right-6 bg-slate-900 p-6 rounded-[32px] text-white flex items-center gap-5 shadow-2xl border border-white/10">
                <Navigation className="w-12 h-12 text-orange-500 animate-pulse" />
                <div>
                   <h3 className="font-black text-lg">Turn Left in 200m</h3>
                   <p className="text-xs text-slate-400 uppercase tracking-widest font-black">Onto Dreamland Sector 4</p>
                </div>
             </div>
          </div>
          <div className="h-[40%] bg-white rounded-t-[56px] p-10 -mt-16 relative z-10 shadow-[0_-20px_60px_rgba(0,0,0,0.2)]">
             <div className="flex justify-between items-center mb-10">
                <div>
                   <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">Pick Up At</p>
                   <h2 className="text-3xl font-black text-slate-900">Dreamland Hotel</h2>
                </div>
                <div className="flex gap-3">
                   <button className="bg-slate-50 p-5 rounded-[24px] border border-slate-100 shadow-sm text-slate-600"><Phone className="w-7 h-7" /></button>
                   <button className="bg-slate-50 p-5 rounded-[24px] border border-slate-100 shadow-sm text-slate-600"><MessageSquare className="w-7 h-7" /></button>
                </div>
             </div>
             <button onClick={() => setView('dashboard')} className="w-full bg-green-600 text-white py-7 rounded-[32px] font-black text-sm uppercase tracking-widest shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4">
                <CheckCircle2 className="w-6 h-6" />
                I'VE PICKED UP THE ORDER
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryApp;
