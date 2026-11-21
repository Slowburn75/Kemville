export const offerings = [
  {
    slug: "consultations",
    label: "Medical consultations",
    intro: "A conversation with a doctor, in the format that works for you.",
    items: [
      "WhatsApp chat",
      "Telephone consultations",
      "Google Meet video",
      "In-person consultations",
    ],
    action: "/book",
  },
  {
    slug: "medical-imaging",
    label: "Medical imaging",
    intro:
      "Explore diagnostic imaging and discuss referral requirements with your clinician.",
    items: ["CT imaging", "Ultrasound", "Imaging equipment enquiries"],
    image: "/WhatsApp Image 2026-11-19 at 20.29.33 (2).jpeg",
  },
  {
    slug: "pharmaceuticals",
    label: "Pharmaceuticals",
    intro:
      "Explore medicine purchase enquiries for individual and institutional needs.",
    items: [
      "Prescription medicine enquiries",
      "Non-prescription product enquiries",
      "Institutional pharmaceutical procurement",
    ],
    purchase: true,
  },
  {
    slug: "equipment",
    label: "Medical equipment",
    intro:
      "Plan equipment purchases for your practice, facility or care setting.",
    items: [
      "Ultrasound systems",
      "CT systems",
      "Patient monitoring equipment",
      "Clinical examination equipment",
    ],
    image: "/WhatsApp Image 2026-11-19 at 20.29.32.jpeg",
    purchase: true,
  },
  {
    slug: "consumables",
    label: "Medical consumables",
    intro:
      "Build a procurement list for the everyday essentials of clinical care.",
    items: [
      "Examination gloves",
      "Syringes and needles",
      "Dressings and gauze",
      "Masks and protective supplies",
      "Sample collection supplies",
    ],
    purchase: true,
  },
  {
    slug: "medical-tourism",
    label: "Medical tourism",
    intro:
      "Explore specialist care abroad, with clinical review and continuity of care at the centre.",
    items: [
      "Specialist assessment",
      "Hospital and clinician verification",
      "Treatment estimate review",
      "Travel and follow-up planning",
    ],
    image: "/WhatsApp Image 2026-11-19 at 20.29.33.jpeg",
  },
] as const;
export const conditionGroups = [
  {
    specialty: "Heart & vascular",
    conditions: [
      "Coronary artery disease",
      "Heart valve disease",
      "Congenital heart conditions",
    ],
  },
  {
    specialty: "Cancer care",
    conditions: [
      "Breast cancer",
      "Prostate cancer",
      "Colorectal cancer",
      "Other cancer diagnoses requiring specialist review",
    ],
  },
  {
    specialty: "Bones, joints & spine",
    conditions: [
      "Hip and knee arthritis",
      "Spinal disorders",
      "Complex fractures",
    ],
  },
  {
    specialty: "Kidney & urology",
    conditions: [
      "Chronic kidney disease",
      "Kidney stones",
      "Prostate conditions",
    ],
  },
  {
    specialty: "Neurology & neurosurgery",
    conditions: [
      "Brain and spinal conditions",
      "Epilepsy",
      "Movement disorders",
    ],
  },
  {
    specialty: "Women’s health & fertility",
    conditions: ["Infertility", "Uterine fibroids", "Endometriosis"],
  },
  {
    specialty: "Eye care",
    conditions: ["Cataracts", "Glaucoma", "Retinal conditions"],
  },
  {
    specialty: "Digestive health",
    conditions: [
      "Gallbladder disease",
      "Hernias",
      "Complex gastrointestinal conditions",
    ],
  },
];
