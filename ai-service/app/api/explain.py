# TODO: POST /explain endpoint.
# Responsibilities:
#   - Accept an ExplanationRequest body (validated by explanation_schema.py)
#   - Pass the feature vector to explainer.explain()
#   - Return { shap_values: list of { feature, value, direction } }
#   - Endpoint is protected by API key via security.py dependency
