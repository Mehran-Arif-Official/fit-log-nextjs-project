"use client";

import { useCallback, useEffect, useState } from "react";
import { getWorkout, getWorkouts } from "./api";
import type { Workout } from "./types";

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  retry: () => void;
}

// Module-level cache so moving between pages doesn't refetch the library.
let listCache: Workout[] | null = null;

function useAsync<T>(
  load: () => Promise<T>,
  initial: T | null,
  options: { onSuccess?: (data: T) => void; skipIfInitial?: boolean } = {}
): FetchState<T> {
  const { onSuccess, skipIfInitial = false } = options;
  const [data, setData] = useState<T | null>(initial);
  const [loading, setLoading] = useState(initial === null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (skipIfInitial && initial !== null && attempt === 0) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    load()
      .then((result) => {
        if (cancelled) return;
        onSuccess?.(result);
        setData(result);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Something went wrong.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt, load]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  return { data, loading, error, retry };
}

const loadList = () => getWorkouts();

export function useWorkouts() {
  return useAsync<Workout[]>(loadList, listCache, {
    skipIfInitial: true,
    onSuccess: (d) => {
      listCache = d;
    },
  });
}

export function useWorkout(id: string) {
  const load = useCallback(() => getWorkout(id), [id]);
  const cached = listCache?.find((w) => String(w.id) === id) ?? null;
  // Show the cached list entry instantly, then refresh from the details endpoint.
  return useAsync<Workout>(load, cached);
}
