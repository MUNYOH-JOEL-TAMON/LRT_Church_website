import { Broadcast } from '../models/Broadcast';
import { Event } from '../models/Event';
import { IVirtualParticipant } from '../interfaces/IBroadcast';
import { NotificationService } from './NotificationService';

interface LiveReaction {
  id: string;
  type: string; // 'amen' | 'praise' | 'hallelujah' | 'love' | 'clap'
  userName: string;
  createdAt: number;
}

// In-memory real-time state for active congregation participants and reactions
const activeParticipants = new Map<string, IVirtualParticipant>();
const recentReactions: LiveReaction[] = [];

// Cleanup stale participants (heartbeat timeout: 45 seconds)
setInterval(() => {
  const now = Date.now();
  for (const [userId, participant] of activeParticipants.entries()) {
    if (now - new Date(participant.lastPing).getTime() > 45000) {
      activeParticipants.delete(userId);
    }
  }

  // Keep only reactions from the last 20 seconds
  const cutoff = now - 20000;
  while (recentReactions.length > 0 && recentReactions[0].createdAt < cutoff) {
    recentReactions.shift();
  }
}, 5000);

export class BroadcastService {
  /**
   * Get the current broadcast session (or latest one) with access evaluation
   */
  public static async getCurrentBroadcast(user?: any) {
    // Priority: Live session first, then Scheduled, then most recent
    let broadcast: any = await Broadcast.findOne({ status: 'live' })
      .populate('eventId', 'title date location registeredAttendees')
      .sort({ updatedAt: -1 });

    if (!broadcast) {
      broadcast = await Broadcast.findOne({ status: 'scheduled' })
        .populate('eventId', 'title date location registeredAttendees')
        .sort({ scheduledDate: 1 });
    }
    if (!broadcast) {
      broadcast = await Broadcast.findOne()
        .populate('eventId', 'title date location registeredAttendees')
        .sort({ updatedAt: -1 });
    }

    // Default fallback if no broadcast exists yet
    if (!broadcast) {
      broadcast = await Broadcast.create({
        title: 'Sunday Worship Service',
        preacher: 'Pastor',
        status: 'offline',
        sourceType: 'youtube',
        streamUrl: 'https://www.youtube.com/watch?v=live_stream',
        allowWebcams: true,
        accessLevel: 'all',
      });
    }

    // Evaluate audience access restriction
    const event = broadcast.eventId as any;
    let isRestricted = false;
    let isUserRegistered = false;

    if (broadcast.accessLevel === 'registered_only' && event) {
      const userRole = user?.role?.toLowerCase();
      const isAdminOrPastor = ['admin', 'pastor', 'editor'].includes(userRole);

      if (!isAdminOrPastor) {
        const attendeeIds = (event.registeredAttendees || []).map((id: any) => id.toString());
        isUserRegistered = !!(user?.id && attendeeIds.includes(user.id.toString()));
        if (!isUserRegistered) {
          isRestricted = true;
        }
      } else {
        isUserRegistered = true;
      }
    }

    // Convert to plain object and mask streamUrl if restricted so non-registered viewers cannot stream
    const broadcastObj = broadcast.toObject ? broadcast.toObject() : { ...broadcast };
    if (isRestricted) {
      broadcastObj.streamUrl = '';
    }

    const restriction = {
      isRestricted,
      accessLevel: broadcast.accessLevel || 'all',
      isUserRegistered,
      event: event
        ? {
            _id: event._id,
            title: event.title,
            date: event.date,
            location: event.location,
            isRegistrationClosed: new Date(event.date).getTime() < Date.now(),
          }
        : null,
      message: isRestricted
        ? `This live broadcast is reserved exclusively for registered attendees of ${event?.title || 'this program'}.`
        : undefined,
    };

    return {
      broadcast: broadcastObj,
      restriction,
    };
  }

  /**
   * Start a live broadcast session and notify members
   */
  public static async startBroadcast(data: any, userId?: string) {
    let broadcast: any;
    if (data._id) {
      broadcast = await Broadcast.findByIdAndUpdate(
        data._id,
        {
          ...data,
          status: 'live',
          startedAt: new Date(),
          endedAt: null,
          createdBy: userId,
        },
        { new: true, upsert: true }
      );
    } else {
      // Mark any other live broadcasts as offline first
      await Broadcast.updateMany({ status: 'live' }, { status: 'offline', endedAt: new Date() });

      broadcast = await Broadcast.create({
        ...data,
        status: 'live',
        startedAt: new Date(),
        createdBy: userId,
      });
    }

    // Dispatch In-App Notification (targeted if registered_only, or to all members if open)
    try {
      if (broadcast.accessLevel === 'registered_only' && broadcast.eventId) {
        const event = await Event.findById(broadcast.eventId).select('title registeredAttendees');
        if (event && event.registeredAttendees && event.registeredAttendees.length > 0) {
          await NotificationService.notifyUsers(event.registeredAttendees, {
            title: `🔴 LIVE NOW: ${broadcast.title} (Exclusive)`,
            message: `The live program for ${event.title} is now streaming! Tap to worship with other registered attendees.`,
            type: 'event',
            link: '/portal/dashboard?tab=live',
            metadata: { broadcastId: broadcast._id, eventId: event._id },
          });
        }
      } else {
        await NotificationService.notifyAllMembers({
          title: `🔴 LIVE NOW: ${broadcast.title}`,
          message: `${broadcast.preacher} is live ministering! Join the Virtual Sanctuary and worship with us now.`,
          type: 'event',
          link: '/portal/dashboard?tab=live',
          metadata: { broadcastId: broadcast._id },
        });
      }
    } catch (err) {
      console.error('Failed to dispatch broadcast live notification:', err);
    }

    return broadcast;
  }

  /**
   * Check if a member is allowed to join the Virtual Congregation wall
   */
  public static async canUserJoinPresence(userId: string, userRole?: string): Promise<{ allowed: boolean; reason?: string }> {
    const liveBroadcast = await Broadcast.findOne({ status: 'live' });
    if (!liveBroadcast) return { allowed: true };

    if (liveBroadcast.accessLevel === 'registered_only' && liveBroadcast.eventId) {
      const isAdminOrPastor = ['admin', 'pastor', 'editor'].includes(userRole?.toLowerCase() || '');
      if (isAdminOrPastor) return { allowed: true };

      const event = await Event.findById(liveBroadcast.eventId).select('title registeredAttendees');
      if (event) {
        const attendeeIds = (event.registeredAttendees || []).map((id: any) => id.toString());
        const isRegistered = attendeeIds.includes(userId);
        if (!isRegistered) {
          return {
            allowed: false,
            reason: `Only registered attendees of "${event.title}" can appear on the sanctuary video wall.`,
          };
        }
      }
    }
    return { allowed: true };
  }

  /**
   * Update broadcast settings / status
   */
  public static async updateBroadcast(id: string, data: any) {
    const updated = await Broadcast.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!updated) throw new Error('Broadcast session not found');
    return updated;
  }

  /**
   * End the current live broadcast
   */
  public static async endBroadcast(id: string) {
    const ended = await Broadcast.findByIdAndUpdate(
      id,
      {
        status: 'offline',
        endedAt: new Date(),
        spotlightedMemberId: null,
      },
      { new: true }
    );
    // Clear participants on broadcast end
    activeParticipants.clear();
    return ended;
  }

  /**
   * Join or update member presence in the Virtual Sanctuary
   */
  public static joinOrUpdatePresence(participant: {
    userId: string;
    name: string;
    email?: string;
    location?: string;
    hasCamera?: boolean;
    hasAudio?: boolean;
    streamPeerId?: string;
  }) {
    const existing = activeParticipants.get(participant.userId);
    const updated: IVirtualParticipant = {
      userId: participant.userId,
      name: participant.name,
      email: participant.email || existing?.email || '',
      location: participant.location || existing?.location || 'Online Worshipper',
      hasCamera: participant.hasCamera !== undefined ? participant.hasCamera : existing?.hasCamera || false,
      hasAudio: participant.hasAudio !== undefined ? participant.hasAudio : existing?.hasAudio || false,
      isMutedByAdmin: existing?.isMutedByAdmin !== undefined ? existing.isMutedByAdmin : true, // safe default
      isSpotlighted: existing?.isSpotlighted || false,
      streamPeerId: participant.streamPeerId || existing?.streamPeerId,
      lastPing: new Date(),
    };

    activeParticipants.set(participant.userId, updated);
    return updated;
  }

  /**
   * Heartbeat ping to keep member online in the roster
   */
  public static pingPresence(userId: string) {
    const p = activeParticipants.get(userId);
    if (p) {
      p.lastPing = new Date();
      activeParticipants.set(userId, p);
      return true;
    }
    return false;
  }

  /**
   * Member leaves the virtual sanctuary
   */
  public static leavePresence(userId: string) {
    activeParticipants.delete(userId);
    return true;
  }

  /**
   * Get all active virtual congregation participants
   */
  public static getParticipants(): IVirtualParticipant[] {
    return Array.from(activeParticipants.values());
  }

  /**
   * Media Team / Admin: Remotely mute or unmute a member so they can speak with the pastor
   */
  public static setMemberAudio(userId: string, isMutedByAdmin: boolean) {
    const p = activeParticipants.get(userId);
    if (!p) throw new Error('Participant is not connected');

    p.isMutedByAdmin = isMutedByAdmin;
    activeParticipants.set(userId, p);
    return p;
  }

  /**
   * Media Team / Admin: Spotlight a specific member's video box on the Sanctuary screen
   */
  public static async spotlightMember(broadcastId: string, memberId: string | null) {
    for (const [uid, p] of activeParticipants.entries()) {
      p.isSpotlighted = memberId ? uid === memberId : false;
      // If spotlighted, automatically grant audio speaking permission
      if (p.isSpotlighted) {
        p.isMutedByAdmin = false;
      }
      activeParticipants.set(uid, p);
    }

    const broadcast = await Broadcast.findByIdAndUpdate(
      broadcastId,
      { spotlightedMemberId: memberId },
      { new: true }
    );

    return {
      broadcast,
      participants: Array.from(activeParticipants.values()),
    };
  }

  /**
   * Add a live floating reaction
   */
  public static addReaction(type: string, userName: string) {
    const reaction: LiveReaction = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      userName,
      createdAt: Date.now(),
    };
    recentReactions.push(reaction);
    return reaction;
  }

  /**
   * Get recent reactions for display animations
   */
  public static getRecentReactions() {
    return recentReactions.slice(-25);
  }
}

