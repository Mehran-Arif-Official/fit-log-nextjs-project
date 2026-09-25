import { btn, cardGrid } from "@/lib/ui";

const shimmer = "animate-pulse bg-mist motion-reduce:animate-none";

export function CardSkeletons({ count = 8 }: { count?: number }) {
  return (
    <div className={cardGrid} aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex flex-col overflow-hidden rounded-[18px] border border-line bg-surface">
          <div className={`aspect-[4/3] ${shimmer}`} />
          <div className="flex flex-col gap-2 p-[18px]">
            <div className={`h-3.5 w-[70%] rounded-md ${shimmer}`} />
            <div className={`h-3.5 w-2/5 rounded-md ${shimmer}`} />
            <div className={`h-3.5 w-[90%] rounded-md ${shimmer}`} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="grid items-start gap-5 min-[900px]:grid-cols-2 min-[900px]:gap-12" aria-hidden="true">
      <div className={`aspect-square rounded-[18px] ${shimmer}`} />
      <div className="flex flex-col gap-3">
        <div className={`h-10 w-[70%] rounded-md ${shimmer}`} />
        <div className={`h-3.5 w-[90%] rounded-md ${shimmer}`} />
        <div className={`h-3.5 w-2/5 rounded-md ${shimmer}`} />
      </div>
    </div>
  );
}

const box =
  "flex flex-col items-center gap-2.5 rounded-[18px] border-2 border-dashed border-line bg-surface px-5 py-8 text-center sm:py-14";
const boxTitle = "font-display text-[1.9rem] font-bold leading-none";
const boxText = "mb-2 max-w-[44ch] text-muted";

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className={box} role="alert">
      <h2 className={boxTitle}>We couldn&apos;t load the workouts</h2>
      <p className={boxText}>{message} Check your connection and try again.</p>
      <button type="button" className={btn.primary} onClick={onRetry}>
        Try again
      </button>
    </div>
  );
}

export function EmptyState({ title, text, children }: { title: string; text: string; children?: React.ReactNode }) {
  return (
    <div className={box}>
      <h2 className={boxTitle}>{title}</h2>
      <p className={boxText}>{text}</p>
      {children}
    </div>
  );
}
