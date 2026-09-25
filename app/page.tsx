"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import WorkoutCard from "@/components/WorkoutCard";
import { CardSkeletons, EmptyState, ErrorState } from "@/components/States";
import { SearchIcon } from "@/components/Icons";
import { useWorkouts } from "@/lib/useFetch";
import { btn, cardGrid, cx, pageTitle, wrap } from "@/lib/ui";

export default function HomePage() {
  const { data, loading, error, retry } = useWorkouts();
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("All");

  const groups = useMemo(() => {
    const set = new Set<string>();
    data?.forEach((w) => w.muscleGroups.forEach((m) => set.add(m)));
    return ["All", ...Array.from(set).sort()];
  }, [data]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (data ?? []).filter((w) => {
      const matchesGroup = group === "All" || w.muscleGroups.includes(group);
      const matchesQuery =
        !q ||
        w.name.toLowerCase().includes(q) ||
        w.equipment.toLowerCase().includes(q) ||
        w.muscleGroups.some((m) => m.toLowerCase().includes(q));
      return matchesGroup && matchesQuery;
    });
  }, [data, query, group]);

  const count = data?.length;

  return (
    <>
      <section className="overflow-hidden bg-volt text-noir">
        <div
          className={cx(
            wrap,
            "grid grid-cols-1 items-center gap-2 py-7 sm:py-12 min-[900px]:grid-cols-[1.1fr_0.9fr] min-[900px]:gap-8 min-[900px]:py-16",
          )}
        >
          <div>
            <h1 className="max-w-[17ch] font-display text-[clamp(2.5rem,8vw,4.75rem)] font-bold leading-[1.05]">
              TRAIN WITH INTENT. LOG EVERY SET.
            </h1>
            <p className="mt-4 max-w-[46ch] text-[clamp(1.02rem,2.2vw,1.2rem)] text-noir/80">
              FitLog is a dark, no-nonsense gym companion: pick a lift, lock it
              into today's plan, and watch the week's work add up.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#library" className={btn.dark}>
                Browse the library
              </a>
              <Link href="/my-plan" className={btn.outlineOnVolt}>
                Open my plan
              </Link>
            </div>
          </div>
          <div className="w-[min(72vw,420px)] justify-self-center min-[900px]:w-[min(100%,440px)] min-[900px]:justify-self-end">
            <Image
              src="/banner.png"
              alt="Gym Illustration"
              width={334}
              height={334}
              priority
              sizes="(min-width: 900px) 420px, 60vw"
              className="h-auto w-full drop-shadow-[0_22px_24px_rgba(13,14,15,0.22)]"
            />
          </div>
        </div>
      </section>

      <section
        id="library"
        className={cx(wrap, "scroll-mt-20 py-7 sm:py-14")}
        aria-labelledby="library-title"
      >
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="library-title" className={pageTitle}>
              The Library
            </h2>
            <p className="mt-1.5 text-muted">
              {count
                ? `${count} lifts covering every major muscle group.`
                : "Lifts covering every major muscle group."}
            </p>
          </div>

          <div className="w-full sm:max-w-[380px]">
            <label className="flex min-h-[46px] items-center gap-2.5 rounded-xl border-2 border-line bg-surface px-3.5 text-muted focus-within:border-ink">
              <SearchIcon />
              <span className="sr-only">Search workouts</span>
              <input
                type="search"
                placeholder="Search by name, muscle or equipment"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="min-w-0 flex-1 border-0 bg-transparent py-2.5 text-ink outline-none placeholder:text-[#7b828a]"
              />
            </label>
          </div>
        </div>

        {groups.length > 1 && (
          <div
            className="mb-5 flex gap-2 overflow-x-auto pb-1.5"
            role="group"
            aria-label="Filter by muscle group"
          >
            {groups.map((g) => (
              <button
                key={g}
                type="button"
                aria-pressed={g === group}
                onClick={() => setGroup(g)}
                className={cx(
                  "min-h-10 flex-none cursor-pointer rounded-full border-2 px-4 py-1.5 text-[0.95rem] font-medium transition-colors",
                  g === group
                    ? "border-noir bg-noir text-volt"
                    : "border-line bg-surface text-ink hover:border-ink",
                )}
              >
                {g}
              </button>
            ))}
          </div>
        )}

        {loading && !data && <CardSkeletons />}
        {error && !data && <ErrorState message={error} onRetry={retry} />}
        {data && visible.length === 0 && (
          <EmptyState
            title="No lifts match your search"
            text="Try a different name, or clear the muscle group filter."
          >
            <button
              type="button"
              className={btn.primary}
              onClick={() => {
                setQuery("");
                setGroup("All");
              }}
            >
              Clear filters
            </button>
          </EmptyState>
        )}
        {data && visible.length > 0 && (
          <div className={cardGrid}>
            {visible.map((w, i) => (
              <WorkoutCard key={w.id} workout={w} priority={i < 4} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
