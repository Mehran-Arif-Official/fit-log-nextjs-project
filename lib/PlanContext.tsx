"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export const PLAN_LIMIT = 5;

const PLAN_KEY = "fitlog:plan";
const SAVED_KEY = "fitlog:saved";

interface PlanContextValue {
  planIds: number[];
  savedIds: number[];
  ready: boolean;
  inPlan: (id: number) => boolean;
  isSaved: (id: number) => boolean;
  togglePlan: (id: number) => void;
  toggleSaved: (id: number) => void;
  removeFromPlan: (id: number) => void;
  clearPlan: () => void;
}

const PlanContext = createContext<PlanContextValue | null>(null);

function read(key: string): number[] {
  try {
    const raw = window.localStorage.getItem(key);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((n): n is number => typeof n === "number") : [];
  } catch {
    return [];
  }
}

function write(key: string, ids: number[]) {
  try {
    window.localStorage.setItem(key, JSON.stringify(ids));
  } catch {
    /* storage may be unavailable (private mode); state still works in memory */
  }
}

export function PlanProvider({ children }: { children: ReactNode }) {
  const [planIds, setPlanIds] = useState<number[]>([]);
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    setPlanIds(read(PLAN_KEY));
    setSavedIds(read(SAVED_KEY));
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) write(PLAN_KEY, planIds);
  }, [planIds, ready]);

  useEffect(() => {
    if (ready) write(SAVED_KEY, savedIds);
  }, [savedIds, ready]);

  const notify = useCallback((message: string) => {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  const togglePlan = useCallback(
    (id: number) => {
      if (planIds.includes(id)) {
        setPlanIds(planIds.filter((n) => n !== id));
        notify("Removed from today's plan.");
      } else if (planIds.length >= PLAN_LIMIT) {
        notify(`Your plan is full. Finish a lift to make room (limit ${PLAN_LIMIT}).`);
      } else {
        setPlanIds([...planIds, id]);
        notify("Added to today's plan.");
      }
    },
    [planIds, notify]
  );

  const toggleSaved = useCallback(
    (id: number) => {
      if (savedIds.includes(id)) {
        setSavedIds(savedIds.filter((n) => n !== id));
        notify("Removed from saved.");
      } else {
        setSavedIds([...savedIds, id]);
        notify("Saved for later.");
      }
    },
    [savedIds, notify]
  );

  const removeFromPlan = useCallback(
    (id: number) => {
      setPlanIds((ids) => ids.filter((n) => n !== id));
      notify("Marked as done. There's room for another lift.");
    },
    [notify]
  );

  const clearPlan = useCallback(() => {
    setPlanIds([]);
    notify("Plan cleared.");
  }, [notify]);

  const value = useMemo<PlanContextValue>(
    () => ({
      planIds,
      savedIds,
      ready,
      inPlan: (id) => planIds.includes(id),
      isSaved: (id) => savedIds.includes(id),
      togglePlan,
      toggleSaved,
      removeFromPlan,
      clearPlan,
    }),
    [planIds, savedIds, ready, togglePlan, toggleSaved, removeFromPlan, clearPlan]
  );

  return (
    <PlanContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-5 z-[200] flex justify-center px-4"
        role="status"
        aria-live="polite"
      >
        {toast && (
          <div className="max-w-[480px] rounded-xl border-l-[5px] border-volt bg-noir px-[18px] py-3 font-medium text-white shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
            {toast}
          </div>
        )}
      </div>
    </PlanContext.Provider>
  );
}

export function usePlan() {
  const ctx = useContext(PlanContext);
  if (!ctx) throw new Error("usePlan must be used inside <PlanProvider>");
  return ctx;
}
