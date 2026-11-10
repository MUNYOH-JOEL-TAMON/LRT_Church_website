import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { BroadcastService } from '../services/BroadcastService';

export class BroadcastController {
  public static async getCurrent(req: Request, res: Response): Promise<void> {
    try {
      const broadcast = await BroadcastService.getCurrentBroadcast();
      const participants = BroadcastService.getParticipants();
      const reactions = BroadcastService.getRecentReactions();

      res.status(200).json({
        success: true,
        data: {
          broadcast,
          participants,
          reactions,
          activeViewersCount: participants.length,
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public static async start(req: AuthRequest, res: Response): Promise<void> {
    try {
      const broadcast = await BroadcastService.startBroadcast(req.body, req.user?.id);
      res.status(200).json({ success: true, data: broadcast, message: 'Broadcast is now live' });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  public static async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const broadcast = await BroadcastService.updateBroadcast(req.params.id as string, req.body);
      res.status(200).json({ success: true, data: broadcast });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  public static async end(req: AuthRequest, res: Response): Promise<void> {
    try {
      const broadcast = await BroadcastService.endBroadcast(req.params.id as string);
      res.status(200).json({ success: true, data: broadcast, message: 'Broadcast ended' });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  public static async joinPresence(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user?.id) {
        res.status(401).json({ success: false, message: 'Not authenticated' });
        return;
      }
      const participant = BroadcastService.joinOrUpdatePresence({
        userId: req.user.id,
        name: `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || 'Online Worshipper',
        email: req.user.email,
        location: req.body.location || 'Online Worshipper',
        hasCamera: req.body.hasCamera,
        hasAudio: req.body.hasAudio,
        streamPeerId: req.body.streamPeerId,
      });
      res.status(200).json({ success: true, data: participant });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  public static async pingPresence(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user?.id) {
        res.status(401).json({ success: false, message: 'Not authenticated' });
        return;
      }
      BroadcastService.pingPresence(req.user.id);
      res.status(200).json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public static async leavePresence(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (req.user?.id) {
        BroadcastService.leavePresence(req.user.id);
      }
      res.status(200).json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public static async getParticipants(req: Request, res: Response): Promise<void> {
    try {
      const participants = BroadcastService.getParticipants();
      res.status(200).json({ success: true, data: participants });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public static async setMemberAudio(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { memberId } = req.params;
      const { isMutedByAdmin } = req.body;
      const updated = BroadcastService.setMemberAudio(memberId as string, isMutedByAdmin);
      res.status(200).json({
        success: true,
        data: updated,
        message: isMutedByAdmin ? 'Member audio muted' : 'Member audio enabled for pastor dialogue',
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  public static async spotlightMember(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { broadcastId } = req.params;
      const { memberId } = req.body; // pass null to remove spotlight
      const result = await BroadcastService.spotlightMember(broadcastId as string, memberId);
      res.status(200).json({
        success: true,
        data: result,
        message: memberId ? 'Member spotlighted on Sanctuary screen' : 'Spotlight cleared',
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  public static async sendReaction(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { type } = req.body;
      const userName = req.user ? `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() : 'Worshipper';
      const reaction = BroadcastService.addReaction(type || 'amen', userName);
      res.status(200).json({ success: true, data: reaction });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  public static async getReactions(req: Request, res: Response): Promise<void> {
    try {
      const reactions = BroadcastService.getRecentReactions();
      res.status(200).json({ success: true, data: reactions });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
