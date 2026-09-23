import { formatOpeningDay, thisWeekEnds, type Provider } from "./data";

export const sortOptions = [
  { id: "recommended", label: "Recommended" },
  { id: "soonest", label: "Soonest availability" },
  { id: "free-consult", label: "Free consultation first" },
  { id: "most-carriers", label: "Most insurance carriers" },
] as const;

export type SortKey = (typeof sortOptions)[number]["id"];

export function isSortKey(value: string): value is SortKey {
  return sortOptions.some((option) => option.id === value);
}

export type Filters = {
  availableThisWeek: boolean;
  freeConsult: boolean;
  specialties: string[];
  styles: string[];
};

export const emptyFilters: Filters = {
  availableThisWeek: false,
  freeConsult: false,
  specialties: [],
  styles: [],
};

export function hasActiveFilters(filters: Filters): boolean {
  return (
    filters.availableThisWeek ||
    filters.freeConsult ||
    filters.specialties.length > 0 ||
    filters.styles.length > 0
  );
}

// OR within a group, AND across groups.
export function applyFilters(list: Provider[], filters: Filters): Provider[] {
  return list.filter((provider) => {
    if (filters.availableThisWeek && provider.nextOpeningDate > thisWeekEnds) return false;
    if (filters.freeConsult && !provider.freeConsult) return false;
    if (
      filters.specialties.length > 0 &&
      !filters.specialties.some((value) => provider.specialties.includes(value))
    ) {
      return false;
    }
    if (filters.styles.length > 0 && !filters.styles.some((value) => provider.style.includes(value))) {
      return false;
    }
    return true;
  });
}

// Stable sort, so ties keep the recommended (data) order.
export function applySort(list: Provider[], key: SortKey): Provider[] {
  const sorted = [...list];
  switch (key) {
    case "soonest":
      return sorted.sort((a, b) => a.nextOpeningDate.localeCompare(b.nextOpeningDate));
    case "free-consult":
      return sorted.sort((a, b) => Number(Boolean(b.freeConsult)) - Number(Boolean(a.freeConsult)));
    case "most-carriers":
      return sorted.sort((a, b) => b.insuranceCount - a.insuranceCount);
    default:
      return sorted;
  }
}

function joinList(items: string[]): string {
  if (items.length < 3) return items.join(" and ");
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

// One sentence for the pick card. The picks stand apart from the filter
// bar, so this reads off the search and the provider only.
export function matchSentence(provider: Provider, insurance: string): string {
  const lead = "Works with couples across Washington";
  const details = [
    insurance === "Self-pay" ? "welcomes self-pay" : `takes ${insurance}`,
    `opens ${formatOpeningDay(provider.nextOpeningDate)}`,
  ];
  if (provider.freeConsult) details.push("offers a free consultation");
  return `${lead}, ${joinList(details)}.`;
}
