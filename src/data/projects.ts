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

// Somira’s information is verified; the other projects currently have titles only.
// Keep unknown information empty; add verified details and images project by project.
export const projects: Project[] = [
  {
    slug: "somira",
    title: "Somira",
    year: "2025",
    materials: "Camphor wood",
    category: "Wood",
    dimensions: "H 230 × W 170 × D 200 cm",
    description:
      "Somira is a large-scale wooden sculpture inspired in part by the image of a dual-bodied Bishamonten.\n\nFor me, this figure is connected to the boundary between life and death. I was especially interested in working with scale. I made the sculpture much larger than the human body so that the viewer has to physically confront its presence.\n\nDeath is something enormous and always present, even when we try not to think about it. I wanted Somira to feel like a guardian standing somewhere between life and death, creating a moment in which the viewer becomes aware of that constant presence.",
    images: [
      {
        src: "somira-01",
        alt: "Somira, a large carved wooden sculpture with two guardian faces, displayed in an atrium",
        caption: "",
        width: 2400,
        height: 3600,
      },
    ],
  },
  {
    slug: "four-gates-pagoda",
    title: "Four-Gates Pagoda",
    year: "",
    materials: "",
    category: "",
    dimensions: "",
    description: "",
    images: [
      {
        src: "four-gates-pagoda-01",
        alt: "Four-Gates Pagoda, angled view showing two sides and the peaked roof against a white background",
        caption: "",
        width: 2400,
        height: 1600,
      },
      {
        src: "four-gates-pagoda-02",
        alt: "Four-Gates Pagoda, alternate view showing an arched opening beneath the peaked roof against a white background",
        caption: "",
        width: 2400,
        height: 1600,
      },
    ],
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
