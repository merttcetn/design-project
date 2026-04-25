import asyncio
import json
import sys
from pathlib import Path

from fastapi import APIRouter, HTTPException
from starlette.concurrency import run_in_threadpool

from backend.config import get_settings
from backend.models import BuildGraphResponse, RunTestsRequest, RunTestsResponse
from build_graph import build_and_save_adjacency


router = APIRouter(tags=["dev"])


def _count_graph(graph_path: Path) -> tuple[int, int]:
    with graph_path.open("r", encoding="utf-8") as file:
        graph = json.load(file)

    node_ids = set(graph.keys())
    edge_count = 0
    for edges in graph.values():
        edge_count += len(edges)
        for edge in edges:
            node_ids.add(edge["to"])

    return len(node_ids), edge_count


def _build_graph() -> BuildGraphResponse:
    settings = get_settings()
    missing_files = [str(path) for path in settings.edge_paths if not path.exists()]
    if missing_files:
        raise FileNotFoundError(f"Edge file not found: {', '.join(missing_files)}")

    build_and_save_adjacency(
        [str(path) for path in settings.edge_paths],
        str(settings.graph_path),
    )
    node_count, edge_count = _count_graph(settings.graph_path)

    return BuildGraphResponse(
        graph_path=str(settings.graph_path),
        edge_files=[str(path) for path in settings.edge_paths],
        node_count=node_count,
        edge_count=edge_count,
        message="Graph rebuilt successfully.",
    )


def _validate_test_targets(targets: list[str]) -> list[str]:
    settings = get_settings()
    normalized_targets = []

    for target in targets:
        target_path = Path(target)
        if target_path.is_absolute() or ".." in target_path.parts:
            raise HTTPException(status_code=400, detail="Test targets must be relative paths.")

        resolved = (settings.root_dir / target_path).resolve()
        if settings.root_dir not in resolved.parents and resolved != settings.root_dir:
            raise HTTPException(status_code=400, detail="Test target is outside project root.")
        if not resolved.exists():
            raise HTTPException(status_code=404, detail=f"Test target not found: {target}")

        normalized_targets.append(str(target_path))

    return normalized_targets


@router.post("/graph/build", response_model=BuildGraphResponse)
async def build_graph() -> BuildGraphResponse:
    try:
        return await run_in_threadpool(_build_graph)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/tests/run", response_model=RunTestsResponse)
async def run_tests(request: RunTestsRequest) -> RunTestsResponse:
    settings = get_settings()
    targets = _validate_test_targets(request.targets)
    command = [sys.executable, "-m", "pytest", *targets]
    if request.verbose:
        command.append("-v")

    process = await asyncio.create_subprocess_exec(
        *command,
        cwd=settings.root_dir,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE,
    )
    stdout, stderr = await process.communicate()

    return RunTestsResponse(
        command=command,
        returncode=process.returncode,
        passed=process.returncode == 0,
        stdout=stdout.decode("utf-8", errors="replace"),
        stderr=stderr.decode("utf-8", errors="replace"),
    )
