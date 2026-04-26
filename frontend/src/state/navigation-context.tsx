"use client";

import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { BuildingNode } from "@/data/nodes";
import { fetchNodes, fetchRoute } from "@/services/api";
import type { RouteResponse } from "@/types/route";

type NavigationContextValue = {
  startId: string | null;
  goalId: string | null;
  avoidStairs: boolean;
  route: RouteResponse | null;
  nodes: BuildingNode[];
  currentIndex: number;
  isLoading: boolean;
  nodesLoading: boolean;
  error: string | null;
  nodesError: string | null;
  setStartId: (id: string | null) => void;
  setGoalId: (id: string | null) => void;
  setAvoidStairs: (value: boolean) => void;
  requestRoute: () => Promise<RouteResponse>;
  completeStep: () => void;
  clearError: () => void;
  resetRoute: () => void;
  resetAll: () => void;
};

const NavigationContext = createContext<NavigationContextValue | null>(null);

export function NavigationProvider({ children }: PropsWithChildren) {
  const [startId, setStartIdState] = useState<string | null>(null);
  const [goalId, setGoalIdState] = useState<string | null>(null);
  const [avoidStairs, setAvoidStairs] = useState(true);
  const [route, setRoute] = useState<RouteResponse | null>(null);
  const [nodes, setNodes] = useState<BuildingNode[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [nodesLoading, setNodesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nodesError, setNodesError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    fetchNodes()
      .then((result) => {
        if (!active) {
          return;
        }

        setNodes(result);
        setNodesError(null);
      })
      .catch((nodeError) => {
        if (!active) {
          return;
        }

        setNodes([]);
        setNodesError(
          nodeError instanceof Error
            ? nodeError.message
            : "Konumlar yüklenemedi.",
        );
      })
      .finally(() => {
        if (active) {
          setNodesLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const resetRoute = useCallback(() => {
    setRoute(null);
    setCurrentIndex(0);
    setError(null);
  }, []);

  const setStartId = useCallback(
    (id: string | null) => {
      setStartIdState(id);
      resetRoute();
    },
    [resetRoute],
  );

  const setGoalId = useCallback(
    (id: string | null) => {
      setGoalIdState(id);
      resetRoute();
    },
    [resetRoute],
  );

  const requestRoute = useCallback(async () => {
    if (!startId || !goalId) {
      throw new Error("Başlangıç ve varış konumu seçilmeden rota hesaplanamaz.");
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchRoute({
        start: startId,
        goal: goalId,
        avoid_stairs: avoidStairs,
      });
      setRoute(result);
      setCurrentIndex(0);
      return result;
    } catch (routeError) {
      const message =
        routeError instanceof Error
          ? routeError.message
          : "Rota hesaplanırken beklenmeyen bir hata oluştu.";
      setError(message);
      throw routeError;
    } finally {
      setIsLoading(false);
    }
  }, [avoidStairs, goalId, startId]);

  const completeStep = useCallback(() => {
    setCurrentIndex((index) => {
      const maxIndex = Math.max((route?.instructions.length ?? 1) - 1, 0);
      return Math.min(index + 1, maxIndex);
    });
  }, [route?.instructions.length]);

  const resetAll = useCallback(() => {
    setStartIdState(null);
    setGoalIdState(null);
    setAvoidStairs(true);
    setRoute(null);
    setCurrentIndex(0);
    setError(null);
  }, []);

  const value = useMemo(
    () => ({
      startId,
      goalId,
      avoidStairs,
      route,
      nodes,
      currentIndex,
      isLoading,
      nodesLoading,
      error,
      nodesError,
      setStartId,
      setGoalId,
      setAvoidStairs,
      requestRoute,
      completeStep,
      clearError: () => setError(null),
      resetRoute,
      resetAll,
    }),
    [
      avoidStairs,
      completeStep,
      currentIndex,
      error,
      goalId,
      isLoading,
      nodes,
      nodesError,
      nodesLoading,
      requestRoute,
      resetAll,
      resetRoute,
      route,
      setGoalId,
      setStartId,
      startId,
    ],
  );

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigationFlow() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigationFlow must be used inside NavigationProvider.");
  }
  return context;
}
