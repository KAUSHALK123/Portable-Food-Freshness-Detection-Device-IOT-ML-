"""
Smart Freshness Prediction Engine
----------------------------------
Each container has exactly ONE sensor node:
  - DHT11  → temperature + humidity
  - MQ135  → gas (ppm)
"""

SHELF_LIFE_TABLE: dict[str, float] = {
    "tomato": 7.0,
    "banana": 5.0,
    "onion": 30.0,
    "apple": 20.0,
}
_DEFAULT_SHELF_LIFE = 7.0


def predict_freshness(
    temperature: float,
    humidity: float,
    gas: int,
    food_type: str = "unknown",
) -> dict:
    """
    Compute freshness score, status, shelf-life estimate, and discount recommendation.

    Freshness formula:
        score = 100 - (gas × 0.05) - (temperature × 0.4) - (humidity × 0.2)
        clamped to [0, 100]

    Shelf-life formula:
        env_factor = (gas × 0.02) + (temperature × 0.03)
        remaining = base_life - env_factor   (clamped to ≥ 0)
    """
    score = 100.0 - (gas * 0.05) - (temperature * 0.4) - (humidity * 0.2)
    score = max(0.0, min(100.0, score))

    if score >= 70:
        status = "Fresh"
    elif score >= 40:
        status = "Consume Soon"
    elif score >= 20:
        status = "Spoiling"
    else:
        status = "Spoiled"

    base_life = SHELF_LIFE_TABLE.get(food_type.lower(), _DEFAULT_SHELF_LIFE)
    env_factor = (gas * 0.02) + (temperature * 0.03)
    shelf_life_days = max(0.0, round(base_life - env_factor, 1))

    if score >= 70:
        recommended_discount = "No discount"
        action = "Product is fresh"
    elif score >= 40:
        recommended_discount = "10%"
        action = "Monitor closely, consider minor discount"
    elif score >= 20:
        recommended_discount = "20%"
        action = "Apply discount to reduce waste"
    else:
        recommended_discount = "40%"
        action = "Apply significant discount or remove from shelf"

    return {
        "freshness_score": round(score, 2),
        "status": status,
        "shelf_life_days": shelf_life_days,
        "recommended_discount": recommended_discount,
        "action": action,
    }
