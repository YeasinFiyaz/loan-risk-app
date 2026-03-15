import joblib
import numpy as np
import os

# -- Lazy loading — model loads only when first prediction is made -----------
_model          = None
_label_encoders = None
_feature_names  = None
_best_threshold = None

def _load_models():
    global _model, _label_encoders, _feature_names, _best_threshold
    if _model is None:
        from django.conf import settings
        MODEL_DIR       = settings.ML_MODEL_PATH
        _model          = joblib.load(os.path.join(MODEL_DIR, 'xgb_model.pkl'))
        _label_encoders = joblib.load(os.path.join(MODEL_DIR, 'label_encoders.pkl'))
        _feature_names  = joblib.load(os.path.join(MODEL_DIR, 'feature_names.pkl'))
        _best_threshold = joblib.load(os.path.join(MODEL_DIR, 'best_threshold.pkl'))


def get_risk_category(probability: float) -> str:
    if probability < 0.25:
        return 'LOW'
    elif probability < 0.50:
        return 'MEDIUM'
    elif probability < 0.75:
        return 'HIGH'
    else:
        return 'VERY_HIGH'


def predict_risk(data: dict) -> dict:
    _load_models()

    loan_amnt            = float(data['loan_amnt'])
    annual_inc           = float(data['annual_inc'])
    installment          = float(data['installment'])
    emp_length           = float(data['emp_length'])
    home_ownership       = str(data['home_ownership'])
    purpose              = str(data['purpose'])
    grade                = str(data['grade'])
    dti                  = float(data['dti'])
    delinq_2yrs          = float(data.get('delinq_2yrs', 0))
    open_acc             = float(data['open_acc'])
    pub_rec              = float(data.get('pub_rec', 0))
    revol_bal            = float(data['revol_bal'])
    revol_util           = float(data['revol_util'])
    total_acc            = float(data['total_acc'])
    mort_acc             = float(data.get('mort_acc', 0))
    pub_rec_bankruptcies = float(data.get('pub_rec_bankruptcies', 0))

    income_to_loan_ratio = annual_inc / (loan_amnt + 1)
    monthly_debt_burden  = installment / ((annual_inc / 12) + 1)
    credit_risk_score    = dti * (revol_util / 100 + 1)
    has_delinquency      = 1 if delinq_2yrs > 0 else 0
    has_bankruptcy       = 1 if pub_rec_bankruptcies > 0 else 0
    has_pub_rec          = 1 if pub_rec > 0 else 0
    loan_to_income       = loan_amnt / (annual_inc + 1)
    acc_utilization      = open_acc / (total_acc + 1)

    input_data = {
        'loan_amnt':             loan_amnt,
        'annual_inc':            annual_inc,
        'installment':           installment,
        'emp_length':            emp_length,
        'home_ownership':        home_ownership,
        'purpose':               purpose,
        'grade':                 grade,
        'dti':                   dti,
        'delinq_2yrs':           delinq_2yrs,
        'open_acc':              open_acc,
        'pub_rec':               pub_rec,
        'revol_bal':             revol_bal,
        'revol_util':            revol_util,
        'total_acc':             total_acc,
        'mort_acc':              mort_acc,
        'pub_rec_bankruptcies':  pub_rec_bankruptcies,
        'income_to_loan_ratio':  income_to_loan_ratio,
        'monthly_debt_burden':   monthly_debt_burden,
        'credit_risk_score':     credit_risk_score,
        'has_delinquency':       has_delinquency,
        'has_bankruptcy':        has_bankruptcy,
        'has_pub_rec':           has_pub_rec,
        'loan_to_income':        loan_to_income,
        'acc_utilization':       acc_utilization,
    }

    cat_fields = ['home_ownership', 'purpose', 'grade']
    for field in cat_fields:
        le  = _label_encoders.get(field)
        val = input_data[field]
        if le is not None:
            if val in le.classes_:
                input_data[field] = int(le.transform([val])[0])
            else:
                input_data[field] = 0

    row      = np.array([[input_data[f] for f in _feature_names]])
    prob     = float(_model.predict_proba(row)[0][1])
    category = get_risk_category(prob)
    is_default = prob >= _best_threshold

    return {
        'risk_score':     round(prob, 4),
        'risk_category':  category,
        'is_default':     bool(is_default),
        'threshold_used': round(float(_best_threshold), 2),
    }