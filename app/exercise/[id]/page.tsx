"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { usePlan, PLAN_LIMIT } from "@/lib/PlanContext";
import { useWorkout } from "@/lib/useFetch";
import { btn, cx, tag, wrap } from "@/lib/ui";
import { BackIcon, BookmarkIcon, CheckIcon, PlusIcon } from "@/components/Icons";
import { DetailSkeleton, ErrorState } from "@/components/States";

export default function ExercisePage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { data: w, loading, error, retry } = useWorkout(id);
  const { inPlan, isSaved, togglePlan, toggleSaved, planIds } = usePlan();

  useEffect(() => {
    document.title = w ? `${w.name} | FitLog` : "Workout | FitLog";
  }, [w]);

  if (!w && loading) {
    return (
      <div className={cx(wrap, "py-7 sm:py-14")} aria-busy="true">
        <DetailSkeleton />
      </div>
    );
  }

  if (!w) {
    return (
      <div className={cx(wrap, "py-7 sm:py-14")}>
        <BackLink />
        <ErrorState message={error ?? "That workout could not be found."} onRetry={retry} />
      </div>
    );
  }

  const planned = inPlan(w.id);
  const saved = isSaved(w.id);
  const planFull = !planned && planIds.length >= PLAN_LIMIT;

  const stats: [string, string][] = [
    ["Equipment", w.equipment],
    ["Difficulty", w.difficulty],
    ["Sets", String(w.sets)],
    ["Reps", w.reps],
    ["Duration", `${w.duration} min`],
    ["Calories", `${w.caloriesBurned} kcal`],
    ["Rating", w.rating.toFixed(1)],
  ];

  return (
    <div className={cx(wrap, "py-7 sm:py-14")}>
      <BackLink />
      <article className="grid grid-cols-1 items-start gap-5 sm:gap-8 min-[900px]:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] min-[900px]:gap-12">
        <div className="relative aspect-square overflow-hidden rounded-[18px] bg-mist min-[900px]:sticky min-[900px]:top-[88px]">
          <Image
            src={w.image}
            alt={`${w.name} demonstration`}
            fill
            priority
            sizes="(min-width: 900px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        <div>
          <h1 className="font-display text-[clamp(2.4rem,7vw,4rem)] font-bold leading-[1.05]">{w.name}</h1>
          <p className="mt-3 max-w-[60ch] text-[1.1rem] text-muted">{w.description}</p>

          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Muscle groups">
            {w.muscleGroups.map((m) => (
              <li key={m} className={tag}>
                {m}
              </li>
            ))}
          </ul>

          <dl className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {stats.map(([label, value]) => (
              <div key={label} className="rounded-xl border border-line bg-surface px-3.5 py-3">
                <dt className="text-[0.85rem] text-muted">{label}</dt>
                <dd className="font-display text-[1.4rem] font-bold leading-tight [overflow-wrap:anywhere]">{value}</dd>
              </div>
            ))}
          </dl>

          <h2 className="mb-3 mt-7 font-display text-[1.8rem] font-bold leading-none">Instructions</h2>
          <ol className="grid gap-2.5">
            {w.instructions.map((step, i) => (
              <li key={i} className="relative min-h-8 pl-[46px]">
                <span
                  className="absolute -top-px left-0 grid size-8 place-items-center rounded-full bg-noir text-[0.95rem] font-bold text-volt"
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>

          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="button"
              className={cx(planned ? btn.dark : btn.primary, "max-sm:basis-full")}
              onClick={() => togglePlan(w.id)}
              aria-disabled={planFull}
              aria-pressed={planned}
            >
              {planned ? <CheckIcon /> : <PlusIcon />}
              {planned ? "In today's plan" : "Add to today's plan"}
            </button>
            <button
              type="button"
              className={cx(saved ? btn.outlineActive : btn.outline, "max-sm:basis-full")}
              onClick={() => toggleSaved(w.id)}
              aria-pressed={saved}
            >
              <BookmarkIcon filled={saved} />
              {saved ? "Saved" : "Save for later"}
            </button>
          </div>
          {planFull && (
            <p className="mt-3 text-[0.95rem] text-danger">
              Today&apos;s plan is full. Mark a lift as done to make room.
            </p>
          )}
        </div>
      </article>
    </div>
  );
}

function BackLink() {
  return (
    <Link
      href="/"
      className="-ml-2 mb-5 inline-flex items-center gap-1.5 rounded-full border-2 border-transparent py-1.5 pl-2 pr-3 font-semibold no-underline hover:border-ink"
    >
      <BackIcon /> Back to the library
    </Link>
  );
}
