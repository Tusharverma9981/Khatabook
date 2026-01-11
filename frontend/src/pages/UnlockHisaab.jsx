import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function UnlockHisaab({ id }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const unlock = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // ✅ unlock API call
      await api.post(`/hisaabs/${id}/unlock`, { password });

      // ✅ mark this hisaab unlocked for this session
      sessionStorage.setItem(`unlock_${id}`, "true");

      // ✅ go to hisaab page
      navigate(`/hisaab/${id}`, { replace: true });
    } catch (err) {
      alert(err?.response?.data?.message || "Wrong password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto" }}>
      <h2>🔒 Hisaab Locked</h2>

      <form onSubmit={unlock}>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: 10, marginTop: 10 }}
        />

        <button
          disabled={loading}
          style={{
            width: "100%",
            padding: 10,
            marginTop: 10,
            cursor: "pointer",
          }}
        >
          {loading ? "Unlocking..." : "Unlock"}
        </button>
      </form>
    </div>
  );
}
