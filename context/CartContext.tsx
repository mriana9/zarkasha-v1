"use client";

import {
  createContext,
  useContext,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export interface CartItem {
  id: string;
  title_ar: string;
  title_en: string;
  price: number;
  image: string;
  quantity: number;
}

export interface ProductInput {
  id: string;
  title_ar: string;
  title_en: string;
  price?: number;
  images?: string[];
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: ProductInput) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "zarkasha_cart";
const EMPTY_CART: CartItem[] = [];
let cartSnapshot: CartItem[] = EMPTY_CART;
let cartLoaded = false;
const cartListeners = new Set<() => void>();

function getCartSnapshot(): CartItem[] {
  if (!cartLoaded) {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      cartSnapshot = savedCart ? (JSON.parse(savedCart) as CartItem[]) : EMPTY_CART;
    } catch (e) {
      console.error(e);
      cartSnapshot = EMPTY_CART;
    }
    cartLoaded = true;
  }
  return cartSnapshot;
}

function subscribeToCart(listener: () => void): () => void {
  cartListeners.add(listener);
  const handleStorage = (event: StorageEvent) => {
    if (event.key === CART_STORAGE_KEY || event.key === null) {
      cartLoaded = false;
      getCartSnapshot();
      cartListeners.forEach((notify) => notify());
    }
  };
  window.addEventListener("storage", handleStorage);

  return () => {
    cartListeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

function updateCart(updater: (current: CartItem[]) => CartItem[]): void {
  const nextCart = updater(getCartSnapshot());
  cartSnapshot = nextCart;
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(nextCart));
  cartListeners.forEach((listener) => listener());
}

export function CartProvider({ children }: { children: ReactNode }) {
  const cart = useSyncExternalStore(
    subscribeToCart,
    getCartSnapshot,
    () => EMPTY_CART,
  );
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  const addToCart = (product: ProductInput) => {
    updateCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }
      return [
        ...prev,
        {
          id: product.id,
          title_ar: product.title_ar,
          title_en: product.title_en,
          price: product.price || 0,
          image: product.images?.[0] || "/categories/book.png",
          quantity: 1,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    updateCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    updateCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[],
    );
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        isCartOpen,
        setIsCartOpen,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
