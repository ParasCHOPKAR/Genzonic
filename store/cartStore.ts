import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  size: string;
  quantity: number;
}

interface CartState {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string | number, size: string) => void;
  increaseQty: (id: string | number, size: string) => void;
  decreaseQty: (id: string | number, size: string) => void;
  clearCart: () => void; 
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: [],

      addToCart: (item) => set((state) => {
        const existingItem = state.cart.find((i) => i.id === item.id && i.size === item.size);
        
        if (existingItem) {
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
        cart: state.cart.map((i) =>
          i.id === id && i.size === size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        ),
      })),

      decreaseQty: (id, size) => set((state) => ({
        cart: state.cart.map((i) =>
          i.id === id && i.size === size && i.quantity > 1
            ? { ...i, quantity: i.quantity - 1 }
            : i
        ),
      })),

      clearCart: () => set({ cart: [] }),
    }),
    {
      name: 'genzonic-cart', 
    }
  )
);