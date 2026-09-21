"use client";

import { clientFormats, faqs, insurancePlans, providers, specialtyMix, type Provider } from "./data";
import type { VariantId } from "./variants";

const pageSize = 4;
const shortListSize = 3;

export type SearchState = {
  zip: string;
  insurance: string;
  page: number;
  expanded: boolean;
  openFaq: string | null;
};

type SearchPageProps = {
  layout: "mobile" | "desktop";
  variant: VariantId;
  state: SearchState;
  onZipChange: (zip: string) => void;
  onInsuranceChange: (insurance: string) => void;
  onPageChange: (page: number) => void;
  onExpandedChange: (expanded: boolean) => void;
  onFaqChange: (id: string | null) => void;
};

export function SearchPage({
  layout,
  variant,
  state,
  onZipChange,
  onInsuranceChange,
  onPageChange,
  onExpandedChange,
  onFaqChange,
}: SearchPageProps) {
  const directory = variant !== "short-list" || state.expanded;
  const pageCount = Math.ceil(providers.length / pageSize);
  const page = Math.min(state.page, pageCount);
  const visible = directory
    ? variant === "short-list"
      ? providers
      : providers.slice((page - 1) * pageSize, page * pageSize)
    : providers.slice(0, shortListSize);
  const rangeStart = directory && variant !== "short-list" ? (page - 1) * pageSize + 1 : 1;
  const rangeEnd = rangeStart + visible.length - 1;
  const resultsTitle =
    variant === "short-list" && !state.expanded
      ? "Three couples therapists to start with"
      : "Top couples therapists in Washington";

  function findCare() {
    document.getElementById(`results-${layout}`)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <div className="search" data-layout={layout}>
      <header className="search-bar">
        <p className="search-wordmark">Headway</p>
        <p className="search-bar-note">Couples therapy</p>
      </header>

      <section className="search-hero" aria-labelledby={`hero-${layout}`}>
        <div className="search-hero-copy">
          <h1 id={`hero-${layout}`}>Book couples therapy, covered by insurance</h1>
          <p className="search-lede">Couples therapists in Washington</p>
          <form
            className="search-form"
            onSubmit={(event) => {
              event.preventDefault();
              findCare();
            }}
          >
            <label>
              Zip code
              <input
                inputMode="numeric"
                autoComplete="postal-code"
                maxLength={5}
                value={state.zip}
                onChange={(event) => onZipChange(event.target.value.replace(/\D/g, "").slice(0, 5))}
              />
            </label>
            <label>
              Insurance
              <select
                value={state.insurance}
                onChange={(event) => onInsuranceChange(event.target.value)}
              >
                {insurancePlans.map((plan) => (
                  <option key={plan}>{plan}</option>
                ))}
              </select>
            </label>
            <button type="submit">Find care</button>
          </form>
          <p className="search-form-note">
            Near {state.zip || "your zip"} · {state.insurance} · Washington
          </p>
        </div>
        <SessionArt />
      </section>

      <section className="search-cost" aria-label="Cost estimate">
        <p>Most couples pay $0–$40 per session with {state.insurance}.</p>
        <p>Self-pay visits in this prototype are typically $120–$180.</p>
      </section>

      <section className="search-results" id={`results-${layout}`} aria-labelledby={`results-title-${layout}`}>
        <div className="search-results-head">
          <h2 id={`results-title-${layout}`}>{resultsTitle}</h2>
          {variant === "why-this-match" ? (
            <p>Each card leads with why it fits couples care in Washington.</p>
          ) : null}
          {variant === "short-list" && !state.expanded ? (
            <p>A ranked handful for this search, with the rest of the directory one step away.</p>
          ) : (
            <p>
              Showing {rangeStart}–{rangeEnd} of {providers.length} fictional therapists
            </p>
          )}
        </div>
        <ol className="search-grid">
          {visible.map((provider, index) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              insurance={state.insurance}
              variant={variant}
              rank={variant === "short-list" && !state.expanded ? index + 1 : null}
            />
          ))}
        </ol>
        {variant === "short-list" ? (
          <button
            type="button"
            className="search-quiet"
            onClick={() => onExpandedChange(!state.expanded)}
          >
            {state.expanded ? "Show the short list" : "See more therapists"}
          </button>
        ) : (
          <nav className="search-pager" aria-label="Results pages">
            {Array.from({ length: pageCount }, (_, index) => {
              const number = index + 1;
              const current = number === page;
              return (
                <button
                  key={number}
                  type="button"
                  aria-current={current ? "page" : undefined}
                  onClick={() => onPageChange(number)}
                >
                  {number}
                </button>
              );
            })}
          </nav>
        )}
      </section>

      <section className="search-proof" aria-labelledby={`proof-${layout}`}>
        <h2 id={`proof-${layout}`}>Couples therapy in Washington</h2>
        <dl>
          <div>
            <dt>Therapists</dt>
            <dd>590+</dd>
          </div>
          <div>
            <dt>Years in practice</dt>
            <dd>10</dd>
          </div>
        </dl>
        <div className="search-mix">
          <h3>Specialties</h3>
          <ul>
            {specialtyMix.map((item) => (
              <li key={item.label}>
                <span>{item.label}</span>
                <span>{item.share}</span>
              </li>
            ))}
          </ul>
          <h3>How they see clients</h3>
          <ul>
            {clientFormats.map((item) => (
              <li key={item.label}>
                <span>{item.label}</span>
                <span>{item.share}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="search-faq" aria-labelledby={`faq-${layout}`}>
        <h2 id={`faq-${layout}`}>Questions about couples care</h2>
        {faqs.map((faq) => {
          const open = state.openFaq === faq.id;
          return (
            <div key={faq.id} className="search-faq-item">
              <button
                type="button"
                aria-expanded={open}
                onClick={() => onFaqChange(open ? null : faq.id)}
              >
                {faq.question}
              </button>
              {open ? <p>{faq.answer}</p> : null}
            </div>
          );
        })}
      </section>

      <section className="search-close" aria-labelledby={`close-${layout}`}>
        <h2 id={`close-${layout}`}>Find the right couples therapist</h2>
        <p>Start with zip and insurance, then choose someone whose next opening works.</p>
        <button type="button" onClick={findCare}>
          Find care
        </button>
      </section>

      <nav className="search-crumbs" aria-label="Breadcrumb">
        <ol>
          <li>Home</li>
          <li>Therapists</li>
          <li>Washington</li>
          <li>Couples</li>
        </ol>
      </nav>
      <p className="search-footnote">
        Costs are estimates for this prototype. Nothing here checks coverage or books a visit.
      </p>
      <footer className="search-footer">
        <p>Headway concept</p>
        <p>Fictional providers · Not a Headway product</p>
      </footer>
    </div>
  );
}

function ProviderCard({
  provider,
  insurance,
  variant,
  rank,
}: {
  provider: Provider;
  insurance: string;
  variant: VariantId;
  rank: number | null;
}) {
  const reasons = [
    "Couples care",
    "Washington",
    insurance === "Self-pay" ? "Self-pay welcome" : `Takes ${insurance}`,
    provider.nextOpening,
  ];

  return (
    <li className="search-card">
      {rank ? <p className="search-rank">Rank {rank}</p> : null}
      <div className="search-card-top">
        <div className="search-portrait" style={{ background: provider.tone }} aria-hidden="true">
          {provider.initials}
        </div>
        <div>
          <h3>{provider.name}</h3>
          <p>Therapist · {provider.credentials}</p>
          <p>{provider.format}</p>
        </div>
      </div>
      {variant === "why-this-match" ? (
        <ul className="search-reasons" aria-label={`Why ${provider.name} matches`}>
          {reasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      ) : null}
      <p className="search-bio">{provider.bio}</p>
      <p>
        <span className="search-label">Specialties</span> {provider.specialties}
      </p>
      <p>
        <span className="search-label">Style</span> {provider.style}
      </p>
      <p>Accepts {provider.insuranceCount} insurance carriers</p>
      <p className="search-opening">Next opening {provider.nextOpening}</p>
      <button type="button">View profile and book</button>
    </li>
  );
}

function SessionArt() {
  return (
    <svg className="search-art" viewBox="0 0 420 320" role="img" aria-label="Two people in a therapy session">
      <rect width="420" height="320" rx="16" fill="#d0eee0" />
      <rect x="46" y="168" width="150" height="96" rx="12" fill="#ffffff" />
      <rect x="224" y="168" width="150" height="96" rx="12" fill="#ffffff" />
      <circle cx="121" cy="118" r="36" fill="#13aa65" />
      <circle cx="299" cy="118" r="36" fill="#0f8752" />
      <rect x="168" y="214" width="84" height="10" rx="5" fill="#101010" opacity="0.12" />
    </svg>
  );
}
