import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { User } from '../models/User';

export class UserController {
  /**
   * Get all users (Admin only)
   * GET /api/v1/users
   */
  public static async getAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
      res.status(200).json({ success: true, data: users });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Update a user's role (Admin only)
   * PUT /api/v1/users/:id/role
   */
  public static async updateRole(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { role } = req.body;
      const validRoles = ['Admin', 'Pastor', 'Editor', 'Member', 'Visitor'];
      if (!validRoles.includes(role)) {
        res.status(400).json({ success: false, message: 'Invalid role' });
        return;
      }
      const user = await User.findByIdAndUpdate(
        req.params.id as string,
        { role },
        { new: true, runValidators: true }
      ).select('-passwordHash');
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }
      res.status(200).json({ success: true, data: user });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  /**
   * Delete a user (Admin only)
   * DELETE /api/v1/users/:id
   */
  public static async remove(req: AuthRequest, res: Response): Promise<void> {
    try {
      // Prevent admin from deleting themselves
      if (req.params.id as string === req.user.id) {
        res.status(400).json({ success: false, message: 'You cannot delete your own account' });
        return;
      }
      const user = await User.findByIdAndDelete(req.params.id as string);
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }
      res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}
