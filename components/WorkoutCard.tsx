import Image from "next/image";
import Link from "next/link";
import type { Workout } from "@/lib/types";
import { tag } from "@/lib/ui";
import WorkoutMeta from "./WorkoutMeta";

export default function WorkoutCard({ workout, priority = false }: { workout: Workout; priority?: boolean }) {
  return (
    <Link
      href={`/exercise/${workout.id}`}
      className="flex flex-col overflow-hidden rounded-[18px] border border-line bg-surface no-underline transition hover:-translate-y-0.5 hover:border-ink motion-reduce:transition-none"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-mist">
        <Image
          src={workout.image}
          alt={`${workout.name} demonstration`}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw"
          priority={priority}
          className="object-cover"
        />
        <ul className="absolute inset-x-3 bottom-3 flex flex-wrap gap-1.5" aria-label="Muscle groups">
          {workout.muscleGroups.map((m) => (
            <li key={m} className={tag}>
              {m}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-1 flex-col gap-1 px-[18px] pb-[18px] pt-4">
        <h3 className="font-display text-[1.55rem] font-bold leading-[1.05]">{workout.name}</h3>
        <p className="text-[0.95rem] text-muted">{workout.equipment}</p>
        <WorkoutMeta workout={workout} />
      </div>
    </Link>
  );
}
