import { SiteData } from '../types';

// High quality custom SVG data URIs for anime-line-art styled visuals
export const DEFAULT_AVATAR_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="100%" height="100%">
  <rect width="300" height="300" fill="#0F172A"/>
  <!-- Manga halftone background dots -->
  <pattern id="dots" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
    <circle cx="2" cy="2" r="1.5" fill="#1E293B"/>
  </pattern>
  <rect width="300" height="300" fill="url(#dots)"/>
  
  <!-- Speed lines background -->
  <path d="M 150 150 L 0 0 M 150 150 L 300 0 M 150 150 L 0 300 M 150 150 L 300 300 M 150 150 L 150 0 M 150 150 L 0 150 M 150 150 L 300 150 M 150 150 L 150 300" stroke="#334155" stroke-width="1.5" stroke-dasharray="4 4"/>
  
  <!-- Sharp Mecha Hair Back -->
  <path d="M 50 160 C 40 90 80 30 150 25 C 220 30 260 90 250 160 Z" fill="#020617" stroke="#38BDF8" stroke-width="3"/>
  
  <!-- Face base (Sharp angular jaw) -->
  <polygon points="85,100 215,100 195,190 150,230 105,190" fill="#1E293B" stroke="#F8FAFC" stroke-width="4" stroke-linejoin="round"/>
  
  <!-- Cyber HUD Visor / Goggles (A1L Cyber Visor) -->
  <polygon points="80,120 220,120 210,158 90,158" fill="#0EA5E9" stroke="#F8FAFC" stroke-width="3.5"/>
  <line x1="80" y1="139" x2="220" y2="139" stroke="#F8FAFC" stroke-width="2"/>
  <text x="132" y="146" font-family="monospace" font-size="12" font-weight="900" fill="#FFFFFF">A1L-v2</text>
  
  <!-- Tactical Nose & Mouth (Sharp Mecha Manga Lines) -->
  <path d="M 148 172 L 152 178" stroke="#38BDF8" stroke-width="3.5" stroke-linecap="round"/>
  <path d="M 132 195 L 168 195" fill="none" stroke="#F8FAFC" stroke-width="3.5" stroke-linecap="round"/>
  
  <!-- Angular Spiky Anime Bangs -->
  <path d="M 60 100 Q 100 130 125 100 Q 150 150 175 98 Q 200 130 240 95 Q 210 50 150 40 Q 90 50 60 100 Z" fill="#020617" stroke="#38BDF8" stroke-width="2.5"/>
  <path d="M 95 65 L 110 90 M 135 55 L 145 88 M 180 58 L 170 88" stroke="#38BDF8" stroke-width="2" stroke-linecap="round"/>
  
  <!-- Tactical Collar & Armor Vest -->
  <polygon points="70,220 150,255 230,220 250,295 50,295" fill="#0F172A" stroke="#F8FAFC" stroke-width="4"/>
  <path d="M 110 238 L 110 285 M 190 238 L 190 285" stroke="#38BDF8" stroke-width="3" stroke-dasharray="4 4"/>
  
  <!-- Mecha Tech Badges -->
  <polygon points="250,50 260,65 275,70 260,75 250,90 240,75 225,70 240,65" fill="#F59E0B" stroke="#F8FAFC" stroke-width="2"/>
  <polygon points="35,130 40,140 50,145 40,150 35,160 30,150 20,145 30,140" fill="#0EA5E9" stroke="#F8FAFC" stroke-width="2"/>
</svg>
`)}`;

export const PROJECT_1_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 380" width="100%" height="100%">
  <rect width="600" height="380" fill="#FAFAFA"/>
  <pattern id="grid1" width="20" height="20" patternUnits="userSpaceOnUse">
    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#F1F5F9" stroke-width="1.5"/>
  </pattern>
  <rect width="600" height="380" fill="url(#grid1)"/>
  
  <!-- Anime Manga Panel Box -->
  <rect x="20" y="20" width="560" height="340" fill="#FFFFFF" stroke="#111827" stroke-width="4" rx="4"/>
  <rect x="35" y="35" width="530" height="40" fill="#FEF08A" stroke="#111827" stroke-width="3"/>
  <text x="50" y="61" font-family="monospace" font-size="18" font-weight="900" fill="#111827">⚡ SYSTEM://NEO_GENAI_STUDIO v3.0</text>
  
  <!-- Line Art Interface Wireframe -->
  <rect x="35" y="90" width="160" height="250" fill="#F8FAFC" stroke="#111827" stroke-width="3"/>
  <rect x="210" y="90" width="355" height="150" fill="#E0F2FE" stroke="#111827" stroke-width="3"/>
  <rect x="210" y="255" width="355" height="85" fill="#FFE4E6" stroke="#111827" stroke-width="3"/>
  
  <!-- Waveform line art -->
  <path d="M 225 165 Q 260 110 300 165 T 380 165 T 460 165 T 540 165" fill="none" stroke="#111827" stroke-width="4"/>
  <path d="M 225 165 Q 260 130 300 165 T 380 165 T 460 165 T 540 165" fill="none" stroke="#2563EB" stroke-width="2" stroke-dasharray="4 4"/>
  
  <!-- Manga FX Badge -->
  <polygon points="500,40 550,20 540,60 580,70 535,85 545,115 510,95 490,120 485,85 450,75 485,60" fill="#111827"/>
  <text x="495" y="73" font-family="sans-serif" font-size="13" font-weight="bold" fill="#FFFFFF">CRAZY!</text>
</svg>
`)}`;

export const PROJECT_2_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 380" width="100%" height="100%">
  <rect width="600" height="380" fill="#FAFAFA"/>
  <pattern id="mangaDots2" width="10" height="10" patternUnits="userSpaceOnUse">
    <circle cx="2" cy="2" r="1.5" fill="#E2E8F0"/>
  </pattern>
  <rect width="600" height="380" fill="url(#mangaDots2)"/>
  
  <rect x="20" y="20" width="560" height="340" fill="#FFFFFF" stroke="#111827" stroke-width="4"/>
  
  <!-- Diagonal Manga split panel -->
  <polygon points="30,30 400,30 220,350 30,350" fill="#F3E8FF" stroke="#111827" stroke-width="3"/>
  <polygon points="415,30 570,30 570,350 235,350" fill="#FFFFFF" stroke="#111827" stroke-width="3"/>
  
  <!-- Line art cyber brain / node web -->
  <circle cx="210" cy="180" r="45" fill="#FEF08A" stroke="#111827" stroke-width="3.5"/>
  <circle cx="100" cy="100" r="25" fill="#FFFFFF" stroke="#111827" stroke-width="3"/>
  <circle cx="110" cy="270" r="30" fill="#FFFFFF" stroke="#111827" stroke-width="3"/>
  <circle cx="420" cy="120" r="35" fill="#E0F2FE" stroke="#111827" stroke-width="3"/>
  <circle cx="480" cy="260" r="28" fill="#FFE4E6" stroke="#111827" stroke-width="3"/>
  
  <line x1="125" y1="100" x2="170" y2="155" stroke="#111827" stroke-width="3"/>
  <line x1="135" y1="250" x2="175" y2="205" stroke="#111827" stroke-width="3"/>
  <line x1="255" y1="180" x2="385" y2="130" stroke="#111827" stroke-width="3"/>
  <line x1="250" y1="200" x2="452" y2="250" stroke="#111827" stroke-width="3"/>

  <text x="50" y="70" font-family="monospace" font-size="20" font-weight="900" fill="#111827">🌐 AGENT_CANVAS</text>
  <rect x="50" y="85" width="120" height="24" fill="#111827" rx="3"/>
  <text x="58" y="101" font-family="sans-serif" font-size="12" font-weight="bold" fill="#FFFFFF">MULTI-AGENT UI</text>
</svg>
`)}`;

export const PROJECT_3_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 380" width="100%" height="100%">
  <rect width="600" height="380" fill="#FAFAFA"/>
  <rect x="20" y="20" width="560" height="340" fill="#FFFFFF" stroke="#111827" stroke-width="4"/>
  
  <!-- Speed lines background -->
  <g stroke="#E2E8F0" stroke-width="2">
    <line x1="300" y1="190" x2="0" y2="0"/>
    <line x1="300" y1="190" x2="600" y2="0"/>
    <line x1="300" y1="190" x2="0" y2="380"/>
    <line x1="300" y1="190" x2="600" y2="380"/>
    <line x1="300" y1="190" x2="300" y2="0"/>
    <line x1="300" y1="190" x2="300" y2="380"/>
  </g>
  
  <!-- Anime Isometric Terminal Box -->
  <polygon points="120,130 300,50 480,130 300,210" fill="#E0F2FE" stroke="#111827" stroke-width="4"/>
  <polygon points="120,130 300,210 300,320 120,240" fill="#FEF08A" stroke="#111827" stroke-width="4"/>
  <polygon points="480,130 300,210 300,320 480,240" fill="#FFE4E6" stroke="#111827" stroke-width="4"/>
  
  <text x="180" y="125" font-family="monospace" font-size="16" font-weight="bold" fill="#111827">CLI_SPEED_KIT</text>
</svg>
`)}`;

export const DEFAULT_AVATAR_URL = 'https://res.cloudinary.com/ggdsxmwu/image/upload/v1786301776/copy_of_chatgpt_image_202688_15_43_43.png';

export const INITIAL_SITE_DATA: SiteData = {
  profile: {
    name: 'A1L',
    alias: 'A1L / MECHA_GEEK',
    title: '全栈架构师 & 机甲动漫科技极客',
    subtitle: '专注于 AI 原生应用、高并发 Web 架构与硬派动漫线条 UI 视觉系统',
    avatarUrl: DEFAULT_AVATAR_URL,
    logoUrl: DEFAULT_AVATAR_URL,
    iconUrl: DEFAULT_AVATAR_URL,
    siteTitle: 'A1L 极客工程作品集 // MECHA CYBER PORTFOLIO',
    speechBubbleText: '「 代码如精密构件，唯有严丝合缝才能迸发极限性能！」',
    bioLines: [
      '6+ 年硬核全栈工程实践，擅长分布式系统设计与高性能前端架构。',
      '熟练运用 React 19, TypeScript, Tailwind CSS, Node.js 及 Gemini AI SDK 原生构建。',
      '热衷机甲动漫、Cyberpunk 美学与开源极客创作，将硬核工装线条融入现代产品。'
    ],
    location: '中国 · 深圳 / 远程 Remote',
    statusText: '⚡ A1L MECHA SYSTEM ONLINE',
    skills: [
      'A1L Core',
      'React 19',
      'TypeScript',
      'Tailwind CSS',
      'Node.js / Express',
      'Gemini AI SDK',
      'Cyber Line UI',
      'System Arch'
    ],
    blogUrl: 'https://dev.to',
    githubUrl: 'https://github.com',
    copyrightText: '© 2026 Kaito Lin (林海涛). All rights reserved.',
    copyrightSubtext: 'A1L MECHA ENGINE // CRAFTED WITH REACT & TAILWIND'
  },
  socialLinks: [
    {
      id: 'link-1',
      name: 'GitHub 开源主页',
      url: 'https://github.com',
      type: 'github',
      iconName: 'Github',
      badgeText: '100+ Repos',
      isPrimary: true
    },
    {
      id: 'link-2',
      name: '技术博客 (Medium / Dev.to)',
      url: 'https://dev.to',
      type: 'blog',
      iconName: 'BookOpen',
      badgeText: 'Weekly Blog',
      isPrimary: true
    },
    {
      id: 'link-3',
      name: 'Twitter / X 动态',
      url: 'https://x.com',
      type: 'twitter',
      iconName: 'Twitter',
      badgeText: 'Tech & Art'
    },
    {
      id: 'link-4',
      name: 'Bilibili 哔哩哔哩',
      url: 'https://bilibili.com',
      type: 'bilibili',
      iconName: 'Tv',
      badgeText: '动画 & 编程视频'
    },
    {
      id: 'link-5',
      name: '电子邮箱 (Email)',
      url: 'mailto:kaito.lin.dev@example.com',
      type: 'email',
      iconName: 'Mail',
      badgeText: 'Open for Hire'
    }
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'NeoGenAI Studio - 动漫线条 AI 创意工作站',
      summary: '基于 Gemini AI 原生 API 的突破性创意生成平台，支持线条画提示词生成与实时交互。',
      description: '结合 Gemini 2.5/Flash 大模型与极简线条 canvas 渲染器，帮助创作者通过自然语言生成漫画面板、线条连环画与矢量素材。全栈集成 Vite + Express 服务端。',
      imageUrl: PROJECT_1_SVG,
      demoUrl: 'https://ai.studio',
      githubUrl: 'https://github.com',
      category: 'AI Tool',
      tags: ['Gemini API', 'React 19', 'Tailwind', 'Express'],
      featured: true,
      createdAt: '2026-06-15'
    },
    {
      id: 'proj-2',
      title: 'AgentCanvas - 多 Agent 协作线条画板',
      summary: '多智能体自组织画布系统，在动漫分割面板中实时展现 Agent 推理流与交互结果。',
      description: '打破常规 Dashboard 视觉，引入分层分镜漫画面板 (Comic Grid Panel)。每一个 Panel 容纳一个专门的 Agent 操作流，具备手绘风格线框图与动态提示气泡。',
      imageUrl: PROJECT_2_SVG,
      demoUrl: 'https://example.com/agent-canvas',
      githubUrl: 'https://github.com',
      category: 'Web App',
      tags: ['TypeScript', 'WebSocket', 'Canvas API', 'Motion'],
      featured: true,
      createdAt: '2026-04-20'
    },
    {
      id: 'proj-3',
      title: 'LineCraft CLI - 极简命令行工匠工具包',
      summary: '针对开发者设计的终端线条高亮与文档自动化工具，一键生成二次元线条文档。',
      description: '轻量高效的终端 Rust/Node.js 工具，可为 API 接口生成干净的 Line-Art SVG 架构图，并在 Markdown 中无缝嵌入漫画风流程图。',
      imageUrl: PROJECT_3_SVG,
      githubUrl: 'https://github.com',
      category: 'CLI / Open Source',
      tags: ['Node.js', 'CLI', 'SVG Engine', 'Markdown'],
      featured: false,
      createdAt: '2026-02-10'
    }
  ],
  techSkills: [
    {
      id: 'skill-1',
      name: 'React 19 & Next.js Ecosystem',
      level: 96,
      category: 'frontend',
      color: '#38BDF8',
      experience: '6 Yrs',
      tagline: '高并发组件架构 / Server Components / 状态流转'
    },
    {
      id: 'skill-2',
      name: 'TypeScript & Advanced Type System',
      level: 94,
      category: 'frontend',
      color: '#F59E0B',
      experience: '5 Yrs',
      tagline: '类型拓扑建模 / 严格断言 / 零运行时开销'
    },
    {
      id: 'skill-3',
      name: 'Tailwind CSS & Cyber Line Art UI',
      level: 95,
      category: 'frontend',
      color: '#10B981',
      experience: '5 Yrs',
      tagline: '新暴力主义 (Neo-Brutalism) / 二次元高对比度线条视觉'
    },
    {
      id: 'skill-4',
      name: 'Node.js, Express & Distributed API',
      level: 90,
      category: 'backend',
      color: '#A855F7',
      experience: '6 Yrs',
      tagline: '高性能 REST Server / WebSocket / 代理路由转发'
    },
    {
      id: 'skill-5',
      name: 'Gemini AI SDK & AI Agents System',
      level: 88,
      category: 'ai',
      color: '#F43F5E',
      experience: '3 Yrs',
      tagline: '多模态推理 / Function Calling / 向量与结构化输出'
    },
    {
      id: 'skill-6',
      name: 'System Architecture & Performance',
      level: 87,
      category: 'architecture',
      color: '#0EA5E9',
      experience: '6 Yrs',
      tagline: '高可用容灾 / 模块解耦 / 极致首屏与渲染流优化'
    }
  ],
  footerLinks: [
    { id: 'fl-1', name: 'GitHub Profile', url: 'https://github.com', iconType: 'github' },
    { id: 'fl-2', name: 'X / Twitter', url: 'https://x.com', iconType: 'twitter' },
    { id: 'fl-3', name: 'Contact Email', url: 'mailto:kaito.lin.dev@example.com', iconType: 'email' },
    { id: 'fl-4', name: 'Dev Blog', url: 'https://dev.to', iconType: 'blog' },
  ]
};
