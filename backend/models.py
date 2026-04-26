from pydantic import BaseModel, Field


class RouteRequest(BaseModel):
    start: str = Field(..., min_length=1, description="Baslangic node ID'si.")
    goal: str = Field(..., min_length=1, description="Hedef node ID'si.")
    avoid_stairs: bool = Field(
        default=True,
        description="True ise merdiven kenarlarina cok yuksek maliyet verilir.",
    )


class RouteInstruction(BaseModel):
    index: int
    from_node: str
    to_node: str
    instruction: str
    type: str


class RouteResponse(BaseModel):
    path: list[str]
    instructions: list[RouteInstruction]
    enhanced_instructions: list[str]


class BuildingNode(BaseModel):
    id: str
    kat: int
    bolum: str
    description: str
    diger_katlara_gecis: bool | None = None


class NodesResponse(BaseModel):
    nodes: list[BuildingNode]


class BuildGraphResponse(BaseModel):
    graph_path: str
    edge_files: list[str]
    node_count: int
    edge_count: int
    message: str


class RunTestsRequest(BaseModel):
    targets: list[str] = Field(
        default_factory=lambda: ["test_navigator.py"],
        description="Pytest hedefleri. Varsayılan olarak navigator testleri çalışır.",
    )
    verbose: bool = Field(default=True, description="True ise pytest -v ile çalışır.")


class RunTestsResponse(BaseModel):
    command: list[str]
    returncode: int
    passed: bool
    stdout: str
    stderr: str
