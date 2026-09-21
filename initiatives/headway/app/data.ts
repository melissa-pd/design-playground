export const insurancePlans = [
  "Aetna",
  "Cigna",
  "Blue Cross Blue Shield",
  "Kaiser Permanente",
  "Self-pay",
] as const;

export type InsurancePlan = (typeof insurancePlans)[number];

export type Provider = {
  id: string;
  name: string;
  credentials: string;
  format: string;
  bio: string;
  specialties: string;
  style: string;
  insuranceCount: number;
  nextOpening: string;
  initials: string;
  tone: string;
};

export const providers: Provider[] = [
  {
    id: "elena-voss",
    name: "Elena Voss",
    credentials: "LMFT",
    format: "Virtual · Washington",
    bio: "Elena helps couples slow conflict down and say the thing they have been circling. Sessions are structured, warm, and practical.",
    specialties: "Relationship issues, communication, life transitions",
    style: "Warm, structured, direct",
    insuranceCount: 4,
    nextOpening: "Next opening Tuesday",
    initials: "EV",
    tone: "#d0eee0",
  },
  {
    id: "marcus-hale",
    name: "Marcus Hale",
    credentials: "LMFT",
    format: "Virtual · Washington",
    bio: "Marcus works with partners who want repair after a rupture, including affairs, distance, and the quiet drift that shows up as logistics.",
    specialties: "Couples conflict, trust, family dynamics",
    style: "Steady, curious, plainspoken",
    insuranceCount: 6,
    nextOpening: "Next opening Thursday",
    initials: "MH",
    tone: "#ffcfbd",
  },
  {
    id: "priya-nandakumar",
    name: "Priya Nandakumar",
    credentials: "LCSW",
    format: "Virtual · Washington",
    bio: "Priya focuses on how stress, culture, and family expectation land inside a relationship, and what the two of you want instead.",
    specialties: "Anxiety, cultural identity, relationship issues",
    style: "Affirming, calm, specific",
    insuranceCount: 5,
    nextOpening: "Next opening Friday",
    initials: "PN",
    tone: "#a3d1ff",
  },
  {
    id: "jonah-ellis",
    name: "Jonah Ellis",
    credentials: "LMHC",
    format: "Virtual · Washington",
    bio: "Jonah is a fit for couples who like homework between sessions: one conversation to practice, then a review of what actually happened.",
    specialties: "Communication, anger, life transitions",
    style: "Direct, coaching, collaborative",
    insuranceCount: 3,
    nextOpening: "Next opening next Monday",
    initials: "JE",
    tone: "#fce382",
  },
  {
    id: "camille-ortiz",
    name: "Camille Ortiz",
    credentials: "PsyD",
    format: "Virtual · Washington",
    bio: "Camille works with LGBTQ+ couples and mixed-orientation partnerships on intimacy, repair, and decisions that have been postponed.",
    specialties: "Intimacy, identity, relationship issues",
    style: "Affirming, inquisitive, gentle",
    insuranceCount: 4,
    nextOpening: "Next opening Wednesday",
    initials: "CO",
    tone: "#e08a6b",
  },
  {
    id: "andre-blake",
    name: "Andre Blake",
    credentials: "LMFT",
    format: "Virtual · Washington",
    bio: "Andre helps couples who are high-functioning at work and stuck at home. The work is concrete: patterns, pauses, and a plan for the week.",
    specialties: "Work stress, conflict, parenting",
    style: "Practical, direct, encouraging",
    insuranceCount: 7,
    nextOpening: "Next opening Thursday",
    initials: "AB",
    tone: "#a1dec2",
  },
];

export const faqs = [
  {
    id: "cost",
    question: "How much does couples therapy cost in Washington?",
    answer:
      "With insurance, many people pay a copay, and some sessions are $0. Self-pay varies by provider. A cost estimate uses your plan, not a guess from the directory.",
  },
  {
    id: "choose",
    question: "How do I choose a couples therapy specialist in Washington?",
    answer:
      "Start with format, insurance, and the next opening you can both attend. Then read how they work with couples, not only the list of specialties.",
  },
  {
    id: "prepare",
    question: "How should I prepare for couples therapy sessions?",
    answer:
      "Agree on one conversation you want help with. You do not need a polished story. The first session is for fit, goals, and whether you want to continue together.",
  },
];

export const specialtyMix = [
  { label: "Relationship issues", share: "64%" },
  { label: "Anxiety", share: "41%" },
  { label: "Family therapy", share: "22%" },
  { label: "Life transitions", share: "18%" },
];

export const clientFormats = [
  { label: "Virtual", share: "78%" },
  { label: "In person", share: "22%" },
];
