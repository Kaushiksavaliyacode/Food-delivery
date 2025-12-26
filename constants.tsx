
import React from 'react';
import { Restaurant } from './types.ts';

export const COLORS = {
  primary: '#FFC107',
  secondary: '#FF4136',
  accent: '#F97316',
  success: '#22C55E',
  error: '#EF4444',
  surface: '#FFFFFF',
  background: '#F8F9FA'
};

export const CATEGORIES = [
  { id: '1', name: 'Soups', nameGujarati: 'સુપ', icon: '🥣' },
  { id: '2', name: 'Chinese', nameGujarati: 'ચાઈનીઝ', icon: '🍜' },
  { id: '3', name: 'Main Course', nameGujarati: 'પંજાબી સબ્જી', icon: '🍛' },
  { id: '4', name: 'Tandoor', nameGujarati: 'નાન - રોટી', icon: '🫓' },
  { id: '5', name: 'Rice & Dal', nameGujarati: 'દાળ રાઈસ બીરીયાની', icon: '🍚' },
  { id: '6', name: 'Drinks', nameGujarati: 'કોલ્ડ્રીંકસ', icon: '🥤' }
];

export const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: 'r1',
    name: 'Jalaram Chinese & Punjabi',
    nameGujarati: 'જલારામ ચાઇનીઝ & પંજાબી',
    cuisine: ['Punjabi', 'Chinese', 'Main Course'],
    rating: 4.8,
    deliveryTime: 25,
    distance: 1.2,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=600',
    priceRange: 2,
    location: { lat: 22.3072, lng: 73.1812, address: "Jalaram Plaza, City Center", type: 'Work' },
    isOpen: true,
    menu: [
      { id: 's1', name: 'Hot and Sour Soup', nameGujarati: 'હોટ એન્ડ સાવર સુપ', description: 'Spicy and tangy vegetable soup.', price: 70.00, category: 'Soups', image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true },
      { id: 's2', name: 'Manchow Soup', nameGujarati: 'મનચાઉ સુપ', description: 'Classic Indo-Chinese soup with crispy noodles.', price: 70.00, category: 'Soups', image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true },
      { id: 's3', name: 'Tomato Soup', nameGujarati: 'ટોમેટો સુપ', description: 'Freshly made cream of tomato soup.', price: 70.00, category: 'Soups', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true },
      { id: 'p1', name: 'Paneer Tufani', nameGujarati: 'પનીર તુફાની', description: 'Spicy cottage cheese in rich tomato gravy.', price: 240.00, category: 'Main Course', image: 'https://images.unsplash.com/photo-1601050633729-19548301ecf8?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true },
      { id: 'p2', name: 'Paneer Tikka Masala', nameGujarati: 'પનીર ટીકા મસાલા', description: 'Grilled paneer in a spicy onion-tomato gravy.', price: 240.00, category: 'Main Course', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true },
      { id: 'p3', name: 'Paneer Butter Masala', nameGujarati: 'પનીર બટર મસાલા', description: 'Creamy and buttery cottage cheese curry.', price: 260.00, category: 'Main Course', image: 'https://images.unsplash.com/photo-1601050633729-19548301ecf8?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true },
      { id: 'p4', name: 'Kaju Masala', nameGujarati: 'કાજુ મસાલા', description: 'Rich cashew nuts in creamy gravy.', price: 280.00, category: 'Main Course', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true },
      { id: 'p8', name: 'Paneer Angara', nameGujarati: 'પનીર અંગારા', description: 'Smoky flavored paneer preparation.', price: 300.00, category: 'Main Course', image: 'https://images.unsplash.com/photo-1601050633729-19548301ecf8?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true },
      { id: 'c1', name: 'Manchurian Dry', nameGujarati: 'મન્ચુરીયન ડ્રાય', description: 'Deep fried veg balls in spicy soya sauce.', price: 100.00, category: 'Chinese', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true },
      { id: 'c2', name: 'Hakka Noodles', nameGujarati: 'હક્કા નુડલ્સ', description: 'Stir fried noodles with fresh vegetables.', price: 100.00, category: 'Chinese', image: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true },
      { id: 'r1', name: 'Veg Biryani', nameGujarati: 'વેજ બીરીયાની', description: 'Fragrant rice cooked with mixed vegetables.', price: 120.00, category: 'Rice & Dal', image: 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true },
      { id: 'r2', name: 'Dal Fry Butter', nameGujarati: 'દાળ ફ્રાય બટર', description: 'Yellow lentils tempered with butter.', price: 120.00, category: 'Rice & Dal', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true },
      { id: 't1', name: 'Butter Nan', nameGujarati: 'બટર નાન', description: 'Soft leavened refined flour bread with butter.', price: 50.00, category: 'Tandoor', image: 'https://images.unsplash.com/photo-1601050633729-19548301ecf8?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true },
      { id: 't3', name: 'Butter Roti', nameGujarati: 'બટર રોટી', description: 'Soft whole wheat bread with butter.', price: 30.00, category: 'Tandoor', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true }
    ]
  },
  {
    id: 'r2',
    name: 'South Flavours',
    nameGujarati: 'સાઉથ ફ્લેવર્સ',
    cuisine: ['South Indian', 'Breakfast'],
    rating: 4.5,
    deliveryTime: 20,
    distance: 2.5,
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80&w=600',
    priceRange: 1,
    location: { lat: 22.31, lng: 73.19, address: "Main Road, Near Temple", type: 'Other' },
    isOpen: true,
    menu: [
      { id: 'si1', name: 'Masala Dosa', nameGujarati: 'મસાલા ઢોસા', description: 'Crispy rice crepe with potato filling.', price: 80.00, category: 'Main Course', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true },
      { id: 'si2', name: 'Idli Sambhar', nameGujarati: 'ઈડલી સંભાર', description: 'Steamed rice cakes with lentil soup.', price: 60.00, category: 'Main Course', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true },
      { id: 'si3', name: 'Menduvada', nameGujarati: 'મેદુવડા', description: 'Traditional south fried donuts.', price: 70.00, category: 'Main Course', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true }
    ]
  }
];
