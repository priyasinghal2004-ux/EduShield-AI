# TODO: SHAP TreeExplainer wrapper.
# Responsibilities:
#   - Initialize shap.TreeExplainer with the loaded Random Forest model at startup
#   - explain(feature_vector: dict) → list of { feature, value, direction }
#     - Convert feature_vector to a numpy array in correct column order
#     - Scale the input using the feature scaler
#     - Compute SHAP values using explainer.shap_values()
#     - Map raw SHAP floats to the output schema:
#         direction: 'positive' if value > 0 (increases risk), 'negative' otherwise
#     - Sort results by absolute SHAP value descending (most impactful first)
