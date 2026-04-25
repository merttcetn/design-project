import os
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path

from dotenv import load_dotenv


ROOT_DIR = Path(__file__).resolve().parents[1]
DEFAULT_EDGE_PATHS = [
    "edges/kat_1_edges.json",
    "edges/kat_2_edges.json",
    "edges/kat_3_edges.json",
    "edges/zemin_kat_edges.json",
    "edges/vertical_edges.json",
]


def _resolve_path(value: str, default: Path) -> Path:
    path = Path(value) if value else default
    if path.is_absolute():
        return path
    return ROOT_DIR / path


def _parse_cors_origins(value: str | None) -> list[str]:
    if not value:
        return ["*"]
    origins = [origin.strip() for origin in value.split(",") if origin.strip()]
    return origins or ["*"]


def _parse_bool(value: str | None, default: bool) -> bool:
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


def _parse_paths(value: str | None, defaults: list[str]) -> list[Path]:
    raw_paths = [path.strip() for path in value.split(",")] if value else defaults
    return [_resolve_path(path, ROOT_DIR / path) for path in raw_paths if path]


@dataclass(frozen=True)
class Settings:
    root_dir: Path
    graph_path: Path
    edge_paths: list[Path]
    static_dir: Path
    cors_origins: list[str]
    minimax_api_key: str | None
    minimax_model: str
    minimax_base_url: str
    enable_dev_endpoints: bool


@lru_cache
def get_settings() -> Settings:
    load_dotenv(ROOT_DIR / ".env")

    return Settings(
        root_dir=ROOT_DIR,
        graph_path=_resolve_path(
            os.getenv("GRAPH_PATH", "graph.json"),
            ROOT_DIR / "graph.json",
        ),
        edge_paths=_parse_paths(os.getenv("EDGE_PATHS"), DEFAULT_EDGE_PATHS),
        static_dir=_resolve_path(
            os.getenv("STATIC_DIR", "static"),
            ROOT_DIR / "static",
        ),
        cors_origins=_parse_cors_origins(os.getenv("CORS_ORIGINS")),
        minimax_api_key=os.getenv("MINIMAX_API_KEY"),
        minimax_model=os.getenv("MINIMAX_MODEL", "MiniMax-M2.7"),
        minimax_base_url=os.getenv("MINIMAX_BASE_URL", "https://api.minimax.io/v1"),
        enable_dev_endpoints=_parse_bool(os.getenv("ENABLE_DEV_ENDPOINTS"), False),
    )
