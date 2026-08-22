# Cloud Security Digital Twin

AI-powered Cloud Security Posture Management Tool

## What it does
- Scans cloud inventory (EC2, S3, IAM)
- Builds security graph (Identity → Role → Permission → Resource)
- Simulates identity compromise & finds attack paths
- Calculates blast radius & risk score (0-100)
- AI-powered security explanation & recommendations

## Live Demo
https://cloud-security-digital-twin.onrender.com

## API Endpoints
- GET  /api/health     → Service status
- GET  /api/inventory  → Cloud resource inventory
- GET  /api/graph      → Security graph
- POST /api/simulate   → Attack path simulation
- POST /api/explain    → AI security explanation

## Tech Stack
- Java 24 + Spring Boot 4.1
- PostgreSQL 18
- OpenRouter AI (LLaMA model)
- Docker + Render deployment

## Sample Request
POST /api/simulate
{"identityId": "identity-alice"}

## Sample Response
{
  "blastRadius": 4,
  "riskScore": 81,
  "riskLevel": "CRITICAL",
  "attackPaths": [...]
}
