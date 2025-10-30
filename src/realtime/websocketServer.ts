import { WebSocketServer, WebSocket } from 'ws';
import { Transcription } from '../models/Transcription';

// Initializes a WebSocket server for mock real-time transcription
export function initWebSocketServer(server: import('http').Server) {
  const wss = new WebSocketServer({ server, path: '/ws' });
  console.log('WebSocket server running at /ws');

  wss.on('connection', (socket: WebSocket) => {
    console.log('Client connected to WebSocket');

    socket.on('message', async (msg) => {
      try {
        const { audioChunk, audioUrl } = JSON.parse(msg.toString());

        // Send a partial transcription update
        const partial = `Partial transcription of chunk: "${audioChunk}"`;
        socket.send(JSON.stringify({ type: 'partial', data: partial }));

        // Small delay to simulate processing time
        await new Promise((r) => setTimeout(r, 500));

        // Send final transcription
        const final = `Final mock transcription for ${audioUrl}`;
        socket.send(JSON.stringify({ type: 'final', data: final }));

        // Save result to MongoDB
        const doc = new Transcription({
          audioUrl,
          transcription: final,
          source: 'websocket',
        });
        await doc.save();

        console.log('Saved realtime transcription to MongoDB');
      } catch (err) {
        console.error('WebSocket error:', err);
      }
    });

    socket.on('close', () => console.log('Client disconnected'));
  });
}
