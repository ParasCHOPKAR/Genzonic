import { create } from 'zustand';

export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  size: string;
  quantity: number;
  stock: number; // 🔥 1. Added strict stock property
  customDesign?: any; // To store customization details
}

interface CartState {
  cart: CartItem[];
  setCart: (newCart: CartItem[]) => void;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string | number, size: string) => void;
  increaseQty: (id: string | number, size: string) => void;
  decreaseQty: (id: string | number, size: string) => void;
  clearCart: () => void; 
}

export const useCartStore = create<CartState>()((set) => ({
  cart: [],

  setCart: (newCart) => set({ cart: newCart }),

  addToCart: (item) => set((state) => {
    const existingItem = state.cart.find((i) => i.id === item.id && i.size === item.size);
    
    if (existingItem) {
      // 🔥 2. Block adding to cart from PDP if already at max stock or limit of 2
      if (existingItem.quantity >= Math.min(item.stock ?? Infinity, 2)) {
        return { cart: state.cart }; 
      }
      return {
        cart: state.cart.map((i) =>
          i.id === item.id && i.size === item.size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        ),
      };
    }
    return { cart: [...state.cart, { ...item, quantity: 1 }] };
  }),

  removeFromCart: (id, size) => set((state) => ({
    cart: state.cart.filter((i) => !(i.id === id && i.size === size)),
  })),

  increaseQty: (id, size) => set((state) => ({
    cart: state.cart.map((i) => {
      if (i.id === id && i.size === size) {
        // 🔥 3. Strict guard: Prevent increasing beyond database stock limit or limit of 2
        if (i.quantity >= Math.min(i.stock ?? Infinity, 2)) {
          return i; 
        }
        return { ...i, quantity: i.quantity + 1 };
      }
      return i;
    }),
  })),

  decreaseQty: (id, size) => set((state) => {
    const existingItem = state.cart.find((i) => i.id === id && i.size === size);
    
    if (existingItem && existingItem.quantity === 1) {
      return {
        cart: state.cart.filter((i) => !(i.id === id && i.size === size)),
      };
    }

    return {
      cart: state.cart.map((i) =>
        i.id === id && i.size === size
          ? { ...i, quantity: i.quantity - 1 }
          : i
      ),
    };
  }),

  clearCart: () => set({ cart: [] }),
}));