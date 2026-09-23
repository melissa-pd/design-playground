"use client";

import { useState } from "react";
import {
  faqs,
  formatOpeningDay,
  formatStats,
  insurancePlans,
  insuranceStats,
  languageStats,
  providers,
  specialtyOptions,
  specialtyStats,
  styleOptions,
  type Provider,
} from "./data";
import {
  applyFilters,
  applySort,
  emptyFilters,
  hasActiveFilters,
  isSortKey,
  matchSentence,
  sortOptions,
  type Filters,
  type SortKey,
} from "./results";
import { variantRank, type VariantId } from "./variants";

const pageSize = 8;
const pickCount = 3;

const footerColumns = [
  {
    title: "Find care",
    links: ["Therapists", "Psychiatrists", "By specialty", "Online therapy", "Therapy resources"],
  },
  {
    title: "Providers",
    links: ["Join Headway", "Provider portal", "Refer provider", "Provider resources"],
  },
  {
    title: "Company",
    links: ["About us", "Company blog", "Press", "Careers"],
  },
  {
    title: "Support",
    links: ["Help center", "Contact us", "For health plans", "Sitemap", "FAQs"],
  },
] as const;

const legalLinks = [
  "Terms of Service",
  "Privacy Policy",
  "Supplemental Payment Terms",
  "HIPAA Notice of Privacy Practices",
  "CA Privacy Policy for Business Customers",
  "Washington State Consumer Health Data Privacy Policy",
  "Biometric Data Policy",
  "Accessibility",
  "Vulnerability Disclosure",
] as const;

export type SearchState = {
  zip: string;
  insurance: string;
  page: number;
  openFaq: string | null;
  sortKey: SortKey;
  filters: Filters;
};

type SearchPageProps = {
  layout: "mobile" | "desktop";
  variant: VariantId;
  state: SearchState;
  onZipChange: (zip: string) => void;
  onInsuranceChange: (insurance: string) => void;
  onPageChange: (page: number) => void;
  onFaqChange: (id: string | null) => void;
  onSortChange: (key: SortKey) => void;
  onFiltersChange: (filters: Filters) => void;
};

export function SearchPage({
  layout,
  variant,
  state,
  onZipChange,
  onInsuranceChange,
  onPageChange,
  onFaqChange,
  onSortChange,
  onFiltersChange,
}: SearchPageProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const rank = variantRank(variant);
  const showFilters = rank >= 1;
  const showPicks = rank >= 2;
  const activeFilters = showFilters ? state.filters : emptyFilters;
  const picks = showPicks ? providers.slice(0, pickCount) : [];
  const pool = showPicks ? providers.slice(pickCount) : providers;
  const listed = applySort(applyFilters(pool, activeFilters), state.sortKey);
  const total = listed.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(state.page, pageCount);
  const rangeStart = (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, total);
  const visible = listed.slice((page - 1) * pageSize, page * pageSize);
  const sortControl = (
    <SortControl layout={layout} sortKey={state.sortKey} onSortChange={onSortChange} />
  );

  function findCare() {
    setMenuOpen(false);
    document.getElementById(`results-${layout}`)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function focusSearch() {
    const input = document.querySelector<HTMLInputElement>(
      `#search-form-${layout} input`,
    );
    input?.scrollIntoView({ behavior: "smooth", block: "center" });
    input?.focus();
  }

  return (
    <div className="search" data-layout={layout}>
      <header className="search-header">
        <a className="search-logo" href={`#hero-${layout}`}>
          <img src="/logo.png" alt="Headway" width={160} height={32} />
        </a>
        <div className="search-header-tools">
          <button
            type="button"
            className="search-icon-button"
            aria-label="Search"
            onClick={focusSearch}
          >
            <img src="/icons/icon-search.svg" alt="" width={24} height={24} />
          </button>
          <button
            type="button"
            className="search-icon-button"
            aria-label="Menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <img src="/icons/icon-menu.svg" alt="" width={24} height={24} />
          </button>
        </div>
        <div className="search-header-actions">
          <nav
            className={menuOpen ? "search-nav is-open" : "search-nav"}
            aria-label="Main"
          >
            <button type="button" onClick={findCare}>
              Search providers
            </button>
            <button type="button" className="search-nav-item" onClick={findCare}>
              Find care
            </button>
            <button type="button" className="search-nav-item">
              For providers
            </button>
            <button type="button" className="search-nav-item">
              Company
            </button>
          </nav>
          <div className="search-header-cta">
            <button type="button" className="search-portal">
              My portal
            </button>
            <button type="button" className="search-find" onClick={findCare}>
              Find a therapist
            </button>
          </div>
        </div>
      </header>

      <section className="search-hero" aria-labelledby={`hero-${layout}`}>
        <div className="search-hero-copy">
          <h1 id={`hero-${layout}`}>
            Book couples therapy, covered by insurance
          </h1>
          <p className="search-kicker">Couples therapists in Washington</p>
          <form
            className="search-form"
            id={`search-form-${layout}`}
            onSubmit={(event) => {
              event.preventDefault();
              findCare();
            }}
          >
            <label className="search-field">
              <span>Zip code</span>
              <span className="search-control">
                <img src="/icons/icon-pin.svg" alt="" width={18} height={18} />
                <input
                  inputMode="numeric"
                  autoComplete="postal-code"
                  maxLength={5}
                  aria-label="Zip code"
                  value={state.zip}
                  onChange={(event) =>
                    onZipChange(event.target.value.replace(/\D/g, "").slice(0, 5))
                  }
                />
              </span>
            </label>
            <label className="search-field search-field-insurance">
              <span className="search-field-label">
                Insurance <em>Optional</em>
              </span>
              <span className="search-control">
                <img src="/icons/icon-shield.svg" alt="" width={20} height={21} />
                <select
                  aria-label="Insurance"
                  value={state.insurance}
                  onChange={(event) => onInsuranceChange(event.target.value)}
                >
                  {insurancePlans.map((plan) => (
                    <option key={plan} value={plan}>
                      {plan === "Aetna"
                        ? "Aetna, Cigna, Blue Cross Blue Shield, +70 more"
                        : plan}
                    </option>
                  ))}
                </select>
                <img className="search-chevron" src="/icons/icon-chevron.svg" alt="" width={16} height={16} />
              </span>
            </label>
            <button type="submit">Find care</button>
          </form>
        </div>
        <div className="search-photo">
          <img
            src="/session.png"
            alt="Therapist and patient in a therapy session"
          />
        </div>
      </section>

      <button type="button" className="search-estimate" onClick={findCare}>
        <img src="/art/calculator.png" alt="" width={56} height={45} />
        <span>
          <strong>Get a cost estimate</strong>
          <span>People with insurance pay as low as $0 per session through Headway</span>
        </span>
        <Chevron open={false} />
      </button>

      <section className="search-results" id={`results-${layout}`} aria-labelledby={`results-title-${layout}`}>
        <div className="search-results-intro">
          <h2 id={`results-title-${layout}`}>Top couples therapists in Washington</h2>
          <p>
            Work through relationship challenges with a couples therapist who understands your
            unique dynamic. Headway connects you with experienced providers across Washington,
            offering affordable sessions with an average savings of 75% through insurance—many
            patients pay as low as $0 per session.
          </p>
        </div>
        {picks.length > 0 ? (
          <TopPicks layout={layout} picks={picks} insurance={state.insurance} />
        ) : null}
        {showFilters || layout === "mobile" ? (
          <div className="search-toolbar">
            {showFilters ? <FilterBar filters={state.filters} onChange={onFiltersChange} /> : null}
            {layout === "mobile" ? sortControl : null}
          </div>
        ) : null}
        <ResultsHeader
          layout={layout}
          total={total}
          infoOpen={infoOpen}
          onInfoToggle={() => setInfoOpen((open) => !open)}
        >
          {layout === "desktop" ? sortControl : null}
        </ResultsHeader>
        {total === 0 ? <EmptyState onClear={() => onFiltersChange(emptyFilters)} /> : null}
        {total > 0 ? (
          <ol className="search-grid">
            {visible.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </ol>
        ) : null}
        {pageCount > 1 ? (
          <nav className="search-pager" aria-label="Results pages">
            <div className="search-pager-pages">
              <button
                type="button"
                className="search-pager-step"
                aria-label="Previous page"
                disabled={page === 1}
                onClick={() => onPageChange(page - 1)}
              >
                <img src="/icons/icon-chevron.svg" alt="" width={16} height={16} />
              </button>
              {Array.from({ length: pageCount }, (_, index) => {
                const number = index + 1;
                const current = number === page;
                return (
                  <button
                    key={number}
                    type="button"
                    aria-current={current ? "page" : undefined}
                    aria-label={`Page ${number}`}
                    onClick={() => onPageChange(number)}
                  >
                    {number}
                  </button>
                );
              })}
              <button
                type="button"
                className="search-pager-step search-pager-next"
                aria-label="Next page"
                disabled={page === pageCount}
                onClick={() => onPageChange(page + 1)}
              >
                <img src="/icons/icon-chevron.svg" alt="" width={16} height={16} />
              </button>
            </div>
            <p className="search-pager-count">
              {rangeStart} - {rangeEnd} of {total} <span>available therapists</span>
            </p>
          </nav>
        ) : null}
      </section>

      <section className="search-about" aria-labelledby={`about-${layout}`}>
        <h2 id={`about-${layout}`}>About our couples therapists in Washington</h2>
        <div className="search-stat-row">
          <article className="search-stat">
            <div className="search-stat-art" data-art="people">
              <img src="/art/stat-people.png" alt="" />
            </div>
            <p>Number of therapists serving Washington</p>
            <strong>590+</strong>
          </article>
          <article className="search-stat">
            <div className="search-stat-art" data-art="books">
              <img src="/art/stat-books.png" alt="" />
            </div>
            <p>Average years in practice</p>
            <strong>10 years</strong>
          </article>
        </div>
        <div className="search-mix-row">
          <StatList title="Top specialties offered" art="leaves" items={specialtyStats} />
          <StatList title="Insurances accepted" art="cards" items={insuranceStats} />
          <StatList title="Languages spoken" art="speech" items={languageStats} />
        </div>
        <div className="search-mix-row search-mix-row-narrow">
          <StatList title="How they see their clients" art="session" items={formatStats} />
        </div>
      </section>

      <section className="search-faq" aria-labelledby={`faq-${layout}`}>
        <div className="search-faq-intro">
          <h2 id={`faq-${layout}`}>Frequently asked questions</h2>
          <img className="search-chair" src="/art/chair.png" alt="" width={240} height={238} />
        </div>
        <div>
          {faqs.map((faq) => {
            const open = state.openFaq === faq.id;
            return (
              <div key={faq.id} className="search-faq-item">
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => onFaqChange(open ? null : faq.id)}
                >
                  <span>{faq.question}</span>
                  <Chevron open={open} />
                </button>
                {open ? <p>{faq.answer}</p> : null}
              </div>
            );
          })}
        </div>
      </section>

      <section className="search-close" aria-labelledby={`close-${layout}`}>
        <img
          className="search-close-photo"
          src="/art/patient.png"
          alt=""
        />
        <div className="search-close-copy">
          <h2 id={`close-${layout}`}>Find the right couples therapist for you</h2>
          <p>
            Headway makes it easy to find support for your relationship — from finding the right
            provider, to understanding costs, to scheduling with ease.
          </p>
          <button type="button" onClick={findCare}>
            Find your match
          </button>
        </div>
      </section>

      <nav className="search-crumbs" aria-label="Breadcrumb">
        <ol>
          <li>Home</li>
          <li>Therapists</li>
          <li>Washington</li>
          <li>Couples therapy</li>
        </ol>
      </nav>
      <p className="search-footnote">
        Cost may vary based on your location, age, and insurance coverage. Nothing here checks
        coverage or books a visit.
      </p>

      <footer className="search-footer">
        <div className="search-footer-inner">
          <nav className="search-footer-nav" aria-label="Footer">
            <img
              className="search-footer-logo"
              src="/icons/footer-logo.svg"
              alt="Headway"
              width={160}
              height={31}
            />
            {footerColumns.map((column) => (
              <div className="search-footer-col" key={column.title}>
                <h3>{column.title}</h3>
                <ul>
                  {column.links.map((link) => (
                    <li key={link}>
                      <button type="button" onClick={link === "Therapists" ? findCare : undefined}>
                        {link}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          <hr className="search-footer-rule" />
          <div className="search-footer-bottom">
            <div className="search-footer-brand">
              <p>© 2026 Therapymatch, Inc.</p>
              <div className="search-footer-social">
                <button type="button" aria-label="Instagram">
                  <img src="/icons/icon-instagram.svg" alt="" width={18} height={18} />
                </button>
                <button type="button" aria-label="X">
                  <img src="/icons/icon-x.svg" alt="" width={18} height={18} />
                </button>
                <button type="button" aria-label="LinkedIn">
                  <img src="/icons/icon-linkedin.svg" alt="" width={18} height={18} />
                </button>
              </div>
            </div>
            <div className="search-footer-crisis">
              <p>
                If you&apos;re experiencing emotional distress, the resources below provide free
                and confidential support 24/7.{" "}
                <strong>If this is an emergency, call 911.</strong>
              </p>
              <div className="search-footer-resources">
                <div>
                  <a href="https://988lifeline.org/">Suicide Prevention Lifeline</a>
                  <span>Call or text 988</span>
                </div>
                <div>
                  <a href="https://www.crisistextline.org/">Crisis Text Line</a>
                  <span>Text HOME to 741741</span>
                </div>
              </div>
            </div>
            <ul className="search-footer-legal">
              {legalLinks.map((link) => (
                <li key={link}>
                  <button type="button">{link}</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </footer>

    </div>
  );
}

function ResultsHeader({
  layout,
  total,
  infoOpen,
  onInfoToggle,
  children,
}: {
  layout: "mobile" | "desktop";
  total: number;
  infoOpen: boolean;
  onInfoToggle: () => void;
  children?: React.ReactNode;
}) {
  const noteId = `best-fit-note-${layout}`;

  return (
    <div className="search-results-bar">
      <div className="search-count-wrap">
        <p className="search-count" aria-live="polite">
          <strong>
            {total} {total === 1 ? "provider" : "providers"}
          </strong>{" "}
          who best fit your preferences
          <button
            type="button"
            className="search-info"
            aria-label="How best fit is ranked"
            aria-expanded={infoOpen}
            aria-controls={noteId}
            onClick={onInfoToggle}
          >
            <InfoIcon />
          </button>
        </p>
        {infoOpen ? (
          <p id={noteId} className="search-count-note">
            Best fit ranks by couples-care focus, your selected insurance, and the soonest opening.
            Sort reorders within that set.
          </p>
        ) : null}
      </div>
      {children}
    </div>
  );
}

function SortControl({
  layout,
  sortKey,
  onSortChange,
}: {
  layout: "mobile" | "desktop";
  sortKey: SortKey;
  onSortChange: (key: SortKey) => void;
}) {
  const sortId = `sort-${layout}`;
  const current = sortOptions.find((option) => option.id === sortKey)?.label ?? "Recommended";

  return (
    <div className="search-sort">
      <label htmlFor={sortId}>Sort:</label>
      <span className="search-sort-value" aria-hidden="true">
        {current}
      </span>
      <Chevron open={false} />
      <select
        id={sortId}
        value={sortKey}
        onChange={(event) => {
          const next = event.target.value;
          if (isSortKey(next)) onSortChange(next);
        }}
      >
        {sortOptions.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function FilterBar({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (filters: Filters) => void;
}) {
  return (
    <div className="search-filters" role="group" aria-label="Filter providers">
      <button
        type="button"
        className="search-chip"
        aria-pressed={filters.availableThisWeek}
        onClick={() => onChange({ ...filters, availableThisWeek: !filters.availableThisWeek })}
      >
        Available this week
      </button>
      <button
        type="button"
        className="search-chip"
        aria-pressed={filters.freeConsult}
        onClick={() => onChange({ ...filters, freeConsult: !filters.freeConsult })}
      >
        Free consultation
      </button>
      <FilterMenu
        label="Specialty"
        options={specialtyOptions}
        selected={filters.specialties}
        onChange={(specialties) => onChange({ ...filters, specialties })}
      />
      <FilterMenu
        label="Approach"
        options={styleOptions}
        selected={filters.styles}
        onChange={(styles) => onChange({ ...filters, styles })}
      />
      {hasActiveFilters(filters) ? (
        <button type="button" className="search-chip-clear" onClick={() => onChange(emptyFilters)}>
          Clear all
        </button>
      ) : null}
    </div>
  );
}

function FilterMenu({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}) {
  function toggle(option: string) {
    onChange(
      selected.includes(option)
        ? selected.filter((value) => value !== option)
        : [...selected, option],
    );
  }

  return (
    <details
      className="search-chip-menu"
      name="filters"
      onKeyDown={(event) => {
        if (event.key !== "Escape") return;
        event.currentTarget.open = false;
        event.currentTarget.querySelector("summary")?.focus();
      }}
    >
      <summary className="search-chip">
        {label}
        {selected.length > 0 ? ` (${selected.length})` : ""}
        <Chevron open={false} />
      </summary>
      <fieldset className="search-chip-panel">
        <legend className="visually-hidden">{label}</legend>
        {options.map((option) => (
          <label key={option}>
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => toggle(option)}
            />
            {option}
          </label>
        ))}
      </fieldset>
    </details>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="search-empty" role="status">
      <p>No providers match those filters. Try removing one.</p>
      <button type="button" className="search-chip-clear" onClick={onClear}>
        Clear filters
      </button>
    </div>
  );
}

function TopPicks({
  layout,
  picks,
  insurance,
}: {
  layout: "mobile" | "desktop";
  picks: Provider[];
  insurance: string;
}) {
  return (
    <section className="search-picks" aria-labelledby={`picks-title-${layout}`}>
      <h3 className="search-picks-title" id={`picks-title-${layout}`}>
        Your top {picks.length === 1 ? "match" : `${picks.length} matches`}
      </h3>
      <ol className="search-picks-grid">
        {picks.map((provider) => (
          <PickCard
            key={provider.id}
            provider={provider}
            why={matchSentence(provider, insurance)}
          />
        ))}
      </ol>
    </section>
  );
}

function PickCard({ provider, why }: { provider: Provider; why: string }) {
  return (
    <li className="search-pick">
      <div className="search-portrait-wrap">
        <img className="search-portrait" src={provider.photo} alt="" width={80} height={80} />
      </div>
      <div className="search-pick-identity">
        <h4>{provider.name}</h4>
        <p>Therapist</p>
        <p>Virtual • Washington</p>
      </div>
      <p className="search-pick-why">
        <strong>Why this fits</strong>
        {why}
      </p>
      <p className="search-bio">{provider.bio}</p>
      <ul className="search-meta">
        <li>
          <img src="/icons/icon-spec.svg" alt="" width={18} height={18} />
          <span>{provider.specialties.join(", ")}</span>
        </li>
        <li>
          <img src="/icons/icon-style.svg" alt="" width={18} height={18} />
          <span>{provider.style.join(", ")}</span>
        </li>
        <li>
          <img src="/icons/icon-ins.svg" alt="" width={18} height={18} />
          <span>Accepts {provider.insuranceCount} insurance carriers</span>
        </li>
      </ul>
      <div className="search-pick-foot">
        <p>Next opening {formatOpeningDay(provider.nextOpeningDate)}</p>
        <button type="button">View profile and book</button>
      </div>
    </li>
  );
}

function ProviderCard({ provider }: { provider: Provider }) {
  return (
    <li className="search-card">
      <div className="search-card-top">
        <div className="search-portrait-wrap">
          <img
            className="search-portrait"
            src={provider.photo}
            alt=""
            width={120}
            height={120}
          />
        </div>
        <div className="search-identity">
          <h3>{provider.name}</h3>
          <p>Therapist</p>
          <p>Virtual • Washington</p>
        </div>
      </div>
      <div className="search-card-body">
        <p className="search-bio">{provider.bio}</p>
        <ul className="search-meta">
          <li>
            <img src="/icons/icon-spec.svg" alt="" width={18} height={18} />
            <span>{provider.specialties.join(", ")}</span>
          </li>
          <li>
            <img src="/icons/icon-style.svg" alt="" width={18} height={18} />
            <span>{provider.style.join(", ")}</span>
          </li>
          <li>
            <img src="/icons/icon-ins.svg" alt="" width={18} height={18} />
            <span>Accepts {provider.insuranceCount} insurance carriers</span>
          </li>
        </ul>
      </div>
      <div className="search-card-foot">
        <div className="search-card-actions">
          <div>
            <p>Next opening {formatOpeningDay(provider.nextOpeningDate)}</p>
            {provider.freeConsult ? (
              <p className="search-consult">Offers free consultations</p>
            ) : null}
          </div>
          <button type="button">View profile and book</button>
        </div>
      </div>
    </li>
  );
}

const statArt: Record<string, string> = {
  leaves: "/art/stat-specialties.png",
  cards: "/art/stat-insurance.png",
  speech: "/art/stat-languages.png",
  session: "/art/stat-session.png",
};

function StatList({
  title,
  art,
  items,
}: {
  title: string;
  art: string;
  items: { share: string; label: string }[];
}) {
  return (
    <article className="search-mix">
      <div className="search-stat-art" data-art={art}>
        <img src={statArt[art]} alt="" />
      </div>
      <h3>{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item.label}>
            <span>{item.share}</span>
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function InfoIcon() {
  return (
    <svg className="search-info-icon" viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="10" cy="10" r="8.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="10" cy="6.5" r="1" fill="currentColor" />
      <path d="M10 9v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg className={open ? "search-faq-chevron is-open" : "search-faq-chevron"} viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M13.35 6.35 8.35 11.35a.5.5 0 0 1-.7 0L2.65 6.35a.5.5 0 0 1 .7-.7L8 10.29l4.65-4.64a.5.5 0 0 1 .7.7Z"
        fill="#353535"
      />
    </svg>
  );
}

