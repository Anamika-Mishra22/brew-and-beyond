import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus, FaArrowLeft } from 'react-icons/fa';

const Cart = () => {
  const { cart, addToCart, removeFromCart, updateQuantity } = useCart();

  // Price calculations
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? 40 : 0; // Standard boutique delivery fee
  const grandTotal = subtotal + deliveryFee;

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 bg-[#cca880]">
        <h2 className="text-3xl font-serif text-[#2e1806] mb-4">No items added yet😶 </h2>
        <p className="text-[#52371e] text-sm mb-6 font-medium">Explore our artisanal menu to curate your perfect order</p>
        <Link 
          to="/menu" 
          className="bg-[#4a2c11] hover:bg-[#2b1706] text-[#f7ebd9] px-6 py-3 rounded-sm font-medium text-xs tracking-wider uppercase transition shadow-sm"
        >
          Explore Menu 
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#cca880] text-[#3a200a] font-sans px-6 py-10 selection:bg-[#4a2c11] selection:text-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/menu" className="text-[#4a2c11] hover:text-[#2b1706] flex items-center gap-2 font-medium text-sm">
            <FaArrowLeft /> Back to Menu
          </Link>
          <h1 className="text-3xl font-serif text-[#2e1806]">Your Cart</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div 
                key={item._id} 
                className="flex items-center justify-between bg-[#e4cfb6] p-4 rounded-sm shadow-sm border border-[#c4a98a]"
              >
                <div className="flex items-center gap-4">
                 <img 
  src={item.image && item.image.startsWith('http') ? item.image : `https://brew-and-beyond.onrender.com/${item.image?.replace(/^\/+/, '')}`} 
  alt={item.name} 
  className="w-20 h-20 object-cover rounded-sm border border-[#c4a98a]" 
/>
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#2e1806]">{item.name}</h3>
                    <p className="text-[#4a2c11] font-serif font-bold text-sm mt-1">₹{item.price}</p>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2 bg-[#d8bc98] p-1.5 rounded-sm border border-[#baa080]">
                  <button 
                    onClick={() => {
                      if (item.quantity > 1) {
                        updateQuantity(item._id, item.quantity - 1);
                      } else {
                        removeFromCart(item._id);
                      }
                    }}
                    className="bg-[#4a2c11] hover:bg-[#2b1706] text-[#f7ebd9] w-6 h-6 rounded-sm font-bold flex items-center justify-center transition text-xs cursor-pointer"
                  >
                    {item.quantity === 1 ? '🗑️' : <FaMinus size={10} />}
                  </button>
                  <span className="font-bold text-[#2e1806] px-2 text-sm w-6 text-center">{item.quantity}</span>
                  <button 
                    onClick={() => addToCart(item)}
                    className="bg-[#4a2c11] hover:bg-[#2b1706] text-[#f7ebd9] w-6 h-6 rounded-sm font-bold flex items-center justify-center transition text-xs cursor-pointer"
                  >
                    <FaPlus size={10} />
                  </button>
                </div>

                {/* Delete Button */}
                <button 
                  onClick={() => removeFromCart(item._id)}
                  className="text-rose-950 hover:text-rose-900 p-2 transition cursor-pointer"
                  title="Remove item"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>

          {/* Order Bill Summary */}
          <div className="bg-[#e4cfb6] p-6 rounded-sm shadow-sm border border-[#c4a98a] h-fit space-y-4">
            <h2 className="text-lg font-serif font-bold text-[#2e1806] border-b border-[#d8bc98] pb-3">Order Summary</h2>
            
            <div className="space-y-3 text-[#52371e] text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-serif font-bold text-[#2e1806]">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-serif font-bold text-[#2e1806]">₹{deliveryFee}</span>
              </div>
              <div className="border-t border-[#d8bc98] pt-3 flex justify-between text-base font-serif font-bold text-[#2e1806]">
                <span>Grand Total</span>
                <span>₹{grandTotal}</span>
              </div>
            </div>
          
            <Link 
              to="/checkout" 
              className="block text-center w-full mt-6 bg-[#4a2c11] hover:bg-[#2b1706] text-[#f7ebd9] py-3 rounded-sm font-medium text-xs tracking-wider uppercase transition shadow-sm"
            >
              Proceed to Checkout
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;