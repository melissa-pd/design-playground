#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

function asRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? value
    : undefined;
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function dedupe(values) {
  return [...new Set(values.filter(isNonEmptyString))];
}

function firstString(...values) {
  for (const value of values) {
    if (isNonEmptyString(value)) return value;
    if (Array.isArray(value)) {
      const first = value.find(isNonEmptyString);
      if (first) return first;
    }
  }
  return undefined;
}

function valueFromRecord(value, keys) {
  if (isNonEmptyString(value)) return value;
  const record = asRecord(value);
  if (!record) return undefined;

  return firstString(...keys.map((key) => record[key]));
}

function normalizeStringList(values, keys = ["value"]) {
  if (!Array.isArray(values)) return [];
  return dedupe(
    values.map((value) => valueFromRecord(value, keys)).filter(isNonEmptyString),
  );
}

function dominantFamily(styles, contexts) {
  const counts = new Map();

  for (const style of styles) {
    const record = asRecord(style);
    const family = record?.family;
    const context = String(record?.context ?? "").toLowerCase();
    if (!isNonEmptyString(family) || !contexts.some((item) => context.includes(item))) {
      continue;
    }
    counts.set(family, (counts.get(family) ?? 0) + 1);
  }

  return [...counts.entries()].sort((first, second) => second[1] - first[1])[0]?.[0];
}

function firstFamily(styles, contexts) {
  for (const style of styles) {
    const record = asRecord(style);
    const family = record?.family;
    const context = String(record?.context ?? "").toLowerCase();
    if (
      isNonEmptyString(family) &&
      contexts.some((item) => context.includes(item))
    ) {
      return family;
    }
  }
  return undefined;
}

function normalizeTypographyStyles(values) {
  if (!Array.isArray(values)) return [];

  return values.flatMap((value) => {
    const record = asRecord(value);
    if (!record || !isNonEmptyString(record.family)) return [];

    return [
      {
        context: isNonEmptyString(record.context) ? record.context : "unknown",
        family: record.family,
        fallbacks: isNonEmptyString(record.fallbacks) ? record.fallbacks : null,
        size: isNonEmptyString(record.size) ? record.size : null,
        weight:
          typeof record.weight === "number" || isNonEmptyString(record.weight)
            ? record.weight
            : null,
        lineHeight:
          typeof record.lineHeight === "number" || isNonEmptyString(record.lineHeight)
            ? record.lineHeight
            : null,
        spacing: isNonEmptyString(record.spacing) ? record.spacing : null,
        transform: isNonEmptyString(record.transform) ? record.transform : null,
      },
    ];
  });
}

export function normalizeExtraction(raw, sourceUrl) {
  const root = asRecord(raw) ?? {};
  const colors = asRecord(root.colors) ?? {};
  const semanticColors = asRecord(colors.semantic) ?? {};
  const typography = asRecord(root.typography) ?? {};
  const typographyStyles = normalizeTypographyStyles(typography.styles);
  const spacing = asRecord(root.spacing) ?? {};
  const borderRadius =
    asRecord(root.borderRadius) ?? asRecord(root.borders) ?? {};
  const cssVariables = asRecord(colors.cssVariables) ?? {};

  const normalizedCssVariables = Object.fromEntries(
    Object.entries(cssVariables).flatMap(([name, value]) => {
      const normalizedValue = valueFromRecord(value, ["value", "normalized", "color"]);
      return normalizedValue ? [[name, normalizedValue]] : [];
    }),
  );

  const headingFont = firstString(
    typography.headingFont,
    typography.heading,
    firstFamily(typographyStyles, ["heading", "display", "hero"]),
  );
  const bodyFont = firstString(
    typography.bodyFont,
    typography.body,
    dominantFamily(typographyStyles, [
      "body",
      "paragraph",
      "button",
      "link",
      "caption",
      "input",
    ]),
    dominantFamily(typographyStyles, ["heading"]),
  );

  return {
    source: {
      url: firstString(root.url, sourceUrl) ?? sourceUrl,
      extractedAt:
        firstString(root.extractedAt, new Date().toISOString()) ??
        new Date().toISOString(),
      extractor: "dembrandt",
      normalizer: "design-playground-v2",
    },
    colors: {
      primary: firstString(
        colors.primary,
        colors.brand,
        colors.main,
        semanticColors.primary,
      ),
      secondary: firstString(colors.secondary, semanticColors.secondary),
      accent: firstString(
        colors.accent,
        colors.highlight,
        semanticColors.accent,
      ),
      background: firstString(
        colors.background,
        colors.surface,
        semanticColors.background,
      ),
      foreground: firstString(
        colors.foreground,
        colors.text,
        semanticColors.foreground,
      ),
      palette: normalizeStringList(colors.palette, [
        "normalized",
        "value",
        "color",
      ]),
      cssVariables: normalizedCssVariables,
    },
    typography: {
      headingFont,
      bodyFont,
      monoFont: firstString(typography.monoFont, typography.mono),
      styles: typographyStyles,
    },
    spacing: {
      scale: dedupe([
        ...normalizeStringList(spacing.scale),
        ...normalizeStringList(spacing.commonValues, ["px", "value"]),
      ]),
    },
    radius: {
      scale: dedupe([
        ...normalizeStringList(borderRadius.radius),
        ...normalizeStringList(borderRadius.values, ["value"]),
      ]),
    },
    shadows: {
      scale: normalizeStringList(root.shadows, ["shadow", "value"]),
    },
  };
}

function pushLine(lines, name, value) {
  if (isNonEmptyString(value)) lines.push(`  ${name}: ${value};`);
}

function fontValue(value) {
  if (!isNonEmptyString(value)) return value;
  return /\s/.test(value) ? `"${value}"` : value;
}

export function generateCssVars(normalized) {
  const lines = [":root {"];
  pushLine(lines, "--color-primary", normalized.colors.primary);
  pushLine(lines, "--color-secondary", normalized.colors.secondary);
  pushLine(lines, "--color-accent", normalized.colors.accent);
  pushLine(lines, "--color-background", normalized.colors.background);
  pushLine(lines, "--color-foreground", normalized.colors.foreground);
  pushLine(lines, "--font-heading", fontValue(normalized.typography.headingFont));
  pushLine(lines, "--font-body", fontValue(normalized.typography.bodyFont));
  pushLine(lines, "--font-mono", fontValue(normalized.typography.monoFont));

  normalized.spacing.scale.forEach((value, index) => {
    pushLine(lines, `--space-${index + 1}`, value);
  });
  normalized.radius.scale.forEach((value, index) => {
    pushLine(lines, `--radius-${index + 1}`, value);
  });
  normalized.shadows.scale.forEach((value, index) => {
    pushLine(lines, `--shadow-${index + 1}`, value);
  });
  Object.entries(normalized.colors.cssVariables).forEach(([name, value]) => {
    pushLine(lines, name.startsWith("--") ? name : `--${name}`, value);
  });

  lines.push("}");
  return `${lines.join("\n")}\n`;
}

function parseCwd(args) {
  const cwdIndex = args.indexOf("--cwd");
  if (cwdIndex === -1) return process.cwd();
  const cwd = args[cwdIndex + 1];
  if (!cwd) throw new Error("--cwd requires a path");
  return resolve(cwd);
}

export async function writeNormalizedArtifacts(cwd) {
  const rawPath = resolve(cwd, ".extract-design-system/raw.json");
  const normalizedPath = resolve(cwd, ".extract-design-system/normalized.json");
  const designSystemDirectory = resolve(cwd, "design-system");
  const tokenPath = resolve(designSystemDirectory, "tokens.json");
  const cssPath = resolve(designSystemDirectory, "tokens.css");

  const raw = JSON.parse(await readFile(rawPath, "utf8"));
  const normalized = normalizeExtraction(raw, raw.url);
  const serialized = `${JSON.stringify(normalized, null, 2)}\n`;

  await mkdir(resolve(cwd, ".extract-design-system"), { recursive: true });
  await mkdir(designSystemDirectory, { recursive: true });
  await Promise.all([
    writeFile(normalizedPath, serialized),
    writeFile(tokenPath, serialized),
    writeFile(cssPath, generateCssVars(normalized)),
  ]);

  return { rawPath, normalizedPath, tokenPath, cssPath, normalized };
}

const isMain =
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (isMain) {
  try {
    const cwd = parseCwd(process.argv.slice(2));
    const result = await writeNormalizedArtifacts(cwd);
    console.log(
      JSON.stringify(
        {
          normalizedPath: result.normalizedPath,
          tokenPath: result.tokenPath,
          cssPath: result.cssPath,
          counts: {
            palette: result.normalized.colors.palette.length,
            cssVariables: Object.keys(result.normalized.colors.cssVariables).length,
            typographyStyles: result.normalized.typography.styles.length,
            spacing: result.normalized.spacing.scale.length,
            radius: result.normalized.radius.scale.length,
            shadows: result.normalized.shadows.scale.length,
          },
        },
        null,
        2,
      ),
    );
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
