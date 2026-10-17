import type { cv } from "../site";

// Only add Chinese artist text after a verified translation is supplied.
export const artistText: {
  biography?: string;
  statement?: string;
  cv?: typeof cv;
} = {};
