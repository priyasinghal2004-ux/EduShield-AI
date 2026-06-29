from pydantic import BaseModel
from typing import List, Optional

class StudentData(BaseModel):
    attendanceRate: float
    gpa: float
    failedCourses: int
    disciplinaryIncidents: int
    consecutiveAbsences: int
    tardyCount: int

class ShapFeature(BaseModel):
    feature: str
    impact: float
    direction: str

class PredictionResponse(BaseModel):
    riskScore: int
    riskLabel: str
    dropoutProbability: float

class ExplanationResponse(BaseModel):
    shapValues: List[ShapFeature]
