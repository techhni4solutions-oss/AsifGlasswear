import { useState } from "react";
import { api, setAuthToken } from "../../services/api";
import { useData } from "../../context/DataContext";

interface Props {
  onLogin: () => void;
  onBack: () => void;
}

export default function AdminLogin({ onLogin, onBack }: Props) {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { refreshData } = useData();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Map admin email or username
      const u = username.includes("@") ? username.split("@")[0] : username;
      const res = await api.login({ username: u, password });
      setAuthToken(res.token);
      await refreshData();
      onLogin();
    } catch (err: any) {
      setError(err.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#0c0c0b" }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5 border" style={{ borderColor: "rgba(201,169,110,0.3)", backgroundColor: "rgba(201,169,110,0.08)" }}>
            <svg width="28" height="28" viewBox="0 0 20 20" fill="none">
              <rect x="2" y="2" width="7" height="7" stroke="#c9a96e" strokeWidth="1.5" />
              <rect x="11" y="2" width="7" height="7" stroke="#c9a96e" strokeWidth="1.5" />
              <rect x="2" y="11" width="7" height="7" stroke="#c9a96e" strokeWidth="1.5" />
              <rect x="11" y="11" width="7" height="7" stroke="#c9a96e" strokeWidth="1.5" />
            </svg>
          </div>
          <div className="font-serif text-2xl text-white">Asif Glass & Aluminium</div>
          <div className="text-xs tracking-widest uppercase mt-1" style={{ color: "var(--gold)", fontFamily: "'JetBrains Mono',monospace" }}>Admin Portal</div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl p-8 border" style={{ borderColor: "rgba(255,255,255,0.07)", backgroundColor: "#1a1918" }}>
          <h2 className="font-serif text-xl text-white mb-6">Sign In</h2>

          {error && (
            <div className="mb-4 p-3 rounded-lg text-sm bg-red-900/40 text-red-200 border border-red-700/50">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" style={{ color: "rgba(245,244,240,0.7)" }}>Username or Email</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3.5 rounded-lg text-sm border"
              style={{ borderColor: "rgba(255,255,255,0.1)", backgroundColor: "rgba(255,255,255,0.04)", color: "white" }}
              required
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium mb-2" style={{ color: "rgba(245,244,240,0.7)" }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3.5 rounded-lg text-sm border"
              style={{ borderColor: "rgba(255,255,255,0.1)", backgroundColor: "rgba(255,255,255,0.04)", color: "white" }}
              required
            />
          </div>

          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded"
                style={{ accentColor: "var(--gold)" }}
              />
              <span className="text-sm" style={{ color: "rgba(245,244,240,0.6)" }}>Remember me</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-gold w-full py-3.5 rounded-lg font-semibold text-base"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="text-center mt-6">
          <button onClick={onBack} className="text-sm flex items-center gap-1 mx-auto" style={{ color: "rgba(245,244,240,0.4)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to Website
          </button>
        </div>
      </div>
    </div>
  );
}
