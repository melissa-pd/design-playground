"use client";

import {
  ArrowLeft,
  ArrowRight,
  CalendarBlank,
  CaretDown,
  Check,
  Clock,
  Heart,
  Info,
  MapPin,
  SlidersHorizontal,
  Sparkle,
  VideoCamera,
  X,
} from "@phosphor-icons/react";
import { useEffect, useMemo, useRef, useState } from "react";

type DebugData = Record<string, boolean | number | string | null | string[]>;

function writeDebugLog(
  hypothesisId: string,
  location: string,
  message: string,
  data: DebugData,
) {
  const body = JSON.stringify({
    hypothesisId,
    location,
    message,
    data,
    timestamp: Date.now(),
  });

  void fetch("/api/debug-log", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => undefined);
}

type FormatFilter = "all" | "virtual" | "in-person";
type SpecialtyFilter =
  | "all"
  | "Anxiety"
  | "Trauma"
  | "Life transitions"
  | "Medication support";
type AvailabilityFilter = "all" | "week" | "evenings";
type SortOption = "match" | "soonest";

type Provider = {
  id: number;
  name: string;
  credentials: string;
  pronouns: string;
  location: string;
  formats: Array<Exclude<FormatFilter, "all">>;
  nextAvailable: string;
  availableInDays: number;
  evenings: boolean;
  specialties: SpecialtyFilter[];
  about: string;
  matchReasons: string[];
  initials: string;
  avatarTone: string;
  tier: "best" | "more";
};

const providers: Provider[] = [
  {
    id: 1,
    name: "Maya Chen",
    credentials: "LCSW",
    pronouns: "she/her",
    location: "Brooklyn, NY",
    formats: ["virtual", "in-person"],
    nextAvailable: "Tomorrow at 6:00 PM",
    availableInDays: 1,
    evenings: true,
    specialties: ["Anxiety", "Life transitions"],
    about:
      "Warm, practical therapy for adults navigating anxiety, identity, and major life shifts.",
    matchReasons: ["Takes Aetna", "Evening sessions", "Anxiety specialist"],
    initials: "MC",
    avatarTone: "peach",
    tier: "best",
  },
  {
    id: 2,
    name: "Jordan Brooks",
    credentials: "LMHC",
    pronouns: "they/them",
    location: "Brooklyn, NY",
    formats: ["virtual"],
    nextAvailable: "Wednesday at 12:30 PM",
    availableInDays: 3,
    evenings: false,
    specialties: ["Anxiety", "Trauma"],
    about:
      "Collaborative, strengths-based care for people who want to feel less stuck and more present.",
    matchReasons: ["Takes Aetna", "Virtual this week", "Trauma-informed"],
    initials: "JB",
    avatarTone: "lilac",
    tier: "best",
  },
  {
    id: 3,
    name: "Lena Ortiz",
    credentials: "LCSW",
    pronouns: "she/her",
    location: "Queens, NY",
    formats: ["virtual", "in-person"],
    nextAvailable: "Friday at 5:30 PM",
    availableInDays: 5,
    evenings: true,
    specialties: ["Anxiety", "Life transitions"],
    about:
      "Culturally responsive therapy that makes room for family, work, and everything in between.",
    matchReasons: ["Takes Aetna", "Bilingual care", "Evening sessions"],
    initials: "LO",
    avatarTone: "sky",
    tier: "best",
  },
  {
    id: 4,
    name: "Theo Williams",
    credentials: "PsyD",
    pronouns: "he/him",
    location: "New York, NY",
    formats: ["virtual"],
    nextAvailable: "Next Monday at 9:00 AM",
    availableInDays: 8,
    evenings: false,
    specialties: ["Trauma", "Life transitions"],
    about:
      "Insight-oriented support for patterns that keep repeating, grounded in clear next steps.",
    matchReasons: ["Takes Aetna", "Trauma specialist", "15+ years experience"],
    initials: "TW",
    avatarTone: "sage",
    tier: "more",
  },
  {
    id: 5,
    name: "Priya Shah",
    credentials: "LMFT",
    pronouns: "she/her",
    location: "Brooklyn, NY",
    formats: ["virtual"],
    nextAvailable: "Next Tuesday at 7:00 PM",
    availableInDays: 9,
    evenings: true,
    specialties: ["Anxiety", "Life transitions"],
    about:
      "Direct but compassionate care for high-achieving adults, couples, and new parents.",
    matchReasons: ["Takes Aetna", "Evening sessions", "Life transition focus"],
    initials: "PS",
    avatarTone: "gold",
    tier: "more",
  },
];

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  );
}

function SelectField({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="filter-field">
      <span>{label}</span>
      <span className="select-wrap">
        <select value={value} onChange={(event) => onChange(event.target.value)}>
          {children}
        </select>
        <CaretDown size={16} aria-hidden="true" />
      </span>
    </label>
  );
}

function ProviderAvatar({ provider }: { provider: Provider }) {
  return (
    <div
      className={`provider-avatar avatar-${provider.avatarTone}`}
      role="img"
      aria-label={`Illustrated portrait placeholder for ${provider.name}`}
    >
      <span className="portrait-hair" />
      <span className="portrait-face" />
      <span className="portrait-body" />
      <span className="portrait-initials">{provider.initials}</span>
    </div>
  );
}

function ProviderCard({
  provider,
  saved,
  onSave,
  onView,
}: {
  provider: Provider;
  saved: boolean;
  onSave: (provider: Provider) => void;
  onView: (provider: Provider) => void;
}) {
  return (
    <article className="provider-card">
      <div className="provider-card-main">
        <ProviderAvatar provider={provider} />
        <div className="provider-copy">
          <div className="provider-title-row">
            <div>
              <p className="eyebrow">
                {provider.tier === "best" ? "Strong match" : "More to explore"}
              </p>
              <h3>
                {provider.name}, {provider.credentials}
              </h3>
              <p className="provider-meta">
                {provider.pronouns} <span>·</span> {provider.location}
              </p>
            </div>
            <button
              type="button"
              className={`save-button ${saved ? "is-saved" : ""}`}
              onClick={() => onSave(provider)}
              aria-pressed={saved}
              aria-label={`${saved ? "Remove" : "Save"} ${provider.name}`}
            >
              <Heart size={20} weight={saved ? "fill" : "regular"} />
            </button>
          </div>

          <p className="provider-about">{provider.about}</p>

          <div className="match-box">
            <div className="match-heading">
              <Sparkle size={17} weight="fill" aria-hidden="true" />
              <span>Why {provider.name.split(" ")[0]} fits your search</span>
            </div>
            <ul>
              {provider.matchReasons.map((reason) => (
                <li key={reason}>
                  <Check size={14} weight="bold" aria-hidden="true" />
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="provider-card-action">
        <div className="format-row" aria-label="Session formats">
          {provider.formats.includes("virtual") ? (
            <span>
              <VideoCamera size={16} aria-hidden="true" /> Virtual
            </span>
          ) : null}
          {provider.formats.includes("in-person") ? (
            <span>
              <MapPin size={16} aria-hidden="true" /> In person
            </span>
          ) : null}
        </div>
        <p className="next-label">Next opening</p>
        <p className="next-slot">
          <CalendarBlank size={19} aria-hidden="true" />
          {provider.nextAvailable}
        </p>
        <button
          type="button"
          className="primary-button"
          onClick={() => onView(provider)}
        >
          View {provider.name.split(" ")[0]}&apos;s profile
          <ArrowRight size={17} weight="bold" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}

function EmptyState({
  onRelax,
  onReset,
}: {
  onRelax: () => void;
  onReset: () => void;
}) {
  return (
    <section className="empty-state" aria-live="polite">
      <div className="empty-orbit" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <p className="eyebrow">No exact matches yet</p>
      <h2>Let&apos;s keep the path to care open.</h2>
      <p>
        No one matches every filter right now. Two small changes unlock
        providers who still take Aetna and support your goals.
      </p>
      <div className="empty-suggestions">
        <button type="button" onClick={onRelax}>
          <VideoCamera size={19} aria-hidden="true" />
          Include virtual care
          <ArrowRight size={16} aria-hidden="true" />
        </button>
        <button type="button" onClick={onReset}>
          <Clock size={19} aria-hidden="true" />
          See the soonest options
          <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>
      <button type="button" className="text-button" onClick={onReset}>
        Clear all filters
      </button>
    </section>
  );
}

export default function Home() {
  const [format, setFormat] = useState<FormatFilter>("all");
  const [specialty, setSpecialty] = useState<SpecialtyFilter>("all");
  const [availability, setAvailability] =
    useState<AvailabilityFilter>("all");
  const [sort, setSort] = useState<SortOption>("match");
  const [savedIds, setSavedIds] = useState<Set<number>>(() => new Set());
  const [notice, setNotice] = useState<string | null>(null);
  const debugInstanceId = useRef<string | null>(null);

  useEffect(() => {
    const instanceId = debugInstanceId.current ?? crypto.randomUUID();
    debugInstanceId.current = instanceId;
    const navigation = performance.getEntriesByType(
      "navigation",
    )[0] as PerformanceNavigationTiming | undefined;

    // #region agent log
    writeDebugLog("A,B", "app/page.tsx:Home mount", "Home mounted", {
      instanceId,
      url: window.location.href,
      navigationType: navigation?.type ?? null,
      timeOrigin: performance.timeOrigin,
      historyLength: window.history.length,
    });
    // #endregion

    return () => {
      // #region agent log
      writeDebugLog("A", "app/page.tsx:Home cleanup", "Home unmounted", {
        instanceId,
        url: window.location.href,
      });
      // #endregion
    };
  }, []);

  useEffect(() => {
    // #region agent log
    writeDebugLog("A,C", "app/page.tsx:state effect", "State committed", {
      instanceId: debugInstanceId.current,
      format,
      specialty,
      availability,
      sort,
      savedIds: [...savedIds].toSorted((first, second) => first - second).map(String),
      notice,
    });
    // #endregion
  }, [availability, format, notice, savedIds, sort, specialty]);

  useEffect(() => {
    function handleLifecycleEvent(event: Event) {
      const persisted =
        event instanceof PageTransitionEvent ? event.persisted : null;

      // #region agent log
      writeDebugLog("A,B,D", "app/page.tsx:lifecycle listener", "Browser lifecycle event", {
        instanceId: debugInstanceId.current,
        eventType: event.type,
        persisted,
        url: window.location.href,
        historyLength: window.history.length,
      });
      // #endregion
    }

    function handleSubmit(event: SubmitEvent) {
      const form = event.target instanceof HTMLFormElement ? event.target : null;

      // #region agent log
      writeDebugLog("B,D", "app/page.tsx:submit listener", "Document submit observed", {
        instanceId: debugInstanceId.current,
        defaultPrevented: event.defaultPrevented,
        formAction: form?.action ?? null,
        submitterTag:
          event.submitter instanceof HTMLElement
            ? event.submitter.tagName.toLowerCase()
            : null,
        url: window.location.href,
      });
      // #endregion
    }

    function handleInteraction(event: Event) {
      const target = event.target instanceof HTMLElement ? event.target : null;
      const interactive = target?.closest("button, a, select, input") ?? null;
      const form = interactive?.closest("form") ?? null;
      const anchor = interactive instanceof HTMLAnchorElement ? interactive : null;
      const control =
        interactive instanceof HTMLInputElement ||
        interactive instanceof HTMLSelectElement
          ? interactive
          : null;

      // #region agent log
      writeDebugLog("C,D", "app/page.tsx:interaction listener", "Interaction completed", {
        instanceId: debugInstanceId.current,
        eventType: event.type,
        targetTag: interactive?.tagName.toLowerCase() ?? null,
        targetId: interactive?.id || null,
        targetName: control?.name || null,
        targetValue: control?.value ?? null,
        buttonType:
          interactive instanceof HTMLButtonElement ? interactive.type : null,
        anchorHref: anchor?.href ?? null,
        formAction: form?.action ?? null,
        defaultPrevented: event.defaultPrevented,
        url: window.location.href,
      });
      // #endregion
    }

    const lifecycleEvents = [
      "beforeunload",
      "pagehide",
      "pageshow",
      "popstate",
      "hashchange",
    ] as const;

    lifecycleEvents.forEach((eventName) =>
      window.addEventListener(eventName, handleLifecycleEvent),
    );
    document.addEventListener("submit", handleSubmit);
    document.addEventListener("click", handleInteraction);
    document.addEventListener("change", handleInteraction);

    return () => {
      lifecycleEvents.forEach((eventName) =>
        window.removeEventListener(eventName, handleLifecycleEvent),
      );
      document.removeEventListener("submit", handleSubmit);
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("change", handleInteraction);
    };
  }, []);

  const filteredProviders = useMemo(() => {
    const nextProviders = providers.filter((provider) => {
      const matchesFormat =
        format === "all" || provider.formats.includes(format);
      const matchesSpecialty =
        specialty === "all" || provider.specialties.includes(specialty);
      const matchesAvailability =
        availability === "all" ||
        (availability === "week" && provider.availableInDays <= 7) ||
        (availability === "evenings" && provider.evenings);

      return matchesFormat && matchesSpecialty && matchesAvailability;
    });

    if (sort === "soonest") {
      return nextProviders.toSorted(
        (first, second) => first.availableInDays - second.availableInDays,
      );
    }

    return nextProviders;
  }, [availability, format, sort, specialty]);

  const bestMatches = filteredProviders.filter(
    (provider) => provider.tier === "best",
  );
  const moreMatches = filteredProviders.filter(
    (provider) => provider.tier === "more",
  );
  const hasFilters =
    format !== "all" || specialty !== "all" || availability !== "all";

  function handleReset() {
    setFormat("all");
    setSpecialty("all");
    setAvailability("all");
    setSort("match");
  }

  function handleSparseScenario() {
    setFormat("in-person");
    setSpecialty("Anxiety");
    setAvailability("week");
    setSort("match");
  }

  function handleEmptyScenario() {
    setFormat("in-person");
    setSpecialty("Trauma");
    setAvailability("evenings");
    setSort("match");
  }

  function handleRelaxVirtual() {
    setFormat("virtual");
    setSpecialty("Trauma");
    setAvailability("all");
  }

  function handleSave(provider: Provider) {
    setSavedIds((current) => {
      const next = new Set(current);
      if (next.has(provider.id)) {
        next.delete(provider.id);
        setNotice(`${provider.name} removed from your shortlist.`);
      } else {
        next.add(provider.id);
        setNotice(`${provider.name} saved to your shortlist.`);
      }
      return next;
    });
  }

  function handleView(provider: Provider) {
    setNotice(
      `${provider.name}'s profile would open here. This prototype focuses on the search decision.`,
    );
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Headway concept home">
          <BrandMark />
          <span>headway</span>
        </a>
        <div className="concept-label">
          <span>Independent concept</span>
        </div>
        <nav aria-label="Utility navigation">
          <a href="#results">Find care</a>
          <button type="button" className="header-button">
            Log in
          </button>
        </nav>
      </header>

      <main id="top">
        <section className="search-hero">
          <a href="#" className="back-link" onClick={(event) => event.preventDefault()}>
            <ArrowLeft size={16} weight="bold" aria-hidden="true" />
            Your preferences
          </a>
          <div className="hero-grid">
            <div>
              <p className="eyebrow">Your care shortlist starts here</p>
              <h1>Therapists picked for how you want to feel.</h1>
              <p className="hero-lede">
                Every result takes Aetna, supports anxiety and life changes,
                and is accepting new clients near Brooklyn.
              </p>
            </div>
            <aside className="scenario-panel" aria-label="Prototype scenarios">
              <p>Explore the result states</p>
              <div>
                <button type="button" onClick={handleReset}>
                  Full list
                </button>
                <button type="button" onClick={handleSparseScenario}>
                  Two nearby
                </button>
                <button type="button" onClick={handleEmptyScenario}>
                  No exact match
                </button>
              </div>
              <small>
                These controls expose the core search scenarios in this concept.
              </small>
            </aside>
          </div>
        </section>

        <section className="query-summary" aria-label="Current search">
          <div>
            <span className="summary-icon">
              <SlidersHorizontal size={19} weight="bold" aria-hidden="true" />
            </span>
            <p>
              <strong>Your search</strong>
              Brooklyn, NY <span>·</span> Aetna <span>·</span> Anxiety &amp;
              life changes
            </p>
          </div>
          <button type="button" onClick={() => setNotice("Search editing is outside this prototype.")}>
            Edit search
          </button>
        </section>

        <section className="results-shell" id="results">
          <aside className="filters" aria-label="Filter therapists">
            <div className="filters-heading">
              <div>
                <p className="eyebrow">Refine</p>
                <h2>What matters today?</h2>
              </div>
              {hasFilters ? (
                <button type="button" onClick={handleReset}>
                  Clear
                </button>
              ) : null}
            </div>

            <SelectField
              label="Session format"
              value={format}
              onChange={(value) => setFormat(value as FormatFilter)}
            >
              <option value="all">Any format</option>
              <option value="virtual">Virtual</option>
              <option value="in-person">In person</option>
            </SelectField>

            <SelectField
              label="Focus"
              value={specialty}
              onChange={(value) => setSpecialty(value as SpecialtyFilter)}
            >
              <option value="all">Any focus</option>
              <option value="Anxiety">Anxiety</option>
              <option value="Trauma">Trauma</option>
              <option value="Life transitions">Life transitions</option>
              <option value="Medication support">Medication support</option>
            </SelectField>

            <SelectField
              label="Availability"
              value={availability}
              onChange={(value) =>
                setAvailability(value as AvailabilityFilter)
              }
            >
              <option value="all">Any availability</option>
              <option value="week">This week</option>
              <option value="evenings">Evenings</option>
            </SelectField>

            <div className="insurance-note">
              <Check size={18} weight="bold" aria-hidden="true" />
              <div>
                <strong>Aetna is applied</strong>
                <span>Every result is shown as in-network.</span>
              </div>
              <Info size={17} aria-label="Insurance is part of the current search" />
            </div>
          </aside>

          <div className="results-column">
            <div className="results-header">
              <div>
                <p className="result-count" aria-live="polite">
                  {filteredProviders.length}{" "}
                  {filteredProviders.length === 1 ? "therapist" : "therapists"}
                </p>
                <p>
                  Ranked by your care preferences, availability, and insurance.
                </p>
              </div>
              <SelectField
                label="Sort by"
                value={sort}
                onChange={(value) => setSort(value as SortOption)}
              >
                <option value="match">Best match</option>
                <option value="soonest">Soonest opening</option>
              </SelectField>
            </div>

            {filteredProviders.length === 0 ? (
              <EmptyState onRelax={handleRelaxVirtual} onReset={handleReset} />
            ) : (
              <>
                {filteredProviders.length <= 2 ? (
                  <section className="sparse-note" aria-live="polite">
                    <span>
                      <Sparkle size={18} weight="fill" aria-hidden="true" />
                    </span>
                    <div>
                      <strong>
                        {filteredProviders.length === 1
                          ? "One focused option"
                          : "Two strong nearby options"}
                      </strong>
                      <p>
                        A shorter list can make the decision easier. Both match
                        your non-negotiables; compare fit and timing below.
                      </p>
                    </div>
                    <button type="button" onClick={handleReset}>
                      Broaden search
                    </button>
                  </section>
                ) : null}

                {bestMatches.length > 0 ? (
                  <section className="result-group" aria-labelledby="best-match-heading">
                    <div className="group-heading">
                      <div>
                        <p className="eyebrow">Start here</p>
                        <h2 id="best-match-heading">Best matched to you</h2>
                      </div>
                      <span>Match order, explained</span>
                    </div>
                    <div className="provider-list">
                      {bestMatches.map((provider) => (
                        <ProviderCard
                          key={provider.id}
                          provider={provider}
                          saved={savedIds.has(provider.id)}
                          onSave={handleSave}
                          onView={handleView}
                        />
                      ))}
                    </div>
                  </section>
                ) : null}

                {moreMatches.length > 0 ? (
                  <section className="result-group" aria-labelledby="more-match-heading">
                    <div className="group-heading">
                      <div>
                        <p className="eyebrow">Keep exploring</p>
                        <h2 id="more-match-heading">More providers to consider</h2>
                      </div>
                    </div>
                    <div className="provider-list">
                      {moreMatches.map((provider) => (
                        <ProviderCard
                          key={provider.id}
                          provider={provider}
                          saved={savedIds.has(provider.id)}
                          onSave={handleSave}
                          onView={handleView}
                        />
                      ))}
                    </div>
                  </section>
                ) : null}
              </>
            )}
          </div>
        </section>
      </main>

      <footer>
        <div>
          <BrandMark />
          <span>Search results concept</span>
        </div>
        <p>Speculative product design exercise · Mock provider data</p>
      </footer>

      {notice ? (
        <div className="toast" role="status">
          <Check size={18} weight="bold" aria-hidden="true" />
          <span>{notice}</span>
          <button
            type="button"
            onClick={() => setNotice(null)}
            aria-label="Dismiss message"
          >
            <X size={17} weight="bold" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
