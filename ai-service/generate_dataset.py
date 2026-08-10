import pandas as pd
import numpy as np

np.random.seed(42)

rows = 1000

attendanceRate = np.random.uniform(0.4, 1.0, rows)
gpa = np.random.uniform(1.5, 4.0, rows)
failedCourses = np.random.randint(0, 6, rows)
disciplinaryIncidents = np.random.randint(0, 5, rows)
consecutiveAbsences = np.random.randint(0, 15, rows)
tardyCount = np.random.randint(0, 20, rows)

riskScore = (
    (1 - attendanceRate) * 40 +
    (4 - gpa) * 10 +
    failedCourses * 5 +
    disciplinaryIncidents * 4 +
    consecutiveAbsences * 1.5 +
    tardyCount * 0.5
)

riskScore = np.clip(riskScore, 0, 100)

riskLabel = []

for score in riskScore:
    if score >= 70:
        riskLabel.append("High")
    elif score >= 40:
        riskLabel.append("Medium")
    else:
        riskLabel.append("Low")

df = pd.DataFrame({
    "attendanceRate": attendanceRate,
    "gpa": gpa,
    "failedCourses": failedCourses,
    "disciplinaryIncidents": disciplinaryIncidents,
    "consecutiveAbsences": consecutiveAbsences,
    "tardyCount": tardyCount,
    "riskScore": riskScore,
    "riskLabel": riskLabel
})

df.to_csv("student_dataset.csv", index=False)

print("Dataset generated successfully!")
print(df.head())