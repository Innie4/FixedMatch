import websocketService from '@/services/websocket';

interface AdminUpdate {
  type: string;
  payload: any;
  timestamp: string;
  adminAction: boolean;
}

export const sendAdminUpdate = async (type: string, payload: any) => {
  try {
    // First, update the database through your API
    const response = await fetch(`/api/admin/${type.toLowerCase()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Failed to update ${type}`);
    }

    const updatedData = await response.json();

    // Then, broadcast the update through WebSocket
    const update: AdminUpdate = {
      type: `${type.toUpperCase()}_UPDATED`,
      payload: updatedData,
      timestamp: new Date().toISOString(),
      adminAction: true,
    };

    websocketService.send(update);

    return updatedData;
  } catch (error) {
    console.error(`Error sending admin update for ${type}:`, error);
    throw error;
  }
};

// Helper functions for common admin actions
export const adminActions = {
  updateMatch: (matchData: any) => sendAdminUpdate('match', matchData),
  updatePrediction: (predictionData: any) => sendAdminUpdate('prediction', predictionData),
  updateUser: (userData: any) => sendAdminUpdate('user', userData),
  updateContent: (contentData: any) => sendAdminUpdate('content', contentData),
  updateSettings: (settingsData: any) => sendAdminUpdate('settings', settingsData),
}; 