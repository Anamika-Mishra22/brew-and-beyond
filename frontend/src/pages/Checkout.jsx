import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import socket from '../socket';

const Checkout = () => {
  const { cart, totalItems } = useCart();
  const { token, loading: authLoading } = useAuth(); // 🟢 authLoading yahan upar destructure kiya
  const navigate = useNavigate();

  const [address, setAddress] = useState({ street: '', city: '', phone: '' });
  const [loading, setLoading] = useState(false);
  
  // Payment Method Selection State
  const [paymentMethod, setPaymentMethod] = useState('RAZORPAY'); 

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? 40 : 0;
  const grandTotal = subtotal + deliveryFee;

  // Dynamic UPI Link for QR Generation
  const upiId = "anu812708@oksbi";
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=upi://pay?pa=${upiId}%26pn=Brew%20and%20Beyond%26am=${grandTotal}%26cu=INR`;

  // 🟢 Auth loading check (Refresh karne par direct login page par nahi jayega)
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#cca880] flex items-center justify-center font-serif text-[#2e1806] text-lg">
        Brewing your session... ☕
      </div>
    );
  }

  const handleOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 🟢 OPTION 1: CASH ON DELIVERY (COD) OR DIRECT QR UPI
      if (paymentMethod === 'COD' || paymentMethod === 'UPI_QR') {
        const orderResponse = await fetch('http://localhost:5000/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            orderItems: cart.map((item) => ({
              food: item._id,
              name: item.name,
              qty: item.quantity,
              price: item.price
            })),
            shippingAddress: {
              address: address.street,
              city: address.city,
              phone: address.phone
            },
            totalAmount: grandTotal,
            paymentMethod: paymentMethod,
            paymentId: paymentMethod === 'COD' ? 'COD_PAYMENT' : 'UPI_QR_DIRECT'
          })
        });

        const newOrderData = await orderResponse.json();

        if (orderResponse.ok) {
          socket.emit('new_order_placed', newOrderData);
          alert(`Order Placed Successfully via ${paymentMethod === 'COD' ? 'Cash on Delivery' : 'UPI QR Code'}! ☕`);
          navigate('/orders');
        } else {
          alert(newOrderData.message || 'Order creation failed. Please try again.');
        }
        return;
      }

      // 🟢 OPTION 2: ORIGINAL RAZORPAY GATEWAY FLOW
      const razorpayRes = await fetch('http://localhost:5000/api/orders/razorpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ totalAmount: grandTotal })
      });

      const razorpayData = await razorpayRes.json();

      if (!razorpayRes.ok) {
        throw new Error(razorpayData.message || 'Payment initialization failed!');
      }

      const options = {
        key: razorpayData.key,
        amount: razorpayData.amount,
        currency: razorpayData.currency,
        name: "Brew & Beyond",
        description: "Coffee Order Payment",
        order_id: razorpayData.id,
        prefill: {
          name: 'Anu Mishra',
          email: 'anu@example.com',
          contact: address.phone || '9876543210',
          method: 'upi'
        },
        theme: {
          color: "#4a2c11"
        },
        handler: async function (paymentResponse) {
          try {
            const orderResponse = await fetch('http://localhost:5000/api/orders', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                orderItems: cart.map((item) => ({
                  food: item._id,
                  name: item.name,
                  qty: item.quantity,
                  price: item.price
                })),
                shippingAddress: {
                  address: address.street,
                  city: address.city,
                  phone: address.phone
                },
                totalAmount: grandTotal,
                paymentMethod: 'RAZORPAY',
                paymentId: paymentResponse.razorpay_payment_id
              })
            });
            
            const newOrderData = await orderResponse.json();

            if (orderResponse.ok) {
              socket.emit('new_order_placed', newOrderData);
              alert('Payment Successful! Order Placed ☕');
              navigate('/orders');
            } else {
              alert(newOrderData.message || 'Payment received but order creation failed.');
            }
          } catch (err) {
            alert('Error while saving order post-payment!');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      alert(err.message || 'Server connection error!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#cca880] text-[#3a200a] font-sans px-4 py-4 selection:bg-[#4a2c11] selection:text-white flex flex-col justify-center">
      <div className="max-w-4xl mx-auto w-full">
        
        {/* Header Title (Super Compact) */}
        <div className="mb-4 text-center sm:text-left space-y-0.5">
          <span className="text-[10px] font-serif italic text-[#613e1c] block">Secure Artisanal Checkout</span>
          <h1 className="text-xl md:text-2xl font-serif text-[#2e1806] font-normal">
            Checkout & Order Summary
          </h1>
          <p className="text-[11px] text-[#52371e]">
            Complete your delivery details to enjoy freshly brewed handcrafted delights.
          </p>
        </div>
            
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          
          {/* Shipping Form & Payment Selection */}
          <div className="lg:col-span-7 bg-[#e4cfb6] p-4 rounded-sm shadow-md border border-[#c4a98a]">
            <div className="flex items-center space-x-2 pb-2 mb-3 border-b border-[#c4a98a]">
              <span className="flex items-center justify-center w-6 h-6 bg-[#4a2c11] text-[#f7ebd9] font-bold rounded-sm text-[11px] font-serif">
                1
              </span>
              <h2 className="text-sm font-serif font-bold text-[#2e1806]">Delivery Information</h2>
            </div>

            <form onSubmit={handleOrder} className="space-y-3">
              <div>
                <label className="block text-[10px] font-serif uppercase tracking-wider text-[#4a2c11] mb-0.5 font-bold">
                  Street Address
                </label>
                <input 
                  type="text" 
                  required 
                  value={address.street} 
                  onChange={(e) => setAddress({ ...address, street: e.target.value })} 
                  className="w-full px-2.5 py-2 bg-white/70 border border-[#c4a98a] rounded-sm focus:ring-1 focus:ring-[#4a2c11] outline-none transition text-[#2e1806] placeholder-[#8c6d53] text-xs" 
                  placeholder="e.g., Flat 402, Green Valley Apartments"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-serif uppercase tracking-wider text-[#4a2c11] mb-0.5 font-bold">
                    City / Area
                  </label>
                  <input 
                    type="text" 
                    required 
                    value={address.city} 
                    onChange={(e) => setAddress({ ...address, city: e.target.value })} 
                    className="w-full px-2.5 py-2 bg-white/70 border border-[#c4a98a] rounded-sm focus:ring-1 focus:ring-[#4a2c11] outline-none transition text-[#2e1806] placeholder-[#8c6d53] text-xs" 
                    placeholder="Lucknow"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-serif uppercase tracking-wider text-[#4a2c11] mb-0.5 font-bold">
                    Phone Number
                  </label>
                  <input 
                    type="tel" 
                    required 
                    value={address.phone} 
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })} 
                    className="w-full px-2.5 py-2 bg-white/70 border border-[#c4a98a] rounded-sm focus:ring-1 focus:ring-[#4a2c11] outline-none transition text-[#2e1806] placeholder-[#8c6d53] text-xs" 
                    placeholder="+91 9876543210"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="pt-2 border-t border-[#c4a98a]">
                <label className="block text-[11px] font-serif font-bold text-[#2e1806] mb-1.5">
                  Select Payment Method
                </label>
                
                <div className="space-y-1.5">
                  {/* Option 1: Razorpay Gateway */}
                  <label className={`flex items-center p-2.5 border rounded-sm cursor-pointer transition ${paymentMethod === 'RAZORPAY' ? 'border-[#4a2c11] bg-white/90 ring-1 ring-[#4a2c11]' : 'border-[#c4a98a] bg-white/40 hover:bg-white/60'}`}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="RAZORPAY" 
                      checked={paymentMethod === 'RAZORPAY'} 
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="accent-[#4a2c11] w-3.5 h-3.5 cursor-pointer"
                    />
                    <div className="ml-2.5">
                      <p className="text-xs font-serif font-bold text-[#2e1806]">Online Payment Gateway (Razorpay)</p>
                      <p className="text-[10px] text-[#52371e]">Instant Online Cards, Netbanking & Auto UPI</p>
                    </div>
                  </label>

                  {/* Option 2: Cash on Delivery */}
                  <label className={`flex items-center p-2.5 border rounded-sm cursor-pointer transition ${paymentMethod === 'COD' ? 'border-[#4a2c11] bg-white/90 ring-1 ring-[#4a2c11]' : 'border-[#c4a98a] bg-white/40 hover:bg-white/60'}`}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="COD" 
                      checked={paymentMethod === 'COD'} 
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="accent-[#4a2c11] w-3.5 h-3.5 cursor-pointer"
                    />
                    <div className="ml-2.5">
                      <p className="text-xs font-serif font-bold text-[#2e1806]">Cash on Delivery (COD)</p>
                      <p className="text-[10px] text-[#52371e]">Pay cash upon pickup or delivery</p>
                    </div>
                  </label>

                  {/* Option 3: Direct Scan & Pay QR UPI */}
                  <label className={`flex items-center p-2.5 border rounded-sm cursor-pointer transition ${paymentMethod === 'UPI_QR' ? 'border-[#4a2c11] bg-white/90 ring-1 ring-[#4a2c11]' : 'border-[#c4a98a] bg-white/40 hover:bg-white/60'}`}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="UPI_QR" 
                      checked={paymentMethod === 'UPI_QR'} 
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="accent-[#4a2c11] w-3.5 h-3.5 cursor-pointer"
                    />
                    <div className="ml-2.5">
                      <p className="text-xs font-serif font-bold text-[#2e1806]">Direct Cafe UPI / QR Code</p>
                      <p className="text-[10px] text-[#52371e]">Scan & pay via GPay, PhonePe, Paytm</p>
                    </div>
                  </label>
                </div>

                {/* Direct QR Display UI when UPI_QR is Selected */}
                {paymentMethod === 'UPI_QR' && (
                  <div className="mt-2.5 p-2.5 bg-[#f7ebd9] border border-[#c4a98a] rounded-sm text-center">
                    <p className="text-[10px] font-serif font-bold text-[#2e1806] mb-1">Scan QR with any UPI App to Pay ₹{grandTotal}</p>
                    <div className="inline-block p-1 bg-white rounded-sm border border-[#c4a98a]">
                      <img 
                        src={qrCodeUrl} 
                        alt="Brew & Beyond UPI QR Code" 
                        className="w-28 h-28 mx-auto"
                      />
                    </div>
                    <p className="text-[10px] text-[#4a2c11] font-mono mt-0.5 font-bold">UPI ID: {upiId}</p>
                  </div>
                )}
              </div>

              <div className="pt-1">
                <button 
                  type="submit" 
                  disabled={loading || totalItems === 0}
                  className="w-full bg-[#4a2c11] hover:bg-[#2b1706] text-[#f7ebd9] py-2 px-3 rounded-sm font-medium text-xs tracking-wider uppercase transition shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <span>Processing Order...</span>
                  ) : (
                    <span>
                      {paymentMethod === 'COD' 
                        ? `Place Order (COD - ₹${grandTotal})` 
                        : paymentMethod === 'UPI_QR'
                        ? `Confirm & Place Order (₹${grandTotal})`
                        : `Proceed to Pay (₹${grandTotal})`}
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Mini Cart Summary */}
          <div className="lg:col-span-5 bg-[#e4cfb6] p-4 rounded-sm shadow-md border border-[#c4a98a]">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#c4a98a]">
              <h2 className="text-sm font-serif font-bold text-[#2e1806]">Order Summary</h2>
              <span className="bg-[#4a2c11] text-[#f7ebd9] text-[10px] font-bold px-2 py-0.5 rounded-sm">
                {totalItems} Items
              </span>
            </div>

            <div className="space-y-2 max-h-36 overflow-y-auto pr-1 mb-3">
              {cart.map(item => (
                <div key={item._id} className="flex justify-between items-center text-xs bg-white/50 p-1.5 rounded-sm border border-[#c4a98a]/40">
                  <div className="flex items-center space-x-2">
                    <span className="font-serif font-medium text-[#2e1806]">{item.name}</span>
                    <span className="text-[9px] text-[#f7ebd9] bg-[#4a2c11] px-1.5 py-0.5 rounded-sm font-bold">
                      x{item.quantity}
                    </span>
                  </div>
                  <span className="font-serif font-bold text-[#2e1806]">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="space-y-1.5 pt-2 border-t border-dashed border-[#c4a98a] text-xs text-[#52371e]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-serif">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className="font-serif">{deliveryFee > 0 ? `₹${deliveryFee}` : 'FREE'}</span>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-[#c4a98a] flex justify-between items-center">
              <span className="text-xs font-serif font-bold text-[#2e1806]">Total Amount</span>
              <span className="text-base font-serif font-bold text-[#4a2c11]">₹{grandTotal}</span>
            </div>

            <div className="mt-3 bg-[#f7ebd9] p-2 rounded-sm border border-[#c4a98a] text-[10px] text-[#4a2c11] text-center font-serif italic">
              ☕ Safe & Secure Artisanal Checkout
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;