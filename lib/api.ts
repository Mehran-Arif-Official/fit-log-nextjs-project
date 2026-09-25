import type { Workout } from "./types";

const BASE_URL = "https://api.abcz.workers.dev/api/fitlog";

async function request<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(
      res.status === 404
        ? "That workout could not be found."
        : `The server responded with status ${res.status}.`
    );
  }
  const body = await res.json();
  // Tolerate both a bare payload and a `{ data: ... }` envelope.
  return (body && typeof body === "object" && "data" in body ? body.data : body) as T;
}

export const getWorkouts = () => request<Workout[]>(BASE_URL);

export const getWorkout = (id: string | number) =>
  request<Workout>(`${BASE_URL}/${encodeURIComponent(String(id))}`);
