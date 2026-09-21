import { Suspense } from "react";
import { Explorer } from "./explorer";

export default function HomePage() {
  return (
    <Suspense fallback={<p className="explorer-loading">Loading the search page…</p>}>
      <Explorer />
    </Suspense>
  );
}
