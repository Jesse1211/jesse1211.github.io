export type Categories = "Educations" | "Experiences" | "Projects" | "AboutMe";

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
}

export interface Experience {
  _id: string;
  StartDate: string;
  EndDate: string;
  Title: string;
  Company: string;
  Description: string;
  Accomplishments: string[];
  Location: string;
  Image: string;
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
  Location: string;
  Additional?: string[];
}

export type RequestType =
  | "GETONE"
  | "GETALL"
  | "UPDATE"
  | "ADD"
  | "DELETEONE"
  | "DELETEALL";

export const responseEducation: Education[] = [
  {
    _id: "1",
    StartDate: "Jan 2023",
    EndDate: "May 2024",
    School: "Cornell University",
    Major: "Master of Engineer, Computer Science",
    Expertise: [
      "Programming Languages",
      "Database",
      "Computer Networks",
      "Computer Graphics",
      "Entrepreneurship Management",
    ],
    Grade: "3.70/4.00",
    Location: "Ithaca, NY",
    Image: "./Cornell_University_Logo.png",
  },
  {
    _id: "2",
    StartDate: "Sep 2021",
    EndDate: "Jun 2023",
    School: "University of California, Davis",
    Major: "Bachelor of Science, Computer Science",
    Expertise: [
      "Data Structures",
      "Algorithms",
      "Gaming Design",
      "Artificial Intelligence",
      "Machine Learning",
    ],
    Location: "University Park, PA",
    Grade: "3.30/4.00",
    Image: "./UCDavis_logo.png",
  },
  {
    _id: "3",
    StartDate: "Jun 2019",
    EndDate: "Jun 2021",
    School: "City College of San Francisco",
    Major: "Associate, Computer Science",
    Expertise: ["Teaching Assistant"],
    Location: "San Francisco, CA",
    Grade: "3.97/4.00",
    Image: "./CCSF_Logo.png",
  },
  {
    _id: "4",
    StartDate: "Jan 2018",
    EndDate: "Jan 2019",
    School: "Berkeley City College",
    Major: "Mathematics",
    Expertise: [],
    Location: "Associate, Berkeley, CA",
    Grade: "3.50/4.00",
    Image: "./Berkeley_city_College_logo.png",
  },
];
export const responseExperience: Experience[] = [
  {
    _id: "1",
    StartDate: "Jan 2024",
    EndDate: "Present",
    Title: "Research technician",
    Company: "DIAPER Infant Nutrition Project, Cornell University",
    Location: "Ithaca, NY",
    Description: "",
    Accomplishments: [
      "Overhauling over 3000 lines of code, updating 20 deprecated packages, introduced generic functions, refined 20 API endpoints to decrease latency, added JWT token to increase security compliance by 100% in front-end React and back-end Flask",
      "Making seamless user interaction experiences by transitioning from Multi-Page Application (MPA) to Single-Page Application (SPA) with migrating from JavaScript to TypeScript using Vite to improve code scalability and integration possibilities. ",
      "Optimizing streamlined processes by leveraging GitHub CI/CD with AWS k8s, attaining 50% increase in deployment efficiency",
      "Creating 3 Confluence documentation sets to clarify design architecture, reduced 5 hours for each new hire onboarding",
    ],
    Image: "./Cornell_University_Logo.png",
  },
  {
    _id: "2",
    StartDate: "Oct 2022",
    EndDate: "Dec 2023",
    Title: "Co-founder, Software Engineer, UX/UI Designer",
    Company: "EduRoute Inc.",
    Location: "Davis, CA",
    Description: "",
    Accomplishments: [
      "Led and developed full-stack web app eduroute.ai in C# Dotnet and TypeScript React for college degree plan generator product with a team of 5 designers and developers",
      "Engineered and maintained class scheduling product schedgo.com with 2000 MAUs",
      "Implemented the Search engine to achieve typo-tolerance, semantic search and hybrid search cross all data collections",
      "Orchestrated batch jobs for ETL processing by command-line tool for efficient indexing and storage of scraped data in databases",
      "Contributed code to the Typesense Search Nuget Package on GitHub, implemented Typesense to leverage new features including Vector Embedding and Hybrid Search for semantic search capabilities",
      "Designed and implemented referral system to end-to-end",
    ],
    Image: "./Schedgo.png",
  },
];
export const responseProject: Project[] = [
  {
    _id: "1",
    StartDate: "Jan.2024",
    EndDate: "Present",
    Title:
      "Full-Stack Website Development for Portfolio Customization and deployment",
    Company: "Personal Project",
    Description: "",
    Accomplishments: [
      "Leading, designing, developing and maintaining an end-to-end dynamic website that facilitates user customization of professional portfolios, complete with automated build and deployment processes with 3 software engineers",
      "Developing the frontend using React, enhanced by ZDog.js, Three.js, and WebGL technologies to create a suite of interactive and visually captivating portfolio templates",
      "Implementing Flask & .NET core to drive rapid development with a pragmatic approach, focusing on clean, maintainable code",
      "Integrating MongoDB to handle data across RESTful API endpoints, ensuring robust data management and scalability",
      "Deploying the solution on AWS and leveraging Google Firebase to establish a comprehensive serverless architecture, enhancing the platform with resilient hosting, secure authentication, and efficient serverless functions ",
    ],
    Expertises: [""],
    Location: "Cornell, Ithaca, NY",
  },
  {
    _id: "2",
    StartDate: "May 2023",
    EndDate: "Jun 2023",
    Title: "Team Leader: 2D RPG Game Development",
    Company: "Gaming Design Course in UC Davis",
    Description: "",
    Location: "Davis, CA",
    Accomplishments: [
      "Led a team in the development of an engaging RPG game with top-down and side-on scenes and 6 features in C# Unity",
      "Documented the substance synthesis feature and enemies' intelligence behavior during battle implementation ",
    ],
    Expertises: [""],
  },
  {
    _id: "3",
    StartDate: "Aug.2023",
    EndDate: "Dec.2023",
    Title: "Shopping website front-end",
    Company: "Personal Project",
    Description: "",
    Accomplishments: [
      "Implemented dynamic route matching, programmatic navigation, redirect to connect all static pages, Element-Ui, loadash, vee-validate, Vuex to manage 18 webpages with API calls in Vue2 and JavaScript",
      "Recreated Axios interceptors for user identification, added UUID token from server in request header",
    ],
    Expertises: [""],
    Location: "Davis, CA",
  },
];
