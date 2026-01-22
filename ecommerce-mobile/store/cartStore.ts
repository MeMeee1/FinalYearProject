import { create } from 'zustand';

interface CartItem {
  product: any;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addProduct: (product: any) => void;
  removeProduct: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  resetCart: () => void;
}

export const useCart = create<CartState>((set) => ({
  items: [],

  addProduct: (product: any) =>
    set((state) => {
      // Check if product already exists in cart
      const existingItem = state.items.find(
        (item) => item.product.id === product.id
      );

      if (existingItem) {
        // Increment quantity if exists
        return {
          items: state.items.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }

      // Add new product
      return {
        items: [...state.items, { product, quantity: 1 }],
      };
    }),

  removeProduct: (productId: number) =>
    set((state) => ({
      items: state.items.filter((item) => item.product.id !== productId),
    })),

  updateQuantity: (productId: number, quantity: number) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      ),
    })),

  clearCart: () => set({ items: [] }),

  resetCart: () => set({ items: [] }),
}));
