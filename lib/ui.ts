// Shared Tailwind class strings, so repeated patterns stay consistent.

export const cx = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(" ");

export const wrap = "mx-auto w-full max-w-[1200px] px-4 sm:px-8";

export const cardGrid = "grid grid-cols-[repeat(auto-fill,minmax(min(100%,250px),1fr))] gap-3.5 sm:gap-6";

export const pageTitle = "font-display text-[clamp(2rem,5vw,2.75rem)] font-bold leading-none";

export const tag = "rounded-full bg-noir px-2.5 py-0.5 text-[0.825rem] font-semibold text-volt";

const btnBase =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 font-semibold leading-tight no-underline transition-colors active:translate-y-px motion-reduce:transition-none";

const sizes = {
  md: "min-h-[46px] px-5 py-2.5 text-base",
  sm: "min-h-10 px-3.5 py-2 text-[0.925rem]",
};

const variants = {
  primary: "border-noir bg-volt text-noir hover:bg-volt-deep",
  dark: "border-noir bg-noir text-white hover:bg-ink",
  outline: "border-ink bg-transparent text-ink hover:bg-ink hover:text-white",
  outlineActive: "border-ink bg-ink text-white",
  outlineOnVolt: "border-noir bg-transparent text-noir hover:bg-noir/10",
};

function buildButtons(size: keyof typeof sizes) {
  const out = {} as Record<keyof typeof variants, string>;
  (Object.keys(variants) as (keyof typeof variants)[]).forEach((v) => {
    out[v] = cx(btnBase, sizes[size], variants[v]);
  });
  return out;
}

/** Default (medium) buttons, e.g. `btn.primary`. */
export const btn = buildButtons("md");
/** Compact buttons for list rows, e.g. `btnSm.primary`. */
export const btnSm = buildButtons("sm");
