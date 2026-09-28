import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "rh11_cart";
const FREE_SHIPPING_THRESHOLD = 70;
const SHIPPING_COST = 4.95;

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (item) => {
    const key = `${item.slug}|${item.size}|${item.color}`;
    setItems((prev) => {
      const found = prev.find((i) => i.key === key);
      if (found) {
        return prev.map((i) => (i.key === key ? { ...i, qty: Math.min(i.qty + item.qty, 20) } : i));
      }
      return [...prev, { ...item, key }];
    });
    setIsOpen(true);
  };

  const updateQty = (key, delta) => {
    setItems((prev) =>
      prev
        .map((i) => (i.key === key ? { ...i, qty: Math.max(0, Math.min(20, i.qty + delta)) } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const removeItem = (key) => setItems((prev) => prev.filter((i) => i.key !== key));
  const clear = () => setItems([]);
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const value = useMemo(() => {
    const subtotal = items.reduce((acc, i) => acc + i.price * i.qty, 0);
    const count = items.reduce((acc, i) => acc + i.qty, 0);
    const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    return {
      items,
      count,
      subtotal,
      shipping,
      total: subtotal + shipping,
      freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
      addItem,
      updateQty,
      removeItem,
      clear,
      isOpen,
      openCart,
      closeCart,
    };
  }, [items, isOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
