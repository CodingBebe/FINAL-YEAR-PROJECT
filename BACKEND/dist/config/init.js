"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeDatabase = exports.initializeDatabase = void 0;
const database_1 = require("./database");
Object.defineProperty(exports, "closeDatabase", { enumerable: true, get: function () { return database_1.closeDatabase; } });
const initializeDatabase = async () => {
    try {
        await (0, database_1.connectToDatabase)();
        // You can add any MongoDB-specific initialization here if needed
    }
    catch (error) {
        console.error('❌ Failed to initialize MongoDB:', error);
        process.exit(1);
    }
};
exports.initializeDatabase = initializeDatabase;
