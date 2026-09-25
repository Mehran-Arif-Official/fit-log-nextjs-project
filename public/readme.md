fit-log-nextjs-project

Browse gym workouts, build today's plan, and track your calories.

ABOUT

FitLog is a responsive workout library. It loads exercises from the FitLog API, lets you explore each lift in detail, and helps you put together a realistic session of up to five lifts for the day, with live minute and calorie totals. It works on mobile, tablet and desktop.

TECHNOLOGIES USED

Next.js 16 (App Router): routing, layouts and image optimisation

React 19: UI components, hooks and Context for shared state
TypeScript: strict typing for API data and components
CSS3: custom properties, Grid and Flexbox, media queries (no UI framework)
Fontsource: self-hosted Barlow and Barlow Condensed fonts
Fetch API: talking to the FitLog REST API (https://api.abcz.workers.dev/api/fitlog)

KEY FEATURES

1. Workout library: a responsive grid of exercises showing image, muscle groups, equipment, duration, calories and rating, with search and muscle-group filters.

2. Exercise details: a dedicated page for each lift (/exercise/[id]) with description, sets, reps, difficulty and step-by-step instructions.

3. Today's plan with a five-lift cap: add or remove lifts and see live totals for exercises, minutes and calories.

4. Saved lifts and sorting: bookmark exercises for later, switch between "Today's Plan" and "Saved", and sort by duration, calories or rating.

5. Persistent and resilient: your plan and saved lists survive a page refresh (localStorage), and the app shows loading skeletons, empty states and a retry button if the API fails.
