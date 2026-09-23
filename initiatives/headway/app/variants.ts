// Variants are cumulative: each one includes everything before it.
export const variants = [
  {
    id: "sort",
    label: "Sort order",
  },
  {
    id: "filter-bar",
    label: "Filter bar",
  },
  {
    id: "top-three",
    label: "Top 3 picks",
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
