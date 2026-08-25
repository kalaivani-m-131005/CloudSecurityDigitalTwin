import { useState } from "react";

const API = "http://localhost:8080";

export default function App() {
  const [page, setPage] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [inventory, setInventory] = useState(null);
  const [graph, setGraph] = useState(null);
  const [simResult, setSimResult] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [identity, setIdentity] = useState("identity-alice");

  const login = async () => {
    setError("");
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        const data = await res.json();
        setToken(data.token);
        setUser(data);
        setPage("dashboard");
      } else {
        setError("Invalid credentials! Try admin/admin123");
      }
    } catch (e) {
      setError("Connection error — please try again");
    }
  };

  const authFetch = (url, opts = {}) =>
    fetch(url, { ...opts, headers: { ...opts.headers, "Authorization": `Bearer ${token}`, "Content-Type": "application/json" } });

  const loadInventory = async () => {
    setLoading(true); setPage("inventory");
    const d = await authFetch(`${API}/api/inventory`).then(r => r.json());
    setInventory(d); setLoading(false);
  };

  const loadGraph = async () => {
    setLoading(true); setPage("graph");
    const d = await authFetch(`${API}/api/graph`).then(r => r.json());
    setGraph(d); setLoading(false);
  };

  const runSim = async () => {
    setLoading(true); setPage("result");
    const sim = await authFetch(`${API}/api/simulate`, { method: "POST", body: JSON.stringify({ identityId: identity }) }).then(r => r.json());
    const ai = await authFetch(`${API}/api/explain`, { method: "POST", body: JSON.stringify(sim) }).then(r => r.json());
    setSimResult(sim); setAiResult(ai); setLoading(false);
  };

  const logout = () => { setToken(""); setUser(null); setPage("login"); };

  const s = {
    app: { minHeight: "100vh", background: "linear-gradient(135deg,#0a0f1e,#0f172a)", fontFamily: "'Segoe UI',sans-serif", color: "#e2e8f0" },
    center: { display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" },
    glass: { background: "rgba(30,41,59,0.9)", backdropFilter: "blur(20px)", border: "1px solid rgba(96,165,250,0.3)", borderRadius: "20px", padding: "2.5rem", width: "380px" },
    title: { color: "#60a5fa", fontSize: "1.5rem", fontWeight: "700", textAlign: "center", marginBottom: "0.5rem" },
    sub: { color: "#94a3b8", textAlign: "center", marginBottom: "2rem", fontSize: "0.9rem" },
    input: { width: "100%", padding: "0.9rem", background: "#0f172a", border: "1px solid #334155", borderRadius: "10px", color: "#e2e8f0", fontSize: "1rem", marginBottom: "1rem", boxSizing: "border-box" },
    btn: { width: "100%", padding: "0.9rem", background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", border: "none", borderRadius: "10px", color: "white", fontSize: "1rem", fontWeight: "600", cursor: "pointer" },
    error: { background: "rgba(239,68,68,0.1)", border: "1px solid #ef4444", borderRadius: "8px", padding: "0.75rem", color: "#ef4444", marginBottom: "1rem", fontSize: "0.9rem" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.2rem 2rem", background: "rgba(30,41,59,0.95)", borderBottom: "1px solid #1e293b", position: "sticky", top: 0, zIndex: 100 },
    content: { padding: "2rem" },
    grid4: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem", marginBottom: "2rem" },
    grid3: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.5rem" },
    card: { background: "rgba(30,41,59,0.8)", border: "1px solid #334155", borderRadius: "16px", padding: "1.5rem" },
    menuCard: { background: "rgba(30,41,59,0.8)", border: "1px solid #334155", borderRadius: "16px", padding: "2rem", cursor: "pointer", textAlign: "center" },
    badge: (l) => { const c = { critical: "#ef4444", high: "#f97316", medium: "#eab308", low: "#22c55e" }; return { background: c[l?.toLowerCase()] || "#64748b", color: "white", padding: "0.2rem 0.7rem", borderRadius: "20px", fontSize: "0.75rem", fontWeight: "700" }; },
    itemRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem", background: "#0f172a", borderRadius: "8px", marginBottom: "0.5rem" },
    loading: { textAlign: "center", padding: "4rem", color: "#60a5fa", fontSize: "1.2rem" },
    statCard: (c) => ({ background: `rgba(${c},0.1)`, border: `1px solid rgba(${c},0.3)`, borderRadius: "16px", padding: "1.5rem", textAlign: "center" }),
    statNum: (c) => ({ fontSize: "2.5rem", fontWeight: "800", color: `rgb(${c})` }),
  };

  const Header = ({ title, back }) => (
    <div style={s.header}>
      <div>
        <span style={{ color: "#60a5fa", fontWeight: "700", fontSize: "1.2rem" }}>☁️ {title}</span>
        {user && <span style={{ color: "#94a3b8", fontSize: "0.8rem", marginLeft: "1rem" }}>👤 {user.username} • {user.role}</span>}
      </div>
      {back ? <button onClick={() => setPage(back)} style={{ background: "rgba(96,165,250,0.1)", color: "#60a5fa", border: "1px solid #60a5fa", padding: "0.5rem 1rem", borderRadius: "8px", cursor: "pointer" }}>← Back</button>
            : <button onClick={logout} style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid #ef4444", padding: "0.5rem 1rem", borderRadius: "8px", cursor: "pointer" }}>Logout</button>}
    </div>
  );

  if (page === "login") return (
    <div style={s.center}>
      <div style={s.glass}>
        <div style={{ textAlign: "center", fontSize: "3rem", marginBottom: "1rem" }}>🔐</div>
        <h1 style={s.title}>Cloud Security Digital Twin</h1>
        <p style={s.sub}>AI-Powered Security Posture Management</p>
        {error && <div style={s.error}>⚠️ {error}</div>}
        <input style={s.input} placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
        <input style={s.input} placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && login()} />
        <button style={s.btn} onClick={login}>Sign In →</button>
        <div style={{ marginTop: "1.5rem", padding: "1rem", background: "rgba(96,165,250,0.05)", borderRadius: "8px", fontSize: "0.8rem", color: "#64748b" }}>
          <div>👤 admin / admin123 (Admin)</div>
          <div>👤 analyst / analyst123 (Analyst)</div>
        </div>
      </div>
    </div>
  );

  if (page === "dashboard") return (
    <div style={s.app}>
      <Header title="Cloud Security Digital Twin" />
      <div style={s.content}>
        <div style={s.grid4}>
          {[["Total","9","148,163,184","🖥️"],["Critical","2","239,68,68","🚨"],["High","2","249,115,22","⚠️"],["Low","1","34,197,94","✅"]].map(([l,n,c,i]) => (
            <div key={l} style={s.statCard(c)}>
              <div style={{ fontSize: "2rem" }}>{i}</div>
              <div style={s.statNum(c)}>{n}</div>
              <div style={{ color: "#94a3b8", fontSize: "0.85rem" }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={s.grid3}>
          {[["🖥️","Cloud Inventory","EC2, S3, IAM Resources",loadInventory],
            ["🔗","Security Graph","Identity Chain Analysis",loadGraph],
            ["⚡","Attack Simulation","AI-Powered Risk Analysis",() => setPage("simulate")]
          ].map(([icon,title,desc,fn]) => (
            <div key={title} style={s.menuCard} onClick={fn}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>{icon}</div>
              <div style={{ color: "#60a5fa", fontSize: "1.1rem", fontWeight: "700", marginBottom: "0.5rem" }}>{title}</div>
              <div style={{ color: "#94a3b8", fontSize: "0.9rem" }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (page === "inventory") return (
    <div style={s.app}>
      <Header title="Cloud Inventory" back="dashboard" />
      <div style={s.content}>
        {loading ? <div style={s.loading}>⏳ Loading...</div> : inventory && (
          <div style={s.grid3}>
            <div style={s.card}>
              <h3 style={{ color: "#93c5fd", marginBottom: "1rem" }}>🖥️ EC2 Instances</h3>
              {inventory.ec2Instances?.map(i => (
                <div key={i.instanceId} style={s.itemRow}>
                  <div><div style={{ fontWeight: "600" }}>{i.name}</div><div style={{ color: "#94a3b8", fontSize: "0.8rem" }}>{i.instanceType}</div></div>
                  <span style={s.badge(i.sensitivityLevel)}>{i.sensitivityLevel}</span>
                </div>
              ))}
            </div>
            <div style={s.card}>
              <h3 style={{ color: "#93c5fd", marginBottom: "1rem" }}>🪣 S3 Buckets</h3>
              {inventory.s3Buckets?.map(b => (
                <div key={b.bucketName} style={s.itemRow}>
                  <div><div style={{ fontWeight: "600" }}>{b.bucketName}</div><div style={{ color: "#94a3b8", fontSize: "0.8rem" }}>Public: {b.publicAccess}</div></div>
                  <span style={s.badge(b.sensitivityLevel)}>{b.sensitivityLevel}</span>
                </div>
              ))}
            </div>
            <div style={s.card}>
              <h3 style={{ color: "#93c5fd", marginBottom: "1rem" }}>👤 IAM Users</h3>
              {inventory.iamUsers?.map(u => (
                <div key={u.username} style={s.itemRow}>
                  <div><div style={{ fontWeight: "600" }}>{u.username}</div><div style={{ color: "#94a3b8", fontSize: "0.8rem" }}>{u.role}</div></div>
                  <span style={{ ...s.badge("low"), background: u.mfaEnabled === "true" ? "#22c55e" : "#ef4444" }}>MFA {u.mfaEnabled === "true" ? "ON" : "OFF"}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (page === "graph") return (
    <div style={s.app}>
      <Header title="Security Graph" back="dashboard" />
      <div style={s.content}>
        {loading ? <div style={s.loading}>⏳ Building graph...</div> : graph && (
          <>
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
              {[["Nodes", graph.stats?.totalNodes, "#60a5fa"], ["Edges", graph.stats?.totalEdges, "#8b5cf6"], ["Identities", graph.stats?.identityNodes, "#3b82f6"], ["Resources", graph.stats?.resourceNodes, "#22c55e"]].map(([l, v, c]) => (
                <div key={l} style={{ background: "rgba(30,41,59,0.8)", border: `1px solid ${c}`, borderRadius: "10px", padding: "1rem 1.5rem", textAlign: "center" }}>
                  <div style={{ color: c, fontSize: "1.8rem", fontWeight: "800" }}>{v}</div>
                  <div style={{ color: "#94a3b8", fontSize: "0.85rem" }}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem" }}>
              {["IDENTITY", "ROLE", "PERMISSION", "RESOURCE"].map(type => {
                const colors = { IDENTITY: "#3b82f6", ROLE: "#8b5cf6", PERMISSION: "#eab308", RESOURCE: "#22c55e" };
                return (
                  <div key={type} style={{ background: `rgba(30,41,59,0.8)`, border: `1px solid ${colors[type]}`, borderRadius: "16px", padding: "1.5rem" }}>
                    <div style={{ color: colors[type], fontWeight: "700", marginBottom: "1rem", textAlign: "center" }}>{type}</div>
                    {graph.nodes?.filter(n => n.type === type).map(n => (
                      <div key={n.id} style={{ background: "#0f172a", border: "1px solid #334155", borderRadius: "8px", padding: "0.5rem", marginBottom: "0.5rem", textAlign: "center", fontSize: "0.85rem" }}>{n.label}</div>
                    ))}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );

  if (page === "simulate") return (
    <div style={s.app}>
      <Header title="Attack Simulation" back="dashboard" />
      <div style={s.content}>
        <div style={{ ...s.card, maxWidth: "500px", margin: "0 auto" }}>
          <h2 style={{ color: "#e2e8f0", marginBottom: "0.5rem" }}>⚡ Identity Compromise Simulation</h2>
          <p style={{ color: "#94a3b8", marginBottom: "1.5rem" }}>Select identity to simulate attack scenario</p>
          <select style={{ width: "100%", padding: "0.9rem", background: "#0f172a", border: "1px solid #334155", borderRadius: "10px", color: "#e2e8f0", fontSize: "1rem", marginBottom: "1.5rem" }} value={identity} onChange={e => setIdentity(e.target.value)}>
            <option value="identity-alice">👤 Alice — Admin (High Risk)</option>
            <option value="identity-bob">👤 Bob — ReadOnly (Low Risk)</option>
            <option value="identity-charlie">👤 Charlie — DevOps (Medium Risk)</option>
          </select>
          <button style={{ width: "100%", padding: "1rem", background: "linear-gradient(135deg,#ef4444,#f97316)", border: "none", borderRadius: "10px", color: "white", fontSize: "1.1rem", fontWeight: "700", cursor: "pointer" }} onClick={runSim}>🚀 Run Attack Simulation</button>
        </div>
      </div>
    </div>
  );

  if (page === "result") return (
    <div style={s.app}>
      <Header title="Simulation Results" back="dashboard" />
      <div style={s.content}>
        {loading ? <div style={s.loading}>🤖 Running AI Analysis...</div> : simResult && (
          <div style={{ maxWidth: "700px", margin: "0 auto" }}>
            <div style={{ ...s.card, textAlign: "center", marginBottom: "1.5rem" }}>
              <div style={{ background: `conic-gradient(${simResult.riskScore >= 80 ? "#ef4444" : simResult.riskScore >= 60 ? "#f97316" : simResult.riskScore >= 40 ? "#eab308" : "#22c55e"} ${simResult.riskScore * 3.6}deg, #1e293b 0deg)`, width: "160px", height: "160px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                <div style={{ background: "#0a0f1e", width: "120px", height: "120px", borderRadius: "50%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: simResult.riskScore >= 80 ? "#ef4444" : simResult.riskScore >= 60 ? "#f97316" : "#eab308", fontSize: "2rem", fontWeight: "800" }}>{simResult.riskScore}</span>
                  <span style={{ color: "#94a3b8", fontSize: "0.75rem" }}>/100</span>
                </div>
              </div>
              <h2 style={{ color: simResult.riskScore >= 80 ? "#ef4444" : simResult.riskScore >= 60 ? "#f97316" : "#eab308" }}>{simResult.riskLevel} RISK</h2>
              <div style={{ display: "flex", justifyContent: "center", gap: "2rem", marginTop: "1rem" }}>
                <div><div style={{ color: "#ef4444", fontSize: "1.8rem", fontWeight: "800" }}>{simResult.blastRadius}</div><div style={{ color: "#94a3b8", fontSize: "0.85rem" }}>Resources Affected</div></div>
                <div><div style={{ color: "#f97316", fontSize: "1.8rem", fontWeight: "800" }}>{simResult.attackPaths?.length}</div><div style={{ color: "#94a3b8", fontSize: "0.85rem" }}>Attack Paths</div></div>
              </div>
            </div>
            <div style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.3)", borderRadius: "16px", padding: "1.5rem" }}>
              <h3 style={{ color: "#60a5fa", marginBottom: "1rem" }}>🤖 AI Security Analysis</h3>
              <p style={{ color: "#e2e8f0", lineHeight: "1.7", marginBottom: "1.5rem" }}>{aiResult?.explanation}</p>
              <h3 style={{ color: "#22c55e", marginBottom: "1rem" }}>✅ Recommendations</h3>
              <p style={{ color: "#e2e8f0", lineHeight: "1.7" }}>{aiResult?.recommendation}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}