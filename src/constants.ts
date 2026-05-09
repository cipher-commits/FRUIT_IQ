import { VarietyData } from "./types";

export const VARIETIES: VarietyData[] = [
  // Mangoes
  {
    id: "M1",
    name: "Sindhri",
    category: "Mango",
    origin: "Mirpur Khas, Sindh",
    season: "May - July",
    avg_price: "250-350 PKR/kg",
    best_for: "Export, Milkshakes, Fresh slices",
    description: "The 'Queen of Mangoes', known for its elongated shape and aromatic sweetness."
  },
  {
    id: "M2",
    name: "Chaunsa",
    category: "Mango",
    origin: "Multan, Punjab",
    season: "June - August",
    avg_price: "300-450 PKR/kg",
    best_for: "Premium Dessert, Export",
    description: "Incredibly sweet and juicy with a distinct honey-like flavor."
  },
  {
    id: "M3",
    name: "Anwar Ratool",
    category: "Mango",
    origin: "Ratol, UP (Heritage)",
    season: "June - July",
    avg_price: "400-600 PKR/kg",
    best_for: "Connoisseurs, Fresh Eating",
    description: "Small in size but packs an explosion of concentrated mango flavor."
  },
  {
    id: "M4",
    name: "Langra",
    category: "Mango",
    origin: "Varanasi (Heritage)",
    season: "June - July",
    avg_price: "200-300 PKR/kg",
    best_for: "Juices, Pickles",
    description: "Keeps its green skin even when ripe. Delicate, fiberless flesh."
  },
  // Dates
  {
    id: "D1",
    name: "Ajwa",
    category: "Date",
    origin: "Madinah (Grown in PK)",
    season: "August",
    avg_price: "2000-3000 PKR/kg",
    best_for: "Heath supplements, Religious value",
    description: "Dark, almost black, soft and fruity with a fine texture."
  },
  {
    id: "D2",
    name: "Aseel",
    category: "Date",
    origin: "Khairpur, Sindh",
    season: "August - September",
    avg_price: "180-250 PKR/kg",
    best_for: "Cooking, Industrial use, Syrup",
    description: "The primary commercial variety of Pakistan, excellent for processing."
  }
];

export const DISEASES = {
  Mango: [
    { name: "Anthracnose", symptoms: "Dark spots on leaves and fruit", remedy: "Copper-based fungicides" },
    { name: "Powdery Mildew", symptoms: "White powdery growth", remedy: "Sulfur sprays" },
    { name: "Fruit Fly", symptoms: "Larvae in fruit", remedy: "Pheromone traps" }
  ],
  Date: [
    { name: "Bayoud Disease", symptoms: "Wilt and dieback", remedy: "Resistant varieties" },
    { name: "Fruit Rot", symptoms: "Softening and decay", remedy: "Humidity control" }
  ]
};
