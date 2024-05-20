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

export const responseEducation: Education[] = [
  {
    _id: "1",
    StartDate: "Jan 2023",
    EndDate: "May 2024",
    School: "Cornell University",
    Major: "Master of Food Science",
    Expertise: [
      "Product Development",
      "Anti-Oxidants",
      "Anticancer Compounds",
      "Pet Food Production",
      "Bioactive Compounds",
      "Food Chemistry",
      "Nutrition",
    ],
    Grade: "3.70/4.00",
    Location: "Ithaca, NY",
    Image: "./Cornell_University_Logo.png",
  },
  {
    _id: "2",
    StartDate: "Aug 2018",
    EndDate: "Dec 2022",
    School: "Pennsylvania State University",
    Major: "Bachelor of Science in Food Science",
    Expertise: [
      "Product Development",
      "Biological Engineering",
      "Bioplastics",
      "Food Safety",
      "Microbiology",
      "Ice Cream Production",
      "Meat Science",
    ],
    Location: "University Park, PA",
    Grade: "3.30/4.00",
    Image: "./Penn_State_University_Logo.png",
  },
];
export const responseExperience: Experience[] = [
  {
    _id: "1",
    StartDate: "May 2021",
    EndDate: "Aug.2021",
    Title: "Nutritionist & PD Intern",
    Company: "UNOMI Technology Limited",
    Location: "Chengdu, China",
    Description: "",
    Accomplishments: [
      "Led and presented a new collagen product pre-launching event as the first milestone.",
      "Collaborated with R&D Lab to develop and launch a new drinkable collagen product in 2 months.",
      "Redeveloped and optimized the formula for a Gymnema weight control product with a 2-person nutritionist team.",
      "Reformulated with SOD anti-oxidation products by adding new functional ingredients and nutrients.",
      "Translated six product labels in Chinese, English, and Japanese on a 4-person design team.",
    ],
    Image: "UNOMI.jpeg",
    link: "https://www.unomi.life/",
  },
];
export const responseProject: Project[] = [
  {
    _id: "1",
    StartDate: "Jan.2024",
    EndDate: "Present",
    Title: "Wine Chemistry Analyst",
    Company: "Food Chemistry Lab, supervised by Dr.Gavin Saks",
    Description: "",
    Accomplishments: [
      "Interpret commonly measured quantitative and qualitative metrics relevant to grape growing and winemaking and their utility in wine production.",
      "Evaluate the advantages and disadvantages of different methodologies for measuring wine and grape components.",
      "Apply chemistry analysis techniques for wine production.",
    ],
    Expertises: [""],
    Location: "Cornell, Ithaca, NY",
  },
  {
    _id: "2",
    StartDate: "Dec.2022",
    EndDate: "Present",
    Title: "Master's Thesis Bioactive Compounds and Health Benefits of Oats",
    Company: "Diet and Cancer Lab, supervised by Dr. Rui Hai Liu",
    Description: "",
    Location: "Cornell, Ithaca, NY",
    Accomplishments: [
      "Study the health benefits of antioxidants and phytochemicals in whole grains.",
      "Analysis of the impact of food processing on antioxidant activity in whole grain.",
      "Quantify phenol, ascorbic acid, flavonoid concentration, and antioxidant activity in sprouted oat.",
    ],
    Expertises: [""],
    Additional: ["Publication in preparation - first author"],
  },
  {
    _id: "3",
    StartDate: "Aug.2023",
    EndDate: "Dec.2023",
    Title: "Semester Project: Pet Food Analysis and Reformulation",
    Company:
      "Nutrition for Dogs and Cats, supervised by Dr. Nathalie L. Trottier",
    Description: "",
    Accomplishments: [
      "Analyzed formulations and interpreted all the ingredients and rationales for two pet foods.",
      "Collaborated with team members to reformulate a dry grain-free dog food.",
      "Researched and conducted a report on the new dry grain-free dog food formulations.",
    ],
    Expertises: [""],
    Location: "Cornell, Ithaca, NY",
  },
  {
    _id: "4",
    StartDate: "Feb.2022",
    EndDate: "Dec.2022",
    Title: "Undergraduate Research Assistant and PD",
    Company: "Agricultural and Biological Engineering",
    Location: "Penn State, University Park, PA",
    Description: "",
    Accomplishments: [
      "Developed 6 bio-plastic formulations and applied them to agricultural tests.",
      "Performed wet-lab scientific research through gas chromatography-mass spectrometry (GC-MS) and high-performance liquid chromatography (HPLC).",
      "Collaborated with 2 team members to develop a new bio-degradable polymer film using food waste.",
      "Researched and modified biopolymer film in real-life applications with twelve formulations.",
    ],
    Expertises: [""],
    Additional: [
      "Publication in preparation - contributing author",
      "PA American Chemistry Society 12th Undergraduate poster symposium - first Author",
    ],
  },
];

const introductionCN: Introduction = {
  adderess: "纽约, 美国",
  chips: ["Seeking SWE Positions", "CS MEng @ Cornell University"],
  generalInformation: "General information",
  line1: "Hello, welcome to my nest",
  parapraph:
    "Feel free to browse around and I will share some learning experience and interview experience as a new coder in the future",
};

const introductionUS: Introduction = {
  adderess: "New York, USA",
  chips: ["Seeking SWE Positions", "CS MEng @ Cornell University"],
  generalInformation: "General information",
  line1: "Hello and welcome to Jackie’s website. ",
  parapraph:
    "As you wander through these pages, you'll get a glimpse into my personal and professional journey in the science 🧪 world. I hope you find inspiration and insight.",
};

export const allData: AllDataType = {
  "zh-CN": {
    experience: responseExperience,
    education: responseEducation,
    projects: responseProject,
    introduction: introductionCN,
  },
  "en-US": {
    experience: responseExperience,
    education: responseEducation,
    projects: responseProject,
    introduction: introductionUS,
  },
};
