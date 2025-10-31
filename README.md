# 🎙️ VoiceOwl Backend + Full Stack Submission

A minimal Node.js + TypeScript backend that mocks audio transcription, stores results in MongoDB, and includes a WebSocket + optional React frontend.

---

## ⚙️ How to Run

### 🪄 1. Clone & Install
```bash
git clone https://github.com/bhawna123-github/voiceOwl-Transcription
cd voiceowl-backend
npm install

📄 2. Add Environment File

Create a .env file in the project root:

PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/voiceowl

🚀 3. Start the Server
npm run dev


You’ll see:

✅ HTTP server running at http://localhost:3000
✅ WebSocket ready at ws://localhost:3000/ws

🧠 What This Does
🎧 POST /transcription

Accepts an audio URL, mocks a transcription, and saves it to MongoDB.

Example Request

{
  "audioUrl": "https://example.com/audio.mp3"
}


Example Response

{
  "id": "652ff2b7e...",
  "audioUrl": "https://example.com/audio.mp3",
  "transcription": "transcribed text",
  "createdAt": "2025-10-30T09:45:00Z"
}

📅 GET /transcriptions

Fetches all transcriptions created in the last 30 days (sorted newest first).

Optional filter example:

GET /transcriptions?source=azure

☁️ POST /azure-transcription

Mocks Azure Speech-to-Text (no real API call, just simulates latency and response).

Example Request

{
  "audioUrl": "https://example.com/sample.mp3",
  "language": "en-US"
}


Example Response

{
  "id": "6530f3b9...",
  "audioUrl": "https://example.com/sample.mp3",
  "transcription": "Azure mock transcription (en-US) for: https://example.com/sample.mp3",
  "source": "azure",
  "createdAt": "2025-10-30T09:50:00Z"
}

🔊 WebSocket /ws

Added a WebSocket endpoint to stream dummy partial and final transcriptions.

You can test it right in your browser console:

const ws = new WebSocket("ws://localhost:3000/ws");
ws.onopen = () => {
  ws.send(JSON.stringify({ audioChunk: "chunk-1", audioUrl: "https://example.com/test.mp3" }));
};
ws.onmessage = (msg) => console.log("Received:", msg.data);


Output example:

Partial transcription of chunk: "chunk-1"
Final mock transcription for https://example.com/test.mp3

🗂️ Folder Structure
src/
├─ app.ts
├─ server.ts
├─ config/
│  └─ db.ts
├─ controllers/
│  ├─ transcriptionController.ts
│  └─ azureController.ts
├─ services/
│  ├─ mockTranscriber.ts
│  └─ azureTranscriber.ts
├─ models/
│  └─ Transcription.ts
├─ routes/
│  ├─ transcriptionRoutes.ts
│  └─ azureRoutes.ts
├─ realtime/
│  └─ websocketServer.ts
└─ tests/
   └─ transcription.test.ts

🧪 Tests

Basic Jest tests for controllers are included.

Run tests:

npm test

🧩 MongoDB Indexing Note

For large datasets (e.g., 100M+ records), I’d add an index on createdAt:

db.transcriptions.createIndex({ createdAt: -1 })


This keeps the “last 30 days” query fast and efficient.

💻 Frontend (Optional)

A simple React + TypeScript frontend (inside /client) lets you:

🔗 Enter audio URL

☁️ Choose Azure or Mock transcription

🧾 View recent transcriptions

To run frontend:

cd client
npm install
npm run dev


Then open http://localhost:5173

🧰 Tech Stack

⚙️ Node.js + TypeScript

🧱 Express

🍃 MongoDB (Mongoose)

🧪 Jest (for tests)

🔊 WebSocket (ws library)

🔐 dotenv

⚛️ React (frontend)

🎥 Loom Demo

A short Loom video (2–3 min) will show API flow + frontend demo.

👤 Author

Bhawna Inaniya
VoiceOwl Backend + Full Stack Submission
