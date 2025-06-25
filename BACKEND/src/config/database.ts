import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://admin:fyprmis@udsm-rmis-project.mb0x3dm.mongodb.net/?retryWrites=true&w=majority&appName=UDSM-RMIS-PROJECT';

export const connectToDatabase = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB Atlas with Mongoose.');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
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