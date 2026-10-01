import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix


# ==========================================
# 1. LOAD DATASET
# ==========================================

print("Loading dataset...")

df = pd.read_csv("heart.csv")

print("\nDataset loaded successfully!")
print("Shape:", df.shape)
print("\nColumns:")
print(df.columns.tolist())


# ==========================================
# 2. CLEAN COLUMN NAMES
# ==========================================

df.columns = df.columns.str.strip().str.lower()


# ==========================================
# 3. TARGET COLUMN
# ==========================================

target_column = "target"

if target_column not in df.columns:
    possible_targets = [
        "target",
        "output",
        "condition",
        "heartdisease",
        "heart_disease"
    ]

    for col in possible_targets:
        if col in df.columns:
            target_column = col
            break

if target_column not in df.columns:
    raise ValueError(
        "Target column not found. "
        "Please check your heart.csv file."
    )


print("\nTarget column:", target_column)


# ==========================================
# 4. REMOVE MISSING VALUES
# ==========================================

df = df.dropna()

print("\nAfter removing missing values:")
print(df.shape)


# ==========================================
# 5. FEATURES
# ==========================================

features = [
    "age",
    "sex",
    "cp",
    "trestbps",
    "chol",
    "fbs",
    "restecg",
    "thalach",
    "exang",
    "oldpeak",
    "slope",
    "ca",
    "thal"
]


# Check whether all features exist

missing_features = [
    feature for feature in features
    if feature not in df.columns
]

if missing_features:
    raise ValueError(
        f"These required columns are missing: {missing_features}"
    )


X = df[features]
y = df[target_column]


# ==========================================
# 6. TRAIN TEST SPLIT
# ==========================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)


# ==========================================
# 7. STANDARDIZATION
# ==========================================

scaler = StandardScaler()

X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)


# ==========================================
# 8. RANDOM FOREST MODEL
# ==========================================

model = RandomForestClassifier(
    n_estimators=200,
    random_state=42,
    max_depth=10
)

print("\nTraining model...")

model.fit(X_train_scaled, y_train)


# ==========================================
# 9. EVALUATION
# ==========================================

y_pred = model.predict(X_test_scaled)

accuracy = accuracy_score(y_test, y_pred)

print("\n================================")
print("MODEL RESULTS")
print("================================")

print("Accuracy:", round(accuracy * 100, 2), "%")

print("\nClassification Report:")
print(classification_report(y_test, y_pred))

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))


# ==========================================
# 10. SAVE MODEL
# ==========================================

joblib.dump(
    model,
    "model/heart_model.pkl"
)

joblib.dump(
    scaler,
    "model/scaler.pkl"
)

print("\n================================")
print("SUCCESS")
print("================================")

print("Model saved:")
print("model/heart_model.pkl")

print("Scaler saved:")
print("model/scaler.pkl")