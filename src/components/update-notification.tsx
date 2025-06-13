import { useEffect, useState } from 'react';
import { useRealTimeUpdates } from '@/hooks/useRealTimeUpdates';
import { motion, AnimatePresence } from 'framer-motion';

interface UpdateNotificationProps {
  type: string;
  message: string;
}

export function UpdateNotification({ type, message }: UpdateNotificationProps) {
  const [show, setShow] = useState(false);
  const { lastUpdate } = useRealTimeUpdates(type);

  useEffect(() => {
    if (lastUpdate) {
      setShow(true);
      const timer = setTimeout(() => setShow(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [lastUpdate]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 right-4 z-50"
        >
          <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
            <span className="animate-spin">🔄</span>
            <span>{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 