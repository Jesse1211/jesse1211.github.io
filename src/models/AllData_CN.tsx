import { Experience, Education, Introduction } from "./Categories";

export const educationCN: Education[] = [
  {
    _id: "1",
    StartDate: "2024年1月",
    EndDate: "2024年12月",
    School: "康奈尔大学",
    Major: "工程硕士,计算机科学",
    Expertise: ["编程语言", "数据库", "计算机网络", "计算机图形学", "创业管理"],
    Grade: "3.71/4.00",
    Location: "纽约州伊萨卡",
    Image: "./Cornell_University_Logo.png",
    Moto: "Breaking the rules of conventional wisdom.",
    Description:
      "Where I honed my software engineering skills and discovered my passion — challenging conventional wisdom.",
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
    Moto: "Greater Together for the Greater Good.",
    Description:
      "Driven by curiosity, I discovered a new field and developed a solid foundation in computer science.",
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
    Moto: "The Truth Shall Make You Free",
    Description:
      "I found motivation through studying — it's never boring with clear goals.",
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
    Moto: "Transforms lives.",
    Description: "The moment my life started to change.",
  },
];

export const experienceCN: Experience[] = [
  {
    _id: "1",
    StartDate: "2025年9月",
    EndDate: "2026年7月",
    Title: "平台软件工程师",
    Company: "ProtonBase",
    Location: "中国杭州",
    Description:
      "云原生数据仓库平台 —— 基于 Kubernetes 的多租户基础设施, 存储与计算解耦架构。",
    Brief: new Map([
      [
        "基于 Kubernetes 与 存储-计算解耦架构, 构建多租户、云原生的数据仓库平台",
        [
          "通过自研 Kubernetes Operator 管理四层资源模型。",
          "Datacloud —— 租户隔离边界。",
          "Catalog —— 共享存储层。",
          "Warebase —— 计算集群。",
          "SuperNode —— 单节点。",
        ],
      ],
      [
        "将 PITR 时间点恢复从定时批处理迁移到带流控的并发管道连续监控",
        [
          "备份耗时降低 70%。",
          "WAL 积压减少 500%。",
        ],
      ],
    ]),
    Image: "./protonbase.png",
    Link: "https://protonbase.com",
  },
  {
    _id: "2",
    StartDate: "2024年1月",
    EndDate: "2025年7月",
    Title: "全栈开发工程师, 团队负责人",
    Company: "康奈尔大学 DIAPER 实验室",
    Location: "纽约州伊萨卡",
    Description:
      "日常粪便信息增强研究, 从粪便的物理、生化和微生物特性探究婴儿的肠胃健康。",
    Brief: new Map([
      [
        "现已上线网页端、Google Play、Apple TestFlight 平台, 并在纽约市医院投入使用。",
        [
          "网页应用(参与者端)：通过问卷收集粪便图像与婴儿的日常元数据。",
          "移动应用(研究员端)：展示问卷采集的婴儿数据, 并可视化微生物组和微量营养素。",
        ],
      ],
      [
        "跨学科团队协作(15+位软件工程师), 在20次冲刺中交付30+主要功能。",
        [
          "每周开展冲刺会议, 进行任务分配、代码审查与结对编程。",
          "实施敏捷开发方法, 提高团队协作与生产效率。",
          "撰写3份 Confluence 文档, 明确架构设计, 使新成员每人节省5小时上手时间。",
        ],
      ],
      [
        "前端开发",
        [
          "使用 Flutter 构建含60+组件的移动应用, 用于收集婴儿日常问卷与粪便图像。",
          "采用 React 和 TypeScript 构建网页应用, 展示婴儿微生物与问卷数据, 共含5种可视化形式。",
          "将网站从多页面应用(MPA)转为单页面应用(SPA), 并通过 Vite 构建为渐进式网页应用(PWA)。",
        ],
      ],
      [
        "后端开发",
        [
          "设计并开发新后端结构, 整合6个具有特定功能的 NuGet 套件, 构建45个 API。",
          "引入泛型函数, 优化40+ API 服务结构, 前后端引入 JWT token 提高安全性 100%。",
          "重构超过10,000行代码, 将 Flask 从 v1.0.2 升级到 v3.0.3, Flutter 从 v2.3.0 升级到 v3.24.1 等。",
        ],
      ],
      [
        "DevOps 运维",
        [
          "使用 Docker、K8s、Jenkins 构建 CI/CD 流程, 自动化发布, 提升部署频率。",
          "使用轻量级 Kubernetes K3S 部署在 AWS EC2 实例上, 配置 ArgoCD 实现镜像更新自动化部署(通过 Nexus 拉取 Docker 镜像)。",
        ],
      ],
    ]),
    Image: "./Cornell_University_Logo.png",
    Link: "https://dashboard.diaper-project.com",
  },
  {
    _id: "3",
    StartDate: "2022年10月",
    EndDate: "2023年12月",
    Title: "联合创始人 & 全栈开发工程师",
    Company: "EduRoute Inc.",
    Location: "加州戴维斯",
    Description: "一个让教育更轻松的 EdTech 初创公司",
    Brief: new Map([
      [
        "EduRoute",
        [
          "EduRoute 旨在根据每位学生的目标和需求, 生成最优的课程安排与学位规划。",
          "使用 TypeScript 和 React 开发渐进式网页应用(PWA)。",
          "为 Typesense Search Nuget Package v0.25.0 贡献代码。",
          "实现具有容错性、语义与混合搜索的 TypeScript 搜索功能, 跨越3个数据集合。",
        ],
      ],
      [
        "SchedGo",
        [
          "✨SchedGo 是一款基于 AI 的网页与移动端学术规划工具, 可根据学生目标生成最优课表与学位计划。",
          "🚀课表生成器已在加州4所大学中被2000+名学生使用与喜爱。",
          "现已上线网页、Google Play、Apple TestFlight 平台。",
          "与5位设计师与开发者一同使用 C# Dotnet 和 TypeScript React 开发网页端课程计划生成器。",
          "使用现代 .NET 开发容器化微服务。",
          "实现 TypeScript 搜索功能, 实现容错性、语义与混合搜索。",
          "端到端开发推荐系统、谷歌地图导航系统。",
        ],
      ],
      [
        "成果与奖项",
        [
          "每学期为学生节省 10,000+ 小时, 总月活跃用户超 2000",
          "在第23届 UC Davis Big Bang 商业竞赛中荣获一等奖与人气奖, 总奖金 $30,000",
        ],
      ],
    ]),
    Image: "./Schedgo.png",
    Link: "https://eduroute.ai/",
  },
  {
    _id: "4",
    StartDate: "2023年5月",
    EndDate: "2023年6月",
    Title: "团队负责人: 2D RPG 游戏开发",
    Company: "UC Davis 游戏设计课程",
    Description: "",
    Location: "加州戴维斯",
    Image: "",
    Link: "",
    Brief: new Map([
      [
        "带领团队使用 C# 与 Unity 开发 RPG 游戏, 包含俯视视角与横版战斗场景, 包含6项功能",
        [],
      ],
      ["撰写合成系统和敌人战斗 AI 行为的功能文档", []],
    ]),
  },
  {
    _id: "5",
    StartDate: "2023年8月",
    EndDate: "2023年12月",
    Title: "购物网站前端开发",
    Company: "个人项目",
    Description: "",
    Location: "加州戴维斯",
    Image: "",
    Link: "",
    Brief: new Map([
      [
        "在 Vue2 与 JavaScript 中使用 Element-UI、lodash、vee-validate、Vuex, 实现18个网页页面的 API 动态路由、编程式导航、重定向等功能",
        [],
      ],
      [
        "重写 Axios 拦截器用于用户识别, 向请求头中添加服务器返回的 UUID token",
        [],
      ],
    ]),
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
