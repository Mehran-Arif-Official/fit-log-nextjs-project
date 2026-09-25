import type { Workout } from "@/lib/types";
import { cx } from "@/lib/ui";
import { ClockIcon, FlameIcon, StarIcon } from "./Icons";

export default function WorkoutMeta({ workout, pushRating = true }: { workout: Workout; pushRating?: boolean }) {
  const item = "inline-flex items-center gap-1.5";
  return (
    <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-3 text-[0.9rem] font-medium">
      <span className={item}>
        <ClockIcon /> {workout.duration} min
      </span>
      <span className={item}>
        <FlameIcon /> {workout.caloriesBurned} kcal
      </span>
      <span className={cx(item, "font-bold", pushRating && "ml-auto")}>
        <StarIcon className="text-gold" /> {workout.rating.toFixed(1)}
      </span>
    </div>
  );
}
