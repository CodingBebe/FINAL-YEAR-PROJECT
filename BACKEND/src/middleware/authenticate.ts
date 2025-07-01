import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel, User } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    // Fetch user from DB to get firstName and lastName
    const user = await UserModel.findById(decoded.id).lean() as User | null;
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }
    (req as any).user = {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      unit_id: user.unit_id
    };
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

export default authenticate; 