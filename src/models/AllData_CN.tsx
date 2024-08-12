import { Experience, Education, Project, Introduction } from "./Categories";

export const educationCN: Education[] = [
  {
    _id: "1",
    StartDate: "2024年1月",
    EndDate: "2024年12月",
    School: "康奈尔大学",
    Major: "工程硕士,计算机科学",
    Expertise: ["编程语言", "数据库", "计算机网络", "计算机图形学", "创业管理"],
    Grade: "3.70/4.00",
    Location: "纽约州伊萨卡",
    Image: "./Cornell_University_Logo.png",
  },
  {
    _id: "2",
    StartDate: "2021年9月",
    EndDate: "2023年6月",
    School: "加州大学戴维斯分校",
    Major: "理学学士,计算机科学",
    Expertise: ["数据结构", "算法", "游戏设计", "人工智能", "机器学习"],
    Location: "加州戴维斯",
    Grade: "3.88/4.00",
    Image: "./UCDavis_logo.png",
  },
  {
    _id: "3",
    StartDate: "2019年6月",
    EndDate: "2021年6月",
    School: "旧金山市立学院",
    Major: "副学士,计算机科学",
    Expertise: ["助教"],
    Location: "加州旧金山",
    Grade: "3.97/4.00",
    Image: "./CCSF_Logo.png",
  },
  {
    _id: "4",
    StartDate: "2018年1月",
    EndDate: "2019年1月",
    School: "伯克利市立学院",
    Major: "数学",
    Expertise: [],
    Location: "副学士,加州伯克利",
    Grade: "3.50/4.00",
    Image: "./Berkeley_city_College_logo.png",
  },
];

export const experienceCN: Experience[] = [
  {
    _id: "1",
    StartDate: "2024年1月",
    EndDate: "现在",
    Title: "全栈开发者",
    Company: "DIAPER 婴儿营养项目",
    Location: "纽约州伊萨卡",
    Description: "",
    Accomplishments: [
      "重写至少3000行代码,更新20个过时包,引入通用功能,优化20个API端点以减少延迟,增加JWT令牌以提高前端React和后端Flask的安全合规性100%",
      "通过将多页面应用程序(MPA)转换为单页面应用程序(SPA)并从JavaScript迁移到TypeScript并且更新使用Vite & Pnpm,实现无缝用户交互体验, 提升网站反应速度",
      "重新设计并优化自动化CI/CD管道, 通过实施GitHub Webhooks检测代码库变化, 使用Jenkins更新Nexus仓库中的Docker镜像, 并配置ArgoCD监控和应用Kubernetes部署的更新, 通过从Nexus拉取Docker镜像, 有效提高部署效率",
      "创建3套Confluence文档集,明确设计架构,为每位新员工节省5小时的入职时间",
    ],
    Image: "./Cornell_University_Logo.png",
    link: "https://dashboard.diaper-project.com",
  },
  {
    _id: "2",
    StartDate: "2022年10月",
    EndDate: "2023年12月",
    Title: "联合创始人 & 全栈开发者",
    Company: "EduRoute Inc.",
    Location: "加州戴维斯",
    Description: "",
    Accomplishments: [
      "带领团队用C# Dotnet和TypeScript React开发全栈Web应用eduroute.ai,为大学学位计划生成器产品提供服务,团队包括5名设计师和开发者",
      "使用2000 MAUs维护和开发课程调度产品schedgo.com",
      "实现搜索引擎以达成错别字容忍、语义搜索和跨所有数据集的混合搜索",
      "通过命令行工具协调批处理作业进行ETL处理,实现数据高效索引和存储",
      "在GitHub上为Typesense Search Nuget包贡献代码,实施Typesense以利用新功能,包括矢量嵌入和混合搜索进行语义搜索",
      "设计并实施端到端的推荐系统",
    ],
    Image: "./Schedgo.png",
    link: "https://eduroute.ai/",
  },
];

export const projectCN: Project[] = [
  {
    _id: "1",
    StartDate: "2024年1月",
    EndDate: "现在",
    Title: "全栈网站开发,用于投资组合定制与部署",
    Company: "个人项目",
    Description: "",
    Accomplishments: [
      "带领、设计、开发并维护一个端到端的动态网站,该网站支持用户自定义专业投资组合,并包括自动化构建和部署过程,团队包括3名软件工程师",
      "使用React开发前端,通过ZDog.js、Three.js和WebGL技术增强,创建一系列互动性强和视觉吸引力强的投资组合模板",
      "实施Flask和.NET核心以推动快速开发,专注于干净、可维护的代码",
      "整合MongoDB处理跨RESTful API端点的数据,确保数据管理和可扩展性",
      "在AWS上部署解决方案并利用Google Firebase建立全面的无服务器架构,提升平台的韧性托管、安全认证和高效的无服务器功能",
    ],
    Expertises: [""],
    Location: "康奈尔,伊萨卡,纽约",
  },
  {
    _id: "2",
    StartDate: "2023年5月",
    EndDate: "2023年6月",
    Title: "团队领导: 2D RPG游戏开发",
    Company: "加州大学戴维斯分校游戏设计课程",
    Description: "",
    Location: "加州戴维斯",
    Accomplishments: [
      "领导一个团队开发一个具有从顶部向下和侧面视图场景的引人入胜的RPG游戏,包括6个特色",
      "在战斗实施过程中记录物质合成特性和敌人的智能行为",
    ],
    Expertises: [""],
  },
  {
    _id: "3",
    StartDate: "2023年8月",
    EndDate: "2023年12月",
    Title: "购物网站前端开发",
    Company: "个人项目",
    Description: "",
    Accomplishments: [
      "实施动态路由匹配、程序导航、重定向以连接所有静态页面,使用Element-Ui、loadash、vee-validate、Vuex管理18个网页及其API调用",
      "重新创建Axios拦截器用于用户识别,在请求头中添加来自服务器的UUID令牌",
    ],
    Expertises: [""],
    Location: "加州戴维斯",
  },
];

export const introductionCN: Introduction = {
  adderess: "纽约, 美国",
  chips: ["寻求软件工程师职位", "康奈尔大学计算机科学工程硕士"],
  generalInformation: "General information",
  line1: "你好，欢迎来到我的小窝",
  parapraph:
    "我是一个还在努力找工作的软件工程师, 之后我会在这里更新成为自己的博客, 为了学习更多好玩的前端知识, 这里全部都自己写的, 请多多关照",
};
