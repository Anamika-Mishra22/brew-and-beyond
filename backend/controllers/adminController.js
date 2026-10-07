const User = require('../models/User');
const Food = require('../models/Food');
const Order = require('../models/Order');

exports.getAdminDashboardStats = async (req, res) => {
  try {
    const [
      totalCustomers,
      productsCount,
      ordersCount,
      pendingBrewsCount,
      revenueResult
    ] = await Promise.all([
      // 1. Total Customers Count (role = 'user')
      User.countDocuments({ role: { $ne: 'admin' } }),

      // 2. Coffee & Food Items Count
      Food.countDocuments(),

      // 3. Total Cafe Orders Count
      Order.countDocuments(),

      // 4. Pending Brews (Orders in progress)
      Order.countDocuments({ status: { $in: ['Pending', 'Preparing', 'Food Processing'] } }),

      // 5. Total Revenue Aggregation
      Order.aggregate([
        { $match: { isPaid: true } },
        { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } }
      ])
    ]);

    const calculatedRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    res.status(200).json({
      success: true,
      stats: {
        customers: totalCustomers,
        products: productsCount,
        orders: ordersCount,
        pendingOrders: pendingBrewsCount,
        totalRevenue: `₹${calculatedRevenue.toLocaleString('en-IN')}`,

        // Operational Fallback Metrics
        onlineSales: '₹56,685.10',
        cafeOutlets: 4,
        baristas: 12,
        deliveryRiders: 18,
        takeawaySales: '₹18,223.20',
        cafeCommission: '₹10,556.20'
      }
    });
  } catch (error) {
    console.error('Error fetching admin dashboard stats:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json({ success: true, message: 'User deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};