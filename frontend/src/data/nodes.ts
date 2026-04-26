import kat1 from './nodes/kat_1_nodes.json';
import kat2 from './nodes/kat_2_nodes.json';
import kat3 from './nodes/kat_3_nodes.json';
import kat4 from './nodes/kat_4_nodes.json';
import zemin from './nodes/zemin_kat_nodes.json';

export type BuildingNode = {
  id: string;
  kat: number;
  bolum: string;
  description: string;
  diger_katlara_gecis?: boolean;
};

export type NodeSection = {
  title: string;
  data: BuildingNode[];
};

type NodeFile = {
  nodes: BuildingNode[];
};

const sources = [zemin, kat1, kat2, kat3, kat4] as unknown as NodeFile[];

export const buildingNodes = sources
  .flatMap((source) => source.nodes)
  .sort((first, second) => {
    if (first.kat !== second.kat) {
      return first.kat - second.kat;
    }
    const bolumCompare = first.bolum.localeCompare(second.bolum, 'tr');
    if (bolumCompare !== 0) {
      return bolumCompare;
    }
    return first.description.localeCompare(second.description, 'tr');
  });

const nodeLookup = new Map(buildingNodes.map((node) => [node.id, node]));

export function getNodeById(id: string | null | undefined) {
  return id ? nodeLookup.get(id) ?? null : null;
}

export function getFloorLabel(floor: number) {
  if (floor === 0) {
    return 'Zemin Kat';
  }
  if (floor > 0) {
    return `${floor}. Kat`;
  }
  return `B${Math.abs(floor)}`;
}

export function getNodeTitle(node: BuildingNode | null | undefined) {
  if (!node) {
    return '';
  }
  return node.description || node.bolum || node.id;
}

export function getNodeSubtitle(node: BuildingNode | null | undefined) {
  if (!node) {
    return '';
  }
  return `${getFloorLabel(node.kat)} · ${node.bolum}`;
}

export function getNodeSections(query: string): NodeSection[] {
  const normalizedQuery = normalize(query);
  const grouped = new Map<string, NodeSection>();

  for (const node of buildingNodes) {
    if (normalizedQuery && !getNodeSearchText(node).includes(normalizedQuery)) {
      continue;
    }

    const title = `${getFloorLabel(node.kat)} · ${node.bolum}`;
    const existing = grouped.get(title);
    if (existing) {
      existing.data.push(node);
    } else {
      grouped.set(title, { title, data: [node] });
    }
  }

  return Array.from(grouped.values());
}

function getNodeSearchText(node: BuildingNode) {
  return normalize(`${node.id} ${node.bolum} ${node.description} ${getFloorLabel(node.kat)}`);
}

function normalize(value: string) {
  return value
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}
