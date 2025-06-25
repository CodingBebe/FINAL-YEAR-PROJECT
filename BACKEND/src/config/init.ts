import { connectToDatabase, closeDatabase } from './database';

export const initializeDatabase = async (): Promise<void> => {
  try {
    await connectToDatabase();
    // You can add any MongoDB-specific initialization here if needed
  } catch (error) {
    console.error('❌ Failed to initialize MongoDB:', error);
    process.exit(1);
  }
};

export { closeDatabase };
