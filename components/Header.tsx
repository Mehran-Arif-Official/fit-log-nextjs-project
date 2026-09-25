"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePlan } from "@/lib/PlanContext";
import { cx, wrap } from "@/lib/ui";
import { BookmarkIcon, ListIcon } from "./Icons";

const links = [
  { href: "/", label: "Workouts" },
  { href: "/my-plan", label: "My Plan" },
];

const counter =
  "inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 text-[0.925rem] text-white/90 no-underline transition-colors hover:border-volt focus-visible:outline-volt";

const badge = "min-w-[22px] rounded-full bg-volt px-1.5 text-center text-[0.8rem] font-bold leading-normal text-noir";

export default function Header() {
  const pathname = usePathname();
  const { planIds, savedIds } = usePlan();

  return (
    <header className="sticky top-0 z-50 bg-noir text-white">
      <div className={cx(wrap, "flex min-h-16 flex-wrap items-center justify-between gap-x-7 gap-y-2 py-2 sm:justify-start")}>
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 font-display text-[1.6rem] font-bold tracking-wide text-white no-underline focus-visible:outline-volt"
          aria-label="FitLog home"
        >
          <Image src="/logo.png" alt="" width={28} height={28} priority />
          <span>FitLog</span>
        </Link>

        <nav className="order-3 flex w-full gap-1 sm:order-none sm:mr-auto sm:w-auto" aria-label="Main">
          {links.map((l) => {
            const active =
              l.href === "/" ? pathname === "/" || pathname.startsWith("/exercise") : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={cx(
                  "flex-1 rounded-full px-3.5 py-2 text-center font-medium no-underline transition-colors focus-visible:outline-volt sm:flex-none",
                  active ? "bg-volt text-noir" : "text-ash hover:bg-white/10 hover:text-white"
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex gap-2">
          <Link href="/my-plan" className={counter} aria-label={`Plan, ${planIds.length} lifts`}>
            <ListIcon />
            <span className="hidden sm:inline">Plan</span>
            <b className={badge}>{planIds.length}</b>
          </Link>
          <Link href="/my-plan#saved" className={counter} aria-label={`Saved, ${savedIds.length} lifts`}>
            <BookmarkIcon />
            <span className="hidden sm:inline">Saved</span>
            <b className={badge}>{savedIds.length}</b>
          </Link>
        </div>
      </div>
    </header>
  );
}
