
import React, { useState } from 'react';
import { UserRole, AppState } from './types';
import CustomerApp from './screens/CustomerApp';
import RestaurantApp from './screens/RestaurantApp';
import DeliveryApp from './screens/DeliveryApp';
import AdminPanel from './screens/AdminPanel';
import DesignDocs from './screens/DesignDocs';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>(UserRole.CUSTOMER);
  const [showDocs, setShowDocs] = useState(false);
  const [appState, setAppState] = useState<AppState>({
    role: UserRole.CUSTOMER,
    currentLocation: null,
    cart: [],
    activeOrder: null,
    isLoggedIn: false
  });

  const renderApp = () => {
    if (showDocs) return <DesignDocs onClose={() => setShowDocs(false)} />;

    switch (role) {
      case UserRole.CUSTOMER:
        return <CustomerApp state={appState} setState={setAppState} />;
      case UserRole.RESTAURANT:
        return <RestaurantApp />;
      case UserRole.DELIVERY:
        return <DeliveryApp />;
      case UserRole.ADMIN:
        return <AdminPanel />;
      default:
        return <CustomerApp state={appState} setState={setAppState} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center">
      {/* Platform Role Switcher */}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col items-end gap-3">
         <button 
          onClick={() => setShowDocs(!showDocs)}
          className="bg-slate-900 text-white px-6 py-2.5 rounded-2xl text-[10px] font-black tracking-widest shadow-2xl hover:bg-slate-800 active:scale-95 transition-all uppercase"
        >
          {showDocs ? "Close Specs" : "View Blueprint"}
        </button>
        <div className="flex bg-white/80 backdrop-blur-xl rounded-[24px] p-1.5 shadow-2xl border border-white/20">
          {Object.values(UserRole).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-tighter transition-all ${
                role === r ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' : 'text-slate-400 hover:bg-slate-50'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Main Responsive Mobile Viewport Container */}
      <div className="w-full max-w-[480px] h-screen bg-white shadow-[0_0_80px_rgba(0,0,0,0.1)] relative flex flex-col overflow-hidden sm:rounded-[48px] sm:my-8 sm:h-[calc(100vh-64px)]">
        {renderApp()}
      </div>
    </div>
  );
};

export default App;
