
import React from 'react';

export const COLORS = {
  primary: '#FFC107', // Bright Yellow-Orange
  secondary: '#FF4136', // Fox Red
  accent: '#F97316',
  success: '#22C55E',
  error: '#EF4444',
  surface: '#FFFFFF',
  background: '#F8F9FA'
};

export const CATEGORIES = [
  { id: '1', name: 'Fast food', icon: '🍔' },
  { id: '2', name: 'Fruit item', icon: '🍎' },
  { id: '3', name: 'Vegetable', icon: '🥦' },
  { id: '4', name: 'Seafood', icon: '🐟' },
  { id: '5', name: 'Italian', icon: '🍝' },
  { id: '6', name: 'Mexican', icon: '🌮' }
];

export const MOCK_RESTAURANTS = [
  {
    id: 'r1',
    name: 'Orix Healthy Kitchen',
    cuisine: ['Healthy', 'Salads'],
    rating: 4.8,
    deliveryTime: 20,
    distance: 1.2,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600',
    priceRange: 2,
    location: { lat: 34.0522, lng: -118.2437, address: "909-1/2 E 49th St, Los Angeles", type: 'Home' },
    menu: [
      { id: 'm1', name: 'Egg Pasta', description: 'Spicy chicken pasta with herbs.', price: 9.80, category: 'Popular', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=300', isVeg: false, available: true, calories: 78 },
      { id: 'm2', name: 'Chicken Dimsum', description: 'Steam chicken dimsum recipe.', price: 6.99, category: 'Popular', image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&q=80&w=300', isVeg: false, available: true, calories: 45 },
      { id: 'm3', name: 'Dan Noodles', description: 'Spicy fruit mixed noodles.', price: 8.86, category: 'Fast food', image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true, calories: 120 },
      { id: 'm4', name: 'Oni Sandwich', description: 'Fresh spicy chicken sandwich.', price: 6.72, category: 'Fast food', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=300', isVeg: false, available: true, calories: 84 }
    ]
  }
];
