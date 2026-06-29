# TODO: Pydantic schemas for prediction request and response.
# Request schema (PredictionRequest):
#   - attendance_rate:         float  (0.0–1.0)
#   - consecutive_absences:    int
#   - gpa:                     float  (0.0–4.0)
#   - failed_courses:          int
#   - disciplinary_incidents:  int
#   - grade:                   int    (9–12)
#   - age:                     int
#
# Response schema (PredictionResponse):
#   - risk_score:  float
#   - risk_label:  str   ('low' | 'medium' | 'high' | 'critical')
