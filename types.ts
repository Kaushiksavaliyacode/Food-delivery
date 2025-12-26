
export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  RESTAURANT = 'RESTAURANT',
  DELIVERY = 'DELIVERY',
  ADMIN = 'ADMIN'
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
  lat: number;
  lng: number;
  address: string;
  type?: 'Home' | 'Work' | 'Other';
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string[];
  rating: number;
  deliveryTime: number;
  distance: number;
  image: string;
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
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  PREPARING = 'PREPARING',
  READY_FOR_PICKUP = 'READY_FOR_PICKUP',
  PICKED_UP = 'PICKED_UP',
  ARRIVING = 'ARRIVING',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export interface Order {
  id: string;
  customerId: string;
  restaurantId: string;
  riderId?: string;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  timestamp: number;
  deliveryLocation: Location;
  riderLocation?: { lat: number, lng: number };
}

export interface AppState {
  role: UserRole;
  currentLocation: Location | null;
  savedAddresses: Location[];
  cart: CartItem[];
  activeOrder: Order | null;
  isLoggedIn: boolean;
  phoneNumber?: string;
}
