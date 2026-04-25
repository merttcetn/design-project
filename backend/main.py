from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from backend.config import get_settings
from backend.dev_router import router as dev_router
from backend.router import router as route_router


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(
        title="Hastane Ici Navigasyon API",
        description="Dijkstra tabanli bina ici rota bulma ve talimat zenginlestirme API'si.",
        version="0.1.0",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(route_router, prefix="/api")
    if settings.enable_dev_endpoints:
        app.include_router(dev_router, prefix="/api")

    if settings.static_dir.exists():
        app.mount(
            "/static",
            StaticFiles(directory=settings.static_dir),
            name="static",
        )

    @app.get("/health")
    async def health() -> dict[str, str]:
        return {"status": "ok"}

    return app


app = create_app()
