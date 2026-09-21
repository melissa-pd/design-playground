"use client";

import {
  faqs,
  formatStats,
  insurancePlans,
  insuranceStats,
  languageStats,
  providers,
  specialtyStats,
  type Provider,
} from "./data";
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

const portraits: Record<string, { hair: string; skin: string; shirt: string; bob?: boolean }> = {
  "elena-voss": { hair: "#2c211c", skin: "#e8c4a8", shirt: "#f3efe8" },
  "marcus-hale": { hair: "#1a1a1a", skin: "#c48a62", shirt: "#d7e4f2" },
  "priya-nandakumar": { hair: "#1c140f", skin: "#c9845a", shirt: "#efe2d4", bob: true },
  "jonah-ellis": { hair: "#6b4a32", skin: "#f0d0b4", shirt: "#e7efe4" },
  "camille-ortiz": { hair: "#3b2418", skin: "#e2b08a", shirt: "#f6e7ea", bob: true },
  "andre-blake": { hair: "#24180f", skin: "#8d5a3c", shirt: "#e4e7ea" },
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
      <header className="search-header">
        <a className="search-logo" href={`#hero-${layout}`}>
          <img src="/logo.png" alt="Headway" width={160} height={32} />
        </a>
        <div className="search-header-actions">
          <nav className="search-nav" aria-label="Main">
            <button type="button" onClick={findCare}>
              Search providers
            </button>
            <button type="button" onClick={findCare}>
              Find care
            </button>
            <button type="button">For providers</button>
            <button type="button">Company</button>
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
                    <option key={plan}>{plan}</option>
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

      <section className="search-results" id={`results-${layout}`} aria-labelledby={`results-title-${layout}`}>
        <div className="search-results-intro">
          <h2 id={`results-title-${layout}`}>{resultsTitle}</h2>
          <p>
            Our couples therapists in Washington can help you and your partner work through
            relationship challenges. Sessions are affordable, with average savings of 75% and many
            patients paying as little as $0 after insurance.
          </p>
          {variant === "why-this-match" ? (
            <p>Each card leads with why it fits couples care in Washington.</p>
          ) : null}
          {variant === "short-list" && !state.expanded ? (
            <p>A ranked handful for this search, with the rest of the directory one step away.</p>
          ) : null}
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

      <section className="search-about" aria-labelledby={`about-${layout}`}>
        <h2 id={`about-${layout}`}>About our couples therapists in Washington</h2>
        <div className="search-stat-row">
          <article className="search-stat">
            <div className="search-stat-art" data-art="people" aria-hidden="true" />
            <p>Number of therapists serving Washington</p>
            <strong>590+</strong>
          </article>
          <article className="search-stat">
            <div className="search-stat-art" data-art="books" aria-hidden="true" />
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
          <ChairArt />
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
        <div className="search-close-photo" aria-hidden="true" />
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
        Cost may vary based on your location, age, and insurance coverage. Providers in this
        prototype are fictional, and nothing here checks coverage or books a visit.
      </p>

      <footer className="search-footer">
        <div className="search-footer-brand">
          <img src="/logo.png" alt="" width={140} height={28} />
          <p>Find mental health care, covered by insurance.</p>
        </div>
        <div className="search-footer-cols">
          <div>
            <h3>Get care</h3>
            <button type="button" onClick={findCare}>Find a therapist</button>
            <button type="button" onClick={findCare}>Search providers</button>
            <button type="button">Insurance</button>
            <button type="button">FAQs</button>
          </div>
          <div>
            <h3>For providers</h3>
            <button type="button">Join Headway</button>
            <button type="button">Provider resources</button>
            <button type="button">Refer a patient</button>
          </div>
          <div>
            <h3>Company</h3>
            <button type="button">About</button>
            <button type="button">Careers</button>
            <button type="button">Press</button>
          </div>
          <div>
            <h3>Legal</h3>
            <button type="button">Privacy</button>
            <button type="button">Terms</button>
            <button type="button">Accessibility</button>
          </div>
        </div>
      </footer>

      <div className="search-sticky">
        <p>Not sure who&apos;s the right fit? Filter 592 therapists with your preferences</p>
        <button type="button" onClick={findCare}>
          Get started
        </button>
      </div>
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
      <div className="search-card-top">
        <div className="search-portrait-wrap">
          {rank ? <span className="search-rank">{rank}</span> : null}
          <Portrait id={provider.id} />
        </div>
        <div>
          <h3>{provider.name}</h3>
          <p>Therapist</p>
          <p>Virtual • Washington</p>
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
      <ul className="search-meta">
        <li>
          <img src="/icons/icon-spec.svg" alt="" width={18} height={18} />
          <span>{provider.specialties}</span>
        </li>
        <li>
          <img src="/icons/icon-style.svg" alt="" width={18} height={18} />
          <span>{provider.style}</span>
        </li>
        <li>
          <img src="/icons/icon-ins.svg" alt="" width={18} height={18} />
          <span>Accepts {provider.insuranceCount} insurance carriers</span>
        </li>
      </ul>
      <div className="search-card-foot">
        <p>{provider.nextOpening}</p>
        <button type="button">View profile and book</button>
      </div>
    </li>
  );
}

function Portrait({ id }: { id: string }) {
  const look = portraits[id] ?? { hair: "#333", skin: "#e7c2a8", shirt: "#eee" };
  return (
    <svg className="search-portrait" viewBox="0 0 120 120" aria-hidden="true">
      <circle cx="60" cy="60" r="60" fill="#d9e6dc" />
      <ellipse cx="60" cy="118" rx="46" ry="36" fill={look.shirt} />
      <circle cx="60" cy="58" r="28" fill={look.skin} />
      {look.bob ? (
        <path d="M32 58c2-28 16-40 28-40s26 12 28 40c-6 8-14 6-28 6s-22 2-28-6z" fill={look.hair} />
      ) : (
        <path d="M34 62c0-30 12-46 26-46s26 16 26 46c-4-10-12-14-26-14s-22 4-26 14z" fill={look.hair} />
      )}
      <circle cx="50" cy="58" r="2" fill="#3a2a24" />
      <circle cx="70" cy="58" r="2" fill="#3a2a24" />
      <path d="M54 70c4 4 8 4 12 0" fill="none" stroke="#a8745c" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

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
      <div className="search-stat-art" data-art={art} aria-hidden="true" />
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

function ChairArt() {
  return (
    <svg className="search-chair" viewBox="0 0 160 150" aria-hidden="true">
      <ellipse cx="80" cy="132" rx="46" ry="8" fill="#e7efe4" />
      <path d="M48 78c0-28 14-48 32-48s32 20 32 48v28H48V78z" fill="#f4efe6" />
      <path d="M44 104h72v10c0 8-16 14-36 14s-36-6-36-14v-10z" fill="#0b663d" />
      <path d="M58 40c8-16 36-16 44 0" fill="none" stroke="#c47b5a" strokeWidth="6" strokeLinecap="round" />
      <circle cx="80" cy="34" r="10" fill="#e8c4a8" />
    </svg>
  );
}
