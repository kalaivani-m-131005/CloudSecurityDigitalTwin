import { useState } from "react";
import { getInventory, getGraph, simulate, explain } from "./api";
import "./App.css";

export default function App() {
  const [page, setPage] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inventory, setInventory] = useState(null);
  const [graph, setGraph] = useState(null);
  const [simResult, setSimResult] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [identity, setIdentity] = useState("identity-alice");

  const login = () => {
    if (email && password) setPage("dashboard");
  };

  const loadInventory = async () => {
    setLoading(true);
    const data = await getInventory();
    setInventory(data);
    setLoading(false);
    setPage("inventory");
  };

  const loadGraph = async () => {
    setLoading(true);
    const data = await getGraph();
    setGraph(data);
    setLoading(false);
    setPage("graph");
  };

  const runSimulate = async () => {
    setLoading(true);
    const data = await simulate(identity);
    setSimResult(data);
    const ai = await explain(data);
    setAiResult(ai);
    setLoading(false);
    setPage("simulate");
  };

  if (page === "login") return (
    <div className="app">
      <div className="login-card">
        <h1>Cloud Security Digital Twin</h1>
        <h2>Sign In</h2>
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button onClick={login}>Sign In</button>
      </div>
    </div>
  );

  if (page === "dashboard") return (
    <div className="app">
      <div className="header">
        <h1>Cloud Security Digital Twin</h1>
        <button className="logout" onClick={() => setPage("login")}>Logout</button>
      </div>
      <div className="grid">
        <div className="card clickable" onClick={loadInventory}>
          <h3>Cloud Inventory</h3>
          <p>View EC2, S3, IAM resources</p>
        </div>
        <div className="card clickable" onClick={loadGraph}>
          <h3>Security Graph</h3>
          <p>Identity to Role to Permission to Resource</p>
        </div>
        <div className="card clickable" onClick={() => setPage("sim-setup")}>
          <h3>Attack Simulation</h3>
          <p>Simulate identity compromise</p>
        </div>
      </div>
    </div>
  );

  if (page === "inventory") return (
    <div className="app">
      <div className="header">
        <h1>Cloud Inventory</h1>
        <button onClick={() => setPage("dashboard")}>Back</button>
      </div>
      {loading ? <p className="loading">Loading...</p> : (
        <div className="grid">
          <div className="card">
            <h3>EC2 Instances</h3>
            {inventory?.ec2Instances?.map(i => (
              <div key={i.instanceId} className={"item " + i.sensitivityLevel.toLowerCase()}>
                <b>{i.name}</b> - {i.sensitivityLevel}
              </div>
            ))}
          </div>
          <div className="card">
            <h3>S3 Buckets</h3>
            {inventory?.s3Buckets?.map(b => (
              <div key={b.bucketName} className={"item " + b.sensitivityLevel.toLowerCase()}>
                <b>{b.bucketName}</b> - {b.sensitivityLevel}
              </div>
            ))}
          </div>
          <div className="card">
            <h3>IAM Users</h3>
            {inventory?.iamUsers?.map(u => (
              <div key={u.username} className="item">
                <b>{u.username}</b> - {u.role} - MFA: {u.mfaEnabled}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  if (page === "graph") return (
    <div className="app">
      <div className="header">
        <h1>Security Graph</h1>
        <button onClick={() => setPage("dashboard")}>Back</button>
      </div>
      <div className="card">
        <h3>Stats</h3>
        <div className="stats">
          <span>Nodes: {graph?.stats?.totalNodes}</span>
          <span>Edges: {graph?.stats?.totalEdges}</span>
          <span>Identities: {graph?.stats?.identityNodes}</span>
          <span>Resources: {graph?.stats?.resourceNodes}</span>
        </div>
        <h3>Nodes</h3>
        <div className="grid">
          {["IDENTITY","ROLE","PERMISSION","RESOURCE"].map(type => (
            <div key={type} className="card">
              <h4>{type}</h4>
              {graph?.nodes?.filter(n => n.type === type).map(n => (
                <div key={n.id} className="item">{n.label}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (page === "sim-setup") return (
    <div className="app">
      <div className="header">
        <h1>Attack Simulation</h1>
        <button onClick={() => setPage("dashboard")}>Back</button>
      </div>
      <div className="card">
        <h3>Select Identity to Compromise</h3>
        <select value={identity} onChange={e => setIdentity(e.target.value)}>
          <option value="identity-alice">Alice - Admin</option>
          <option value="identity-bob">Bob - ReadOnly</option>
          <option value="identity-charlie">Charlie - DevOps</option>
        </select>
        <button onClick={runSimulate}>Run Simulation</button>
      </div>
    </div>
  );

  if (page === "simulate") return (
    <div className="app">
      <div className="header">
        <h1>Simulation Results</h1>
        <button onClick={() => setPage("dashboard")}>Back</button>
      </div>
      {loading ? <p className="loading">Running AI Analysis...</p> : (
        <>
          <div className={"card risk-" + simResult?.riskLevel?.toLowerCase()}>
            <h3>Risk Score: {simResult?.riskScore}/100</h3>
            <h2>{simResult?.riskLevel}</h2>
            <p>Blast Radius: {simResult?.blastRadius} resources affected</p>
          </div>
          <div className="card">
            <h3>AI Explanation</h3>
            <p>{aiResult?.explanation}</p>
            <h3>Recommendations</h3>
            <p>{aiResult?.recommendation}</p>
          </div>
        </>
      )}
    </div>
  );
}