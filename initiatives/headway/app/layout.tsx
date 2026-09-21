import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "A clearer path to care | Headway search concept",
  description:
    "A speculative, code-first product design concept for transparent therapist search results.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
