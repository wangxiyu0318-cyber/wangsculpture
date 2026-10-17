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
    year: "2026",
    materials: "Xuan paper, handmade paper, bamboo supports",
    category: "Paper",
    dimensions: "H 45 × W 45 × D 45 cm",
    description:
      "This work is based on the Four-Gates Pagoda in Jinan, China. My hometown is near a Buddhist temple, and the Four-Gates Pagoda, with its long history, is also part of my memory of home.\n\nI made this pagoda by taking impressions from a previous sculpture of hands and assembling them into the shape of a tower. In Buddhism, hands carry many meanings, and to me they also represent power and authority. Religion is deeply patriarchal, and I have never felt that I could fully find my own place within it. At the same time, I still feel a strong longing for my hometown.\n\nThe original pagoda is made of stone and feels heavy, while this version is made of paper and feels light and fragile. This contrast reflects my understanding of longing: something deeply rooted, but also delicate and difficult to hold onto.",
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
    year: "2022",
    materials: "Camphor wood",
    category: "Wood",
    dimensions: "Each figure: H 260 × W 150 × D 120 cm",
    description:
      "NIOU was created for Miyaji Shrine in Kumamoto, Japan, a shrine with a history of around 1,400 years.\n\nFor the figures, I combined characteristics of Buddhist sculpture from Shuanglin Temple in China with a local tradition of the shrine. During the New Year period, sumo wrestlers are invited to perform and pray for the wellbeing of the local community.\n\nBecause of this connection, I gave the Nio figures fuller, heavier bodies based on sumo wrestlers rather than the more muscular and defined bodies often seen in traditional Japanese Buddhist sculpture.\n\nThrough the work, I wanted to bring together different sculptural traditions and the living customs of the local community, allowing a traditional religious image to take on a form that belongs specifically to this place.",
    images: [
      {
        src: "niou-01",
        alt: "NIOU, two standing guardian figures on plinths at a gallery entrance",
        caption: "",
        width: 2400,
        height: 1800,
      },
    ],
  },
  {
    slug: "nezhas-bike",
    title: "Nezha’s Bike",
    year: "2024",
    materials: "Iron, camphor wood",
    category: "Mixed materials",
    dimensions: "H 120 × W 150 × D 300 cm",
    description:
      "Nezha’s Bike comes from the myth of Nezha. In the story, even after experiencing death and rebirth, Nezha never seems to gain real freedom under the power of patriarchy.\n\nI imagined him using the body of the dragon he killed, together with his own dead body, to build a motorcycle that could carry him away at full speed. I wanted the work to become a wish for escape — from expectation, duty and limitation.\n\nThe sculpture also brings together two opposite ways of making. Wood carving is created through subtraction, while metalwork is built through addition. Working between these two processes has also helped me find my own position as a sculptor.",
    images: [
      {
        src: "nezhas-bike-01",
        alt: "Nezha’s Bike, a sculpture with a dark skeletal framework and two large carved heads",
        caption: "",
        width: 2400,
        height: 1600,
      },
    ],
  },
  {
    slug: "stonesomira",
    title: "StoneSomira",
    year: "2025",
    materials: "Glass, copper, copper mesh",
    category: "Mixed materials",
    dimensions: "H 270 × W 170 × D 140 mm",
    description:
      "StoneSomira continues my Somira series through an experiment with materials. In this work, I used glass, copper, and copper mesh to create a surface texture that feels weathered, stony, and ancient, as if the figure had existed for a very long time.\n\nI am interested in how sculpture surfaces change through time, and in how material can suggest age, fragility, and distance. This work develops the Somira image in a different direction, focusing more on material transformation and the sense of something that feels unearthed or long-existing.",
    images: [
      {
        src: "stonesomira-01",
        alt: "StoneSomira, a textured double-faced figure against a light background",
        caption: "",
        width: 2400,
        height: 3600,
      },
    ],
  },
  {
    slug: "minira",
    title: "MINIRA",
    year: "2025",
    materials: "Camphor wood",
    category: "Wood",
    dimensions: "H 1100 × W 650 × D 680 mm",
    description:
      "MINIRA combines my own process of growing up with the imagined experience of Minira, the child of Godzilla. Through this figure, I think about the confusion that can appear during growth, the questioning of decisions made by one’s parents, and the uncertainty of becoming.\n\nAt the same time, Minira gradually grows scales and becomes closer to the parents’ form. The work reflects both distance and resemblance: the desire to question what is given, and the inevitability of being shaped by where one comes from.",
    images: [
      {
        src: "minira-01",
        alt: "MINIRA, front view of a carved wooden figure with outstretched arms and scales",
        caption: "",
        width: 2400,
        height: 2400,
      },
      {
        src: "minira-02",
        alt: "MINIRA, rear view showing carved scales along the back and legs",
        caption: "",
        width: 2400,
        height: 2400,
      },
    ],
  },
];

const projectYears = [
  ...new Set(projects.map((project) => project.year).filter(Boolean)),
].sort();
export const projectPeriod =
  projectYears.length > 1
    ? `${projectYears[0]} — ${projectYears[projectYears.length - 1]}`
    : projectYears[0];
