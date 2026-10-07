const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload'); // 👈 Multer middleware import kiya

const { 
  getFoods, 
  getFoodById, 
  createFood, 
  updateFood, 
  deleteFood 
} = require('../controllers/foodController');

router.get('/', getFoods);
router.get('/:id', getFoodById);
router.post('/', upload.single('image'), createFood); // 👈 Yahan upload middleware add kiya
router.put('/:id', upload.single('image'), updateFood); // 👈 Update ke waqt bhi image change karne ke liye
router.delete('/:id', deleteFood); 

module.exports = router;