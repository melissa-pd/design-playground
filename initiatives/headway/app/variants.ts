export const variants = [
  {
    id: "baseline",
    label: "Baseline",
    hypothesis:
      "The current search page asks people to scan a directory after a light zip and insurance form.",
  },
  {
    id: "why-this-match",
    label: "Why this match",
    hypothesis:
      "The decision gets easier when the match is visible on the card: couples care, Washington, the selected insurance, and the next opening.",
  },
  {
    id: "short-list",
    label: "Short list",
    hypothesis:
      "A short list is easier to act on than a catalog. The directory and pager step back, with a quiet path to more.",
  },
] as const;

export type VariantId = (typeof variants)[number]["id"];

export const viewports = ["mobile", "desktop", "both"] as const;

export type ViewportId = (typeof viewports)[number];

export function isVariantId(value: string | null): value is VariantId {
  return variants.some((variant) => variant.id === value);
}

export function isViewportId(value: string | null): value is ViewportId {
  return viewports.some((viewport) => viewport === value);
}
