import React, { useState, useRef } from 'react';
const MenuItems = ({ fetchFoods }) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Specialty Coffee',
    isVeg: true
  });

  const fileInputRef = useRef(null);
  
  // 🟢 Yeh state missing thi, isiliye page blank ho raha tha!
  const [imageFile, setImageFile] = useState(null);

  const handleAdd = async (e) => {
    e.preventDefault();

    // 🟢 File upload ke liye FormData use karna zaroori hai
    const formData = new FormData();
    formData.append('name', form.name.trim());
    formData.append('description', form.description.trim());
    formData.append('price', Number(form.price));
    formData.append('category', form.category);
    formData.append('isVeg', Boolean(form.isVeg));
    
    if (imageFile) {
      formData.append('image', imageFile); // File ko append kiya
    }

    try {
      const res = await fetch('http://localhost:5000/api/foods', {
        method: 'POST',
        headers: {
          // ⚠️ FormData use karte waqt 'Content-Type': 'application/json' nahi lagate, 
          // browser khud multipart/form-data set kar leta hai.
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData // JSON.stringify ki jagah direct formData bheja
      });

      const data = await res.json();

      if (res.ok) {
        alert('Artisanal item added successfully! 🎉');
        setForm({
          name: '',
          description: '',
          price: '',
          category: 'Specialty Coffee',
          isVeg: true
        });
        setImageFile(null); // Form reset hone par file bhi clear kar dein
        
        // 🟢 Isko yahan add karna hai:
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

        if (fetchFoods) fetchFoods();
      } else {
        alert(`Validation Error: ${data.message}`);
      }
    } catch (error) {
      console.error('API Error:', error);
      alert('Failed to connect to server!');
    }
  };

  return (
    <form onSubmit={handleAdd} className="bg-[#e4cfb6] p-6 rounded-sm shadow-sm border border-[#c4a98a] mb-8 space-y-4 font-sans">
      <h2 className="text-lg font-serif font-bold text-[#2e1806]">Add New Café Item ☕</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input 
          type="text" 
          placeholder="Item Name" 
          required 
          value={form.name} 
          onChange={e => setForm({...form, name: e.target.value})} 
          className="p-2.5 bg-white/60 border border-[#baa080] rounded-sm text-sm text-[#2e1806] focus:outline-none focus:border-[#4a2c11]" 
        />
        
        <input 
          type="number" 
          placeholder="Price (₹)" 
          required 
          value={form.price} 
          onChange={e => setForm({...form, price: e.target.value})} 
          className="p-2.5 bg-white/60 border border-[#baa080] rounded-sm text-sm text-[#2e1806] focus:outline-none focus:border-[#4a2c11]" 
        />
        
        <select 
          value={form.category} 
          onChange={e => setForm({...form, category: e.target.value})} 
          className="p-2.5 bg-white/60 border border-[#baa080] rounded-sm text-sm text-[#2e1806] focus:outline-none focus:border-[#4a2c11] cursor-pointer"
        >
          <option value="Specialty Coffee">Specialty Coffee</option>
          <option value="Bakery & Pastries">Bakery & Pastries</option>
          <option value="Gourmet Plates">Gourmet Plates</option>
          <option value="Desserts">Desserts</option>
          <option value="Beverages">Beverages</option>
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-[#3a200a]">Upload Cafe Item Image</label>
        <input 
          type="file" 
          ref={fileInputRef}
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])} 
          className="w-full text-xs text-[#3a200a] file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-xs file:font-semibold file:bg-[#4a2c11] file:text-[#f7ebd9] hover:file:bg-[#2b1706] cursor-pointer"
        />
      </div>
      
      <textarea 
        placeholder="Description" 
        required
        rows="2"
        value={form.description} 
        onChange={e => setForm({...form, description: e.target.value})} 
        className="w-full p-2.5 bg-white/60 border border-[#baa080] rounded-sm text-sm text-[#2e1806] focus:outline-none focus:border-[#4a2c11]" 
      />

      <button type="submit" className="bg-[#4a2c11] hover:bg-[#2b1706] text-[#f7ebd9] px-6 py-2.5 rounded-sm font-medium text-xs tracking-wider uppercase transition cursor-pointer shadow-sm">
        Add Item to Menu
      </button>
    </form>
  );
};

export default MenuItems;