// Filtering tags are separate from the verified written Materials and Category fields.
export const materials = [
  { id: "wood", label: "Wood", entrance: "WOOD" },
  { id: "metal", label: "Metal", entrance: "METAL" },
  { id: "paper", label: "Paper", entrance: "PAPER" },
] as const;

export type MaterialTag = typeof materials[number]["id"];
