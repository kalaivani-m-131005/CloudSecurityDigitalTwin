import { useState, useEffect } from "react";

const API = "https://cloud-security-digital-twin.onrender.com";

const theme = {
  bg: "#0d1117",
  surface: "#161b22",
  border: "#30363d",
  text: "#e6edf3",
  muted: "#7d8590",
  accent: "#58a6ff",
  green: "#3fb950",
  red: "#f85149",
  orange: "#d29922",
  purple: "#bc8cff",
};

const s = {
  app: { minHeight: "100vh", background: theme.bg, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", color: theme.text },
  center: { display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: `radial-gradient(ellipse at 50% 0%, #1f2d3d 0%, ${theme.bg} 60%)` },
  loginWrap: { width: "360px" },
  logo: { textAlign: "center", marginBottom: "2rem" },
  logoIcon: { width: "48px", height: "48px", background: "linear-gradient(135deg, #1f6feb, #58a6ff)", borderRadius: "12px", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "24px", marginBottom: "1rem" },
  loginTitle: { color: theme.text, fontSize: "1.5rem", fontWeight: "600", textAlign: "center", marginBottom: "0.5rem" },
  loginSub: { color: theme.muted, textAlign: "center", fontSize: "0.875rem", marginBottom: "2rem" },
  loginCard: { background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "12px", padding: "1.5rem" },
  label: { display: "block", color: theme.muted, fontSize: "0.8rem", fontWeight: "500", marginBottom: "0.4rem", letterSpacing: "0.02em" },
  input: { width: "100%", padding: "0.6rem 0.875rem", background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, fontSize: "0.875rem", marginBottom: "1rem", boxSizing: "border-box", outline: "none" },
  btnPrimary: { width: "100%", padding: "0.6rem", background: "#1f6feb", border: "1px solid #388bfd", borderRadius: "6px", color: "#fff", fontSize: "0.875rem", fontWeight: "500", cursor: "pointer" },
  error: { background: "rgba(248,81,73,0.1)", border: "1px solid rgba(248,81,73,0.4)", borderRadius: "6px", padding: "0.75rem", color: theme.red, marginBottom: "1rem", fontSize: "0.8rem" },
  divider: { borderTop: `1px solid ${theme.border}`, margin: "1rem 0" },
  hint: { color: theme.muted, fontSize: "0.75rem", textAlign: "center" },

  // Layout
  layout: { display: "flex", minHeight: "100vh" },
  sidebar: { width: "240px", background: theme.surface, borderRight: `1px solid ${theme.border}`, padding: "1rem 0", flexShrink: 0, display: "flex", flexDirection: "column" },
  sidebarLogo: { padding: "0 1rem 1rem", borderBottom: `1px solid ${theme.border}`, marginBottom: "0.5rem" },
  sidebarLogoText: { color: theme.text, fontWeight: "600", fontSize: "0.9rem" },
  sidebarLogoSub: { color: theme.muted, fontSize: "0.7rem" },
  navItem: (active) => ({ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.5rem 1rem", margin: "0.1rem 0.5rem", borderRadius: "6px", cursor: "pointer", background: active ? "rgba(88,166,255,0.1)" : "transparent", color: active ? theme.accent : theme.muted, fontSize: "0.85rem", fontWeight: active ? "500" : "400", border: active ? `1px solid rgba(88,166,255,0.2)` : "1px solid transparent" }),
  main: { flex: 1, display: "flex", flexDirection: "column", overflow: "auto" },
  topbar: { padding: "0.875rem 1.5rem", borderBottom: `1px solid ${theme.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: theme.surface },
  topbarTitle: { color: theme.text, fontWeight: "600", fontSize: "0.95rem" },
  userBadge: { display: "flex", alignItems: "center", gap: "0.5rem", background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: "6px", padding: "0.4rem 0.75rem", fontSize: "0.8rem", color: theme.muted },
  content: { padding: "1.5rem", flex: 1 },

  // Cards
  metricsGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem", marginBottom: "1.5rem" },
  metricCard: (c) => ({ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "8px", padding: "1.25rem", borderTop: `3px solid ${c}` }),
  metricVal: (c) => ({ fontSize: "2rem", fontWeight: "700", color: c, lineHeight: 1 }),
  metricLabel: { color: theme.muted, fontSize: "0.75rem", marginTop: "0.4rem", fontWeight: "500" },
  metricChange: (c) => ({ fontSize: "0.7rem", color: c, marginTop: "0.25rem" }),

  // Feature cards
  featureGrid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem", marginBottom: "1.5rem" },
  featureCard: { background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "8px", padding: "1.25rem", cursor: "pointer", transition: "border-color 0.15s" },
  featureIcon: (c) => ({ width: "36px", height: "36px", background: `${c}22`, border: `1px solid ${c}44`, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.875rem", fontSize: "18px" }),
  featureTitle: { color: theme.text, fontWeight: "600", fontSize: "0.875rem", marginBottom: "0.25rem" },
  featureDesc: { color: theme.muted, fontSize: "0.775rem", lineHeight: "1.4" },

  // Table
  tableWrap: { background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "8px", overflow: "hidden" },
  tableHeader: { display: "grid", padding: "0.75rem 1rem", background: theme.bg, borderBottom: `1px solid ${theme.border}`, color: theme.muted, fontSize: "0.75rem", fontWeight: "600", letterSpacing: "0.05em" },
  tableRow: { display: "grid", padding: "0.75rem 1rem", borderBottom: `1px solid ${theme.border}`, alignItems: "center", fontSize: "0.85rem" },
  badge: (level) => {
    const map = { critical: ["#f8514922", "#f85149"], high: ["#d2992222", "#d29922"], medium: ["#388bfd22", "#388bfd"], low: ["#3fb95022", "#3fb950"] };
    const [bg, color] = map[level?.toLowerCase()] || ["#7d859022", "#7d8590"];
    return { background: bg, color, border: `1px solid ${color}44`, padding: "0.2rem 0.5rem", borderRadius: "4px", fontSize: "0.7rem", fontWeight: "600" };
  },

  // Graph
  graphGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem" },
  graphCol: (c) => ({ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "8px", padding: "1rem", borderTop: `2px solid ${c}` }),
  graphColTitle: (c) => ({ color: c, fontSize: "0.7rem", fontWeight: "700", letterSpacing: "0.1em", marginBottom: "0.875rem", textTransform: "uppercase" }),
  graphNode: { background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: "4px", padding: "0.4rem 0.6rem", marginBottom: "0.4rem", fontSize: "0.8rem", color: theme.text },

  // Sim
  simCard: { background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "8px", padding: "1.5rem", maxWidth: "480px" },
  select: { width: "100%", padding: "0.6rem 0.875rem", background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: "6px", color: theme.text, fontSize: "0.875rem", marginBottom: "1.25rem", outline: "none" },
  btnDanger: { width: "100%", padding: "0.7rem", background: "#da3633", border: "1px solid #f85149", borderRadius: "6px", color: "#fff", fontSize: "0.875rem", fontWeight: "500", cursor: "pointer" },

  // Result
  resultGrid: { display: "grid", gridTemplateColumns: "300px 1fr", gap: "1.5rem" },
  riskCard: { background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "8px", padding: "1.5rem", textAlign: "center" },
  aiCard: { background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "8px", padding: "1.5rem" },
  aiSection: { marginBottom: "1.25rem" },
  aiLabel: { color: theme.muted, fontSize: "0.75rem", fontWeight: "600", letterSpacing: "0.05em", marginBottom: "0.5rem", textTransform: "uppercase" },
  aiText: { color: theme.text, fontSize: "0.875rem", lineHeight: "1.6", background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: "6px", padding: "0.875rem" },

  loading: { textAlign: "center", padding: "4rem", color: theme.muted, fontSize: "0.875rem" },
  sectionTitle: { color: theme.text, fontWeight: "600", fontSize: "0.95rem", marginBottom: "1rem" },
  sectionSub: { color: theme.muted, fontSize: "0.8rem", marginBottom: "1.25rem" },
};

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
  const [summary, setSummary] = useState({totalResources:0, criticalCount:0, highCount:0, lowCount:0});
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
        setToken(data.token); setUser(data); setPage("dashboard");
      } else setError("Invalid credentials. Please try again.");
    } catch { setError("Cannot connect to server. Is the backend running?"); }
  };

  const authFetch = (url, opts = {}) =>
    fetch(url, { ...opts, headers: { ...opts.headers, Authorization: `Bearer ${token}`, "Content-Type": "application/json" } });

  const loadInventory = async () => { setLoading(true); setPage("inventory"); const d = await authFetch(`${API}/api/inventory`).then(r => r.json()); setInventory(d); if(d.summary) setSummary(d.summary); setLoading(false); };
  const loadGraph = async () => { setLoading(true); setPage("graph"); const d = await authFetch(`${API}/api/graph`).then(r => r.json()); setGraph(d); setLoading(false); };
  const runSim = async () => {
    setLoading(true); setPage("result");
    const sim = await authFetch(`${API}/api/simulate`, { method: "POST", body: JSON.stringify({ identityId: identity }) }).then(r => r.json());
    const ai = await authFetch(`${API}/api/explain`, { method: "POST", body: JSON.stringify(sim) }).then(r => r.json());
    setSimResult(sim); setAiResult(ai); setLoading(false);
  };
  const logout = () => { setToken(""); setUser(null); setPage("login"); };

  const navItems = [
    { id: "dashboard", label: "Overview", icon: "⊞" },
    { id: "inventory", label: "Cloud Inventory", icon: "◫", action: loadInventory },
    { id: "graph", label: "Security Graph", icon: "◈", action: loadGraph },
    { id: "simulate", label: "Attack Simulation", icon: "⚡", action: () => setPage("simulate") },
  ];

  const Sidebar = () => (
    <div style={s.sidebar}>
      <div style={s.sidebarLogo}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{ width: "28px", height: "28px", background: "linear-gradient(135deg,#1f6feb,#58a6ff)", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>🛡</div>
          <div>
            <div style={s.sidebarLogoText}>SecureTwin</div>
            <div style={s.sidebarLogoSub}>Cloud Security Platform</div>
          </div>
        </div>
      </div>
      <div style={{ flex: 1, padding: "0.5rem 0" }}>
        <div style={{ padding: "0 1rem", marginBottom: "0.25rem", color: theme.muted, fontSize: "0.7rem", fontWeight: "600", letterSpacing: "0.08em" }}>NAVIGATION</div>
        {navItems.map(item => (
          <div key={item.id} style={s.navItem(page === item.id)}
            onClick={() => item.action ? item.action() : setPage(item.id)}>
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
      <div style={{ padding: "1rem", borderTop: `1px solid ${theme.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
          <div style={{ width: "28px", height: "28px", background: "#1f6feb", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "700" }}>
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <div>
            <div style={{ color: theme.text, fontSize: "0.8rem", fontWeight: "500" }}>{user?.username}</div>
            <div style={{ color: theme.muted, fontSize: "0.7rem" }}>{user?.role}</div>
          </div>
        </div>
        <div onClick={logout} style={{ color: theme.red, fontSize: "0.775rem", cursor: "pointer", padding: "0.3rem 0" }}>Sign out</div>
      </div>
    </div>
  );

  const Topbar = ({ title, subtitle }) => (
    <div style={s.topbar}>
      <div>
        <div style={s.topbarTitle}>{title}</div>
        {subtitle && <div style={{ color: theme.muted, fontSize: "0.75rem" }}>{subtitle}</div>}
      </div>
    </div>
  );

  // LOGIN
  if (page === "login") return (
    <div style={s.center}>
      <div style={s.loginWrap}>
        <div style={s.logo}>
          <div style={s.logoIcon}>🛡</div>
          <h1 style={s.loginTitle}>Sign in to SecureTwin</h1>
          <p style={s.loginSub}>Cloud Security Digital Twin Platform</p>
        </div>
        <div style={s.loginCard}>
          {error && <div style={s.error}>{error}</div>}
          <label style={s.label}>Username</label>
          <input style={s.input} placeholder="Enter username" value={username} onChange={e => setUsername(e.target.value)} onKeyDown={e => e.key === "Enter" && login()} />
          <label style={s.label}>Password</label>
          <input style={s.input} type="password" placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && login()} />
          <button style={s.btnPrimary} onClick={login}>Sign in</button>
          <div style={s.divider} />
          <div style={s.hint}>Use your registered credentials to sign in</div>
        </div>
      </div>
    </div>
  );

  // DASHBOARD
  if (page === "dashboard") return (
    <div style={s.layout}>
      <Sidebar />
      <div style={s.main}>
      <Topbar title={`Welcome back, ${user?.username?.charAt(0).toUpperCase() + user?.username?.slice(1)}`} subtitle={`Logged in as ${user?.role} · ${new Date().toLocaleDateString('en-IN', {weekday:'long', year:'numeric', month:'long', day:'numeric'})}`} />
        <div style={s.content}>
          <div style={s.metricsGrid}>
            {[
              ["Total Assets", summary.totalResources||"...", theme.accent, "↑ All resources monitored"],
["Critical", summary.criticalCount||"...", theme.red, "⚠ Immediate action required"],
["High Risk", summary.highCount||"...", theme.orange, "↑ Review recommended"],
["Secure", summary.lowCount||"...", theme.green, "✓ No issues detected"],
            ].map(([label, val, color, note]) => (
              <div key={label} style={s.metricCard(color)}>
                <div style={s.metricVal(color)}>{val}</div>
                <div style={s.metricLabel}>{label}</div>
                <div style={s.metricChange(color)}>{note}</div>
              </div>
            ))}
          </div>

          <div style={{ ...s.sectionTitle, marginBottom: "0.75rem" }}>Security Modules</div>
          <div style={s.featureGrid}>
            {[
              ["🖥", theme.accent, "Cloud Inventory", "Scan and monitor EC2 instances, S3 buckets, and IAM users across your cloud environment.", loadInventory],
              ["◈", theme.purple, "Security Graph", "Visualize identity-to-resource access chains and detect privilege escalation paths.", loadGraph],
              ["⚡", theme.red, "Attack Simulation", "Simulate identity compromise scenarios to measure blast radius and risk exposure.", () => setPage("simulate")],
            ].map(([icon, color, title, desc, fn]) => (
              <div key={title} style={s.featureCard} onClick={fn}
                onMouseOver={e => e.currentTarget.style.borderColor = color}
                onMouseOut={e => e.currentTarget.style.borderColor = theme.border}>
                <div style={s.featureIcon(color)}>{icon}</div>
                <div style={s.featureTitle}>{title}</div>
                <div style={s.featureDesc}>{desc}</div>
              </div>
            ))}
          </div>

          <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "8px", padding: "1.25rem" }}>
            <div style={s.sectionTitle}>Recent Activity</div>
            {[
              ["Identity scan completed", "All 3 IAM users analyzed", theme.green, "2m ago"],
              ["Attack path detected", "Admin → prod-db (CRITICAL)", theme.red, "5m ago"],
              ["Risk score updated", "Alice: 81/100 — CRITICAL", theme.orange, "8m ago"],
            ].map(([title, desc, color, time]) => (
              <div key={title} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.75rem 0", borderBottom: `1px solid ${theme.border}` }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: color, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ color: theme.text, fontSize: "0.85rem" }}>{title}</div>
                  <div style={{ color: theme.muted, fontSize: "0.75rem" }}>{desc}</div>
                </div>
                <div style={{ color: theme.muted, fontSize: "0.75rem" }}>{time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // INVENTORY
  if (page === "inventory") return (
    <div style={s.layout}>
      <Sidebar />
      <div style={s.main}>
        <Topbar title="Cloud Inventory" subtitle="All monitored cloud resources" />
        <div style={s.content}>
          {loading ? <div style={s.loading}>Scanning cloud resources...</div> : inventory && (
            <>
              <div style={{ ...s.sectionTitle, marginBottom: "0.5rem" }}>EC2 Instances</div>
              <div style={{ ...s.tableWrap, marginBottom: "1.5rem" }}>
                <div style={{ ...s.tableHeader, gridTemplateColumns: "2fr 1fr 1fr 1fr" }}>
                  <span>INSTANCE NAME</span><span>TYPE</span><span>STATE</span><span>RISK LEVEL</span>
                </div>
                {inventory.ec2Instances?.map(i => (
                  <div key={i.instanceId} style={{ ...s.tableRow, gridTemplateColumns: "2fr 1fr 1fr 1fr" }}>
                    <span style={{ color: theme.text, fontWeight: "500" }}>{i.name}</span>
                    <span style={{ color: theme.muted }}>{i.instanceType}</span>
                    <span style={{ color: theme.green }}>● {i.state}</span>
                    <span style={s.badge(i.sensitivityLevel)}>{i.sensitivityLevel}</span>
                  </div>
                ))}
              </div>

              <div style={{ ...s.sectionTitle, marginBottom: "0.5rem" }}>S3 Buckets</div>
              <div style={{ ...s.tableWrap, marginBottom: "1.5rem" }}>
                <div style={{ ...s.tableHeader, gridTemplateColumns: "2fr 1fr 1fr" }}>
                  <span>BUCKET NAME</span><span>PUBLIC ACCESS</span><span>RISK LEVEL</span>
                </div>
                {inventory.s3Buckets?.map(b => (
                  <div key={b.bucketName} style={{ ...s.tableRow, gridTemplateColumns: "2fr 1fr 1fr" }}>
                    <span style={{ color: theme.text, fontWeight: "500" }}>{b.bucketName}</span>
                    <span style={{ color: b.publicAccess === "true" ? theme.red : theme.green }}>{b.publicAccess === "true" ? "⚠ Public" : "✓ Private"}</span>
                    <span style={s.badge(b.sensitivityLevel)}>{b.sensitivityLevel}</span>
                  </div>
                ))}
              </div>

              <div style={{ ...s.sectionTitle, marginBottom: "0.5rem" }}>IAM Users</div>
              <div style={s.tableWrap}>
                <div style={{ ...s.tableHeader, gridTemplateColumns: "1fr 1fr 1fr" }}>
                  <span>USERNAME</span><span>ROLE</span><span>MFA STATUS</span>
                </div>
                {inventory.iamUsers?.map(u => (
                  <div key={u.username} style={{ ...s.tableRow, gridTemplateColumns: "1fr 1fr 1fr" }}>
                    <span style={{ color: theme.text, fontWeight: "500" }}>{u.username}</span>
                    <span style={{ color: theme.muted }}>{u.role}</span>
                    <span style={{ color: u.mfaEnabled === "true" ? theme.green : theme.red }}>
                      {u.mfaEnabled === "true" ? "✓ Enabled" : "✗ Disabled"}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  // GRAPH
  if (page === "graph") return (
    <div style={s.layout}>
      <Sidebar />
      <div style={s.main}>
        <Topbar title="Security Graph" subtitle="Identity to resource access chain visualization" />
        <div style={s.content}>
          {loading ? <div style={s.loading}>Building security graph...</div> : graph && (
            <>
              <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
                {[["Total Nodes", graph.stats?.totalNodes, theme.accent], ["Edges", graph.stats?.totalEdges, theme.purple], ["Identities", graph.stats?.identityNodes, theme.green], ["Resources", graph.stats?.resourceNodes, theme.orange]].map(([l, v, c]) => (
                  <div key={l} style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: "6px", padding: "0.875rem 1.25rem", borderLeft: `3px solid ${c}` }}>
                    <div style={{ color: c, fontSize: "1.5rem", fontWeight: "700" }}>{v}</div>
                    <div style={{ color: theme.muted, fontSize: "0.75rem" }}>{l}</div>
                  </div>
                ))}
              </div>
              <div style={s.graphGrid}>
                {[["IDENTITY", theme.accent], ["ROLE", theme.purple], ["PERMISSION", theme.orange], ["RESOURCE", theme.green]].map(([type, c]) => (
                  <div key={type} style={s.graphCol(c)}>
                    <div style={s.graphColTitle(c)}>{type}</div>
                    {graph.nodes?.filter(n => n.type === type).map(n => (
                      <div key={n.id} style={s.graphNode}>{n.label}</div>
                    ))}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  // SIMULATE
  if (page === "simulate") return (
    <div style={s.layout}>
      <Sidebar />
      <div style={s.main}>
        <Topbar title="Attack Simulation" subtitle="Simulate identity compromise scenarios" />
        <div style={s.content}>
          <div style={s.simCard}>
            <div style={{ ...s.sectionTitle, marginBottom: "0.25rem" }}>Configure Simulation</div>
            <div style={{ ...s.sectionSub }}>Select an identity to simulate a compromise and measure the blast radius.</div>
            <label style={s.label}>Target Identity</label>
            <select style={s.select} value={identity} onChange={e => setIdentity(e.target.value)}>
              <option value="identity-alice">Alice — Admin Role (Expected: CRITICAL)</option>
              <option value="identity-bob">Bob — Read Only Role (Expected: LOW)</option>
              <option value="identity-charlie">Charlie — DevOps Role (Expected: MEDIUM)</option>
            </select>
            <button style={s.btnDanger} onClick={runSim}>Run Attack Simulation</button>
          </div>
        </div>
      </div>
    </div>
  );

  // RESULT
  if (page === "result") return (
    <div style={s.layout}>
      <Sidebar />
      <div style={s.main}>
        <Topbar title="Simulation Results" subtitle="AI-powered threat analysis" />
        <div style={s.content}>
          {loading ? <div style={s.loading}>Running AI threat analysis...</div> : simResult && (
            <div style={s.resultGrid}>
              <div>
                <div style={s.riskCard}>
                  <svg width="160" height="160" viewBox="0 0 160 160" style={{ display: "block", margin: "0 auto 1rem" }}>
                    <circle cx="80" cy="80" r="65" fill="none" stroke={theme.border} strokeWidth="12" />
                    <circle cx="80" cy="80" r="65" fill="none"
                      stroke={simResult.riskScore >= 80 ? theme.red : simResult.riskScore >= 60 ? theme.orange : theme.green}
                      strokeWidth="12"
                      strokeDasharray={`${simResult.riskScore * 4.08} 408`}
                      strokeDashoffset="102"
                      strokeLinecap="round" />
                    <text x="80" y="75" textAnchor="middle" fill={theme.text} fontSize="28" fontWeight="700">{simResult.riskScore}</text>
                    <text x="80" y="95" textAnchor="middle" fill={theme.muted} fontSize="11">/100 Risk Score</text>
                  </svg>
                  <div style={{ color: simResult.riskScore >= 80 ? theme.red : simResult.riskScore >= 60 ? theme.orange : theme.green, fontWeight: "700", fontSize: "1.1rem", marginBottom: "1rem" }}>
                    {simResult.riskLevel} RISK
                  </div>
                  <div style={s.divider} />
                  <div style={{ display: "flex", justifyContent: "space-around" }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ color: theme.red, fontWeight: "700", fontSize: "1.5rem" }}>{simResult.blastRadius}</div>
                      <div style={{ color: theme.muted, fontSize: "0.7rem" }}>Resources</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ color: theme.orange, fontWeight: "700", fontSize: "1.5rem" }}>{simResult.attackPaths?.length}</div>
                      <div style={{ color: theme.muted, fontSize: "0.7rem" }}>Attack Paths</div>
                    </div>
                  </div>
                </div>
              </div>
              <div style={s.aiCard}>
                <div style={s.aiSection}>
                  <div style={s.aiLabel}>AI Security Analysis</div>
                  <div style={s.aiText}>{aiResult?.explanation}</div>
                </div>
                <div style={s.aiSection}>
                  <div style={s.aiLabel}>Remediation Recommendations</div>
                  <div style={s.aiText}>{aiResult?.recommendation}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}