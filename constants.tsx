
import React from 'react';

export const COLORS = {
  primary: '#E23744', // Zomato Red
  secondary: '#2D2D2D',
  accent: '#F4F4F4',
  success: '#48BB78',
  error: '#F56565',
  surface: '#FFFFFF',
  background: '#FFFFFF'
};

export const CATEGORIES = [
  { id: '1', name: 'Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=200' },
  { id: '2', name: 'Biryani', image: 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&q=80&w=200' },
  { id: '3', name: 'Veg Meal', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=200' },
  { id: '4', name: 'Burger', image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80&w=200' },
  { id: '5', name: 'Paneer', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=200' },
  { id: '6', name: 'Sandwich', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=200' },
  { id: '7', name: 'Paratha', image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&q=80&w=200' },
  { id: '8', name: 'North Indian', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=200' }
];

export const MOCK_RESTAURANTS = [
  {
    id: 'r1',
    name: 'TMG hotel',
    cuisine: ['Indian', 'Chinese'],
    rating: 4.2,
    ratingCount: 1200,
    deliveryTime: 30,
    distance: 2.1,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600',
    photos: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600'],
    priceRange: 2,
    isOpen: true,
    location: { lat: 21.9567, lng: 70.7932, address: "Station Road, Gondal", type: 'Other' },
    menu: [
      { id: 'm1', name: 'Special Veg Thali', description: 'Complete meal with seasonal veggies.', price: 250, category: 'Veg Meal', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true }
    ]
  },
  {
    id: 'r5',
    name: "La Pino'z Pizza",
    cuisine: ['Italian', 'Pizza'],
    rating: 4.4,
    ratingCount: 5400,
    deliveryTime: 25,
    distance: 1.5,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600',
    photos: ['https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600'],
    priceRange: 2,
    isOpen: true,
    location: { lat: 21.9600, lng: 70.7950, address: "Civic Centre, Gondal", type: 'Other' },
    menu: [
      { id: 'm5', name: 'Cheesy 7 Pizza', description: 'Classic cheesy pizza.', price: 350, category: 'Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true }
    ]
  },
  {
    id: 'r7',
    name: 'Govardhan Thal',
    cuisine: ['Pure Veg', 'Gujarati'],
    rating: 4.6,
    ratingCount: 890,
    deliveryTime: 40,
    distance: 3.2,
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80&w=600',
    photos: ['https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80&w=600'],
    priceRange: 3,
    isOpen: true,
    location: { lat: 21.9700, lng: 70.8000, address: "Highway, Gondal", type: 'Other' },
    menu: [
      { id: 'm7', name: 'Unlimited Thal', description: 'Authentic Gujarati flavors.', price: 300, category: 'Veg Meal', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true }
    ]
  }
];
