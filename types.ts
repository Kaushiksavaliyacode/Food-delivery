
export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  RESTAURANT = 'RESTAURANT',
  DELIVERY = 'DELIVERY',
  ADMIN = 'ADMIN'
}

export interface UserProfile {
  id: string;
  phone: string;
  name: string;
  email?: string;
  addresses: Location[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isVeg: boolean;
  available: boolean;
  calories?: number;
}

export interface Location {
  id?: string;
  lat: number;
  lng: number;
  address: string;
  landmark?: string;
  type: 'Home' | 'Work' | 'Other';
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string[];
  rating: number;
  ratingCount: number;
  deliveryTime: number;
  distance: number;
  image: string;
  photos: string[];
  priceRange: 1 | 2 | 3 | 4;
  menu: MenuItem[];
  location: Location;
  isOpen: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export enum OrderStatus {
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  PICKED_UP = 'PICKED_UP',
  ARRIVING = 'ARRIVING',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export interface OrderTimeline {
  status: OrderStatus;
  timestamp: number;
  message: string;
}

export interface Order {
  id: string;
  customerId: string;
  restaurantId: string;
  riderId?: string;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  timeline: OrderTimeline[];
  timestamp: number;
  deliveryLocation: Location;
  riderLocation?: { lat: number, lng: number };
}

export interface AppState {
  role: UserRole;
  user: UserProfile | null;
  currentLocation: Location | null;
  cart: CartItem[];
  activeOrder: Order | null;
  isLoggedIn: boolean;
  theme: 'light' | 'dark';
}
