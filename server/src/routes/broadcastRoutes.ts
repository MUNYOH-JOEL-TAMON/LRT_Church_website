import { Router } from 'express';
import { BroadcastController } from '../controllers/BroadcastController';
import { protect, authorize, optionalAuth } from '../middleware/authMiddleware';

const router = Router();

// Current broadcast info (optionalAuth determines if member has access to restricted events)
router.get('/current', optionalAuth, BroadcastController.getCurrent);
router.get('/participants', BroadcastController.getParticipants);
router.get('/reactions', BroadcastController.getReactions);

// Member presence & participation
router.post('/presence/join', protect, BroadcastController.joinPresence);
router.post('/presence/ping', protect, BroadcastController.pingPresence);
router.post('/presence/leave', protect, BroadcastController.leavePresence);
router.post('/reactions', protect, BroadcastController.sendReaction);

// Media Ministry / Admin Broadcast Controls
router.post('/start', protect, authorize('Admin', 'Pastor', 'Editor'), BroadcastController.start);
router.put('/:id', protect, authorize('Admin', 'Pastor', 'Editor'), BroadcastController.update);
router.post('/:id/end', protect, authorize('Admin', 'Pastor', 'Editor'), BroadcastController.end);
router.post('/members/:memberId/audio', protect, authorize('Admin', 'Pastor', 'Editor'), BroadcastController.setMemberAudio);
router.post('/:broadcastId/spotlight', protect, authorize('Admin', 'Pastor', 'Editor'), BroadcastController.spotlightMember);

export default router;

