
export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  DELIVERY = 'DELIVERY',
  ADMIN = 'ADMIN'
}

export interface MenuItem {
  id: string;
  name: string;
  nameGujarati?: string;
  description: string;
  descriptionGujarati?: string;
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
  nameGujarati?: string;
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
  ON_WAY = 'ON_WAY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  restaurantId: string;
  restaurantName: string;
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
