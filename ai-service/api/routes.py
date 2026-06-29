from fastapi import APIRouter, Depends
from schemas.prediction import StudentData, PredictionResponse, ExplanationResponse
from services.predictor import Predictor
from services.explainer import Explainer
from core.security import get_api_key

router = APIRouter()

# Initialize ML services once
predictor_service = Predictor()
explainer_service = Explainer(predictor_service)

@router.post("/predict", response_model=PredictionResponse)
async def predict_risk(data: StudentData, api_key: str = Depends(get_api_key)):
    return predictor_service.predict(data)

@router.post("/explain", response_model=ExplanationResponse)
async def explain_risk(data: StudentData, api_key: str = Depends(get_api_key)):
    return explainer_service.explain(data)
