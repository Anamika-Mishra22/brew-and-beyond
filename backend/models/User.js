const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, 'Name is required'] 
    },
    email: { 
      type: String, 
      required: [true, 'Email is required'], 
      unique: true 
    },
    password: { 
      type: String, 
      required: [true, 'Password is required'] 
    },
    role: { 
      type: String, 
      enum: ['user', 'admin'], 
      default: 'user' 
    },
    address: { 
      type: String, 
      default: '' 
    },
    phone: { 
      type: String, 
      default: '' 
    },
    cartData: { 
      type: Object, 
      default: {} 
    }
  },
  { 
    timestamps: true,
    minimize: false // Key point: Khali cart object ({}) ko MongoDB se delete hone se rokega
  }
);

module.exports = mongoose.model('User', userSchema);