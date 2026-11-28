"use client";
import { useEffect, useState } from "react";
import { apiRequest } from "./client";
export function useApi<T>(path: string) {
  const [state, setState] = useState<{
    path: string;
    data?: T;
    error?: string;
  }>({ path });
  useEffect(() => {
    let active = true;
    apiRequest<T>(path)
      .then((data) => {
        if (active) setState({ path, data });
      })
      .catch((error) => {
        if (active) setState({ path, error: error.message });
      });
    return () => {
      active = false;
    };
  }, [path]);
  return state.path === path ? state : { path };
}
