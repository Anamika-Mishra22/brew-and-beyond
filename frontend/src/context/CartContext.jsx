import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Jab bhi cart update hoga, LocalStorage me save ho jayega
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Item Add karne ke liye
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === product._id);
      if (existingItem) {
        return prevCart.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // Quantity change karne ke liye
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(id);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Item delete karne ke liye
  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== id));
  };

  // 🟢 Logout par ya order place hone par Cart pura khali karne ke liye
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        addToCart, 
        updateQuantity, 
        removeFromCart, 
        clearCart, 
        totalItems 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};