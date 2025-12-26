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
  { id: '7', name: 'Pizza & Snacks', icon: '🍕' },
  { id: '8', name: 'Appetizers', icon: '🥤' }
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
      // APPETIZER (Image 1)
      { id: 'm1', name: 'Soft Drinks / Plain Soda', description: 'Refreshing carbonated beverages.', price: 20.00, category: 'Appetizers', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true },
      { id: 'm2', name: 'Fresh Lime Water', description: 'Sweet or salty refreshing lime water.', price: 20.00, category: 'Appetizers', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true },
      { id: 'm3', name: 'Fresh Lime Soda', description: 'Sparkling lime soda, sweet or salty.', price: 25.00, category: 'Appetizers', image: 'https://images.unsplash.com/photo-1543644006-aba61267d713?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true },
      { id: 'm4', name: 'Jaljeera Water', description: 'Traditional tangy and spicy cumin drink.', price: 20.00, category: 'Appetizers', image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true },
      { id: 'm13', name: 'Lassi Sweet / Salty', description: 'Chilled creamy yogurt based drink.', price: 70.00, category: 'Appetizers', image: 'https://images.unsplash.com/photo-1550507992-eb63ffee0847?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true },

      // SOUPS (Image 2)
      { id: 'm22', name: 'Tomato Soup', description: 'Classic rich tomato soup served with croutons.', price: 110.00, category: 'Soups', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true, calories: 120 },
      { id: 'm23', name: 'Lemon Coriander Soup', description: 'Refreshing clear soup with lemon and fresh coriander.', price: 115.00, category: 'Soups', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true },
      { id: 'm24', name: 'Cheese Corn Tomato Soup', description: 'Creamy tomato soup with sweet corn and cheese.', price: 135.00, category: 'Soups', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true },
      { id: 'm29', name: 'Veg. Hot & Sour Soup', description: 'Spicy and tangy vegetable soup.', price: 130.00, category: 'Soups', image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true, calories: 140 },

      // STARTERS (Image 2)
      { id: 'm35', name: 'Finger Chip', description: 'Crispy salted potato fries.', price: 140.00, category: 'Starters', image: 'https://images.unsplash.com/photo-1573014102299-cbff47d28747?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true, calories: 320 },
      { id: 'm36', name: 'Veg. Manchurian (Dry)', description: 'Deep fried veg balls in spicy soya sauce.', price: 220.00, category: 'Starters', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true, calories: 280 },
      { id: 'm39', name: 'Paneer Chilly (Dry)', description: 'Classic Indo-Chinese paneer starter.', price: 285.00, category: 'Starters', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c175f0?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true, calories: 350 },
      { id: 'm40', name: 'Dragon Paneer (Dry)', description: 'Spicy and crispy paneer sticks.', price: 285.00, category: 'Starters', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c175f0?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true },
      { id: 'm45', name: 'Paneer Tikka (Dry)', description: 'Marinated paneer cubes grilled in tandoor.', price: 380.00, category: 'Starters', image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true },

      // CHINESE (Image 3)
      { id: 'm51', name: 'Paneer Chilly (Gravy)', description: 'Paneer cubes in spicy Chinese gravy.', price: 250.00, category: 'Chinese', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c175f0?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true },
      { id: 'm52', name: 'Schezwan Noodles', description: 'Noodles tossed in spicy Schezwan sauce.', price: 220.00, category: 'Chinese', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true },
      { id: 'm55', name: 'Veg. Chowmein', description: 'Stir fried noodles with fresh vegetables.', price: 205.00, category: 'Chinese', image: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true },
      { id: 'm62', name: 'Veg. Fried Rice', description: 'Classic vegetable fried rice.', price: 190.00, category: 'Chinese', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true },
      { id: 'm69', name: 'Triple Fried Rice', description: 'Combination of rice, noodles and crispy noodles.', price: 260.00, category: 'Chinese', image: 'https://images.unsplash.com/photo-1512058560366-cd2429598632?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true },

      // MAIN COURSE - SABZI (Image 4 & 5)
      { id: 'm74', name: 'Aloo Mutter', description: 'Classic potato and green peas curry.', price: 160.00, category: 'Main Course', image: 'https://images.unsplash.com/photo-1601050633729-19548301ecf8?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true },
      { id: 'm86', name: 'Hyderabadi Kabab Curry', description: 'Spicy mixed vegetable kababs in rich curry.', price: 220.00, category: 'Main Course', image: 'https://images.unsplash.com/photo-1601050633729-19548301ecf8?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true },
      { id: 'm102', name: 'Veg. Dreamland Sp.', description: 'Our house special mixed vegetable preparation.', price: 320.00, category: 'Main Course', image: 'https://images.unsplash.com/photo-1517244671473-efdf0366709f?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true },
      { id: 'm106', name: 'Malai Kofta (Sweet)', description: 'Soft paneer balls in creamy sweet gravy.', price: 210.00, category: 'Main Course', image: 'https://images.unsplash.com/photo-1585409600261-0aca7d3352e8?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true },
      { id: 'm110', name: 'Kaju Curry', description: 'Rich cashew nuts in a creamy gravy.', price: 315.00, category: 'Main Course', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true },
      { id: 'm111', name: 'Kaju Butter Masala', description: 'Roasted cashews in buttery tomato gravy.', price: 315.00, category: 'Main Course', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true },
      { id: 'm119', name: 'Paneer Butter Masala', description: 'Cottage cheese in creamy tomato gravy.', price: 265.00, category: 'Main Course', image: 'https://images.unsplash.com/photo-1601050633729-19548301ecf8?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true },
      { id: 'm126', name: 'Paneer Kadai', description: 'Paneer cooked with bell peppers and ground spices.', price: 265.00, category: 'Main Course', image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true },
      { id: 'm160', name: 'Dal Fry', description: 'Yellow lentils tempered with aromatic spices.', price: 135.00, category: 'Main Course', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true },
      { id: 'm161', name: 'Dal Fry Butter', description: 'Dal fry finished with extra butter.', price: 145.00, category: 'Main Course', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true },

      // SOUTH INDIAN (Image 9 & 10)
      { id: 'd03', name: 'Masala Dosa (Small)', description: 'Crispy rice crepe filled with spiced potato.', price: 110.00, category: 'South Indian', image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true },
      { id: 'd07', name: 'Cheese Dosa', description: 'Crispy dosa loaded with melted cheese.', price: 155.00, category: 'South Indian', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true },
      { id: 'd08', name: 'Cheese Masala Dosa', description: 'Potato filling and cheese in crispy dosa.', price: 165.00, category: 'South Indian', image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true },
      { id: 'd12', name: 'Dreamland Sp. Dosa', description: 'Chef special jumbo dosa with rich fillings.', price: 190.00, category: 'South Indian', image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true },
      { id: 'u13', name: 'Tomato Uttapa', description: 'Thick rice pancake topped with fresh tomatoes.', price: 120.00, category: 'South Indian', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true },
      { id: 'u15', name: 'Garlic Uttapa', description: 'Thick pancake topped with roasted garlic.', price: 120.00, category: 'South Indian', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true },

      // TANDOOR (Image 6)
      { id: 't139', name: 'Butter Roti (Tandoor)', description: 'Soft whole wheat bread with butter.', price: 38.00, category: 'Tandoor', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true },
      { id: 't140', name: 'Jeera Roti', description: 'Wheat bread topped with cumin seeds.', price: 45.00, category: 'Tandoor', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true },
      { id: 't145', name: 'Kulcha Cheese Garlic', description: 'Soft bread topped with garlic and cheese.', price: 120.00, category: 'Tandoor', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true },
      { id: 't146', name: 'Butter Naan', description: 'Leavened refined flour bread with butter.', price: 65.00, category: 'Tandoor', image: 'https://images.unsplash.com/photo-1601050633729-19548301ecf8?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true },
      { id: 't149', name: 'Cheese Nan', description: 'Fluffy naan bread stuffed with cheese.', price: 130.00, category: 'Tandoor', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true },

      // PIZZA & SNACKS (Image 7 & 8)
      { id: 'p192', name: 'Veg. Pizza', description: 'Classic vegetable pizza with cheese.', price: 190.00, category: 'Pizza & Snacks', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true },
      { id: 'p199', name: 'Dreamland Sp. Pizza', description: 'House special large pizza with extra toppings.', price: 235.00, category: 'Pizza & Snacks', image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true },
      { id: 's173', name: 'Veg. Sandwich', description: 'Fresh vegetable sandwich.', price: 100.00, category: 'Pizza & Snacks', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true },
      { id: 's180', name: 'Club Sandwich', description: 'Three layered jumbo sandwich.', price: 150.00, category: 'Pizza & Snacks', image: 'https://images.unsplash.com/photo-1550507992-eb63ffee0847?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true },
      { id: 's190', name: 'Dreamland Sp. Sandwich', description: 'Signature premium multi-layered sandwich.', price: 160.00, category: 'Pizza & Snacks', image: 'https://images.unsplash.com/photo-1550507992-eb63ffee0847?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true },
      { id: 'c200', name: 'Chole Bhature', description: 'Classic spicy chickpea curry with fluffy bhatura.', price: 220.00, category: 'Pizza & Snacks', image: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true },
      
      // BASMATI KHAZANA (Image 6)
      { id: 'b164', name: 'Steam Rice', description: 'Long grain fluffy steamed basmati rice.', price: 130.00, category: 'Main Course', image: 'https://images.unsplash.com/photo-1512058560366-cd2429598632?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true },
      { id: 'b168', name: 'Veg. Biryani', description: 'Aromatic basmati rice cooked with mixed veggies.', price: 180.00, category: 'Main Course', image: 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true },
      { id: 'b169', name: 'Hyderabadi Biryani', description: 'Spicy and fragrant Hyderabadi style rice.', price: 180.00, category: 'Main Course', image: 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&q=80&w=300', isVeg: true, available: true },
    ]
  }
];
