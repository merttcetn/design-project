"use client";

import { type ReactNode } from "react";

import { NavigationProvider } from "@/state/navigation-context";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return <NavigationProvider>{children}</NavigationProvider>;
}
