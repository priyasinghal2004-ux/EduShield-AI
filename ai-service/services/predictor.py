import joblib
import os
import random
from core.config import settings
from core.logger import logger
from schemas.prediction import StudentData, PredictionResponse
from services.preprocessor import Preprocessor

class Predictor:
    def __init__(self):
        self.model = None
        self.scaler = None
        self.preprocessor = None
        self._load_artifacts()

    def _load_artifacts(self):
        try:
            if os.path.exists(settings.MODEL_PATH) and os.path.exists(settings.SCALER_PATH):
                self.model = joblib.load(settings.MODEL_PATH)
                self.scaler = joblib.load(settings.SCALER_PATH)
                logger.info("ML artifacts loaded successfully.")
            else:
                logger.warning("ML artifacts not found. Using fallback mock mode.")
        except Exception as e:
            logger.error(f"Error loading ML artifacts: {str(e)}")
        
        self.preprocessor = Preprocessor(scaler=self.scaler)

    def predict(self, data: StudentData) -> PredictionResponse:
        if self.model is None:
            return self._mock_predict(data)
            
        try:
            processed_data = self.preprocessor.transform(data)
            prediction = self.model.predict(processed_data)[0]
            risk_map = {"Low": 25, "Medium": 60, "High": 90}
            score = risk_map[prediction]
            
            if score >= 80:
                level = "Critical"
            elif score >= 60:
                level = "High"
            elif score >= 40:
                level = "Medium"
            else:
                level = "Low"
                
            return PredictionResponse(
                riskScore=score,
                riskLabel=level,
                dropoutProbability=score / 100
            )
        except Exception as e:
            logger.error(f"Prediction failed: {str(e)}. Falling back to mock data.")
            return self._mock_predict(data)

    def _mock_predict(self, data: StudentData) -> PredictionResponse:
        # Generate realistic mock based on basic heuristic
        risk = 0.0
        if data.attendanceRate < 0.85: risk += 0.3
        if data.gpa < 2.0: risk += 0.3
        if data.failedCourses > 1: risk += 0.2
        if data.disciplinaryIncidents > 2: risk += 0.1
        
        # Add random noise
        prob = min(max(risk + random.uniform(-0.1, 0.1), 0.05), 0.95)
        score = int(prob * 100)
        
        if score >= 80:
            level = "Critical"
        elif score >= 60:
            level = "High"
        elif score >= 40:
            level = "Medium"
        else:
            level = "Low"
            
        return PredictionResponse(
            riskScore=score,
            riskLabel=level,
            dropoutProbability=prob
        )
