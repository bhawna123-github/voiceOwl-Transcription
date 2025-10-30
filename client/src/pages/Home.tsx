import { useEffect, useState } from "react";
import axios from "axios";
import TranscriptionForm from "../components/TranscriptionForm";

const API_BASE = "http://localhost:3000";

export default function Home() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/transcriptions`);
      setList(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="container">
      <h1>🎙️ VoiceOwl Transcription Portal</h1>
      <TranscriptionForm onSuccess={fetchList} />
      <h2>Recent Transcriptions</h2>
      {loading && <p>Loading...</p>}
      {!loading && list.length === 0 && <p>No transcriptions found.</p>}
      <ul>
        {list.map((t) => (
          <li key={t.id}>
            <b>{t.audioUrl}</b>
            <br />
            <small>{t.transcription}</small>
            <br />
            <small>{new Date(t.createdAt).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
