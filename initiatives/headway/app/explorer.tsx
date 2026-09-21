"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { insurancePlans } from "./data";
import { emptyFilters, type Filters, type SortKey } from "./results";
import { SearchPage, type SearchState } from "./search-page";
import { isVariantId, isViewportId, variants, type VariantId, type ViewportId } from "./variants";

const frameWidth = {
  mobile: 390,
  desktop: 1440,
} as const;

export function Explorer() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const requestedViewport = searchParams.get("viewport");
  const requestedVariant = searchParams.get("variant");
  const viewport: ViewportId = isViewportId(requestedViewport) ? requestedViewport : "both";
  const variant: VariantId = isVariantId(requestedVariant) ? requestedVariant : "sort";
  const hypothesis = variants.find((item) => item.id === variant)?.hypothesis ?? variants[0].hypothesis;

  const [zip, setZip] = useState("98101");
  const [insurance, setInsurance] = useState<string>(insurancePlans[0]);
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>("recommended");
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef(viewport);
  const variantRef = useRef(variant);
  const [scale, setScale] = useState(1);
  viewportRef.current = viewport;
  variantRef.current = variant;

  const frames = viewport === "both" ? (["mobile", "desktop"] as const) : ([viewport] as const);
  const naturalWidth = frames.reduce((sum, frame) => sum + frameWidth[frame], 0) + (frames.length - 1) * 28;

  const state: SearchState = useMemo(
    () => ({ zip, insurance, page, openFaq, sortKey, filters }),
    [zip, insurance, page, openFaq, sortKey, filters],
  );

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const measure = () => {
      const available = stage.clientWidth - 48;
      setScale(Math.min(1, available / naturalWidth));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    return () => observer.disconnect();
  }, [naturalWidth]);

  function replaceQuery(next: { viewport?: ViewportId; variant?: VariantId }) {
    const params = new URLSearchParams(window.location.search);
    const nextViewport = next.viewport ?? viewportRef.current;
    const nextVariant = next.variant ?? variantRef.current;
    viewportRef.current = nextViewport;
    variantRef.current = nextVariant;
    params.set("viewport", nextViewport);
    params.set("variant", nextVariant);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function selectVariant(next: VariantId) {
    setPage(1);
    setSortKey("recommended");
    setFilters(emptyFilters);
    replaceQuery({ variant: next });
  }

  return (
    <div className="explorer">
      <aside className="explorer-rail">
        <p className="explorer-kicker">Headway</p>
        <p className="explorer-title">Search page</p>
        <fieldset>
          <legend>Viewport</legend>
          <div className="explorer-viewports">
            {(["mobile", "desktop", "both"] as const).map((option) => (
              <label key={option}>
                <input
                  type="radio"
                  name="viewport"
                  value={option}
                  checked={viewport === option}
                  onChange={() => replaceQuery({ viewport: option })}
                />
                {option === "mobile" ? "Mobile" : option === "desktop" ? "Desktop" : "Both"}
              </label>
            ))}
          </div>
        </fieldset>
        <label className="explorer-variant">
          Variant
          <select
            value={variant}
            onChange={(event) => {
              const next = event.target.value;
              if (isVariantId(next)) selectVariant(next);
            }}
          >
            {variants.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <p className="explorer-hypothesis">{hypothesis}</p>
      </aside>
      <div className="explorer-stage" ref={stageRef}>
        <div className="explorer-frames" style={{ gap: 28 * scale }}>
          {frames.map((frame) => (
            <DeviceFrame key={frame} layout={frame} scale={scale}>
              <SearchPage
                layout={frame}
                variant={variant}
                state={state}
                onZipChange={setZip}
                onInsuranceChange={(next) => {
                  setInsurance(next);
                  setPage(1);
                }}
                onPageChange={setPage}
                onSortChange={(next) => {
                  setSortKey(next);
                  setPage(1);
                }}
                onFiltersChange={(next) => {
                  setFilters(next);
                  setPage(1);
                }}
                onFaqChange={setOpenFaq}
              />
            </DeviceFrame>
          ))}
        </div>
      </div>
    </div>
  );
}

function DeviceFrame({
  layout,
  scale,
  children,
}: {
  layout: "mobile" | "desktop";
  scale: number;
  children: React.ReactNode;
}) {
  const width = frameWidth[layout];

  return (
    <figure className="explorer-slot" style={{ width: width * scale }}>
      <figcaption>{layout === "mobile" ? "Mobile · 390" : "Desktop · 1440"}</figcaption>
      <div className="explorer-frame" style={{ width, zoom: scale }}>
        {children}
      </div>
    </figure>
  );
}
