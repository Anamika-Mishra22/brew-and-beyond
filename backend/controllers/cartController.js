const User = require('../models/User');

// 1. Add to Cart
exports.addToCart = async (req, res) => {
  try {
    // Middleware se decoded userId nikalna
    const userId = req.user.id || req.user._id || req.body.userId;
    let userData = await User.findById(userId);

    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let cartData = userData.cartData || {};
    const { itemId } = req.body;

    if (!cartData[itemId]) {
      cartData[itemId] = 1;
    } else {
      cartData[itemId] += 1;
    }

    await User.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Added to cart" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Remove from Cart
exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id || req.body.userId;
    let userData = await User.findById(userId);

    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let cartData = userData.cartData || {};
    const { itemId } = req.body;

    if (cartData[itemId] && cartData[itemId] > 0) {
      cartData[itemId] -= 1;
    }

    await User.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Removed from cart" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Get Cart Data
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id || req.body.userId;
    let userData = await User.findById(userId);

    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let cartData = userData.cartData || {};
    res.json({ success: true, cartData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};