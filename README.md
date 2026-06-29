# EduShield AI

> An AI-powered Student Retention and Early Intervention Platform.

EduShield AI helps schools identify at-risk students before they drop out, using a Random Forest ML model with SHAP-powered explainability.

---

## Project Structure

```
edushield-ai/
├── frontend/        # React.js + Tailwind CSS  →  Deployed on Vercel
├── backend/         # Node.js + Express.js     →  Deployed on Render
├── ai-service/      # Python + FastAPI + SHAP  →  Deployed on Render
└── docs/            # Project documentation
```

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React.js, Tailwind CSS, Vite        |
| Backend    | Node.js, Express.js, Mongoose       |
| Database   | MongoDB Atlas                       |
| AI Service | Python, FastAPI, Scikit-Learn, SHAP |
| Deployment | Vercel (frontend), Render (backend + AI) |

---

## Roles

| Role    | Access                                              |
|---------|-----------------------------------------------------|
| Admin   | Full access — manage users, students, run predictions |
| Teacher | View classroom roster, student risk, log interventions |

---

## Quick Start

See individual `README.md` files inside each service folder:

- [`frontend/`](./frontend/)
- [`backend/`](./backend/)
- [`ai-service/`](./ai-service/)

---

## Documentation

- [Architecture](./docs/ARCHITECTURE.md)
- [API Reference](./docs/API_REFERENCE.md)
