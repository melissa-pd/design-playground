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
  photo: string;
  bio: string;
  specialties: string;
  style: string;
  insuranceCount: number;
  nextOpening: string;
  freeConsult?: boolean;
};

export const providers: Provider[] = [
  {
    id: "patricia-trama",
    name: "Patricia Trama",
    photo: "/providers/patricia-trama.png",
    bio: "You are in the right place. I work with a diverse population promoting ease in communication, conflict resolution, intimacy issues, family dynamics, and life transitions. I am an LGBTQA+ ally.",
    specialties: "Relationship issues, ADD/ADHD, Anger management, Anxiety, Bipolar disorder",
    style: "Affirming, Direct, Inquisitive",
    insuranceCount: 4,
    nextOpening: "Next opening Tuesday 9/22",
  },
  {
    id: "annmarie-carr",
    name: "Annmarie Carr",
    photo: "/providers/annmarie-carr.png",
    bio: "For more than twenty years, I have had the privilege of walking alongside adolescents, adults, and couples during some of the most difficult and meaningful seasons of their lives. I believe that sometimes it can be…",
    specialties: "Relationship issues, ADD/ADHD, Anger management, Anxiety, Bipolar disorder",
    style: "Empowering, Open-minded, Warm",
    insuranceCount: 4,
    nextOpening: "Next opening Tuesday 9/22",
  },
  {
    id: "lacey-thompson",
    name: "Lacey Thompson",
    photo: "/providers/lacey-thompson.png",
    bio: "“Recognizing that there is no universal manual for life, Lacey believes that through supportive collaboration, individuals can develop a personalized blueprint that honors autonomy while strengthening self-awareness and a",
    specialties: "Relationship issues, ADD/ADHD, Anger management, Anxiety, Bipolar disorder",
    style: "Empowering, Energetic, Warm",
    insuranceCount: 6,
    nextOpening: "Next opening Tuesday 9/22",
    freeConsult: true,
  },
  {
    id: "erika-preston",
    name: "Erika Preston",
    photo: "/providers/erika-preston.png",
    bio: "I'm Erika Preston, an LMHC with over 11 years of experience in the field. Throughout my career, I've had the privilege of working in a variety of settings, allowing me to develop a diverse skill set and a deep…",
    specialties: "Relationship issues, Anxiety, Bipolar disorder, Depression, Family issues",
    style: "Affirming, Solution-oriented, Warm",
    insuranceCount: 12,
    nextOpening: "Next opening Tuesday 9/22",
  },
  {
    id: "charles-codner",
    name: "Charles Codner",
    photo: "/providers/charles-codner.png",
    bio: "Hello, I’m Charles, a Licensed Independent Clinical Social Worker (LICSW) dedicated to helping adults build healthier, more fulfilling lives. I work with individuals and couples facing anxiety, depression, trauma,…",
    specialties: "Relationship issues, Anxiety, Bipolar disorder, Chronic conditions, Cultural & ethnic issues",
    style: "Energetic, Humorous, Warm",
    insuranceCount: 6,
    nextOpening: "Next opening Monday 9/21",
    freeConsult: true,
  },
  {
    id: "maddison-meijome",
    name: "Maddison Meijome",
    photo: "/providers/maddison-meijome.png",
    bio: "“I specialize in supporting clients throughout the perinatal period, including pregnancy and postpartum...”",
    specialties: "Relationship issues, ADD/ADHD, Anxiety, Cultural & ethnic issues, Family issues",
    style: "Empowering, Inquisitive, Participatory",
    insuranceCount: 7,
    nextOpening: "Next opening Tuesday 9/22",
  },
  {
    id: "krystal-boza",
    name: "Krystal Boza",
    photo: "/providers/krystal-boza.png",
    bio: "Krystal is known for her warm, no-nonsense approach. She doesn't sit in silence or rely on clinical jargon.",
    specialties: "Relationship issues, Anxiety, Family issues, Identity issues, LGBTQIA+",
    style: "Challenging, Holistic, Open-minded",
    insuranceCount: 8,
    nextOpening: "Next opening Tuesday 9/22",
    freeConsult: true,
  },
  {
    id: "ronald-nussli",
    name: "Ronald Nussli",
    photo: "/providers/ronald-nussli.png",
    bio: "My approach is to engage people with unconditional regard and to utilize Rational Emotive therapy as appropriate.",
    specialties: "Relationship issues, ADD/ADHD, Anger management, Anxiety, Bipolar disorder",
    style: "Affirming, Direct, Warm",
    insuranceCount: 12,
    nextOpening: "Next opening Tuesday 9/22",
  },
  {
    id: "karina-pickard",
    name: "Karina Pickard",
    photo: "/providers/karina-pickard.png",
    bio: "As a former Division I athlete, I understand the pressure to perform, achieve, and “hold it all together”—while internally feeling something very different.",
    specialties: "Relationship issues, ADD/ADHD, Anger management, Anxiety, Depression",
    style: "Affirming, Participatory, Warm",
    insuranceCount: 7,
    nextOpening: "Next opening Monday 9/21",
  },
  {
    id: "lashundra-vines",
    name: "LaShundra Vines",
    photo: "/providers/lashundra-vines.png",
    bio: "I am an empathetic, empowering, and communicative therapist who provides perspective on the connection between a person's past and present issues.",
    specialties: "Relationship issues, ADD/ADHD, Anger management, Anxiety, Bipolar disorder",
    style: "Empowering, Open-minded, Warm",
    insuranceCount: 10,
    nextOpening: "Next opening Monday 9/21",
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
