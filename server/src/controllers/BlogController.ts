import { Request, Response } from 'express';
import { BlogService } from '../services/BlogService';
import { AuthRequest } from '../middleware/authMiddleware';

export class BlogController {
  public static async getAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      const posts = await BlogService.getAll();
      res.status(200).json({ success: true, data: posts });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public static async getPublished(req: Request, res: Response): Promise<void> {
    try {
      const posts = await BlogService.getPublished();
      res.status(200).json({ success: true, data: posts });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public static async getById(req: Request, res: Response): Promise<void> {
    try {
      const post = await BlogService.getById(req.params.id as string);
      res.status(200).json({ success: true, data: post });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  }

  public static async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const post = await BlogService.create(req.body, req.user.id);
      res.status(201).json({ success: true, data: post });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  public static async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const post = await BlogService.update(req.params.id as string, req.body);
      res.status(200).json({ success: true, data: post });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  public static async remove(req: AuthRequest, res: Response): Promise<void> {
    try {
      await BlogService.remove(req.params.id as string);
      res.status(200).json({ success: true, message: 'Blog post deleted successfully' });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  }
}
