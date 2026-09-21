import assert from "node:assert/strict";
import test from "node:test";

import {
  generateCssVars,
  normalizeExtraction,
} from "./normalize-extraction.mjs";

const rawFixture = {
  url: "https://example.com/",
  extractedAt: "2026-09-21T00:00:00.000Z",
  colors: {
    semantic: {
      primary: "rgb(53, 53, 53)",
      secondary: "rgba(0, 0, 0, 0)",
    },
    palette: [
      { color: "rgb(53, 53, 53)", normalized: "#353535", count: 20 },
      { color: "rgb(19, 170, 101)", normalized: "#13aa65", count: 10 },
    ],
    cssVariables: {
      "--hlx-color-green-800": {
        value: "#0a663d",
        lch: "lch(37.67% 38.99 155.25)",
      },
      "--hlx-color-green-400A": {
        value: "#12ab66e0",
        oklch: "oklch(65.31% 0.155 155.85 / 0.878)",
      },
    },
  },
  typography: {
    styles: [
      {
        context: "heading-1",
        family: "Honey Regular",
        size: "44px (2.75rem)",
        weight: 400,
        lineHeight: "1.18",
      },
      {
        context: "button",
        family: "PostGrotesk",
        size: "16px (1rem)",
        weight: 500,
        lineHeight: "1.38",
      },
      {
        context: "caption",
        family: "PostGrotesk",
        size: "14px (0.875rem)",
        weight: 400,
        lineHeight: "1.29",
      },
    ],
  },
  spacing: {
    commonValues: [
      { px: "4px", numericValue: 4 },
      { px: "8px", numericValue: 8 },
    ],
  },
  borderRadius: {
    values: [
      { value: "4px", count: 10 },
      { value: "9999px", count: 2 },
    ],
  },
  shadows: [
    {
      shadow: "rgba(0, 0, 0, 0.07) 0px 2px 10px 0px",
      count: 11,
    },
  ],
};

test("normalizes Dembrandt object-shaped CSS output without dropping values", () => {
  const normalized = normalizeExtraction(rawFixture, rawFixture.url);

  assert.deepEqual(normalized.colors.palette, ["#353535", "#13aa65"]);
  assert.deepEqual(normalized.colors.cssVariables, {
    "--hlx-color-green-800": "#0a663d",
    "--hlx-color-green-400A": "#12ab66e0",
  });
  assert.equal(normalized.typography.headingFont, "Honey Regular");
  assert.equal(normalized.typography.bodyFont, "PostGrotesk");
  assert.equal(normalized.typography.styles.length, 3);
  assert.deepEqual(normalized.spacing.scale, ["4px", "8px"]);
  assert.deepEqual(normalized.radius.scale, ["4px", "9999px"]);
  assert.deepEqual(normalized.shadows.scale, [
    "rgba(0, 0, 0, 0.07) 0px 2px 10px 0px",
  ]);
});

test("generates CSS for preserved Helix variables and corrected fonts", () => {
  const normalized = normalizeExtraction(rawFixture, rawFixture.url);
  const css = generateCssVars(normalized);

  assert.match(css, /--font-heading: "Honey Regular";/);
  assert.match(css, /--font-body: PostGrotesk;/);
  assert.match(css, /--radius-1: 4px;/);
  assert.match(
    css,
    /--shadow-1: rgba\(0, 0, 0, 0\.07\) 0px 2px 10px 0px;/,
  );
  assert.match(css, /--hlx-color-green-800: #0a663d;/);
  assert.match(css, /--hlx-color-green-400A: #12ab66e0;/);
});
