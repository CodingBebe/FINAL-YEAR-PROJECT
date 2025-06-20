import { sequelize, testConnection } from './database';
import { UserModel } from '../models/User';

export const initializeDatabase = async (): Promise<void> => {
  try {
    // Test connection first
    await testConnection();
    
    // Sync all models (creates tables if they don't exist)
    // Use { force: true } only in development to drop and recreate tables
    await sequelize.sync({ 
      force: process.env.NODE_ENV === 'development' && process.env.DROP_TABLES === 'true',
      alter: process.env.NODE_ENV === 'development' 
    });
    
    console.log('✅ Database models synchronized successfully.');
    
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    process.exit(1);
  }
};

export const closeDatabase = async (): Promise<void> => {
  try {
    await sequelize.close();
    console.log('✅ Database connection closed.');
  } catch (error) {
    console.error('❌ Error closing database:', error);
  }
};
