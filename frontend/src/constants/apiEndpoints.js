// TODO: Centralized API endpoint constants.
// Responsibilities:
//   - Export all backend API route strings
//   - Prefix all endpoints from the VITE_API_BASE_URL env var
//   - Keep a single source of truth so URL changes require only one edit

const BASE = import.meta.env.VITE_API_BASE_URL

export const API = {
  // Auth
  LOGIN:               `${BASE}/auth/login`,

  // Students
  STUDENTS:            `${BASE}/students`,
  STUDENT_BY_ID:       (id) => `${BASE}/students/${id}`,
  STUDENTS_IMPORT:     `${BASE}/students/import`,

  // Predictions
  PREDICT:             (studentId) => `${BASE}/predictions/${studentId}`,
  PREDICT_BATCH:       `${BASE}/predictions/batch`,

  // Interventions
  INTERVENTIONS:       `${BASE}/interventions`,
  INTERVENTION_BY_ID:  (id) => `${BASE}/interventions/${id}`,
  INTERVENTIONS_BY_STUDENT: (studentId) => `${BASE}/interventions/student/${studentId}`,

  // Users (Admin)
  USERS:               `${BASE}/users`,
  USER_BY_ID:          (id) => `${BASE}/users/${id}`,
}
