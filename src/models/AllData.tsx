// Portfolio data now lives in the Journey submodule (render/content split):
// jesse1211.github.io is the render layer; Journey is the single source of
// content. We import the bilingual JSON and rebuild the runtime shapes the
// views expect — notably Experience.Brief, which is stored as an array of
// [heading, bullets] pairs in JSON and rehydrated into a Map here.
import experienceJson from "../journey-content/portfolio/experience.json";
import educationJson from "../journey-content/portfolio/education.json";
import introJson from "../journey-content/portfolio/intro.json";
import { Experience, Education, Introduction, LocalType } from "./Categories";

export interface AllDataType {
  "en-US": {
    experience: Experience[];
    education: Education[];
    introduction: Introduction;
  };
  "zh-CN": {
    experience: Experience[];
    education: Education[];
    introduction: Introduction;
  };
}

// JSON shape for an experience: identical to Experience but Brief is pairs.
type ExperienceJson = Omit<Experience, "Brief"> & {
  Brief: [string, string[]][];
};
type Bilingual<T> = Record<LocalType, T>;

const rebuildExperience = (list: ExperienceJson[]): Experience[] =>
  list.map((e) => ({ ...e, Brief: new Map(e.Brief) }));

const experience = experienceJson as unknown as Bilingual<ExperienceJson[]>;
const education = educationJson as unknown as Bilingual<Education[]>;
const introduction = introJson as unknown as Bilingual<Introduction>;

export const allData: AllDataType = {
  "en-US": {
    experience: rebuildExperience(experience["en-US"]),
    education: education["en-US"],
    introduction: introduction["en-US"],
  },
  "zh-CN": {
    experience: rebuildExperience(experience["zh-CN"]),
    education: education["zh-CN"],
    introduction: introduction["zh-CN"],
  },
};
