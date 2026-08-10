import joblib

model = joblib.load("model_artifacts/random_forest_model.pkl")
print(model.classes_)