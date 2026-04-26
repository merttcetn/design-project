import { sortBuildingNodes, type BuildingNode } from "@/data/nodes";
import type { RouteRequest, RouteResponse } from "@/types/route";

const DEFAULT_API_BASE_URL = "http://127.0.0.1:8000";

type NodesResponse = {
  nodes: BuildingNode[];
};

function getApiBaseUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  return (configuredUrl || DEFAULT_API_BASE_URL).replace(/\/$/, "");
}

export async function fetchRoute(
  payload: RouteRequest,
): Promise<RouteResponse> {
  const response = await fetch(`${getApiBaseUrl()}/api/route`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const detail = await readErrorDetail(response);
    throw new Error(
      detail || "Rota hesaplanamadı. Başlangıç ve varış konumlarını kontrol edin.",
    );
  }

  return response.json();
}

export async function fetchNodes(): Promise<BuildingNode[]> {
  const response = await fetch(`${getApiBaseUrl()}/api/nodes`);

  if (!response.ok) {
    const detail = await readErrorDetail(response);
    throw new Error(detail || "Konumlar backend üzerinden yüklenemedi.");
  }

  const body = (await response.json()) as NodesResponse;
  return sortBuildingNodes(body.nodes);
}

async function readErrorDetail(response: Response) {
  try {
    const body = (await response.json()) as { detail?: string };
    return body.detail;
  } catch {
    return null;
  }
}
