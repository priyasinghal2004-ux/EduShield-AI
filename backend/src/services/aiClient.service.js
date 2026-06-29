// TODO: HTTP client for communicating with the Python AI service.
// Responsibilities:
//   - Initialize an Axios instance with:
//       baseURL: AI_SERVICE_URL (from env)
//       headers: { 'X-API-Key': AI_API_KEY }
//       timeout: 10000ms
//   - predict(featureVector)  → POST /predict, return { risk_score, risk_label }
//   - explain(featureVector)  → POST /explain, return { shap_values }
//   - Handle AI service errors gracefully (log + throw AppError)
