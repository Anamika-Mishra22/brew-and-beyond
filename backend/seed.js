const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Food = require('./models/Food'); // Food model import kiya

dotenv.config(); // .env file se MONGO_URI padhne ke liye

// Sample Cafe Menu Data
const sampleFoods = [
  // Beverages
  {
    name: 'Espresso Cold Coffee',
    description: 'Rich brewed espresso blended with chilled milk and chocolate ice cream.',
    price: 180,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c',
    isVeg: true
  },
  {
    name: 'Hazelnut Frappe',
    description: 'Creamy cold coffee infused with roasted hazelnut syrup.',
    price: 210,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699',
    isVeg: true
  },

  // Italian
  {
    name: 'Margherita Pizza',
    description: 'Classic fresh mozzarella, basil leaves, and tangy tomato sauce.',
    price: 320,
    category: 'Italian',
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3',
    isVeg: true
  },
  {
    name: 'Penne Alfredo Pasta',
    description: 'Penne pasta tossed in rich parmesan white cream sauce with herbs.',
    price: 290,
    category: 'Italian',
    image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281310',
    isVeg: true
  },

  // Chinese
  {
    name: 'Veg Hakka Noodles',
    description: 'Stir-fried noodles with crunchy vegetables and soy sauce.',
    price: 220,
    category: 'Chinese',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246',
    isVeg: true
  },
  {
    name: 'Schezwan Momos',
    description: 'Steamed dumplings tossed in spicy schezwan sauce.',
    price: 190,
    category: 'Chinese',
    image: 'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9',
    isVeg: true
  },

  // Indian
  {
    name: 'Paneer Butter Masala',
    description: 'Cottage cheese cubes in rich tomato and cashew butter gravy.',
    price: 340,
    category: 'Indian',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7',
    isVeg: true
  },
  {
    name: 'Garlic Naan',
    description: 'Oven-baked flatbread brushed with garlic butter.',
    price: 60,
    category: 'Indian',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950',
    isVeg: true
  }
];

// Seed Function
const seedDatabase = async () => {
  try {
    // 1. Database Connect karein
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding...');

    // 2. Purane Food Data ko clean karein (Duplicates se bachne ke liye)
    await Food.deleteMany();
    console.log('Old Food Items Cleared.');

    // 3. Naya Sample Data Database me Insert karein
    await Food.insertMany(sampleFoods);
    console.log('Sample Food Items Inserted Successfully!');

    // 4. Script band karein
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Function Call
seedDatabase();