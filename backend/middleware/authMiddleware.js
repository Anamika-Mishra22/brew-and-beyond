const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;

  // 1. Check karein ki headers me 'Authorization' aur 'Bearer' token hai ya nahi
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Header format: "Bearer eyJhbGciOi..." -> Split karke sirf token lete hain
      token = req.headers.authorization.split(' ')[1];

      // Token ko Secret Key se verify karte hain
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');

      // Decoded token me user ID hoti hai, use req object me add kar dete hain
      req.user = {
        _id: decoded.id || decoded._id || decoded.userId,
        role: decoded.role
      };

      // Agle function/controller par jane dete hain
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// 🟢 NEW FUNCTION: Fi
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an Admin' });
  }
};

// 🟢 EXPORTS UPDATE: module.exports 
module.exports = { protect, admin };

