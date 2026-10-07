import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BiSmile } from 'react-icons/bi';
import { useCart } from '../context/CartContext';
import { FaMugHot } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // 🟢 Route navigation ke liye import kiya hai (Checkout par bhejane ke liye)

const categories = ['All', 'Specialty Coffee', 'Bakery & Pastries', 'Gourmet Plates', 'Desserts', 'Beverages'];

const handleImageError = (e) => {
  e.target.onerror = null;
  e.target.src = "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500";
};

const Menu = () => {
  const [foods, setFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart();

  // 🟢 1. STATE: Zomato-style expandable bottom cart drawer/popup ko open ya close rakhne ke liye state
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // 🟢 2. NAVIGATION: "Continue" button click hone par checkout page par redirect karne ke liye hook
  const navigate = useNavigate();

  // Fetch all items initially from backend
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://brew-and-beyond.onrender.com/api/foods');

        const updatedData = response.data.map((item) => {
          if (item.name.toLowerCase().includes('pasta') || item.name.toLowerCase().includes('alfredo')) {
            return {
              ...item,
              image: item.image && !item.image.includes('via.placeholder') 
                ? item.image 
                : 'https://images.unsplash.com/photo-1621996346565-e3d5d6281298?w=500'
            };
          }
          return item;
        });

        setFoods(updatedData);
        setFilteredFoods(updatedData);
      } catch (error) {
        console.error('Error fetching food items from API:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);

  // Filter items locally whenever selectedCategory changes
  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredFoods(foods);
    } else {
      const filtered = foods.filter(
        (item) => item.category?.toLowerCase().trim() === selectedCategory.toLowerCase().trim()
      );
      setFilteredFoods(filtered);
    }
  }, [selectedCategory, foods]);

  return (
    // 🟢 3. LAYOUT: Bottom padding (pb-28) di hai taaki floating bar items ke upar overlap na ho
    <div className="min-h-screen bg-[#cca880] text-[#3a200a] font-sans px-6 py-10 pb-28 relative selection:bg-[#4a2c11] selection:text-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Title */}
        <div className="text-center mb-10 space-y-2">
          <span className="text-xs font-serif italic text-[#613e1c] block">Handcrafted Delights</span>
         <h1 className="text-3xl md:text-5xl font-serif text-[#2e1806] font-normal flex items-center justify-center gap-3">
        Explore Our Menu <FaMugHot className="text-[#4a2c11]" />
        </h1>
        </div>

        {/* Category Tabs Filter */}
        <div className="flex justify-center gap-3 mb-12 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2.5 rounded-sm font-medium text-xs tracking-wider uppercase transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#4a2c11] text-[#f7ebd9] shadow-md border border-[#613e1c]'
                  : 'bg-[#e4cfb6] text-[#4a2c11] hover:bg-[#d8bc98] border border-[#c4a98a]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading Indicator */}
        {loading ? (
          <div className="text-center py-20 text-[#4a2c11] text-base font-serif italic animate-pulse">
            Brewing menu items... ☕
          </div>
        ) : filteredFoods.length === 0 ? (
          <div className="text-center py-20 text-[#52371e] text-sm font-medium">
            No artisanal items found in this category.
          </div>
        ) : (
          /* Food Items Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredFoods.map((item) => (
              <div 
                key={item._id} 
                className="bg-[#e4cfb6] rounded-sm shadow-sm hover:shadow-md transition border border-[#c4a98a] flex flex-col justify-between overflow-hidden p-4 space-y-4"
              >
                <div>
                  <div className="h-52 rounded-sm overflow-hidden bg-[#2b1706] mb-4">
                    <img 
  src={
    item.image && item.image.startsWith('http') 
      ? item.image 
      : `https://brew-and-beyond.onrender.com${item.image}`
  } 
  alt={item.name} 
  className="w-full h-48 object-cover"
  onError={handleImageError} 
/>
                  </div>
                  <div>
                    <div className="mb-2">
                      <h2 className="font-serif font-bold text-base text-[#2e1806]">{item.name}</h2>
                  </div>
                  <p className="text-[#52371e] text-xs line-clamp-2 leading-relaxed">{item.description}</p>
                  </div>
                </div>
                  
                <div className="pt-2 border-t border-[#d8bc98] flex justify-between items-center">
                  <span className="text-lg font-serif font-bold text-[#2e1806]">₹{item.price}</span>

                  {/* Cart Logic */}
                  {(() => {
                    const cartItem = cart.find((c) => c._id === item._id);

                    if (cartItem) {
                      return (
                        <div className="flex items-center gap-1.5 bg-[#d8bc98] p-1 rounded-sm border border-[#baa080]">
                          <button
                            onClick={() => {
                              if (cartItem.quantity > 1) {
                                updateQuantity(item._id, cartItem.quantity - 1);
                              } else {
                                removeFromCart(item._id);
                              }
                          }}
                          className="bg-rose-950/60 hover:bg-rose-900 text-rose-200 w-6 h-6 rounded-sm font-bold flex items-center justify-center transition text-xs cursor-pointer"
                          title={cartItem.quantity === 1 ? "Delete item" : "Decrease quantity"}
                        >
                          {cartItem.quantity === 1 ? '🗑️' : '-'}
                        </button>

                        <span className="font-bold text-[#2e1806] px-2 text-xs">
                          {cartItem.quantity}
                        </span>

                        <button
                          onClick={() => updateQuantity(item._id, cartItem.quantity + 1)}
                        className="bg-[#4a2c11] hover:bg-[#2b1706] text-[#f7ebd9] w-6 h-6 rounded-sm font-bold flex items-center justify-center transition text-xs cursor-pointer"
                        title="Increase quantity"
                      >
                        +
                      </button>
                      </div>
                  );
                }

                return (
                  <button
                    onClick={() => addToCart(item)}
                    className="bg-[#4a2c11] hover:bg-[#2b1706] text-[#f7ebd9] px-4 py-2 rounded-sm text-xs font-medium transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    <i className="fa-solid fa-basket-shopping"></i> Add
                  </button>
                );
              })()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

      {/* ======================================================== */}
      {/* 🟢 4. ZOMATO-STYLE FLOATING BOTTOM CART BAR (Tabhi dikhega jab cart mein 1 ya zyada items honge) */}
      {/* ======================================================== */}
      {cart && cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#2e1806] text-[#f7ebd9] px-6 py-4 shadow-2xl flex items-center justify-between z-50 border-t border-[#4a2c11]">
          
          {/* Left Side: "Your Order (X items)" button jis par click karke drawer khulega */}
          <button 
            onClick={() => setIsCartOpen(!isCartOpen)} 
            className="flex items-center gap-2 cursor-pointer hover:opacity-85 transition"
          >
            <span className="font-serif text-sm md:text-base font-medium">
              Your Order ({cart.reduce((acc, item) => acc + item.quantity, 0)})
            </span>
            <i className={`fa-solid fa-chevron-${isCartOpen ? 'down' : 'up'} text-xs`}></i>
          </button>

          {/* Right Side: Subtotal aur Continue Button (Seedha Checkout page par le jayega) */}
          <div className="flex items-center gap-6">
            <span className="text-sm md:text-base font-serif">
              Subtotal: ₹{cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)}
            </span>
            <button 
              onClick={() => navigate('/checkout')} 
              className="bg-[#cca880] hover:bg-[#b8956e] text-[#2e1806] font-medium px-6 py-2.5 rounded-sm text-xs tracking-wider uppercase transition shadow-sm cursor-pointer"
            >
              Continue
            </button>
          </div>

        </div>
      )}

    {/* ======================================================== */}
      {/* 🟢 ZOMATO STYLE CLEAN FLOATING BOTTOM CART BAR */}
      {/* ======================================================== */}
      {cart && cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#2e1806] text-[#f7ebd9] px-6 py-4 shadow-2xl flex items-center justify-between z-50 border-t border-[#4a2c11]">
          
          {/* Left Side: Your Order with Arrow */}
          <button 
            onClick={() => setIsCartOpen(!isCartOpen)} 
            className="flex items-center gap-3 cursor-pointer hover:opacity-85 transition bg-[#4a2c11]/60 px-4 py-2 rounded-sm border border-[#613e1c]"
          >
            <span className="font-serif text-sm md:text-base font-medium">
              Your Order ({cart.reduce((acc, item) => acc + item.quantity, 0)})
            </span>
            <i className={`fa-solid fa-chevron-${isCartOpen ? 'down' : 'up'} text-xs text-[#cca880]`}></i>
          </button>

          {/* Right Side: Subtotal & Continue */}
          <div className="flex items-center gap-5 md:gap-8">
            <span className="text-sm md:text-base font-serif">
              Subtotal: ₹{cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)}
            </span>
            <button 
              onClick={() => navigate('/checkout')} 
              className="bg-[#cca880] hover:bg-[#b8956e] text-[#2e1806] font-medium px-6 py-2.5 rounded-sm text-xs tracking-wider uppercase transition shadow-sm cursor-pointer"
            >
              Continue
            </button>
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* 🟢 REFINED BOUTIQUE STYLE POPUP DRAWER */}
      {/* ======================================================== */}
      {isCartOpen && cart && cart.length > 0 && (
        <>
          {/* Background Dark Overlay */}
          <div 
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 transition-opacity"
          ></div>

          {/* Clean Elevated Popup Card */}
          <div className="fixed bottom-24 left-6 md:left-10 max-w-md w-full bg-[#f7ebd9] border-2 border-[#4a2c11] text-[#2e1806] p-6 rounded-md shadow-2xl z-50 animate-fadeIn">
            
            {/* Header: Title aur Cross Icon (Close karne ke liye) */}
            <div className="flex justify-between items-center mb-4 border-b border-[#cca880] pb-3">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#2e1806]">Your Order Summary</h3>
                <span className="text-xs italic text-[#613e1c]">Brew & Beyond Artisanal Selection</span>
              </div>
              
             {/* Close Button with Clean Text/Symbol */}
              <button 
                onClick={() => setIsCartOpen(false)}
                className="w-7 h-7 rounded-full bg-[#e4cfb6] hover:bg-[#cca880] text-[#2e1806] flex items-center justify-center font-bold text-base transition cursor-pointer border border-[#c4a98a]"
                title="Close summary"
              >
                ×
              </button>
            </div>

            {/* Added Items List */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map((item, index) => (
                <div key={index} className="flex justify-between items-center bg-[#e4cfb6] p-3 rounded-sm border border-[#c4a98a]">
                  <div className="pr-3">
                    <h4 className="font-serif text-sm font-bold text-[#2e1806]">{item.name}</h4>
                    <span className="text-xs text-[#52371e]">₹{item.price * item.quantity}</span>
                  </div>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3 bg-[#4a2c11] text-[#f7ebd9] px-3 py-1 rounded-sm text-xs">
                    <button 
                      onClick={() => {
                        if (item.quantity > 1) {
                          updateQuantity(item._id, item.quantity - 1);
                        } else {
                          removeFromCart(item._id);
                        }
                      }}
                      className="hover:text-amber-300 font-bold cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-medium">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="hover:text-amber-300 font-bold cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Button: Clear Cart with Icon */}
            <button 
              onClick={() => {
                cart.forEach(item => removeFromCart(item._id));
                setIsCartOpen(false);
              }}
              className="w-full mt-5 bg-rose-950 hover:bg-rose-900 text-rose-100 py-2.5 rounded-sm text-xs tracking-wider uppercase font-medium transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <i className="fa-solid fa-trash-can text-rose-300"></i> Clear Cart
            </button>

          </div>
        </>
      )}
        </div>
  );
};

export default Menu;