import type { ProjectText } from "../projects";

// Add only artist-supplied Chinese copy, keyed by the existing project slug.
// imageAlt is keyed by image src, so images and their order are never duplicated.
export const projectText: Record<string, Partial<ProjectText>> = {};
