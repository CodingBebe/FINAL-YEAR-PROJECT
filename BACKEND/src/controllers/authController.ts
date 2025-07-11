import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User';
import { validateUDSMEmail } from '../utils/emailValidator';

// JWT Secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// Login function
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate email format
    const emailValidation = validateUDSMEmail(email);
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

    const user = await UserModel.findOne({ email: email.toLowerCase() });
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
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

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

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
};

// Register function
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, firstName, lastName, role, unit } = req.body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !unit) {
      res.status(400).json({
        success: false,
        message: 'All fields are required',
        errors: {
          email: !email ? 'Email is required' : null,
          password: !password ? 'Password is required' : null,
          firstName: !firstName ? 'First name is required' : null,
          lastName: !lastName ? 'Last name is required' : null,
          unit: !unit ? 'Unit is required' : null
        }
      });
      return;
    }

    // Validate email format
    const emailValidation = validateUDSMEmail(email);
    if (!emailValidation.isValid) {
      res.status(400).json({ 
        success: false,
        message: emailValidation.message 
      });
      return;
    }

    const existingUser = await UserModel.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(409).json({ 
        success: false,
        message: 'User with this email already exists' 
      });
      return;
    }

    // Create new user (password will be automatically hashed by the hook)
    const newUser = await UserModel.create({
      email: email.toLowerCase(),
      password,
      firstName,
      lastName,
      role: role || 'champion', // default role
      unit_id: unit,
    });

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: newUser._id, 
        email: newUser.email, 
        role: newUser.role 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

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

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
};

// Logout function (mainly for token blacklisting if needed)
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    // In a simple JWT implementation, logout is handled client-side
    // by removing the token from storage
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
};

// Get current user profile
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    // Assuming you have middleware that adds user to req
    const userId = (req as any).user?._id;
    
    if (!userId) {
      res.status(401).json({ 
        success: false,
        message: 'Unauthorized' 
      });
      return;
    }

    const user = await UserModel.findById(userId);
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

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
};

// Register Risk Champion function
export const registerRiskChampion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, firstName, lastName, unit, phone } = req.body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !unit) {
      res.status(400).json({
        success: false,
        message: 'All fields are required',
        errors: {
          email: !email ? 'Email is required' : null,
          password: !password ? 'Password is required' : null,
          firstName: !firstName ? 'First name is required' : null,
          lastName: !lastName ? 'Last name is required' : null,
          unit: !unit ? 'Unit is required' : null
        }
      });
      return;
    }

    // Validate email format
    const emailValidation = validateUDSMEmail(email);
    if (!emailValidation.isValid) {
      res.status(400).json({ 
        success: false,
        message: emailValidation.message 
      });
      return;
    }

    const existingUser = await UserModel.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(409).json({ 
        success: false,
        message: 'User with this email already exists' 
      });
      return;
    }

    // Create new risk champion (password will be automatically hashed by the hook)
    const newUser = await UserModel.create({
      email: email.toLowerCase(),
      password,
      firstName,
      lastName,
      role: 'champion',
      unit_id: unit,
      phone,
    });

    res.status(201).json({
      success: true,
      message: 'Risk champion registered successfully',
      user: {
        id: newUser._id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
        unit_id: newUser.unit_id,
        phone: newUser.phone,
      }
    });
  } catch (error) {
    console.error('Risk champion registration error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
};