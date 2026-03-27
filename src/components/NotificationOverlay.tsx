import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pill, Clock, AlertTriangle, Calendar, X } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import type { PushNotification } from '@/store/appStoreContext';

const iconMap = {
  pill: Pill,
  clock: Clock,
  alert: AlertTriangle,
  calendar: Calendar,
};

function NotificationCard({ notification, onDismiss }: { notification: PushNotification; onDismiss: () => void }) {
  const Icon = iconMap[notification.icon];

  useEffect(() => {
    const timer = setTimeout(onDismiss, 8000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -80, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -40, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="mx-3 mb-2 rounded-2xl bg-white/95 backdrop-blur-xl shadow-lg border border-gray-200/60 p-3.5 cursor-pointer"
      onClick={onDismiss}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${notification.color}15` }}
        >
          <Icon className="w-4.5 h-4.5" style={{ color: notification.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-0.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold text-medical-500 uppercase tracking-wider">MediSync</span>
              <span className="text-[10px] text-gray-400">{notification.timestamp}</span>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onDismiss(); }}
              className="text-gray-300 hover:text-gray-500 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-sm font-semibold text-gray-900 leading-tight">{notification.title}</p>
          <p className="text-xs text-gray-500 leading-relaxed mt-0.5">{notification.body}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function NotificationOverlay() {
  const { notifications, dismissNotification, pushNotificationsEnabled } = useAppStore();

  if (!pushNotificationsEnabled) return null;

  return (
    <div className="absolute top-7 left-0 right-0 z-[100] pointer-events-none">
      <div className="pointer-events-auto">
        <AnimatePresence mode="popLayout">
          {notifications.map((n) => (
            <NotificationCard
              key={n.id}
              notification={n}
              onDismiss={() => dismissNotification(n.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
