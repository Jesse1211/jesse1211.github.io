import { Education, Experience } from "../models/Categories";

const slugifyName = (s: string): string =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24);

export const educationSlug = (e: Education, index: number): string =>
  `${String(index + 1).padStart(2, "0")}-${slugifyName(e.School)}`;

export const experienceSlug = (e: Experience, index: number): string =>
  `${String(index + 1).padStart(2, "0")}-${slugifyName(e.Company)}`;
