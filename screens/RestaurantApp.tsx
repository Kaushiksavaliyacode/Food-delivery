
import React, { useState } from 'react';
import { LayoutDashboard, UtensilsCrossed, Package, TrendingUp, Settings, ChevronRight, Plus, X, Camera, Trash2, Edit3, Image as ImageIcon } from 'lucide-react';
import { MenuItem } from '../types';

const RestaurantApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { id: 'm1', name: 'Margherita Pizza', description: 'Classic mozzarella and basil.', price: 220, category: 'Pizza', image: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true },
    { id: 'm2', name: 'Cheesy 7 Pizza', description: 'Loaded with 7 types of cheese.', price: 350, category: 'Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true }
  ]);
  const [photos, setPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=600'
  ]);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', price: '', category: 'Pizza', description: '' });

  const addMenuItem = () => {
    if (!newItem.name || !newItem.price) return;
    const item: MenuItem = {
      id: 'm' + Date.now(),
      name: newItem.name,
      description: newItem.description,
      price: parseFloat(newItem.price),
      category: newItem.category,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=300',
      isVeg: true,
      available: true
    };
    setMenuItems([...menuItems, item]);
    setShowAddMenu(false);
    setNewItem({ name: '', price: '', category: 'Pizza', description: '' });
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems(menuItems.filter(m => m.id !== id));
  };

  const addPhoto = () => {
    setPhotos([...photos, 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=600']);
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'orders':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg">Active Orders (3)</h2>
              <button className="text-orange-600 text-xs font-bold">History</button>
            </div>
            <div className="space-y-4">
              {[1, 2].map(i => (
                <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                   <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400">ORDER #FF290{i}</p>
                        <h4 className="font-bold">John Wick</h4>
                      </div>
                      <div className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                        Preparing (12m left)
                      </div>
                   </div>
                   <div className="space-y-2 mb-4">
                      <p className="text-xs text-slate-600">1x Margherita Pizza (Regular)</p>
                      <p className="text-xs text-slate-600">2x Coke Zero (500ml)</p>
                   </div>
                   <div className="flex gap-2">
                      <button className="flex-1 bg-slate-100 py-3 rounded-xl text-xs font-bold text-slate-600">VIEW DETAILS</button>
                      <button className="flex-1 bg-green-600 py-3 rounded-xl text-xs font-bold text-white shadow-lg">READY TO SHIP</button>
                   </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'menu':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg">Menu Items ({menuItems.length})</h2>
              <button onClick={() => setShowAddMenu(true)} className="bg-orange-600 text-white p-2 rounded-xl flex items-center gap-1 text-xs font-bold shadow-lg shadow-orange-600/20">
                <Plus className="w-4 h-4" /> Add Item
              </button>
            </div>
            <div className="space-y-4">
              {menuItems.map(item => (
                <div key={item.id} className="bg-white p-4 rounded-2xl flex items-center gap-4 border border-slate-100 shadow-sm relative group">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                    <img src={item.image} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm">{item.name}</h4>
                    <p className="text-[10px] text-slate-400 font-medium line-clamp-1">{item.description}</p>
                    <p className="text-sm font-black text-orange-600 mt-1">${item.price}</p>
                  </div>
                  <button onClick={() => deleteMenuItem(item.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      case 'photos':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg">Restaurant Gallery</h2>
              <button onClick={addPhoto} className="bg-blue-600 text-white p-2 rounded-xl flex items-center gap-1 text-xs font-bold shadow-lg shadow-blue-600/20">
                <Camera className="w-4 h-4" /> Upload
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {photos.map((photo, idx) => (
                <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden shadow-sm group">
                  <img src={photo} className="w-full h-full object-cover" />
                  <button onClick={() => removePhoto(idx)} className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <button onClick={addPhoto} className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-blue-400 hover:text-blue-400 transition-colors">
                <ImageIcon className="w-8 h-8" />
                <span className="text-[10px] font-bold uppercase">Add Photo</span>
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      <div className="p-6 bg-white border-b sticky top-0 z-20">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-bold">Kaushik Healthy Kitchen</h1>
            <p className="text-xs text-slate-500 font-medium">Store status: <span className="text-green-600 font-bold">Open</span></p>
          </div>
          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
             <TrendingUp className="w-5 h-5 text-slate-600" />
          </div>
        </div>
        
        <div className="flex gap-4">
           <div className="flex-1 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Today's Sales</p>
              <p className="text-xl font-black text-slate-800">$1,240</p>
           </div>
           <div className="flex-1 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Orders</p>
              <p className="text-xl font-black text-slate-800">42</p>
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-24">
        {renderContent()}
      </div>

      <div className="bg-white border-t px-6 py-3 flex justify-between items-center rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.03)] fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto z-30">
        <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl transition-all ${activeTab === 'dashboard' ? 'text-orange-600 bg-orange-50' : 'text-slate-300'}`}>
          <LayoutDashboard className="w-6 h-6" />
          <span className="text-[10px] font-bold">Home</span>
        </button>
        <button onClick={() => setActiveTab('orders')} className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl transition-all ${activeTab === 'orders' ? 'text-orange-600 bg-orange-50' : 'text-slate-300'}`}>
          <Package className="w-6 h-6" />
          <span className="text-[10px] font-bold">Orders</span>
        </button>
        <button onClick={() => setActiveTab('menu')} className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl transition-all ${activeTab === 'menu' ? 'text-orange-600 bg-orange-50' : 'text-slate-300'}`}>
          <UtensilsCrossed className="w-6 h-6" />
          <span className="text-[10px] font-bold">Menu</span>
        </button>
        <button onClick={() => setActiveTab('photos')} className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl transition-all ${activeTab === 'photos' ? 'text-orange-600 bg-orange-50' : 'text-slate-300'}`}>
          <ImageIcon className="w-6 h-6" />
          <span className="text-[10px] font-bold">Photos</span>
        </button>
      </div>

      {/* Add Menu Modal */}
      {showAddMenu && (
        <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end animate-in fade-in duration-300">
          <div className="w-full bg-white rounded-t-[40px] p-8 animate-in slide-in-from-bottom duration-500">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black">Add Menu Item</h3>
              <button onClick={() => setShowAddMenu(false)} className="p-2 bg-slate-50 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <input 
                type="text" placeholder="Dish Name" 
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 outline-none focus:border-orange-500 font-bold"
                value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})}
              />
              <div className="flex gap-4">
                <input 
                  type="number" placeholder="Price ($)" 
                  className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 outline-none focus:border-orange-500 font-bold"
                  value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})}
                />
                <select 
                  className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 outline-none focus:border-orange-500 font-bold"
                  value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})}
                >
                  {CATEGORIES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <textarea 
                placeholder="Description" 
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 outline-none focus:border-orange-500 font-bold h-24 resize-none"
                value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})}
              />
              <button onClick={addMenuItem} className="w-full bg-orange-600 text-white py-5 rounded-2xl font-black shadow-xl shadow-orange-600/20 uppercase tracking-widest mt-4">
                Save Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import { CATEGORIES as APP_CATEGORIES } from '../constants';
const CATEGORIES = APP_CATEGORIES;

export default RestaurantApp;
