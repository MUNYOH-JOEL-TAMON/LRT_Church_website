import { Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';
import { AuthRequest } from '../middleware/authMiddleware';

export class AuthController {
  /**
   * Handle user registration
   */
  public static async register(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      // In a real enterprise app, we would use a library like Zod or Joi here 
      // to validate `req.body` strictly before passing it to the service.
      const { user, token } = await AuthService.register(req.body);
      
      res.status(201).json({
        success: true,
        data: user,
        token,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  /**
   * Handle user login
   */
  public static async login(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { user, token } = await AuthService.login(req.body);
      
      res.status(200).json({
        success: true,
        data: user,
        token,
      });
    } catch (error: any) {
      // 401 Unauthorized is the proper status code for failed login
      res.status(401).json({ success: false, message: error.message });
    }
  }

  /**
   * Get currently authenticated user
   */
  public static async getMe(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user = await AuthService.getUserById(req.user.id);
      res.status(200).json({ success: true, data: user });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  }
}
