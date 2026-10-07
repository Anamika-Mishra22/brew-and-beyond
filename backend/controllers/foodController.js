const Food = require('../models/Food');

// @desc    Get all food items
const getFoods = async (req, res) => {
  try {
    const { category } = req.query;
    let filter = {};
    if (category) {
      filter.category = category;
    }

    const foods = await Food.find(filter);
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single food item by ID
const getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (food) {
      res.json(food);
    } else {
      res.status(404).json({ message: 'Food item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new food item with local image upload
const createFood = async (req, res) => {
  try {
    const { name, description, price, category, isVeg } = req.body;

    // 👈 Agar multer ne file upload ki hai toh uska path banayein
    const imagePath = req.file ? `/uploads/${req.file.filename}` : (req.body.image || '');

    const food = new Food({
      name,
      description,
      price: Number(price),
      category,
      image: imagePath, // 👈 Local path yahan database mein save hoga
      isVeg: isVeg === 'true' || isVeg === true,
    });

    const createdFood = await food.save();
    res.status(201).json(createdFood);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update food item details
const updateFood = async (req, res) => {
  try {
    const { name, description, price, category, isVeg } = req.body;
    const food = await Food.findById(req.params.id);

    if (food) {
      food.name = name || food.name;
      food.description = description || food.description;
      food.price = price !== undefined ? Number(price) : food.price;
      food.category = category || food.category;
      
      // 👈 Agar update ke waqt nayi image select ki gayi hai
      if (req.file) {
        food.image = `/uploads/${req.file.filename}`;
      } else if (req.body.image) {
        food.image = req.body.image;
      }

      food.isVeg = isVeg !== undefined ? (isVeg === 'true' || isVeg === true) : food.isVeg;

      const updatedFood = await food.save();
      res.json(updatedFood);
    } else {
      res.status(404).json({ message: 'Food item not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a food item
const deleteFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (food) {
      await Food.findByIdAndDelete(req.params.id);
      res.json({ message: 'Food item removed successfully' });
    } else {
      res.status(404).json({ message: 'Food item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getFoods, getFoodById, createFood, updateFood, deleteFood };