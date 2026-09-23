import { formatOpeningDay, onboarding, thisWeekEnds, type Provider } from "./data";

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

function firstName(provider: Provider): string {
  return provider.name.split(" ")[0];
}

// Each angle answers "why this one" from a different onboarding answer. A pick
// takes the first angle that fits and has not been used, so the three callouts
// never repeat each other.
const angles: {
  id: string;
  build: (provider: Provider, insurance: string, soonestId: string) => string | null;
}[] = [
  {
    id: "tone",
    build: (provider) => {
      const match = provider.style.find((value) => onboarding.tone.includes(value));
      if (!match) return null;
      return `${match} was one of your must-haves, and it is one of only three words ${firstName(provider)} uses for the work.`;
    },
  },
  {
    id: "goal",
    build: (provider) => {
      const match = provider.specialties.find((value) => onboarding.goals.includes(value));
      if (!match) return null;
      return `${match} was top of the list you gave us, and ${firstName(provider)} treats it alongside couples work.`;
    },
  },
  {
    id: "intro-call",
    build: (provider) =>
      onboarding.wantsIntroCall && provider.freeConsult
        ? `You wanted to talk before committing, and ${firstName(provider)} offers a free consultation to start.`
        : null,
  },
  {
    id: "soonest",
    build: (provider, _insurance, soonestId) =>
      provider.id === soonestId
        ? `You are ready to start now: ${firstName(provider)} has the soonest opening of your matches, ${formatOpeningDay(provider.nextOpeningDate)}.`
        : null,
  },
  {
    id: "carriers",
    build: (provider, insurance) =>
      insurance === "Self-pay"
        ? `${firstName(provider)} sees self-pay clients, so there is no plan to verify first.`
        : `Your ${insurance} plan is one of ${provider.insuranceCount} carriers ${firstName(provider)} accepts.`,
  },
  {
    id: "washington",
    build: (provider) =>
      `${firstName(provider)} works with couples across Washington and sees them virtually.`,
  },
];

// One sentence per pick, each drawn from a different angle.
export function calloutsForPicks(picks: Provider[], insurance: string): string[] {
  const soonestId = [...picks].sort((a, b) =>
    a.nextOpeningDate.localeCompare(b.nextOpeningDate),
  )[0]?.id;
  const used = new Set<string>();

  return picks.map((provider) => {
    for (const angle of angles) {
      if (used.has(angle.id)) continue;
      const sentence = angle.build(provider, insurance, soonestId ?? "");
      if (!sentence) continue;
      used.add(angle.id);
      return sentence;
    }
    return angles[angles.length - 1].build(provider, insurance, soonestId ?? "") ?? "";
  });
}
