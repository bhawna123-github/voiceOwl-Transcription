import { useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:3000";

export default function TranscriptionForm({ onSuccess }: { onSuccess: () => void }) {
  const [audioUrl, setAudioUrl] = useState("");
  const [useAzure, setUseAzure] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);
    try {
      const endpoint = useAzure ? "/azure-transcription" : "/transcription";
      const res = await axios.post(`${API_BASE}${endpoint}`, { audioUrl });
      setResponse(res.data);
      setAudioUrl("");
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="url"
        placeholder="Enter audio file URL"
        value={audioUrl}
        onChange={(e) => setAudioUrl(e.target.value)}
        required
      />
      <div style={{ marginBottom: "1rem" }}>
        <label>
          <input
            type="checkbox"
            checked={useAzure}
            onChange={() => setUseAzure(!useAzure)}
          />{" "}
          Use Azure mock
        </label>
      </div>
      <button type="submit" disabled={loading}>
        {loading ? "Processing..." : "Transcribe"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {response && (
        <pre style={{ background: "#f0f0f0", padding: "8px", borderRadius: "4px" }}>
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </form>
  );
}
