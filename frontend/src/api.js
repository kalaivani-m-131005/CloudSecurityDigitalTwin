const BASE_URL = "https://cloud-security-digital-twin.onrender.com";

export const getHealth = () => 
  fetch(`${BASE_URL}/api/health`).then(r => r.json());

export const getInventory = () => 
  fetch(`${BASE_URL}/api/inventory`).then(r => r.json());

export const getGraph = () => 
  fetch(`${BASE_URL}/api/graph`).then(r => r.json());

export const simulate = (identityId) => 
  fetch(`${BASE_URL}/api/simulate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identityId })
  }).then(r => r.json());

export const explain = (data) => 
  fetch(`${BASE_URL}/api/explain`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }).then(r => r.json());