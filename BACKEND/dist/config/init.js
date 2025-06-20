"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeDatabase = exports.initializeDatabase = void 0;
const database_1 = require("./database");
const initializeDatabase = async () => {
    try {
        // Test connection first
        await (0, database_1.testConnection)();
        // Sync all models (creates tables if they don't exist)
        // Use { force: true } only in development to drop and recreate tables
        await database_1.sequelize.sync({
            force: process.env.NODE_ENV === 'development' && process.env.DROP_TABLES === 'true',
            alter: process.env.NODE_ENV === 'development'
        });
        console.log('✅ Database models synchronized successfully.');
    }
    catch (error) {
        console.error('❌ Failed to initialize database:', error);
        process.exit(1);
    }
};
exports.initializeDatabase = initializeDatabase;
const closeDatabase = async () => {
    try {
        await database_1.sequelize.close();
        console.log('✅ Database connection closed.');
    }
    catch (error) {
        console.error('❌ Error closing database:', error);
    }
};
exports.closeDatabase = closeDatabase;
