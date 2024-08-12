import {
  experienceCN,
  educationCN,
  projectCN,
  introductionCN,
} from "./AllData_CN";
import {
  educationUS,
  experienceUS,
  introductionUS,
  projectUS,
} from "./AllData_US";
import { Experience, Education, Project, Introduction } from "./Categories";

export interface AllDataType {
  "en-US": {
    experience: Experience[];
    education: Education[];
    projects: Project[];
    introduction: Introduction;
  };
  "zh-CN": {
    experience: Experience[];
    education: Education[];
    projects: Project[];
    introduction: Introduction;
  };
}

export const allData: AllDataType = {
  "zh-CN": {
    experience: experienceCN,
    education: educationCN,
    projects: projectCN,
    introduction: introductionCN,
  },
  "en-US": {
    experience: experienceUS,
    education: educationUS,
    projects: projectUS,
    introduction: introductionUS,
  },
};
