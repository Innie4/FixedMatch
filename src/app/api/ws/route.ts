import { WebSocketServer } from 'ws';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Store connected clients
const clients = new Set<WebSocket>();

// Create WebSocket server
const wss = new WebSocketServer({ noServer: true });

// Handle WebSocket connections
wss.on('connection', (ws) => {
  clients.add(ws);

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      
      // Broadcast the message to all connected clients
      clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data));
        }
      });
    } catch (error) {
      console.error('Error handling WebSocket message:', error);
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
  });
});

// Handle upgrade requests
export async function GET(req: NextRequest) {
  if (req.headers.get('upgrade') !== 'websocket') {
    return new NextResponse('Expected WebSocket connection', { status: 400 });
  }

  const { socket: ws, response } = await new Promise<{ socket: any; response: Response }>((resolve) => {
    wss.handleUpgrade(req, req.socket, Buffer.alloc(0), (ws) => {
      resolve({ socket: ws, response: new Response() });
    });
  });

  return response;
}

// Helper function to broadcast updates
export function broadcastUpdate(type: string, payload: any) {
  const message = JSON.stringify({
    type,
    payload,
    timestamp: new Date().toISOString()
  });

  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
} 