import Image from "next/image";
import Link from "next/link";
import { cx, wrap } from "@/lib/ui";

export default function Footer() {
  return (
    <footer className="mt-10 bg-noir text-ash">
      <div className={cx(wrap, "flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-6 text-[0.925rem]")}>
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 font-display text-[1.35rem] font-bold tracking-wide text-white no-underline focus-visible:outline-volt"
          aria-label="FitLog home"
        >
          <Image src="/logo.png" alt="" width={24} height={24} />
          <span>FitLog</span>
        </Link>
        <p>© {new Date().getFullYear()} FitLog — Workout Library. Train hard, log honest.</p>
      </div>
    </footer>
  );
}
