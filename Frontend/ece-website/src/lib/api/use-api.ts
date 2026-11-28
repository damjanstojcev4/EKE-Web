"use client";
import { useEffect, useState } from "react";
import { apiRequest } from "./client";
export function useApi<T>(path: string, initialData?: T) {
  const [state, setState] = useState<{
    path: string;
    data?: T;
    error?: string;
  }>({ path, data: initialData });
  useEffect(() => {
    if (initialData !== undefined) return;
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
  }, [path, initialData]);
  return initialData !== undefined
    ? { path, data: initialData, error: undefined }
    : state.path === path ? state : { path };
}
