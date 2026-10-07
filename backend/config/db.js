const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // process.env.MONGO_URI se .env file ka URL fetch hota hai
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    process.exit(1); // Error aane par process ko stop kar do
  }
};

module.exports = connectDB;