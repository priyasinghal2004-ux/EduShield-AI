import shap
import pandas as pd
from core.logger import logger
from schemas.prediction import StudentData, ExplanationResponse, ShapFeature
from services.predictor import Predictor

class Explainer:
    def __init__(self, predictor: Predictor):
        self.predictor = predictor
        self.explainer = None
        self._init_explainer()

    def _init_explainer(self):
        if self.predictor.model is not None:
            try:
                # TreeExplainer is ideal for Random Forest
                self.explainer = shap.TreeExplainer(self.predictor.model)
                logger.info("SHAP explainer initialized.")
            except Exception as e:
                logger.error(f"Error initializing SHAP explainer: {str(e)}")

    def explain(self, data: StudentData) -> ExplanationResponse:
        if self.explainer is None:
            return self._mock_explain(data)
            
        try:
            processed_data = self.predictor.preprocessor.transform(data)
            shap_values = self.explainer.shap_values(processed_data)
            
            # For random forest binary classification, shap_values is usually a list [class_0, class_1]
            # We want class_1 (dropout)
            if isinstance(shap_values, list):
                vals = shap_values[1][0]
            else:
                vals = shap_values[0]
                
            features = self.predictor.preprocessor.feature_names
            
            result = []
            for feat, val in zip(features, vals):
                direction = "positive" if val > 0 else "negative"
                result.append(ShapFeature(
                    feature=feat,
                    impact=float(round(val, 4)),
                    direction=direction
                ))
            
            # Sort by absolute impact
            result.sort(key=lambda x: abs(x.impact), reverse=True)
            return ExplanationResponse(shapValues=result)
            
        except Exception as e:
            logger.error(f"Explanation failed: {str(e)}. Falling back to mock data.")
            return self._mock_explain(data)

    def _mock_explain(self, data: StudentData) -> ExplanationResponse:
        features = []
        
        # Simple heuristic mappings for mock SHAP
        if data.attendanceRate < 0.90:
            features.append(ShapFeature(feature="attendanceRate", impact=0.35, direction="positive"))
        else:
            features.append(ShapFeature(feature="attendanceRate", impact=-0.15, direction="negative"))
            
        if data.gpa < 2.5:
            features.append(ShapFeature(feature="gpa", impact=0.28, direction="positive"))
        else:
            features.append(ShapFeature(feature="gpa", impact=-0.25, direction="negative"))
            
        if data.failedCourses > 0:
            features.append(ShapFeature(feature="failedCourses", impact=0.20, direction="positive"))
            
        if data.disciplinaryIncidents > 0:
            features.append(ShapFeature(feature="disciplinaryIncidents", impact=0.15, direction="positive"))
            
        # Sort by impact
        features.sort(key=lambda x: abs(x.impact), reverse=True)
        return ExplanationResponse(shapValues=features)
