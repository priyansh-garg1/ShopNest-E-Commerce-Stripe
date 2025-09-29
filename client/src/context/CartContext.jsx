import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const localData = localStorage.getItem('cartItems');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = useCallback((product, quantity) => {
    const exist = cartItems.find((x) => x.id === product.id);
    if (exist) {
      if (exist.qty >= product.stock) {
        toast.warn(`Max stock for ${product.title} already in cart.`);
        return;
      }
      const newQty = exist.qty + quantity;
      const finalQty = Math.min(newQty, product.stock);

      if (newQty > product.stock) {
        toast.warn(`Only ${product.stock - exist.qty} more item(s) of ${product.title} could be added.`);
      } else {
        toast.success(`${quantity} x ${product.title} added to cart!`);
      }

      setCartItems(
        (prevItems) => prevItems.map((x) =>
          x.id === product.id ? { ...exist, qty: finalQty } : x
        )
      );
    } else {
      const finalQty = Math.min(quantity, product.stock);
      setCartItems((prevItems) => [...prevItems, { ...product, qty: finalQty }]);
      toast.success(`${quantity} x ${product.title} added to cart!`);
    }
  }, [cartItems]);

  const removeFromCart = useCallback((product) => {
    setCartItems((prevItems) => prevItems.filter((x) => x.id !== product.id));
  }, []);

  const updateQuantity = useCallback((product, quantity) => {
    if (quantity <= 0) {
      removeFromCart(product);
      return;
    }
    const exist = cartItems.find((x) => x.id === product.id);
    if (exist) {
      if (quantity > product.stock) {
        toast.warn(`You can't add more than ${product.stock} items.`);
      }
      const finalQty = Math.min(quantity, product.stock);
      setCartItems(
        (prevItems) => prevItems.map((x) =>
          x.id === product.id ? { ...exist, qty: finalQty } : x
        )
      );
    }
  }, [cartItems, removeFromCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const value = useMemo(() => ({
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    }),
    [cartItems, addToCart, removeFromCart, updateQuantity, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
