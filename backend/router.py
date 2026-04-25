import logging

from fastapi import APIRouter, HTTPException
from starlette.concurrency import run_in_threadpool

from backend.config import Settings, get_settings
from backend.models import RouteInstruction, RouteRequest, RouteResponse
from navigator import find_route, load_graph


logger = logging.getLogger(__name__)
router = APIRouter(tags=["route"])


def _fallback_enhanced_instructions(start: str, goal: str, instructions: list[str]) -> list[str]:
    if not instructions:
        if start == goal:
            return [f"{start} konumundasiniz; hedef konuma zaten ulasmissiniz."]
        return ["Bu rota icin ek talimat bulunmuyor."]

    return [f"{instruction}" for instruction in instructions]


def _build_structured_instructions(
    graph_path: str,
    path: list[str],
    raw_instructions: list[str],
) -> list[RouteInstruction]:
    graph = load_graph(graph_path)
    structured_instructions = []

    for index, (from_node, to_node) in enumerate(zip(path, path[1:]), 1):
        edge = next(
            (candidate for candidate in graph.get(from_node, []) if candidate["to"] == to_node),
            None,
        )
        fallback_instruction = raw_instructions[index - 1] if index - 1 < len(raw_instructions) else ""

        structured_instructions.append(
            RouteInstruction(
                index=index,
                from_node=from_node,
                to_node=to_node,
                instruction=edge.get("instruction", fallback_instruction) if edge else fallback_instruction,
                type=edge.get("type", "corridor") if edge else "corridor",
            )
        )

    return structured_instructions


async def _build_enhanced_instructions(
    start: str,
    goal: str,
    instructions: list[str],
    settings: Settings,
) -> list[str]:
    fallback_instructions = _fallback_enhanced_instructions(start, goal, instructions)

    if not instructions or not settings.minimax_api_key:
        return fallback_instructions

    try:
        from llm_navigation_service import LLMNavigationService

        service = LLMNavigationService(
            api_key=settings.minimax_api_key,
            base_url=settings.minimax_base_url,
        )
        service.model = settings.minimax_model
        enhanced_instructions = await service.enhance_instructions(instructions, start)
    except Exception:
        logger.exception("LLM instruction enhancement failed; returning fallback instructions.")
        return fallback_instructions

    return enhanced_instructions or fallback_instructions


@router.post("/route", response_model=RouteResponse)
async def route(request: RouteRequest) -> RouteResponse:
    settings = get_settings()

    if not settings.graph_path.exists():
        raise HTTPException(status_code=500, detail="Graph file not found.")

    route_result = await run_in_threadpool(
        find_route,
        str(settings.graph_path),
        request.start,
        request.goal,
        request.avoid_stairs,
    )

    if route_result is None:
        raise HTTPException(status_code=404, detail="Route not found or node does not exist.")

    path = route_result["path"]
    raw_instructions = route_result["instructions"]
    structured_instructions = await run_in_threadpool(
        _build_structured_instructions,
        str(settings.graph_path),
        path,
        raw_instructions,
    )
    enhanced_instructions = await _build_enhanced_instructions(
        request.start,
        request.goal,
        raw_instructions,
        settings,
    )

    return RouteResponse(
        path=path,
        instructions=structured_instructions,
        enhanced_instructions=enhanced_instructions,
    )
