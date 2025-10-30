import 'dotenv/config';
import http from 'http';
import app from './app';
import { connectMongo } from './config/db';
import { initWebSocketServer } from './realtime/websocketServer';

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

async function start() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    await connectMongo(mongoUri);

    // Create a single shared HTTP server for both Express & WebSocket
    const server = http.createServer(app);

    // Initialize WebSocket on the same server
    initWebSocketServer(server);

    // Start listening
    server.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
      console.log(`WebSocket ready at ws://localhost:${PORT}/ws`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
