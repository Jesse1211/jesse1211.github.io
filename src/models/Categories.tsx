export type Categories = "Educations" | "Experiences" | "Projects" | "AboutMe";

export interface Education {
  _id: string;
  StartDate: string;
  EndDate: string;
  School: string;
  ReleventCourses: string[];
  Grade: string;
}

export interface Experience {
  _id: string;
  StartDate: string;
  EndDate: string;
  Title: string;
  Company: string;
  Description: string;
  Accomplishments: string[];
  Expertises: string[];
}

export interface Project {
  _id: string;
  StartDate: string;
  EndDate: string;
  Title: string;
  Company: string;
  Description: string;
  Accomplishments: string[];
  Expertises: string[];
}

export type RequestType = "GETONE" | "GETALL" | "UPDATE" | "ADD" | "DELETEONE" | "DELETEALL";