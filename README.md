*** How to Run
1. Clone & Install
git clone <your_repo_url>
cd voiceowl-backend
npm install

2. Add Env File

Create a .env file in root:

PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/voiceowl
3. Start Server
npm run dev


You’ll see:

** HTTP server running at http://localhost:3000
** WebSocket ready at ws://localhost:3000/ws

** What This Does
POST /transcription

Takes an audio URL, mocks a transcription like “transcribed text,” and saves it to MongoDB.

Example:

{
  "audioUrl": "https://example.com/audio.mp3"
}


Response:

{
  "id": "652ff2b7e...",
  "audioUrl": "https://example.com/audio.mp3",
  "transcription": "transcribed text",
  "createdAt": "2025-10-30T09:45:00Z"
}

GET /transcriptions

Fetches all transcriptions created in the last 30 days.
I also added sorting (newest first).

Optional filter example:

GET /transcriptions?source=azure

POST /azure-transcription

Same as the normal transcription, but it mocks Azure Speech-to-Text.
Right now it’s fake (no real API call) — just simulates latency and response.

Example request:

{
  "audioUrl": "https://example.com/sample.mp3",
  "language": "en-US"
}


Response:

{
  "id": "6530f3b9...",
  "audioUrl": "https://example.com/sample.mp3",
  "transcription": "Azure mock transcription (en-US) for: https://example.com/sample.mp3",
  "source": "azure",
  "createdAt": "2025-10-30T09:50:00Z"
}

** WebSocket /ws

Added a WebSocket endpoint to stream dummy “partial” and “final” transcriptions.
You can test it in the browser console:

const ws = new WebSocket("ws://localhost:3000/ws");
ws.onopen = () => {
  ws.send(JSON.stringify({
    audioChunk: "chunk-1",
    audioUrl: "https://example.com/test.mp3"
  }));
};
ws.onmessage = (msg) => console.log("Received:", msg.data);


It sends something like:

Partial transcription of chunk: "chunk-1"
Final mock transcription for https://example.com/test.mp3

** Folder Structure
src/
 ├─ app.ts
 ├─ server.ts
 ├─ config/
 │   └─ db.ts
 ├─ controllers/
 │   ├─ transcriptionController.ts
 │   └─ azureController.ts
 ├─ services/
 │   ├─ mockTranscriber.ts
 │   └─ azureTranscriber.ts
 ├─ models/
 │   └─ Transcription.ts
 ├─ routes/
 │   ├─ transcriptionRoutes.ts
 │   └─ azureRoutes.ts
 ├─ realtime/
 │   └─ websocketServer.ts
 └─ tests/
     └─ transcription.test.ts

** Tests

I added basic Jest tests for the controllers.

Run:

npm test

** MongoDB Indexing Note

If the dataset grows to 100M+ records, I’ll add an index on createdAt field:

db.transcriptions.createIndex({ createdAt: -1 })


This will make the “last 30 days” query fast and efficient.

** Scalability Notes

If I had to scale this for 10k+ concurrent requests:

Run the app in Docker containers behind a load balancer.

Use Redis or in-memory cache for recent transcriptions.

Add a message queue (like RabbitMQ or Kafka) for async tasks.

Switch to cloud MongoDB cluster with sharding.

It’s already modular, so scaling horizontally would be simple.

**  Frontend (Optional)

I made a simple React + TypeScript frontend (in /client)
It lets me:

Enter audio URL

Choose Azure or normal transcription

View recent transcriptions

To run:

cd client
npm install
npm run dev


Then open http://localhost:5173

**   Tech Stack

Node.js + TypeScript

Express

MongoDB (Mongoose)

Jest (for tests)

WebSocket (ws library)

dotenv

React (for frontend)


** Loom Demo

** I’ll record a short Loom video (2–3 min) showing the API calls + frontend demo.

** Author

Bhawna Inaniya
VoiceOwl Backend + Full Stack Submission