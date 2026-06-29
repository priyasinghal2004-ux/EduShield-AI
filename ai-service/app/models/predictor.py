# TODO: Random Forest model wrapper.
# Responsibilities:
#   - Load the pre-trained Random Forest model from MODEL_PATH (.pkl) at import/startup
#   - Load the feature scaler from SCALER_PATH (.pkl)
#   - predict(feature_vector: dict) → { risk_score: float, risk_label: str }
#     - Scale the input features using the loaded scaler
#     - Run model.predict_proba() to get dropout probability
#     - Map probability to risk label (low/medium/high/critical) using thresholds
