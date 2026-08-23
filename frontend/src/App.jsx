import { useState, useEffect } from "react";

const API = "https://cloud-security-digital-twin.onrender.com";

export default function App() {
  const [page, setPage] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [identity, setIdentity] = useState("identity-alice");

  const login = () => { if(email && password) setPage("dashboard"); };

  const load = async (endpoint, method="GET", body=null) => {
    setLoading(true);
    const opts = { method, headers: {"Content-Type":"application/json"} };
    if(body) opts.body = JSON.stringify(body);
    const res = await fetch(API + endpoint, opts);
    const json = await res.json();
    setData(json);
    setLoading(false);
  };

  const runSim = async () => {
    setLoading(true);
    setPage("result");
    const sim = await fetch(API+"/api/simulate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({identityId:identity})}).then(r=>r.json());
    const ai = await fetch(API+"/api/explain",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(sim)}).then(r=>r.json());
    setData({sim,ai});
    setLoading(false);
  };

  if(page==="login") return (
    <div style={{minHeight:"100vh",background:"#0a0f1e",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{background:"#1e293b",padding:"2rem",borderRadius:"12px",width:"360px"}}>
        <h1 style={{color:"#60a5fa",marginBottom:"1rem"}}>Cloud Security Digital Twin</h1>
        <h2 style={{color:"#e2e8f0",marginBottom:"1.5rem"}}>Sign In</h2>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" style={{width:"100%",padding:"0.8rem",marginBottom:"1rem",background:"#0f172a",border:"1px solid #334155",borderRadius:"8px",color:"#e2e8f0",boxSizing:"border-box"}} />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" style={{width:"100%",padding:"0.8rem",marginBottom:"1rem",background:"#0f172a",border:"1px solid #334155",borderRadius:"8px",color:"#e2e8f0",boxSizing:"border-box"}} />
        <button onClick={login} style={{width:"100%",padding:"0.8rem",background:"#3b82f6",color:"white",border:"none",borderRadius:"8px",cursor:"pointer",fontSize:"1rem"}}>Sign In</button>
      </div>
    </div>
  );

  if(page==="dashboard") return (
    <div style={{minHeight:"100vh",background:"#0a0f1e",padding:"2rem"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"2rem"}}>
        <h1 style={{color:"#60a5fa"}}>Cloud Security Digital Twin</h1>
        <button onClick={()=>setPage("login")} style={{background:"#ef4444",color:"white",border:"none",padding:"0.5rem 1rem",borderRadius:"8px",cursor:"pointer"}}>Logout</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"1.5rem"}}>
        {[["Cloud Inventory","View EC2, S3, IAM",()=>{load("/api/inventory");setPage("show");}],
          ["Security Graph","Identity to Resource chain",()=>{load("/api/graph");setPage("show");}],
          ["Attack Simulation","Simulate compromise",()=>setPage("simulate")]
        ].map(([t,d,fn])=>(
          <div key={t} onClick={fn} style={{background:"#1e293b",border:"1px solid #334155",borderRadius:"12px",padding:"2rem",cursor:"pointer",textAlign:"center"}}>
            <h3 style={{color:"#93c5fd",marginBottom:"0.5rem"}}>{t}</h3>
            <p style={{color:"#94a3b8"}}>{d}</p>
          </div>
        ))}
      </div>
    </div>
  );

  if(page==="simulate") return (
    <div style={{minHeight:"100vh",background:"#0a0f1e",padding:"2rem"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"2rem"}}>
        <h1 style={{color:"#60a5fa"}}>Attack Simulation</h1>
        <button onClick={()=>setPage("dashboard")} style={{background:"#334155",color:"white",border:"none",padding:"0.5rem 1rem",borderRadius:"8px",cursor:"pointer"}}>Back</button>
      </div>
      <div style={{background:"#1e293b",padding:"2rem",borderRadius:"12px",maxWidth:"500px"}}>
        <h3 style={{color:"#93c5fd",marginBottom:"1rem"}}>Select Identity</h3>
        <select value={identity} onChange={e=>setIdentity(e.target.value)} style={{width:"100%",padding:"0.8rem",background:"#0f172a",border:"1px solid #334155",borderRadius:"8px",color:"#e2e8f0",marginBottom:"1rem"}}>
          <option value="identity-alice">Alice - Admin</option>
          <option value="identity-bob">Bob - ReadOnly</option>
          <option value="identity-charlie">Charlie - DevOps</option>
        </select>
        <button onClick={runSim} style={{width:"100%",padding:"0.8rem",background:"#3b82f6",color:"white",border:"none",borderRadius:"8px",cursor:"pointer"}}>Run Simulation</button>
      </div>
    </div>
  );

  if(page==="result") return (
    <div style={{minHeight:"100vh",background:"#0a0f1e",padding:"2rem"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"2rem"}}>
        <h1 style={{color:"#60a5fa"}}>Results</h1>
        <button onClick={()=>setPage("dashboard")} style={{background:"#334155",color:"white",border:"none",padding:"0.5rem 1rem",borderRadius:"8px",cursor:"pointer"}}>Back</button>
      </div>
      {loading ? <p style={{color:"#60a5fa",fontSize:"1.2rem"}}>Running AI Analysis...</p> : data && (
        <>
          <div style={{background:"#1e293b",border:"2px solid #ef4444",padding:"2rem",borderRadius:"12px",marginBottom:"1.5rem"}}>
            <h2 style={{color:"#ef4444"}}>{data.sim?.riskLevel}</h2>
            <h3 style={{color:"#e2e8f0"}}>Risk Score: {data.sim?.riskScore}/100</h3>
            <p style={{color:"#94a3b8"}}>Blast Radius: {data.sim?.blastRadius} resources</p>
          </div>
          <div style={{background:"#1e293b",padding:"2rem",borderRadius:"12px"}}>
            <h3 style={{color:"#93c5fd",marginBottom:"1rem"}}>AI Explanation</h3>
            <p style={{color:"#e2e8f0",marginBottom:"1rem"}}>{data.ai?.explanation}</p>
            <h3 style={{color:"#93c5fd",marginBottom:"0.5rem"}}>Recommendations</h3>
            <p style={{color:"#e2e8f0"}}>{data.ai?.recommendation}</p>
          </div>
        </>
      )}
    </div>
  );

  if(page==="show") return (
    <div style={{minHeight:"100vh",background:"#0a0f1e",padding:"2rem"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"2rem"}}>
        <h1 style={{color:"#60a5fa"}}>Data</h1>
        <button onClick={()=>setPage("dashboard")} style={{background:"#334155",color:"white",border:"none",padding:"0.5rem 1rem",borderRadius:"8px",cursor:"pointer"}}>Back</button>
      </div>
      {loading ? <p style={{color:"#60a5fa"}}>Loading...</p> :
        <pre style={{background:"#1e293b",color:"#e2e8f0",padding:"2rem",borderRadius:"12px",overflow:"auto",fontSize:"0.85rem"}}>{JSON.stringify(data,null,2)}</pre>
      }
    </div>
  );
}
