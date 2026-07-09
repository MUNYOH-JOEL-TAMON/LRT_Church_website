import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request to include our custom user payload
export interface AuthRequest extends Request {
  user?: any;
}

/**
 * Middleware to protect routes: Verifies JWT Token
 */
export const protect = (req: AuthRequest, res: Response, next: NextFunction): void => {
  let token;

  // Check if token is passed in the Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]; // Format: "Bearer <token>"
  }

  if (!token) {
    res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    return;
  }

  try {
    const secret = process.env.JWT_SECRET || 'fallback_secret';
    // Verify token
    const decoded = jwt.verify(token, secret);
    
    // Attach the decoded payload (id, role) to the request object
    req.user = decoded;
    
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token is invalid or expired' });
    return;
  }
};

/**
 * Middleware to restrict access based on User roles
 * @param roles Array of allowed roles (e.g., ['Admin', 'Pastor'])
 */
export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    // Case-insensitive role check
    const userRole = req.user?.role?.toLowerCase();
    const allowedRoles = roles.map(r => r.toLowerCase());

    if (!req.user || !allowedRoles.includes(userRole)) {
      res.status(403).json({ 
        success: false, 
        message: `User role '${req.user?.role || 'Unknown'}' is not authorized to access this route` 
      });
      return;
    }
    next();
  };
};
