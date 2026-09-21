import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Couples therapy search | Headway variant explorer",
  description:
    "A speculative explorer for a couples therapy search page, with mobile, desktop, and a few design variants.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
