# TODO: Pydantic schemas for SHAP explanation request and response.
# Request schema (ExplanationRequest):
#   - Same fields as PredictionRequest (reuse or inherit)
#
# Response schema (ShapValue):
#   - feature:    str    (plain-English feature name)
#   - value:      float  (SHAP contribution magnitude)
#   - direction:  str    ('positive' | 'negative')
#
# Response schema (ExplanationResponse):
#   - shap_values: list[ShapValue]  (sorted by abs(value) descending)
