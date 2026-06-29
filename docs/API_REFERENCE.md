# EduShield AI — API Reference

> Full API reference to be completed during backend implementation.

---

## Base URL

```
Production:  https://edushield-api.onrender.com/api
Development: http://localhost:5000/api
```

---

## Authentication

All protected endpoints require:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## Endpoints

### Auth
| Method | Endpoint       | Auth | Description         |
|--------|----------------|------|---------------------|
| POST   | /auth/login    | None | Login, receive JWT  |
| GET    | /auth/me       | Any  | Get current user    |

### Students
| Method | Endpoint              | Auth    | Description             |
|--------|-----------------------|---------|-------------------------|
| GET    | /students             | Any     | List students           |
| GET    | /students/:id         | Any     | Get student profile     |
| POST   | /students             | Admin   | Create student          |
| PUT    | /students/:id         | Admin   | Update student          |
| POST   | /students/import      | Admin   | Bulk CSV import         |

### Predictions
| Method | Endpoint                        | Auth    | Description              |
|--------|---------------------------------|---------|--------------------------|
| POST   | /predictions/:studentId         | Any     | Run prediction + explain |
| GET    | /predictions/:studentId/latest  | Any     | Get latest prediction    |
| POST   | /predictions/batch              | Admin   | Batch predict all        |

### Interventions
| Method | Endpoint                              | Auth    | Description             |
|--------|---------------------------------------|---------|-------------------------|
| GET    | /interventions/student/:studentId     | Any     | List interventions      |
| POST   | /interventions                        | Any     | Log new intervention    |
| PUT    | /interventions/:id                    | Any     | Update intervention     |
| DELETE | /interventions/:id                    | Admin   | Delete intervention     |

---

## Response Shape

### Success
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { }
}
```

### Error
```json
{
  "success": false,
  "message": "Descriptive error message",
  "errors": []
}
```
