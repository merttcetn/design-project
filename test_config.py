from unittest.mock import patch

from backend.config import get_settings


def test_dev_endpoints_default_disabled(monkeypatch):
    monkeypatch.delenv("ENABLE_DEV_ENDPOINTS", raising=False)
    get_settings.cache_clear()

    try:
        with patch("backend.config.load_dotenv", return_value=False):
            assert get_settings().enable_dev_endpoints is False
    finally:
        get_settings.cache_clear()


def test_dev_endpoints_can_be_enabled(monkeypatch):
    monkeypatch.setenv("ENABLE_DEV_ENDPOINTS", "true")
    get_settings.cache_clear()

    try:
        with patch("backend.config.load_dotenv", return_value=False):
            assert get_settings().enable_dev_endpoints is True
    finally:
        get_settings.cache_clear()


def test_minimax_default_model_is_m27(monkeypatch):
    monkeypatch.delenv("MINIMAX_MODEL", raising=False)
    get_settings.cache_clear()

    try:
        with patch("backend.config.load_dotenv", return_value=False):
            assert get_settings().minimax_model == "MiniMax-M2.7"
    finally:
        get_settings.cache_clear()
