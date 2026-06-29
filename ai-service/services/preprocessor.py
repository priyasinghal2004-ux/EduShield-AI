import numpy as np
import pandas as pd
from schemas.prediction import StudentData

class Preprocessor:
    def __init__(self, scaler=None):
        self.scaler = scaler
        self.feature_names = [
            'attendanceRate',
            'gpa',
            'failedCourses',
            'disciplinaryIncidents',
            'consecutiveAbsences',
            'tardyCount'
        ]

    def transform(self, data: StudentData) -> pd.DataFrame:
        df = pd.DataFrame([{
            'attendanceRate': data.attendanceRate,
            'gpa': data.gpa,
            'failedCourses': data.failedCourses,
            'disciplinaryIncidents': data.disciplinaryIncidents,
            'consecutiveAbsences': data.consecutiveAbsences,
            'tardyCount': data.tardyCount
        }])
        
        if self.scaler:
            scaled = self.scaler.transform(df)
            df = pd.DataFrame(scaled, columns=self.feature_names)
            
        return df
