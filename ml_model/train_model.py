# ml_model/train_model.py

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report, roc_auc_score, recall_score, precision_score, f1_score
from xgboost import XGBClassifier
from xgboost.callback import TrainingCallback
from tqdm import tqdm
import joblib
import os

# -- Progress Bar Callback ----------------------------------------------------
class TQDMProgressBar(TrainingCallback):
    def __init__(self, total):
        self.pbar = tqdm(total=total, desc="Training trees", unit="tree",
                         bar_format="{l_bar}{bar:40}{r_bar}")

    def after_iteration(self, model, epoch, evals_log):
        loss = list(evals_log.values())[0]['logloss'][-1]
        self.pbar.set_postfix(logloss=f"{loss:.4f}")
        self.pbar.update(1)
        return False

    def after_training(self, model):
        self.pbar.close()
        return model

# -- 1. Load Dataset ----------------------------------------------------------
print("Loading dataset... (this may take a minute, file is 1.6GB)")
df = pd.read_csv(r'D:\loan-risk-app\dataset\accepted_2007_to_2018Q4.csv',
                 low_memory=False)
print(f"Loaded {len(df):,} rows and {len(df.columns)} columns")

# -- 2. Define Target Variable ------------------------------------------------
df = df[df['loan_status'].isin(['Fully Paid', 'Charged Off'])].copy()
df['TARGET'] = (df['loan_status'] == 'Charged Off').astype(int)
print(f"After filtering: {len(df):,} rows")
print(f"Default rate: {df['TARGET'].mean():.2%}")

# -- 3. Pick Features ---------------------------------------------------------
FEATURES = [
    'loan_amnt',
    'annual_inc',
    'installment',
    'emp_length',
    'home_ownership',
    'purpose',
    'grade',
    'dti',
    'delinq_2yrs',
    'open_acc',
    'pub_rec',
    'revol_bal',
    'revol_util',
    'total_acc',
    'mort_acc',
    'pub_rec_bankruptcies',
]

df = df[FEATURES + ['TARGET']].copy()

# -- 4. Handle Missing Values -------------------------------------------------
print("Handling missing values...")

df['emp_length'] = df['emp_length'].str.replace(' years', '').str.replace(
    ' year', '').str.replace('< 1', '0').str.replace('10+', '10')
df['emp_length'] = pd.to_numeric(df['emp_length'], errors='coerce')
df['revol_util'] = pd.to_numeric(df['revol_util'], errors='coerce')

num_cols = df.select_dtypes(include=[np.number]).columns
df[num_cols] = df[num_cols].fillna(df[num_cols].median())

cat_cols = df.select_dtypes(include=['object']).columns
for col in cat_cols:
    df[col] = df[col].fillna(df[col].mode()[0])

# -- 5. Feature Engineering ---------------------------------------------------
print("Engineering new features...")

df['income_to_loan_ratio']  = df['annual_inc'] / (df['loan_amnt'] + 1)
df['monthly_debt_burden']   = df['installment'] / ((df['annual_inc'] / 12) + 1)
df['credit_risk_score']     = df['dti'] * (df['revol_util'] / 100 + 1)
df['has_delinquency']       = (df['delinq_2yrs'] > 0).astype(int)
df['has_bankruptcy']        = (df['pub_rec_bankruptcies'] > 0).astype(int)
df['has_pub_rec']           = (df['pub_rec'] > 0).astype(int)
df['loan_to_income']        = df['loan_amnt'] / (df['annual_inc'] + 1)
df['acc_utilization']       = df['open_acc'] / (df['total_acc'] + 1)

print(f"Total features after engineering: {len(df.columns) - 1}")

# -- 6. Encode Categorical Columns --------------------------------------------
print("Encoding categorical columns...")
label_encoders = {}
for col in cat_cols:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col].astype(str))
    label_encoders[col] = le

# -- 7. Split Data ------------------------------------------------------------
X = df.drop('TARGET', axis=1)
y = df['TARGET']

print(f"Training on {len(X):,} samples")
print(f"Features: {list(X.columns)}")

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# -- 8. Handle Class Imbalance ------------------------------------------------
scale_pos_weight = (y_train == 0).sum() / (y_train == 1).sum()
print(f"scale_pos_weight = {scale_pos_weight:.2f}")

# -- 9. Train XGBoost Model ---------------------------------------------------
print("Training XGBoost model... (may take 10-15 minutes)")
model = XGBClassifier(
    n_estimators=1000,
    max_depth=8,
    learning_rate=0.03,
    subsample=0.8,
    colsample_bytree=0.8,
    min_child_weight=5,
    gamma=0.1,
    reg_alpha=0.1,
    reg_lambda=1.5,
    scale_pos_weight=scale_pos_weight,
    eval_metric='logloss',
    early_stopping_rounds=30,
    random_state=42,
    n_jobs=-1,
    callbacks=[TQDMProgressBar(total=1000)]
)

model.fit(
    X_train, y_train,
    eval_set=[(X_test, y_test)],
    verbose=False
)

print(f"Best iteration: {model.best_iteration}")

# -- 10. Threshold Tuning for Best Recall -------------------------------------
print("\nTuning decision threshold for best recall...")

y_prob = model.predict_proba(X_test)[:, 1]

thresholds = np.arange(0.20, 0.55, 0.05)
print(f"\n{'Threshold':<12} {'Recall':<10} {'Precision':<12} {'F1':<10} {'ROC-AUC':<10}")
print("-" * 55)

best_threshold = 0.5
best_recall = 0

for thresh in thresholds:
    y_pred_thresh = (y_prob >= thresh).astype(int)
    recall    = recall_score(y_test, y_pred_thresh)
    precision = precision_score(y_test, y_pred_thresh)
    f1        = f1_score(y_test, y_pred_thresh)
    roc       = roc_auc_score(y_test, y_prob)
    print(f"{thresh:<12.2f} {recall:<10.4f} {precision:<12.4f} {f1:<10.4f} {roc:<10.4f}")

    if recall > best_recall and precision >= 0.25:
        best_recall = recall
        best_threshold = thresh

print(f"\nBest threshold selected: {best_threshold:.2f}")
print(f"Best recall achieved:    {best_recall:.4f}")

# -- 11. Final Evaluation -----------------------------------------------------
print("\nFinal Model Evaluation:")
y_pred_final = (y_prob >= best_threshold).astype(int)
print(classification_report(y_test, y_pred_final))
print(f"ROC-AUC Score: {roc_auc_score(y_test, y_prob):.4f}")

# -- 12. Save Everything ------------------------------------------------------
os.makedirs('saved_model', exist_ok=True)

# Remove tqdm callback before saving to avoid pickle error
model.set_params(callbacks=None)

joblib.dump(model,           'saved_model/xgb_model.pkl')
joblib.dump(label_encoders,  'saved_model/label_encoders.pkl')
joblib.dump(list(X.columns), 'saved_model/feature_names.pkl')
joblib.dump(best_threshold,  'saved_model/best_threshold.pkl')

print("\nModel saved to ml_model/saved_model/")
print("   - xgb_model.pkl")
print("   - label_encoders.pkl")
print("   - feature_names.pkl")
print("   - best_threshold.pkl")