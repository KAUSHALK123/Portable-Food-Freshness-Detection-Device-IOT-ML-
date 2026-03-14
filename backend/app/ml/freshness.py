from __future__ import annotations

import importlib.util
from pathlib import Path
from types import ModuleType
from typing import Any


_external_ml: ModuleType | None = None
_external_mtime: float | None = None


def _get_external_file() -> Path:
    backend_app_dir = Path(__file__).resolve().parents[1]
    workspace_root = backend_app_dir.parents[2]
    return workspace_root / "mlmodel" / "freshness.py"


def _load_external_freshness_module() -> ModuleType:
    external_file = _get_external_file()

    if not external_file.exists():
        raise ModuleNotFoundError(
            f"External ML freshness module not found at {external_file}"
        )

    spec = importlib.util.spec_from_file_location("external_ml_freshness", external_file)
    if spec is None or spec.loader is None:
        raise ModuleNotFoundError(f"Unable to load module spec from {external_file}")

    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def _get_external_module() -> ModuleType:
    global _external_ml, _external_mtime

    external_file = _get_external_file()
    current_mtime = external_file.stat().st_mtime

    if _external_ml is None or _external_mtime != current_mtime:
        _external_ml = _load_external_freshness_module()
        _external_mtime = current_mtime

    return _external_ml


def predict_freshness(
    temperature: float,
    humidity: float,
    gas: int,
    food_type: str,
) -> dict[str, Any]:
    external_ml = _get_external_module()
    predict_fn = getattr(external_ml, "predict_freshness", None)
    if not callable(predict_fn):
        raise AttributeError(
            "External module mlmodel/freshness.py must define predict_freshness(...)"
        )

    return predict_fn(temperature, humidity, gas, food_type)
