import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  userId?: string;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  let token = req.cookies?.token;
  
  if (!token && req.headers.authorization) {
    token = req.headers.authorization.replace('Bearer ', '');
  }

  if (!token) {
    res.status(401).json({ error: 'Access denied' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
};