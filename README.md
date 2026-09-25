<div align="center">

<img src="public/logo.png" alt="FitLog logo" width="64" height="64" />

# FitLog — Workout Library

**Browse gym workouts, build today's plan, and track your calories.**

![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)

<img src="public/banner.png" alt="FitLog banner" width="220" />

</div>

---

## About

FitLog is a responsive workout library. It loads exercises from the FitLog API, lets you explore each lift in detail, and helps you put together a realistic session of up to five lifts for the day, with live minute and calorie totals. It works on mobile, tablet and desktop.

## Technologies Used

| Technology | Purpose |
| --- | --- |
| **Next.js 16** (App Router) | Routing, layouts, image optimisation |
| **React 19** | UI components, hooks and Context for shared state |
| **TypeScript** | Strict typing for API data and components |
| **Tailwind CSS 4** | All styling through utility classes, with a custom theme for colours and fonts |
| **Fontsource** | Self-hosted Barlow and Barlow Condensed fonts |
| **Fetch API** | Talking to the [FitLog REST API](https://api.abcz.workers.dev/api/fitlog) |

## Key Features

1. **Workout library** — a responsive grid of exercises showing image, muscle groups, equipment, duration, calories and rating, with search and muscle-group filters.
2. **Exercise details** — a dedicated page per lift (`/exercise/[id]`) with description, sets, reps, difficulty and step-by-step instructions.
3. **Today's plan with a five-lift cap** — add or remove lifts and see live totals for exercises, minutes and calories.
4. **Saved lifts and sorting** — bookmark exercises for later, switch between "Today's Plan" and "Saved", and sort by duration, calories or rating.
5. **Persistent and resilient** — your plan and saved lists survive a refresh (`localStorage`), and the app shows loading skeletons, empty states and a retry button if the API fails.

## Getting Started

```bash
npm install
npm run dev      # http://localhost:3000
```

Build for production with `npm run build` and `npm start`.
