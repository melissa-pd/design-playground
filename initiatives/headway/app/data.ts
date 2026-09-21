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
    nextOpening: "Next opening Tuesday 9/22",
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
    nextOpening: "Next opening Thursday 9/24",
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
    nextOpening: "Next opening Friday 9/25",
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
    nextOpening: "Next opening Monday 9/28",
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
    nextOpening: "Next opening Wednesday 9/23",
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
    nextOpening: "Next opening Thursday 10/1",
    initials: "AB",
    tone: "#a1dec2",
  },
];

export const faqs = [
  {
    id: "kind",
    question: "What kind of therapy is best for couples?",
    answer:
      "Couples therapy helps partners improve communication, resolve conflicts, and build stronger relationships. Approaches like the Gottman Method and Emotionally Focused Therapy can be effective.",
  },
  {
    id: "cost",
    question: "How much does couples therapy cost in Washington?",
    answer:
      "Once you choose a therapist and enter your insurance details, a real product would verify coverage and estimate in-network session costs. This prototype does not check a plan. Patients in the reference page save an average of 75%, and many pay as little as $0.",
  },
  {
    id: "covered",
    question: "Is couples therapy covered by insurance in Washington?",
    answer:
      "Most plans include some mental health coverage, and many include couples therapy. Enter a plan on the search to see who lists it. Nothing here verifies benefits or books a visit.",
  },
];

export const specialtyStats = [
  { share: "98%", label: "Anxiety" },
  { share: "94%", label: "Depression" },
  { share: "88%", label: "Stress management" },
  { share: "88%", label: "Relationship issues" },
  { share: "83%", label: "Trauma" },
];

export const insuranceStats = [
  { share: "98%", label: "Aetna" },
  { share: "90%", label: "Regence BlueShield of Washington" },
  { share: "87%", label: "Carelon Behavioral Health" },
  { share: "86%", label: "Cigna" },
  { share: "49%", label: "Providence Health Plan" },
];

export const languageStats = [
  { share: "99%", label: "English" },
  { share: "5%", label: "Spanish" },
  { share: "2%", label: "Mandarin" },
  { share: "1%", label: "French" },
  { share: "1%", label: "Arabic" },
];

export const formatStats = [
  { share: "88%", label: "Online only" },
  { share: "12%", label: "In-person or online" },
];
