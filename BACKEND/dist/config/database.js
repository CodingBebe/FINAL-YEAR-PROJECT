"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeDatabase = exports.connectToDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://admin:fyprmis@udsm-rmis-project.mb0x3dm.mongodb.net/?retryWrites=true&w=majority&appName=UDSM-RMIS-PROJECT';
const connectToDatabase = async () => {
    try {
        await mongoose_1.default.connect(mongoUri);
        console.log('✅ Connected to MongoDB Atlas with Mongoose.');
    }
    catch (error) {
        console.error('❌ MongoDB connection error:', error);
        throw error;
    }
};
exports.connectToDatabase = connectToDatabase;
const closeDatabase = async () => {
    try {
        await mongoose_1.default.connection.close();
        console.log('✅ Mongoose connection closed.');
    }
    catch (error) {
        console.error('❌ Error closing Mongoose connection:', error);
    }
};
exports.closeDatabase = closeDatabase;
exports.default = mongoose_1.default;
