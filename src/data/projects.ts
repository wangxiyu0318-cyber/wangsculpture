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

// All projects below are illustrative placeholders, not the artist’s actual works.
// Add a project object and its images to create a new archive entry and project page.
export const projects: Project[] = [
  {
    slug: "between-forms",
    title: "Between Forms",
    year: "2025",
    materials: "Charred wood",
    category: "Wood",
    dimensions: "180 × 145 × 80 cm",
    description:
      "Two carved forms lean into a shared space. Their weight and darkened surfaces hold a quiet tension, while the opening between them shifts as the viewer moves around the work.",
    images: [
      {
        src: "between-forms",
        alt: "Two interlocking charred timber arches in a light-filled gallery",
        caption: "Installation view",
        width: 1672,
        height: 941,
      },
      {
        src: "between-forms-detail",
        alt: "A close view of the charred timber grain and the space between the arches",
        caption: "Surface and form, detail",
        width: 1448,
        height: 1086,
      },
    ],
  },
  {
    slug: "a-line-held",
    title: "A Line, Held",
    year: "2025",
    materials: "Copper, patina",
    category: "Metal",
    dimensions: "85 × 60 × 45 cm",
    description:
      "A sheet of copper folds back into itself, holding an open volume. The work follows the movement of a single edge, where a line becomes a surface and a surface becomes a form.",
    images: [
      {
        src: "a-line-held",
        alt: "A continuous folded copper ribbon with a dark patina on a stone plinth",
        caption: "Installation view",
        width: 1122,
        height: 1402,
      },
      {
        src: "a-line-held-detail",
        alt: "The curved edge and textured patina of the folded copper sculpture",
        caption: "Folded edge, detail",
        width: 1448,
        height: 1086,
      },
    ],
  },
  {
    slug: "vessels-of-air",
    title: "Vessels of Air",
    year: "2024",
    materials: "Washi paper, mixed materials",
    category: "Paper",
    dimensions: "Dimensions variable",
    description:
      "Thin layers of handmade paper gather into a family of fragile vessels. Light passes through their surfaces, revealing the fibres, folds and small irregularities that give each form its own presence.",
    images: [
      {
        src: "vessels-of-air",
        alt: "Three translucent handmade washi paper vessels arranged on a pale plinth",
        caption: "Installation view",
        width: 1448,
        height: 1086,
      },
      {
        src: "vessels-of-air-detail",
        alt: "The delicate, fibrous edge of a handmade paper vessel",
        caption: "Paper and light, detail",
        width: 1122,
        height: 1402,
      },
    ],
  },
  {
    slug: "a-still-blue",
    title: "A Still Blue",
    year: "2024",
    materials: "Enamel, steel",
    category: "Enamel",
    dimensions: "120 × 210 × 90 cm",
    description:
      "A group of blue forms finds a balance between stillness and movement. Fired enamel catches and holds the surrounding light, bringing subtle variations to a seemingly continuous field of colour.",
    images: [
      {
        src: "a-still-blue",
        alt: "Cobalt blue enamel forms and a small sphere on a low gallery plinth",
        caption: "Installation view",
        width: 1448,
        height: 1086,
      },
      {
        src: "a-still-blue-detail",
        alt: "Blue enamel sphere beside the curved surface of a larger form",
        caption: "Enamel surface, detail",
        width: 1122,
        height: 1402,
      },
    ],
  },
];

const projectYears = [
  ...new Set(projects.map((project) => project.year)),
].sort();
export const projectPeriod =
  projectYears.length > 1
    ? `${projectYears[0]} — ${projectYears[projectYears.length - 1]}`
    : projectYears[0];
