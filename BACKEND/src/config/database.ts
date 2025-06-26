import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  throw new Error('MONGODB_URI not set in environment variables.');
}

export const connectToDatabase = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB Atlas with Mongoose.');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1); // Stop the app if DB fails
  }
};

export const closeDatabase = async () => {
  try {
    await mongoose.connection.close();
    console.log('✅ Mongoose connection closed.');
  } catch (error) {
    console.error('❌ Error closing Mongoose connection:', error);
  }
};

export default mongoose;
