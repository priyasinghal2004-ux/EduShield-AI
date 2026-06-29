# TODO: POST /predict endpoint.
# Responsibilities:
#   - Accept a PredictionRequest body (validated by prediction_schema.py)
#   - Pass the feature vector to predictor.predict()
#   - Return { risk_score: float, risk_label: str }
#   - Endpoint is protected by API key via security.py dependency
