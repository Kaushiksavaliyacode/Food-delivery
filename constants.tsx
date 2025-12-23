
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
  { id: '1', name: 'Soups', icon: '🥣' },
  { id: '2', name: 'Starters', icon: '🍢' },
  { id: '3', name: 'Main Course', icon: '🍛' },
  { id: '4', name: 'Chinese', icon: '🍜' },
  { id: '5', name: 'South Indian', icon: '🍪' },
  { id: '6', name: 'Tandoor', icon: '🫓' },
  { id: '7', name: 'Pizza & Snacks', icon: '🍕' }
];

export const MOCK_RESTAURANTS = [
  {
    id: 'r1',
    name: 'Dreamland Hotel',
    cuisine: ['Punjabi', 'Chinese', 'South Indian', 'Continental'],
    rating: 4.5,
    deliveryTime: 35,
    distance: 2.5,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600',
    priceRange: 2,
    location: { lat: 34.0522, lng: -118.2437, address: "Station Road, Dreamland", type: 'Work' },
    menu: [
      // SOUPS
      { id: 'm22', name: 'Tomato Soup', description: 'Classic rich tomato soup served with croutons.', price: 110.00, category: 'Soups', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true, calories: 120 },
      { id: 'm29', name: 'Veg. Hot & Sour Soup', description: 'Spicy and tangy vegetable soup.', price: 130.00, category: 'Soups', image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true, calories: 140 },
      
      // STARTERS
      { id: 'm35', name: 'Finger Chip', description: 'Crispy salted potato fries.', price: 140.00, category: 'Starters', image: 'https://images.unsplash.com/photo-1573014102299-cbff47d28747?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true, calories: 320 },
      { id: 'm36', name: 'Veg. Manchurian (Dry)', description: 'Deep fried veg balls in spicy soya sauce.', price: 220.00, category: 'Starters', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true, calories: 280 },
      { id: 'm39', name: 'Paneer Chilly (Dry)', description: 'Classic Indo-Chinese paneer starter.', price: 285.00, category: 'Starters', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c175f0?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true, calories: 350 },
      
      // CHINESE
      { id: 'm52', name: 'Schezwan Noodles', description: 'Noodles tossed in spicy Schezwan sauce.', price: 220.00, category: 'Chinese', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true, calories: 410 },
      { id: 'm55', name: 'Veg. Chowmein', description: 'Stir fried noodles with fresh vegetables.', price: 205.00, category: 'Chinese', image: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true, calories: 380 },
      
      // MAIN COURSE (PANEER)
      { id: 'm111', name: 'Kaju Butter Masala', description: 'Rich cashew based gravy with butter.', price: 315.00, category: 'Main Course', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true, calories: 480 },
      { id: 'm119', name: 'Paneer Butter Masala', description: 'Cottage cheese in creamy tomato gravy.', price: 265.00, category: 'Main Course', image: 'https://images.unsplash.com/photo-1601050633729-19548301ecf8?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true, calories: 450 },
      { id: 'm126', name: 'Paneer Kadai', description: 'Paneer cooked with bell peppers and ground spices.', price: 265.00, category: 'Main Course', image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true, calories: 420 },
      
      // DOSA
      { id: 'd03', name: 'Masala Dosa', description: 'Crispy rice crepe filled with spiced potato.', price: 110.00, category: 'South Indian', image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true, calories: 310 },
      { id: 'd07', name: 'Cheese Dosa', description: 'Crispy dosa loaded with melted cheese.', price: 155.00, category: 'South Indian', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true, calories: 420 },
      
      // TANDOOR
      { id: 't139', name: 'Butter Roti', description: 'Whole wheat bread with butter.', price: 38.00, category: 'Tandoor', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true, calories: 110 },
      { id: 't146', name: 'Butter Naan', description: 'Leavened refined flour bread with butter.', price: 65.00, category: 'Tandoor', image: 'https://images.unsplash.com/photo-1601050633729-19548301ecf8?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true, calories: 220 },
      
      // PIZZA / SNACKS
      { id: 'p192', name: 'Veg. Pizza', description: 'Mixed veg pizza with cheese.', price: 190.00, category: 'Pizza & Snacks', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true, calories: 540 },
      { id: 's173', name: 'Veg. Sandwich', description: 'Fresh vegetable sandwich.', price: 100.00, category: 'Pizza & Snacks', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true, calories: 250 },
    ]
  }
];
