import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CalendarDays,
  PenLine,
  Megaphone,
  Sparkles,
  CheckCheck,
  Trash2,
  X,
  BellOff,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import notificationService from '../../services/notificationService';
import type { AppNotification } from '../../types';

interface NotificationBellProps {
  className?: string;
  isDarkTheme?: boolean;
}

const NotificationBell: React.FC<NotificationBellProps> = ({
  className = '',
  isDarkTheme = false,
}) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Fetch notifications
  const fetchNotifications = async (showLoading = false) => {
    try {
      if (showLoading) setIsLoading(true);
      const res = await notificationService.getAll();
      if (res.data) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch {
      // Quiet fail if network glitch
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };

  // Initial load & Polling every 30 seconds (like Facebook)
  useEffect(() => {
    fetchNotifications(true);
    const interval = setInterval(() => {
      fetchNotifications(false);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  // Mark single notification as read and optionally navigate
  const handleNotificationClick = async (notif: AppNotification) => {
    if (!notif.isRead) {
      try {
        await notificationService.markAsRead(notif._id);
        setNotifications((prev) =>
          prev.map((n) => (n._id === notif._id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch {
        // Quiet fail
      }
    }

    setIsOpen(false);

    if (notif.link) {
      navigate(notif.link);
    }
  };

  // Mark all as read
  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to mark all as read');
    }
  };

  // Clear all notifications
  const handleClearAll = async () => {
    if (!notifications.length) return;
    if (!window.confirm('Are you sure you want to clear all notifications?')) return;
    try {
      await notificationService.clearAll();
      setNotifications([]);
      setUnreadCount(0);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to clear notifications');
    }
  };

  // Delete single notification
  const handleDeleteSingle = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await notificationService.remove(id);
      const target = notifications.find((n) => n._id === id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      if (target && !target.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch {
      // Quiet fail
    }
  };

  // Format relative time helper
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffSecs = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSecs < 60) return 'Just now';
    if (diffSecs < 3600) return `${Math.floor(diffSecs / 60)}m ago`;
    if (diffSecs < 86400) return `${Math.floor(diffSecs / 3600)}h ago`;
    if (diffSecs < 604800) return `${Math.floor(diffSecs / 86400)}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Render type icon
  const renderIcon = (type: string) => {
    switch (type) {
      case 'event':
        return (
          <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-600 flex items-center justify-center flex-shrink-0">
            <CalendarDays className="w-5 h-5" />
          </div>
        );
      case 'blog':
        return (
          <div className="w-10 h-10 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-blue-600 flex items-center justify-center flex-shrink-0">
            <PenLine className="w-5 h-5" />
          </div>
        );
      case 'announcement':
        return (
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <Megaphone className="w-5 h-5" />
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-2xl bg-primary/15 border border-primary/30 text-primary flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
        );
    }
  };

  const displayedNotifications =
    activeFilter === 'unread' ? notifications.filter((n) => !n.isRead) : notifications;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* ── Bell Icon Button ── */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="View notifications"
        className={`relative p-2.5 rounded-2xl transition-all duration-200 cursor-pointer flex items-center justify-center ${
          isDarkTheme
            ? 'bg-white/10 hover:bg-white/15 text-white'
            : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
        } ${isOpen ? 'ring-2 ring-primary/40' : ''}`}
      >
        <Bell className="w-5 h-5 transition-transform group-hover:scale-105" />

        {/* Facebook-style Red Unread Count Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 bg-red-600 text-white text-[11px] font-extrabold rounded-full flex items-center justify-center shadow-lg shadow-red-500/40 border-2 border-white animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* ── Dropdown Panel (Facebook style) ── */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-84 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200/80 z-50 overflow-hidden animate-slide-up origin-top-right">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 bg-white">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-extrabold text-slate-900 text-lg">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <span className="bg-red-50 text-red-600 border border-red-200 text-xs font-bold px-2 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    title="Mark all as read"
                    className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-primary transition-colors text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCheck className="w-4 h-4" />
                    <span className="hidden sm:inline">Mark all read</span>
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    title="Clear all"
                    className="p-1.5 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors sm:hidden cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setActiveFilter('all')}
                className={`flex-1 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setActiveFilter('unread')}
                className={`flex-1 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeFilter === 'unread'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Unread ({unreadCount})
              </button>
            </div>
          </div>

          {/* List Body */}
          <div className="max-h-[26rem] overflow-y-auto divide-y divide-slate-100">
            {isLoading && notifications.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
                <p className="text-xs text-slate-400">Loading notifications...</p>
              </div>
            ) : displayedNotifications.length === 0 ? (
              <div className="py-12 px-6 text-center">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                  <BellOff className="w-6 h-6" />
                </div>
                <p className="text-sm font-heading font-bold text-slate-700">
                  {activeFilter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                </p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  {activeFilter === 'unread'
                    ? "You're all caught up with every announcement and update."
                    : 'You will receive in-app alerts when events and blog devotionals are posted.'}
                </p>
              </div>
            ) : (
              displayedNotifications.map((notif) => (
                <div
                  key={notif._id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`group relative p-4 flex items-start gap-3.5 transition-colors cursor-pointer hover:bg-slate-50 ${
                    !notif.isRead ? 'bg-blue-50/40' : 'bg-white'
                  }`}
                >
                  {/* Type Icon */}
                  {renderIcon(notif.type)}

                  {/* Text details */}
                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex items-center gap-2">
                      <h4
                        className={`text-xs sm:text-sm font-heading leading-tight truncate ${
                          !notif.isRead
                            ? 'font-extrabold text-slate-900'
                            : 'font-bold text-slate-800'
                        }`}
                      >
                        {notif.title}
                      </h4>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed mt-1 line-clamp-2">
                      {notif.message}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[11px] font-medium text-slate-400">
                        {formatTime(notif.createdAt)}
                      </span>
                      {notif.link && (
                        <span className="text-[10px] font-bold text-primary flex items-center gap-0.5">
                          View details <ExternalLink className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Unread blue dot indicator */}
                  {!notif.isRead && (
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600 flex-shrink-0 mt-2 shadow-xs shadow-blue-500/50" />
                  )}

                  {/* Delete button (hover only) */}
                  <button
                    onClick={(e) => handleDeleteSingle(e, notif._id)}
                    title="Dismiss"
                    className="absolute top-3 right-3 p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-slate-200/70 text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400 font-medium">
              Latter Rain Tabernacle Live Notifications
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;

