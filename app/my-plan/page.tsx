"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PLAN_LIMIT, usePlan } from "@/lib/PlanContext";
import { useWorkouts } from "@/lib/useFetch";
import type { Workout } from "@/lib/types";
import { btn, btnSm, cx, pageTitle, wrap } from "@/lib/ui";
import { CardSkeletons, EmptyState, ErrorState } from "@/components/States";
import WorkoutMeta from "@/components/WorkoutMeta";
import { BookmarkIcon, CheckIcon, PlusIcon } from "@/components/Icons";

type Tab = "plan" | "saved";
type Sort = "default" | "duration" | "calories" | "rating";

const sorters: Record<Exclude<Sort, "default">, (a: Workout, b: Workout) => number> = {
  duration: (a, b) => b.duration - a.duration,
  calories: (a, b) => b.caloriesBurned - a.caloriesBurned,
  rating: (a, b) => b.rating - a.rating,
};

export default function MyPlanPage() {
  const { data, loading, error, retry } = useWorkouts();
  const { planIds, savedIds, ready, togglePlan, toggleSaved, removeFromPlan, clearPlan, inPlan } = usePlan();
  const [tab, setTab] = useState<Tab>("plan");
  const [sort, setSort] = useState<Sort>("default");

  useEffect(() => {
    document.title = "My Plan | FitLog";
    if (window.location.hash === "#saved") setTab("saved");
  }, []);

  const byId = useMemo(() => new Map((data ?? []).map((w) => [w.id, w])), [data]);

  const resolve = (ids: number[]) => ids.map((id) => byId.get(id)).filter((w): w is Workout => Boolean(w));

  const planned = useMemo(() => resolve(planIds), [planIds, byId]); // eslint-disable-line react-hooks/exhaustive-deps
  const saved = useMemo(() => resolve(savedIds), [savedIds, byId]); // eslint-disable-line react-hooks/exhaustive-deps

  const totals = useMemo(
    () => ({
      minutes: planned.reduce((s, w) => s + w.duration, 0),
      calories: planned.reduce((s, w) => s + w.caloriesBurned, 0),
    }),
    [planned]
  );

  const list = useMemo(() => {
    const source = tab === "plan" ? planned : saved;
    return sort === "default" ? source : [...source].sort(sorters[sort]);
  }, [tab, planned, saved, sort]);

  const busy = !ready || (loading && !data);

  const summary = [
    { label: "Exercises", value: String(planned.length), suffix: `/${PLAN_LIMIT}` },
    { label: "Minutes", value: String(totals.minutes) },
    { label: "Calories", value: String(totals.calories) },
  ];

  const tabClass = (selected: boolean) =>
    cx(
      "inline-flex min-h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full px-4 py-1.5 text-[0.95rem] font-semibold sm:flex-none",
      selected ? "bg-noir text-white" : "text-ink"
    );
  const countClass = (selected: boolean) =>
    cx(
      "min-w-[22px] rounded-full px-1.5 text-center text-[0.8rem] leading-relaxed",
      selected ? "bg-volt text-noir" : "bg-line text-ink"
    );

  return (
    <div className={cx(wrap, "py-7 sm:py-14")}>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className={pageTitle}>My Plan</h1>
          <p className="mt-1.5 text-muted">Cap of five lifts for today. Finish them, then load more.</p>
        </div>
        {planned.length > 0 && (
          <button type="button" className={btn.outline} onClick={clearPlan}>
            Clear plan
          </button>
        )}
      </div>

      <dl className="mb-6 grid grid-cols-3 gap-2 sm:gap-4">
        {summary.map((s) => (
          <div key={s.label} className="rounded-[18px] bg-noir p-3 text-white sm:p-5">
            <dt className="text-[0.9rem] text-ash">{s.label}</dt>
            <dd className="font-display text-[clamp(2rem,6vw,3.25rem)] font-bold leading-[1.1] text-volt">
              {s.value}
              {s.suffix && <small className="text-[0.5em] text-white/50">{s.suffix}</small>}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mb-[18px] flex flex-wrap items-center justify-between gap-x-5 gap-y-3">
        <div
          className="inline-flex w-full gap-1 rounded-full border border-line bg-surface p-1 sm:w-auto"
          role="tablist"
          aria-label="Plan views"
        >
          <button
            type="button"
            role="tab"
            id="tab-plan"
            aria-selected={tab === "plan"}
            aria-controls="panel"
            className={tabClass(tab === "plan")}
            onClick={() => setTab("plan")}
          >
            Today&apos;s Plan <span className={countClass(tab === "plan")}>{planIds.length}</span>
          </button>
          <button
            type="button"
            role="tab"
            id="tab-saved"
            aria-selected={tab === "saved"}
            aria-controls="panel"
            className={tabClass(tab === "saved")}
            onClick={() => setTab("saved")}
          >
            Saved <span className={countClass(tab === "saved")}>{savedIds.length}</span>
          </button>
        </div>

        <label className="inline-flex w-full items-center gap-2.5 font-medium sm:w-auto">
          <span>Sort by</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="min-h-[42px] flex-1 cursor-pointer rounded-xl border-2 border-line bg-surface py-1.5 pl-3 pr-8 text-ink focus-visible:border-ink sm:flex-none"
          >
            <option value="default">Added order</option>
            <option value="duration">Duration</option>
            <option value="calories">Calories</option>
            <option value="rating">Rating</option>
          </select>
        </label>
      </div>

      <div id="panel" role="tabpanel" aria-labelledby={tab === "plan" ? "tab-plan" : "tab-saved"}>
        {busy && <CardSkeletons count={3} />}
        {error && !data && <ErrorState message={error} onRetry={retry} />}

        {!busy && data && list.length === 0 && tab === "plan" && (
          <EmptyState title="Nothing planned yet" text="Add up to five lifts from the library to build today's session.">
            <Link href="/" className={btn.primary}>
              Browse workouts
            </Link>
          </EmptyState>
        )}
        {!busy && data && list.length === 0 && tab === "saved" && (
          <EmptyState title="No saved lifts" text="Use Save for later on any workout to keep it here.">
            <Link href="/" className={btn.primary}>
              Browse workouts
            </Link>
          </EmptyState>
        )}

        {!busy && data && list.length > 0 && (
          <ul className="grid gap-3.5">
            {list.map((w) => (
              <li
                key={w.id}
                className="grid grid-cols-[76px_1fr] gap-x-4 gap-y-2 rounded-[18px] border border-line bg-surface p-3.5 sm:grid-cols-[120px_1fr_auto] sm:items-center"
              >
                <Link
                  href={`/exercise/${w.id}`}
                  className="relative aspect-square w-[76px] self-start overflow-hidden rounded-xl bg-mist sm:w-[120px] sm:self-center"
                >
                  <Image src={w.image} alt={`${w.name} demonstration`} fill sizes="120px" className="object-cover" />
                </Link>
                <div className="flex flex-col">
                  <h3 className="font-display text-2xl font-bold leading-[1.05]">
                    <Link href={`/exercise/${w.id}`} className="no-underline hover:underline">
                      {w.name}
                    </Link>
                  </h3>
                  <p className="text-[0.95rem] text-muted">
                    {w.sets} sets of {w.reps} with {w.equipment}
                  </p>
                  <WorkoutMeta workout={w} pushRating={false} />
                </div>
                <div className="col-span-full flex flex-wrap gap-2 sm:col-auto sm:flex-col sm:items-stretch">
                  {tab === "plan" ? (
                    <>
                      <button type="button" className={cx(btnSm.primary, "max-sm:flex-1")} onClick={() => removeFromPlan(w.id)}>
                        <CheckIcon /> Mark as done
                      </button>
                      <button type="button" className={cx(btnSm.outline, "max-sm:flex-1")} onClick={() => togglePlan(w.id)}>
                        Remove
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        className={cx(inPlan(w.id) ? btnSm.dark : btnSm.primary, "max-sm:flex-1")}
                        onClick={() => togglePlan(w.id)}
                      >
                        {inPlan(w.id) ? <CheckIcon /> : <PlusIcon />}
                        {inPlan(w.id) ? "In plan" : "Add to plan"}
                      </button>
                      <button type="button" className={cx(btnSm.outline, "max-sm:flex-1")} onClick={() => toggleSaved(w.id)}>
                        <BookmarkIcon filled /> Unsave
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
