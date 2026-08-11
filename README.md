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

### 🗄️ Supabase 数据表设计与接入指南
本项目已在根目录准备好了完整的 SQL 初始化脚本 `supabase_schema.sql`。要在 Supabase 中连接并使用数据库，请按照以下步骤操作：
1. 登录 [Supabase 控制台](https://supabase.com/) 并创建一个新的 Project。
2. 进入项目后，点击左侧导航栏的 **SQL Editor**。
3. 将项目根目录下的 `supabase_schema.sql` 文件内容完整复制并粘贴到 SQL Editor 中。
4. 点击 **Run** 执行脚本，系统将自动创建以下数据表并配置行级安全策略（RLS）：
   - `profiles`（个人资料表）
   - `projects`（作品集项目表）
   - `blog_posts`（博客文章表）
   - `visitor_logs`（181天访客热力图日志表）
   - `geo_nodes`（全球访客雷达节点表）
### 🖼️ Cloudinary 凭证获取与配置指南 (签名模式与无签名模式)

要在项目中配置和使用 Cloudinary 作为图片存储库，您可以根据需要选择 **Signed (安全签名模式)** 或 **Unsigned (便捷无签名模式)**。

#### 1. 注册与登录
- 访问 [Cloudinary 官网](https://cloudinary.com/) 并注册/登录您的免费账号。

#### 2. 从控制台获取基础凭证
登录后进入 **Dashboard** (控制台首页)，在 **Product Environment Credentials** / **API Keys** 模块中可以直接复制以下信息：
- **Cloud Name** -> 对应 `.env` 中的 `VITE_CLOUDINARY_CLOUD_NAME`
- **API Key** -> 对应 `.env` 中的 `VITE_CLOUDINARY_API_KEY` (仅签名模式需要)
- **API Secret (`VITE_CLOUDINARY_API_SECRET`)** -> **Cloudinary 官方提供**。点击 **API Secret** 旁边的 "Show"（眼睛）图标或 "Copy" 按钮进行查看和复制。

---

#### 3. 详细解释：如何获取与配置这两个关键变量？

##### 🔑 A. `VITE_CLOUDINARY_API_SECRET` (Cloudinary 密钥)
- **简介**：这是 Cloudinary 官方分配给您账户的顶级私钥，用于生成安全签名，确保上传请求来自您本人的授权。
- **如何获取**：
  1. 登录 [Cloudinary Console](https://cloudinary.com/)。
  2. 确保页面处于 **Dashboard** (控制台主页)。
  3. 在 **API Keys** 或 **Product Environment Credentials** 模块内，可以看到 `API Secret` 字段。
  4. 默认是隐藏状态，点击旁边的**眼睛图标**（Show）或直接点击**复制按钮**，即可获得纯文本的密钥字符串。
  5. 填入 `.env` 中的 `VITE_CLOUDINARY_API_SECRET`。

---

#### 4. 配置上传模式

##### 选项 A：安全签名模式 (Signed Mode) —— 💡 推荐，更安全
1. 在控制台右上角点击齿轮图标进入 **Settings**（设置），选择 **Upload** 标签页。
2. 滚动到 **Upload presets**，点击 **Add upload preset**。
3. 将 **Signing Mode** 设置为 **Signed**（已签名）。
4. 保存后记下该 Preset 的名称（例如 `my_signed_preset`），并填写到 `.env` 的 `VITE_CLOUDINARY_UPLOAD_PRESET`。
5. 在 `.env` 中补全所有配置：
   ```env
   VITE_CLOUDINARY_CLOUD_NAME=您的 Cloud Name
   VITE_CLOUDINARY_UPLOAD_PRESET=您的 Signed Preset 名称
   VITE_CLOUDINARY_API_KEY=您的 API Key
   VITE_CLOUDINARY_API_SECRET=您的 API Secret
   ```

##### 选项 B：便捷无签名模式 (Unsigned Mode) —— 适合快速开发
1. 在 **Settings > Upload** 标签页中滚动到 **Upload presets**，点击 **Add upload preset**。
2. 将 **Signing Mode** 设置为 **Unsigned**（无签名）。
3. 保存并记下该 Preset 名称。
4. 在 `.env` 中仅需配置：
   ```env
   VITE_CLOUDINARY_CLOUD_NAME=您的 Cloud Name
   VITE_CLOUDINARY_UPLOAD_PRESET=您的 Unsigned Preset 名称
   ```

---

#### 5. 项目内上传函数调用
项目已经预置了安全分流模块 `src/lib/cloudinary.ts`。当您在 `.env` 中配置了 `VITE_CLOUDINARY_API_KEY` 与 `VITE_CLOUDINARY_API_SECRET` 时，系统会自动切换到高安全性的 **Signed 签名模式** 并在客户端进行高强度的 SHA-1 加密校验；否则会自动降级使用 **Unsigned 无签名模式**。

调用方式非常简单：
```typescript
import { uploadToCloudinary } from '@/lib/cloudinary';

// 在表单或上传组件中直接调用：
const imageUrl = await uploadToCloudinary(file);
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
