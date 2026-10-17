export type ArtworkImage = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
};

export type Project = {
  slug: string;
  title: string;
  year: string;
  materials: string;
  category: string;
  dimensions: string;
  description: string;
  images: ArtworkImage[];
};

// Only the titles have been supplied by the artist so far.
// Keep unknown information empty; add verified details and images project by project.
export const projects: Project[] = [
  {
    slug: "somira",
    title: "Somira",
    year: "",
    materials: "",
    category: "",
    dimensions: "",
    description: "",
    images: [],
  },
  {
    slug: "four-gates-pagoda",
    title: "Four-Gates Pagoda",
    year: "",
    materials: "",
    category: "",
    dimensions: "",
    description: "",
    images: [],
  },
  {
    slug: "niou",
    title: "NIOU",
    year: "",
    materials: "",
    category: "",
    dimensions: "",
    description: "",
    images: [],
  },
  {
    slug: "nezhas-bike",
    title: "Nezha’s Bike",
    year: "",
    materials: "",
    category: "",
    dimensions: "",
    description: "",
    images: [],
  },
];

const projectYears = [
  ...new Set(projects.map((project) => project.year).filter(Boolean)),
].sort();
export const projectPeriod =
  projectYears.length > 1
    ? `${projectYears[0]} — ${projectYears[projectYears.length - 1]}`
    : projectYears[0];
