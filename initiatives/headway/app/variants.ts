// Variants are cumulative: each one includes everything before it.
export const variants = [
  {
    id: "sort",
    label: "Sort order",
    hypothesis:
      "Naming the count and letting people reorder the list means fewer descriptions to read before the right one floats up.",
  },
  {
    id: "filter-bar",
    label: "Filter bar",
    hypothesis:
      "Filters turn 'read everyone' into 'read the three who fit'. The list narrows by what matters to this couple before a single bio is opened.",
  },
  {
    id: "top-three",
    label: "Top 3 picks",
    hypothesis:
      "A ranked top 3 with the reasons on the card answers 'who should I actually message' without reading ten bios.",
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

export function variantRank(id: VariantId): number {
  return variants.findIndex((variant) => variant.id === id);
}
