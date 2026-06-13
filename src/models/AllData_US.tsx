import { Experience, Education, Introduction } from "./Categories";

export const educationUS: Education[] = [
  {
    _id: "1",
    StartDate: "Jan 2024",
    EndDate: "Dec 2024",
    School: "Cornell University",
    Major: "Master of Engineering, Computer Science",
    Expertise: [
      "Programming Languages",
      "Database",
      "Computer Networks",
      "Computer Graphics",
      "Entrepreneurship Management",
    ],
    Grade: "3.71/4.00",
    Location: "Ithaca, NY",
    Image: "./Cornell_University_Logo.png",
    Moto: "Breaking the rules of conventional wisdom.",
    Description:
      "Where I honed my software engineering skills and discovered my passion — challenging conventional wisdom.",
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
    Location: "Davis, CA",
    Grade: "3.88/4.00",
    Image: "./UCDavis_logo.png",
    Moto: "Greater Together for the Greater Good.",
    Description:
      "Driven by curiosity, I discovered a new field and developed a solid foundation in computer science.",
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
    Moto: "The Truth Shall Make You Free.",
    Description:
      "I found motivation through studying — it's never boring with clear goals.",
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
    Moto: "Transforms lives.",
    Description: "The moment my life started to change.",
  },
];
export const experienceUS: Experience[] = [
  {
    _id: "1",
    StartDate: "Sep 2025",
    EndDate: "Jun 2026",
    Title: "Platform Software Engineer",
    Company: "ProtonBase",
    Location: "Hangzhou, China",
    Description:
      "Cloud-native data warehouse platform — Kubernetes-based multi-tenant infrastructure with disaggregated storage and compute.",
    Brief: new Map([
      [
        "Built multi-tenant, cloud-native data warehouse platform on Kubernetes with a disaggregated storage-compute architecture",
        [
          "Custom Kubernetes operators managing a four-layer resource model.",
          "Datacloud — tenant isolation boundary.",
          "Catalog — shared storage layer.",
          "Warebase — compute cluster.",
          "SuperNode — individual node.",
        ],
      ],
      [
        "Optimized Point-In-Time Recovery from scheduled batch processing to continuous monitoring with a flow-controlled concurrent pipeline",
        [
          "Reduced backup time by 70%.",
          "Reduced WAL backlog by 500%.",
        ],
      ],
    ]),
    Image: "./protonbase.png",
    Link: "https://protonbase.com",
  },
  {
    _id: "2",
    StartDate: "Jan 2024",
    EndDate: "Jul 2025",
    Title: "Full-Stack Developer, Team Lead",
    Company: "Cornell University DIAPER Lab",
    Location: "Ithaca, NY",
    Description:
      "Daily Infroamtion About Poop Enhances Research, exploring infant gastrointestinal health from the physical, biochemical, and microbial properties of stool.",
    Brief: new Map([
      [
        "Now available on Web, Google Play, Apple TestFlight platforms and launched in NYC hospitals.",
        [
          "Web App For Participants: Gather stool image and infant's daily meta data through survey.",
          "Mobile App For Researchers: Present infants' metadata from surveys and virtualization for microbiomes and micronutrients.",
        ],
      ],
      [
        "Collaborated across multi-disciplinary teams of 15+ SWEs to deliver 30+ major features in 20 sprints.",
        [
          "Weekly-sprint meeting to discuss and assign tasks, code review, and pair programming.",
          "Implemented Agile methodology to improve team collaboration and productivity.",
          "Created 3 Confluence documentation sets to clarify design architecture, reduced 5 hours for each new hire onboarding.",
        ],
      ],
      [
        "Front-End",
        [
          "Developed mobile app with 60+ widgets by Flutter to collect infant's daily surveys and stool images.",
          "Engineered web app with 5 visual types by React, TypeScript to present infants' microbiomes and participants' surveys.",
          "Transitioned from Multi-Page Application (MPA) to Single-Page Application (SPA) as a Progressive Web App (PWA) with Vite.",
        ],
      ],
      [
        "Back-End",
        [
          "Architected and developed new back-end structure with 45 APIs by integrating 6 NuGet packages with unique specs",
          "Introduced generic functions, refined 40+ API services structure, added JWT token to increase security compliance by 100% in front-end React and back-end Flask.",
          "Overhauled over 10,000+ lines of code, updated Flask from v1.0.2 to v3.0.3, Flutter from v2.3.0 to v3.24.1 etc.",
        ],
      ],
      [
        "DevOps",
        [
          "Built CI/CD pipeline to automate apps launching with Docker, K8s and Jenkins to increase deployment frequency.",
          "Leveraged lightweight kubernetes K3S in AWS EC2 instance to deploy Docker images, and configured ArgoCD to monitor and apply updates to Kubernetes deployments by pulling Docker images from Nexus.",
        ],
      ],
    ]),
    Image: "./Cornell_University_Logo.png",
    Link: "https://dashboard.diaper-project.com",
  },
  {
    _id: "3",
    StartDate: "Oct 2022",
    EndDate: "Dec 2023",
    Title: "Co-founder & Full-Stack Developer",
    Company: "EduRoute Inc.",
    Location: "Davis, CA",
    Description: "An EdTech startup making education easy",
    Brief: new Map([
      [
        "EduRoute",
        [
          "EduRoute aim to generate optimized class schedules and degree plans based on each student's unique needs and goals.",
          "Designed & developed Progressive Web App (PWA) using React in TypeScript.",
          "Contributed code to the Typesense Search Nuget Package v0.25.0 on GitHub.",
          "Implemented the Typescript Search to achieve typo-tolerance, semantic and hybrid search cross 3 data collections.",
        ],
      ],
      [
        "SchedGo",
        [
          "✨SchedGo is an AI-powered web & mobile academic planner that generates optimized class schedules & degree plans based on each student's unique needs and goals.",
          "🚀The class scheduler has been used and loved by 2,000+ students across 4 colleges in California.",
          "Now available on Web, Google Play, Apple TestFlight platforms.",
          "Led and developed web app in C# Dotnet and TypeScript React for college degree plan generator product with a team of 5 designers and developers",
          "Developed containerized microservices using modern .NET in C#",
          "Implemented the Typescript Search to achieve typo-tolerance, semantic and hybrid search across 3 data collections",
          "Designed and implemented referral system, google map navigation system to end-to-end",
        ],
      ],
      [
        "Accomplishments",
        [
          "Generated 2,000+ Monthly Active Users (MAUs) and saved 10,000+ hours for students every term",
          "Won 1st Prize & People's Choice Award totaling $30,000 at 23rd UC Davis Big Bang Business Competition",
        ],
      ],
    ]),
    Image: "./Schedgo.png",
    Link: "https://eduroute.ai/",
  },
  {
    _id: "4",
    StartDate: "May 2023",
    EndDate: "Jun 2023",
    Title: "Team Leader: 2D RPG Game Development",
    Company: "Gaming Design Course in UC Davis",
    Description: "",
    Location: "Davis, CA",
    Brief: new Map([
      [
        "Led a team in the development of an engaging RPG game with top-down and side-on scenes and 6 features in C# Unity",
        [],
      ],
      [
        "Documented the substance synthesis feature and enemies' intelligence behavior during battle implementation",
        [],
      ],
    ]),
  },
  {
    _id: "5",
    StartDate: "Aug.2023",
    EndDate: "Dec.2023",
    Title: "Shopping website front-end",
    Company: "Personal Project",
    Description: "",
    Location: "Davis, CA",
    Brief: new Map([
      [
        "Implemented dynamic route matching, programmatic navigation, redirect to connect all static pages, Element-Ui, loadash, vee-validate, Vuex to manage 18 webpages with API calls in Vue2 and JavaScript",
        [],
      ],
      [
        "Recreated Axios interceptors for user identification, added UUID token from server in request header",
        [],
      ],
    ]),
  },
];

export const introductionUS: Introduction = {
  adderess: "New York, USA",
  chips: ["Seeking SWE Positions", "CS MEng @ Cornell University"],
  generalInformation: "General information",
  line1: "Hello, welcome to my nest",
  parapraph:
    "Feel free to browse around and I will share some learning experience and interview experience as a new coder in the future",
};
