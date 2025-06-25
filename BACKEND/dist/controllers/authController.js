"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.logout = exports.register = exports.login = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const emailValidator_1 = require("../utils/emailValidator");
// JWT Secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';
// Login function
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Validate email format
        const emailValidation = (0, emailValidator_1.validateUDSMEmail)(email);
        if (!emailValidation.isValid) {
            res.status(400).json({
                success: false,
                message: emailValidation.message
            });
            return;
        }
        if (!password) {
            res.status(400).json({
                success: false,
                message: 'Password is required'
            });
            return;
        }
        const user = await User_1.UserModel.findOne({ email: email.toLowerCase() });
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
            return;
        }
        // Check if password is correct
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
            return;
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({
            id: user._id,
            email: user.email,
            role: user.role
        }, JWT_SECRET, { expiresIn: '24h' });
        // Send successful response
        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            role: user.role,
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.login = login;
// Register function
const register = async (req, res) => {
    try {
        const { email, password, firstName, lastName, role } = req.body;
        // Validate required fields
        if (!email || !password || !firstName || !lastName) {
            res.status(400).json({
                success: false,
                message: 'All fields are required',
                errors: {
                    email: !email ? 'Email is required' : null,
                    password: !password ? 'Password is required' : null,
                    firstName: !firstName ? 'First name is required' : null,
                    lastName: !lastName ? 'Last name is required' : null
                }
            });
            return;
        }
        // Validate email format
        const emailValidation = (0, emailValidator_1.validateUDSMEmail)(email);
        if (!emailValidation.isValid) {
            res.status(400).json({
                success: false,
                message: emailValidation.message
            });
            return;
        }
        const existingUser = await User_1.UserModel.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            res.status(409).json({
                success: false,
                message: 'User with this email already exists'
            });
            return;
        }
        // Create new user (password will be automatically hashed by the hook)
        const newUser = await User_1.UserModel.create({
            email: email.toLowerCase(),
            password,
            firstName,
            lastName,
            role: role || 'champion', // default role
            unit_id: null // Set this based on your requirements
        });
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({
            id: newUser._id,
            email: newUser.email,
            role: newUser.role
        }, JWT_SECRET, { expiresIn: '24h' });
        // Send successful response
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                id: newUser._id,
                email: newUser.email,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                role: newUser.role
            }
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.register = register;
// Logout function (mainly for token blacklisting if needed)
const logout = async (req, res) => {
    try {
        // In a simple JWT implementation, logout is handled client-side
        // by removing the token from storage
        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    }
    catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.logout = logout;
// Get current user profile
const getProfile = async (req, res) => {
    var _a;
    try {
        // Assuming you have middleware that adds user to req
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
            return;
        }
        const user = await User_1.UserModel.findById(userId);
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            }
        });
    }
    catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.getProfile = getProfile;
