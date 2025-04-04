export type Categories = "Educations" | "Experiences" | "AboutMe";

export interface Education {
  _id: string;
  StartDate: string;
  EndDate: string;
  School: string;
  Major: string;
  Expertise: string[];
  Grade: string;
  Location: string;
  Image: string;
  Moto: string;
  Description: string;
}

export interface Experience {
  _id: string;
  StartDate: string;
  EndDate: string;
  Title: string;
  Company: string;
  Description: string;
  Location: string;
  Image: string;
  Link?: string;
  Brief: Map<string, string[]>;
}

export interface Introduction {
  adderess: string;
  chips: string[];
  generalInformation: string;
  line1: string;
  parapraph: string;
}

export type LocalType = "zh-CN" | "en-US";
