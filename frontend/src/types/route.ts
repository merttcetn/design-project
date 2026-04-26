export type RouteStepType = "corridor" | "elevator" | "stairs" | string;

export type RouteInstruction = {
  index: number;
  from_node: string;
  to_node: string;
  instruction: string;
  type: RouteStepType;
};

export type RouteResponse = {
  path: string[];
  instructions: RouteInstruction[];
  enhanced_instructions: string[];
};

export type RouteRequest = {
  start: string;
  goal: string;
  avoid_stairs: boolean;
};
