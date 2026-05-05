import json
import math
import sys
from pathlib import Path

import joblib
import pandas as pd


# 这个参数控制 safe_probability / confidence_score 的“拉伸程度”
# 1.0 更保守；1.5 更适合展示；2.0 会更容易出现高分
SIGMOID_SCALE = 1.5


def sigmoid(x: float) -> float:
    # 防止极端值导致 exp overflow
    x = max(min(x, 50), -50)
    return 1.0 / (1.0 + math.exp(-x))


def main():
    if len(sys.argv) < 2:
        print(
            json.dumps(
                {
                    "ok": False,
                    "error": "Missing input CSV path argument.",
                }
            )
        )
        sys.exit(1)

    input_csv = Path(sys.argv[1]).resolve()
    artifact_dir = Path(__file__).resolve().parent / "artifacts"

    feature_path = artifact_dir / "selected_features.json"
    scaler_path = artifact_dir / "scaler.pkl"
    label_encoder_path = artifact_dir / "le.pkl"
    model_path = artifact_dir / "Linear_SVM_model.pkl"

    required_files = {
        "input_csv": input_csv,
        "selected_features": feature_path,
        "scaler": scaler_path,
        "label_encoder": label_encoder_path,
        "model": model_path,
    }

    missing_files = [name for name, path in required_files.items() if not path.exists()]
    if missing_files:
        print(
            json.dumps(
                {
                    "ok": False,
                    "error": f"Missing required file(s): {missing_files}",
                }
            )
        )
        sys.exit(1)

    try:
        with open(feature_path, "r", encoding="utf-8") as f:
            selected_features = json.load(f)

        scaler = joblib.load(scaler_path)
        label_encoder = joblib.load(label_encoder_path)
        linear_svm_model = joblib.load(model_path)

        user_df = pd.read_csv(input_csv)

        if len(user_df) != 1:
            print(
                json.dumps(
                    {
                        "ok": False,
                        "error": f"This deployment expects a single-row CSV, but got {len(user_df)} rows.",
                    }
                )
            )
            sys.exit(1)

        required_columns = ["Concentration"] + selected_features
        missing_columns = [col for col in required_columns if col not in user_df.columns]

        if missing_columns:
            print(
                json.dumps(
                    {
                        "ok": False,
                        "error": f"User CSV is missing {len(missing_columns)} required column(s).",
                        "missing_columns_preview": missing_columns[:20],
                    }
                )
            )
            sys.exit(1)

        model_input_columns = ["Concentration"] + selected_features
        X_user = user_df[model_input_columns].copy()

        X_user_scaled = scaler.transform(X_user)
        y_pred_encoded = linear_svm_model.predict(X_user_scaled)
        y_pred_label = label_encoder.inverse_transform(y_pred_encoded)[0]

        # 新增内部技术量：SVM decision margin
        # 不返回前端，只用于后续分数计算
        raw_margin = float(linear_svm_model.decision_function(X_user_scaled)[0])

        # 当前模型方向默认理解为：
        # 正 margin -> 更偏 toxic
        # 负 margin -> 更偏 nontoxic / safe
        # 因此 safe_probability = sigmoid(-raw_margin * scale)
        safe_probability = sigmoid(-SIGMOID_SCALE * raw_margin)

        # confidence_score 表示“对当前预测结果有多稳”
        # safe_probability 高 或 低得很明显，都代表模型较有把握
        confidence_score = round(max(safe_probability, 1.0 - safe_probability) * 100, 1)

        print(
            json.dumps(
                {
                    "ok": True,
                    "prediction": y_pred_label,
                    "safe_probability": round(safe_probability, 6),
                    "confidence_score": confidence_score,
                    "input_file": str(input_csv),
                    "num_input_features": len(model_input_columns),
                }
            )
        )
        sys.exit(0)

    except Exception as e:
        print(
            json.dumps(
                {
                    "ok": False,
                    "error": str(e),
                }
            )
        )
        sys.exit(1)


if __name__ == "__main__":
    main()