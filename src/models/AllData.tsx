import {
  experienceCN,
  educationCN,
  introductionCN,
} from "./AllData_CN";
import {
  educationUS,
  experienceUS,
  introductionUS,
} from "./AllData_US";
import { Experience, Education, Introduction } from "./Categories";

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

export const allData: AllDataType = {
  "zh-CN": {
    experience: experienceCN,
    education: educationCN,
    introduction: introductionCN,
  },
  "en-US": {
    experience: experienceUS,
    education: educationUS,
    introduction: introductionUS,
  },
};
