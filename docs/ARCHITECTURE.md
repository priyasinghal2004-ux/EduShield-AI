# EduShield AI — Architecture Document

> This document describes the technical architecture of EduShield AI.

---

## System Overview

EduShield AI is a three-tier, microservice-based application:

| Service      | Technology           | Platform |
|--------------|----------------------|----------|
| Frontend     | React.js + Tailwind  | Vercel   |
| Backend API  | Node.js + Express.js | Render   |
| AI Service   | Python + FastAPI     | Render   |
| Database     | MongoDB Atlas        | Cloud    |

---

## Communication

- **Frontend → Backend**: HTTPS REST with JWT Authorization header
- **Backend → Database**: Mongoose ODM over MongoDB Atlas connection string
- **Backend → AI Service**: Internal HTTP with X-API-Key shared secret

---

## Roles

| Role    | Permissions                                     |
|---------|-------------------------------------------------|
| Admin   | Full access — users, students, batch prediction |
| Teacher | Own classroom — view students, log interventions |

---

## AI Endpoints

| Endpoint   | Method | Description                          |
|------------|--------|--------------------------------------|
| /predict   | POST   | Returns risk score + label           |
| /explain   | POST   | Returns SHAP values per feature      |
| /health    | GET    | Render uptime check                  |

---

## MongoDB Collections

| Collection    | Purpose                              |
|---------------|--------------------------------------|
| users         | Admin and Teacher accounts           |
| students      | Student profiles and academic data   |
| predictions   | AI prediction results per student    |
| interventions | Intervention logs per student        |

---

## Deployment

See `docs/DEPLOYMENT.md` (to be created) for step-by-step instructions.
