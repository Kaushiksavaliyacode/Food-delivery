
import React from 'react';

export const COLORS = {
  primary: '#F36E35', // Match the specific orange in the screenshot
  secondary: '#FF4136',
  accent: '#F97316',
  success: '#22C55E',
  error: '#EF4444',
  surface: '#FFFFFF',
  background: '#F8F9FB'
};

export const CATEGORIES = [
  { id: '1', name: 'Biryani', icon: '🍚' },
  { id: '2', name: 'Pizza', icon: '🍕' },
  { id: '3', name: 'Burger', icon: '🍔' },
  { id: '4', name: 'Chinese', icon: '🍜' },
  { id: '5', name: 'Snacks', icon: '🍟' },
  { id: '6', name: 'Drinks', icon: '🥤' }
];

export const MOCK_RESTAURANTS = [
  {
    id: 'r1',
    name: 'Dreamland Hotel',
    cuisine: ['Punjabi', 'Chinese', 'South Indian'],
    rating: 4.5,
    deliveryTime: 35,
    distance: 2.5,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600',
    priceRange: 2,
    location: { lat: 34.0522, lng: -118.2437, address: "Station Road, Mumbai", type: 'Work' },
    menu: [
      { id: 'm1', name: 'Paneer Tikka', description: 'Grilled cottage cheese with spices.', price: 240, category: 'Starters', image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=300', isVeg: true, available: true },
      { id: 'm2', name: 'Butter Chicken', description: 'Creamy tomato gravy with chicken.', price: 380, category: 'Main Course', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300', isVeg: false, available: true }
    ]
  },
  {
    id: 'r2',
    name: 'Gondal Food Court',
    cuisine: ['Biryani', 'North Indian'],
    rating: 4.2,
    deliveryTime: 25,
    distance: 1.2,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=600',
    priceRange: 1,
    location: { lat: 19.0760, lng: 72.8777, address: "Mumbai, Maharashtra", type: 'Home' },
    menu: []
  },
  {
    id: 'r3',
    name: 'Spice Garden',
    cuisine: ['Continental', 'Italian'],
    rating: 4.8,
    deliveryTime: 40,
    distance: 3.5,
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600',
    priceRange: 3,
    location: { lat: 19.0760, lng: 72.8777, address: "Bandra, Mumbai", type: 'Home' },
    menu: []
  }
];
