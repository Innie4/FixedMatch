import { useEffect, useState } from 'react';
import WebSocketService from '../services/websocket';

export const useRealTimeUpdates = (dataType) => {
  const [data, setData] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    WebSocketService.connect();

    const handleUpdate = (event) => {
      const { type, payload, timestamp } = event.detail;
      
      if (type === dataType || type === 'GLOBAL_UPDATE') {
        setData(payload);
        setLastUpdate(timestamp);
      }
    };

    window.addEventListener('admin-update', handleUpdate);

    return () => {
      window.removeEventListener('admin-update', handleUpdate);
    };
  }, [dataType]);

  return { data, lastUpdate };
}; 