# Kyvero Portfolio & Analytics Console

🚀 **Kyvero** 是一个采用现代硬核新粗野主义（Neo-Brutalist）视觉美学打造的全栈个人主站与多维数据管理系统。

---

## 🛠️ 技术栈 (Technology Stack)

* **前端核心 (Frontend)**: React 18, TypeScript, Vite, Tailwind CSS
* **动画引擎 (Animations)**: Motion (`motion/react`)
* **数据可视化 (Data Visualization)**: D3.js (用于半年度贡献热力图、全球访客雷达与数据统计矩阵)
* **后端数据库 (Backend & Database)**: Supabase (PostgreSQL 关系型数据库、行级安全策略 RLS、实时订阅)
* **媒体存储库 (Media Storage)**: Cloudinary API (用于作品图片与头像的云端托管、自动裁剪与全球 CDN 加速)
* **静态部署与托管 (Deployment)**: Netlify (支持 SPA 路由重定向、极速 Edge 节点分发与自动化持续部署)

---

## ✨ 核心功能特性 (Core Features)

1. **硬核美学主页 (Neo-Brutalist Portfolio)**:
   - 独特的粗线条与高对比度色彩搭配，集成个人简介、项目作品集、社交矩阵与多语言切换（中、繁、英、日等）。
2. **沉浸式管理控制台 (Admin Console)**:
   - 独立密码加密保护通道，支持快捷指令 `admin` 或直接访问 `/admin` 路由触发。
   - 包含个人资料维护、文章博客系统、项目管理与全景流量监控。
3. **半年度访客活跃热力图 (GitHub-Style Semiannual Heatmap)**:
   - 采用 D3.js 渲染的 181 天（26周）贡献热力矩阵，直观展示每日访客活跃峰值。
4. **全球访客动态雷达 (Global Geo & Traffic Radar)**:
   - 交互式地图与全球节点流量分布，支持国内大区与海外节点的实时切换。

---

## 📦 快速开始与本地开发 (Getting Started)

### 1. 克隆项目
```bash
git clone https://github.com/your-username/a1l-portfolio-console.git
cd a1l-portfolio-console
```

### 2. 安装依赖
```bash
npm install
```

### 3. 配置环境变量
在根目录下复制 `.env.example` 并重命名为 `.env`，填入您的 Supabase 与 Cloudinary 密钥：
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_cloudinary_preset
```

### 4. 启动本地开发服务器
```bash
npm run dev
```
项目将在 `http://localhost:3000` 运行。

---

## 🚢 部署指南 (Deployment to Netlify)

1. 将代码推送到 GitHub 仓库。
2. 在 [Netlify](https://www.netlify.com/) 中新建站点并连接您的 GitHub 仓库。
3. 构建配置：
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. 在 Netlify 站点设置中配置上述环境变量。
5. 点击 **Deploy site** 完成部署。

---

## 📄 许可证 (License)

MIT License © 2026 Kaito Lin.
