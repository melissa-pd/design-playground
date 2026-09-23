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

const genderNoun: Record<string, string> = {
  Woman: "woman",
  Man: "man",
  "Non-binary": "non-binary therapist",
};

// Every callout opens on the two answers all three picks satisfy, gender and
// couples work, then earns its own tail. The tails are ordered, and a pick
// takes the first one that fits and has not been used, so no two repeat.
const angles: {
  id: string;
  tail: (provider: Provider, insurance: string, soonestId: string) => string | null;
}[] = [
  {
    id: "tone",
    tail: (provider) => {
      const match = provider.style.find((value) => onboarding.tone.includes(value));
      return match ? ` with the ${match.toLowerCase()} style you asked for.` : null;
    },
  },
  {
    id: "goal",
    tail: (provider) => {
      const match = provider.specialties.find((value) => onboarding.goals.includes(value));
      return match ? ` who treats ${match.toLowerCase()}, your top goal.` : null;
    },
  },
  {
    id: "intro-call",
    tail: (provider) =>
      onboarding.wantsIntroCall && provider.freeConsult
        ? " who offers the free intro call you wanted."
        : null,
  },
  {
    id: "soonest",
    tail: (provider, _insurance, soonestId) =>
      provider.id === soonestId
        ? `, open soonest of your matches on ${formatOpeningDay(provider.nextOpeningDate)}.`
        : null,
  },
  {
    id: "carriers",
    tail: (provider, insurance) =>
      insurance === "Self-pay"
        ? " who sees self-pay clients."
        : ` who takes your ${insurance} plan, one of ${provider.insuranceCount} carriers.`,
  },
  { id: "washington", tail: () => ", available virtually across Washington." },
];

function toneMatch(provider: Provider): string | undefined {
  return provider.style.find((value) => onboarding.tone.includes(value));
}

function goalMatch(provider: Provider): string | undefined {
  return provider.specialties.find((value) => onboarding.goals.includes(value));
}

// One sentence per pick, each drawn from a different angle.
export function calloutsForPicks(picks: Provider[], insurance: string): string[] {
  const soonestId = [...picks].sort((a, b) =>
    a.nextOpeningDate.localeCompare(b.nextOpeningDate),
  )[0]?.id;
  const used = new Set<string>();

  return picks.map((provider, index) => {
    const wanted = provider.gender === onboarding.therapistGender;
    const subject = wanted
      ? `A ${genderNoun[provider.gender]} in couples work`
      : "A therapist in couples work";

    // The lead pick stacks style, goal, and plan, since it is the strongest match.
    // The goal stays available to the others, who may share the specialty.
    const tone = toneMatch(provider);
    const goal = goalMatch(provider);
    if (index === 0 && tone && goal) {
      used.add("tone");
      used.add("carriers");
      const plan = insurance === "Self-pay" ? "sees self-pay clients" : `takes ${insurance}`;
      return `${subject}, ${tone.toLowerCase()} in style, who treats ${goal.toLowerCase()} and ${plan}.`;
    }

    for (const angle of angles) {
      if (used.has(angle.id)) continue;
      const tail = angle.tail(provider, insurance, soonestId ?? "");
      if (!tail) continue;
      used.add(angle.id);
      return `${subject}${tail}`;
    }
    return `${subject}, available virtually across Washington.`;
  });
}
