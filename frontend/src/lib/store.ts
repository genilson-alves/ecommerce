import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

interface AuthStore {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  isAdmin: () => boolean;
}

export const useAuth = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      setAuth: (user, token) => set({ user, token }),
      logout: () => {
        set({ user: null, token: null });
        localStorage.removeItem('ecommerce-auth-storage');
      },
      isAdmin: () => get().user?.role === 'ADMIN',
    }),
    {
      name: 'ecommerce-auth-storage',
    }
  )
);

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: { id: string; name: string; price: number }) => void;
  removeItem: (id: string) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const { items } = get();
        const existingItem = items.find((item) => item.id === product.id);

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({
            items: [...items, { ...product, quantity: 1 }],
          });
        }
      },
      removeItem: (id) => {
        set({
          items: get().items.filter((item) => item.id !== id),
        });
      },
      increment: (id) => {
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        });
      },
      decrement: (id) => {
        const { items } = get();
        const item = items.find((i) => i.id === id);
        if (item && item.quantity > 1) {
          set({
            items: items.map((i) =>
              i.id === id ? { ...i, quantity: i.quantity - 1 } : i
            ),
          });
        } else {
          set({
            items: items.filter((i) => i.id !== id),
          });
        }
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'ecommerce-cart-storage',
    }
  )
);
