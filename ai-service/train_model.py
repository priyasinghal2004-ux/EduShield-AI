import pandas as pd
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler

# Load dataset
df = pd.read_csv("student_dataset.csv")

X = df[
    [
        "attendanceRate",
        "gpa",
        "failedCourses",
        "disciplinaryIncidents",
        "consecutiveAbsences",
        "tardyCount",
    ]
]

y = df["riskLabel"]

# Scale features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Train model
model = RandomForestClassifier(
    n_estimators=200,
    random_state=42
)

model.fit(X_scaled, y)

# Save model
joblib.dump(model, "model_artifacts/random_forest_model.pkl")
joblib.dump(scaler, "model_artifacts/feature_scaler.pkl")

print("✅ Model trained successfully!")
print("✅ Files saved inside model_artifacts/")