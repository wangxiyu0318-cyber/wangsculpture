import { projectText as englishText } from "./text/projects.en";
import { projectText as chineseText } from "./text/projects.zh";
import type { Language } from "../i18n";

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
    "year": "2025",
    "category": "Mixed materials",
    "dimensions": "H 270 × W 170 × D 140 mm",
    "images": [
      {
        "src": "stonesomira-01",
        "caption": "",
        "width": 2400,
        "height": 3600
      }
    ]
  },
  {
    "slug": "minira",
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
      }
    ]
  },
  {
    "slug": "cave",
    "year": "2025",
    "category": "Wood",
    "dimensions": "H 2450 × W 600 × D 150 mm",
    "images": [
      {
        "src": "cave-01",
        "caption": "",
        "width": 2400,
        "height": 3600
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
