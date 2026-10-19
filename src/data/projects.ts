import type { MaterialTag } from "./materials";
import { projectText as englishText } from "./text/projects.en";
import { projectText as chineseText } from "./text/projects.zh";
import type { Language } from "../i18n";

export type ArtworkImage = {
  type?: "image";
  src: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
};

export type ArtworkVideo = {
  type: "video";
  // Local public path, e.g. /videos/project-01.mp4 (resolved against BASE_URL).
  src: string;
  alt?: string;
  caption?: string;
  width: number;
  height: number;
};

export type ArtworkMedia = ArtworkImage | ArtworkVideo;

export type Project = {
  slug: string;
  title: string;
  year: string;
  materials: string;
  category: string;
  materialTags: MaterialTag[];
  dimensions: string;
  description: string;
  images: ArtworkImage[];
  // Optional ordered gallery; images[0] always remains the static archive/home cover.
  media?: ArtworkMedia[];
};

export type ProjectText = {
  title: string;
  materials: string;
  description: string;
  imageAlt: Record<string, string>;
};

type SharedProject = Omit<Project, "title" | "materials" | "description" | "images"> & {
  images: Omit<ArtworkImage, "alt">[];
};

// Language-independent facts and image metadata are stored once.
export const sharedProjects: SharedProject[] = [
  {
    "slug": "somira",
    "materialTags": ["wood"],
    "year": "2025",
    "category": "Wood",
    "dimensions": "H 230 × W 170 × D 200 cm",
    "images": [
      {
        "src": "somira-01",
        "caption": "",
        "width": 2400,
        "height": 3600
      }
    ]
  },
  {
    "slug": "four-gates-pagoda",
    "materialTags": ["paper"],
    "year": "2026",
    "category": "Paper",
    "dimensions": "H 45 × W 45 × D 45 cm",
    "images": [
      {
        "src": "four-gates-pagoda-01",
        "caption": "",
        "width": 2400,
        "height": 1600
      },
      {
        "src": "four-gates-pagoda-02",
        "caption": "",
        "width": 2400,
        "height": 1600
      }
    ]
  },
  {
    "slug": "niou",
    "materialTags": ["wood"],
    "year": "2022",
    "category": "Wood",
    "dimensions": "Each figure: H 260 × W 150 × D 120 cm",
    "images": [
      {
        "src": "niou-01",
        "caption": "",
        "width": 2400,
        "height": 1800
      }
    ]
  },
  {
    "slug": "nezhas-bike",
    "materialTags": ["wood", "metal"],
    "year": "2024",
    "category": "Mixed materials",
    "dimensions": "H 120 × W 150 × D 300 cm",
    "images": [
      {
        "src": "nezhas-bike-01",
        "caption": "",
        "width": 2400,
        "height": 1600
      }
    ]
  },
  {
    "slug": "stonesomira",
    "materialTags": ["metal"],
    "year": "2025",
    "category": "Mixed materials",
    "dimensions": "H 270 × W 170 × D 140 mm",
    "images": [
      {
        "src": "stonesomira-01",
        "caption": "",
        "width": 2400,
        "height": 3600
      },
      {
        "src": "stonesomira-02",
        "caption": "",
        "width": 2400,
        "height": 3600
      },
      {
        "src": "stonesomira-03",
        "caption": "",
        "width": 2400,
        "height": 3600
      }
    ]
  },
  {
    "slug": "minira",
    "materialTags": ["wood"],
    "year": "2025",
    "category": "Wood",
    "dimensions": "H 1100 × W 650 × D 680 mm",
    "images": [
      {
        "src": "minira-01",
        "caption": "",
        "width": 2400,
        "height": 2400
      },
      {
        "src": "minira-02",
        "caption": "",
        "width": 2400,
        "height": 2400
      },
      {
        "src": "minira-02-installation",
        "caption": "",
        "width": 2400,
        "height": 3600
      },
      {
        "src": "minira-03",
        "caption": "",
        "width": 2400,
        "height": 3600
      },
      {
        "src": "minira-04",
        "caption": "",
        "width": 2400,
        "height": 3600
      }
    ]
  },
  {
    "slug": "cave",
    "materialTags": ["wood"],
    "year": "2025",
    "category": "Wood",
    "dimensions": "H 2450 × W 600 × D 150 mm",
    "images": [
      {
        "src": "cave-01",
        "caption": "",
        "width": 2400,
        "height": 3600
      },
      {
        "src": "cave-02",
        "caption": "",
        "width": 2400,
        "height": 3600
      }
    ]
  },
  {
    "slug": "lay-and-ray",
    "materialTags": [
      "wood"
    ],
    "year": "2026",
    "category": "Wood",
    "dimensions": "H 16 × W 10 × D 10 cm and H 17 × W 10 × D 10 cm",
    "images": [
      {
        "src": "lay-and-ray-01",
        "caption": "",
        "width": 2400,
        "height": 3200
      },
      {
        "src": "lay-and-ray-02",
        "caption": "",
        "width": 2400,
        "height": 3600
      },
      {
        "src": "lay-and-ray-03",
        "caption": "",
        "width": 2400,
        "height": 3600
      },
      {
        "src": "lay-and-ray-04",
        "caption": "",
        "width": 2400,
        "height": 3600
      },
      {
        "src": "lay-and-ray-05",
        "caption": "",
        "width": 2400,
        "height": 3600
      }
    ]
  },
  {
    "slug": "welove",
    "materialTags": [
      "wood"
    ],
    "year": "2026",
    "category": "Wood",
    "dimensions": "H 25 × W 20 × D 10 cm",
    "images": [
      {
        "src": "welove-01",
        "caption": "",
        "width": 2400,
        "height": 1800
      }
    ]
  },
  {
    "slug": "the-four-heavenly-kings",
    "materialTags": [
      "wood"
    ],
    "year": "2026",
    "category": "Wood",
    "dimensions": "H 35 × W 25 × D 10 cm\nH 30 × W 25 × D 10 cm\nH 35 × W 25 × D 10 cm\nH 30 × W 25 × D 10 cm",
    "images": [
      {
        "src": "the-four-heavenly-kings-01",
        "caption": "",
        "width": 2400,
        "height": 1600
      }
    ]
  },
  {
    "slug": "me",
    "materialTags": [
      "wood"
    ],
    "year": "2023",
    "category": "Wood",
    "dimensions": "H 21 × W 15 × D 10 cm",
    "images": [
      {
        "src": "me-01",
        "caption": "",
        "width": 2400,
        "height": 1600
      },
      {
        "src": "me-02",
        "caption": "",
        "width": 2400,
        "height": 1600
      },
      {
        "src": "me-03",
        "caption": "",
        "width": 2400,
        "height": 3600
      }
    ]
  },
  {
    "slug": "shukongojin-vajrapani",
    "materialTags": [
      "wood"
    ],
    "year": "2023",
    "category": "Wood",
    "dimensions": "H 1800 × W 1200 × D 1000 mm",
    "images": [
      {
        "src": "shukongojin-vajrapani-01",
        "caption": "",
        "width": 2400,
        "height": 3600
      },
      {
        "src": "shukongojin-vajrapani-02",
        "caption": "",
        "width": 2400,
        "height": 3600
      },
      {
        "src": "shukongojin-vajrapani-03",
        "caption": "",
        "width": 2400,
        "height": 3600
      }
    ]
  },
  {
    "slug": "gap",
    "materialTags": [
      "wood"
    ],
    "year": "2024",
    "category": "Wood",
    "dimensions": "H 45 × W 20 × D 5 cm",
    "images": [
      {
        "src": "gap-01",
        "caption": "",
        "width": 2400,
        "height": 3600
      },
      {
        "src": "gap-02",
        "caption": "",
        "width": 2400,
        "height": 3600
      }
    ]
  },
  {
    "slug": "redsomira",
    "materialTags": [
      "metal"
    ],
    "year": "2025",
    "category": "Metal",
    "dimensions": "H 12 × W 13 × D 13 cm",
    "images": [
      {
        "src": "redsomira-01",
        "caption": "",
        "width": 2400,
        "height": 2400
      },
      {
        "src": "redsomira-02",
        "caption": "",
        "width": 2400,
        "height": 3600
      }
    ]
  },
  {
    "slug": "bluesomira",
    "materialTags": [
      "metal"
    ],
    "year": "2025",
    "category": "Metal",
    "dimensions": "H 50 × W 65 × D 45 cm",
    "images": [
      {
        "src": "bluesomira-01",
        "caption": "",
        "width": 2400,
        "height": 2400
      },
      {
        "src": "bluesomira-02",
        "caption": "",
        "width": 2400,
        "height": 3600
      }
    ]
  },
  {
    "slug": "whitesomira",
    "materialTags": [
      "metal"
    ],
    "year": "2025",
    "category": "Metal",
    "dimensions": "H 18 × W 14 × D 19 cm",
    "images": [
      {
        "src": "whitesomira-01",
        "caption": "",
        "width": 2400,
        "height": 3600
      },
      {
        "src": "whitesomira-02",
        "caption": "",
        "width": 2400,
        "height": 3600
      }
    ]
  },
  {
    "slug": "gold-somira",
    "materialTags": [
      "metal"
    ],
    "year": "2025",
    "category": "Metal",
    "dimensions": "H 60 × W 65 × D 45 cm",
    "images": [
      {
        "src": "gold-somira-01",
        "caption": "",
        "width": 2400,
        "height": 3600
      },
      {
        "src": "gold-somira-02",
        "caption": "",
        "width": 2400,
        "height": 3600
      }
    ]
  },
  {
    "slug": "one-body-with-the-void",
    "materialTags": [
      "wood"
    ],
    "year": "2024",
    "category": "Wood",
    "dimensions": "H 2000 × W 1600 × D 1600 mm",
    "images": [
      {
        "src": "one-body-with-the-void-01",
        "caption": "",
        "width": 2400,
        "height": 1600
      },
      {
        "src": "one-body-with-the-void-02",
        "caption": "",
        "width": 2400,
        "height": 1600
      },
      {
        "src": "one-body-with-the-void-03",
        "caption": "",
        "width": 2400,
        "height": 3600
      },
      {
        "src": "one-body-with-the-void-04",
        "caption": "",
        "width": 2400,
        "height": 3600
      }
    ]
  },
  {
    "slug": "bakabaka",
    "materialTags": [
      "wood"
    ],
    "year": "2024",
    "category": "Wood",
    "dimensions": "H 20 × W 15 × D 60 cm",
    "images": [
      {
        "src": "bakabaka-01",
        "caption": "",
        "width": 2400,
        "height": 1600
      }
    ]
  }
];

export function getProjects(language: Language): Project[] {
  return sharedProjects.map((project) => {
    const english = englishText[project.slug];
    if (!english) throw new Error(`Missing English text for ${project.slug}`);
    const translated = language === "zh" ? chineseText[project.slug] : undefined;
    return {
      ...project,
      title: translated?.title ?? english.title,
      materials: translated?.materials ?? english.materials,
      // Chinese descriptions stay absent until verified translations are supplied.
      description: language === "zh" ? translated?.description ?? "" : english.description,
      images: project.images.map((image) => ({
        ...image,
        alt: translated?.imageAlt?.[image.src] ?? english.imageAlt[image.src],
      })),
    };
  });
}

// Retain the existing English export for routes and consumers.
export const projects = getProjects("en");

const projectYears = [
  ...new Set(projects.map((project) => project.year).filter(Boolean)),
].sort();
export const projectPeriod =
  projectYears.length > 1
    ? `${projectYears[0]} — ${projectYears[projectYears.length - 1]}`
    : projectYears[0];
