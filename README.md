<div align="center">

# ⚡ KYVERO PORTFOLIO & MULTI-DIMENSIONAL ANALYTICS CONSOLE
### 🚀 Modern Neo-Brutalist Full-Stack Web Application & Visitor Intelligence Engine

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite_6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Hono](https://img.shields.io/badge/Hono_API-E36002?style=for-the-badge&logo=hono&logoColor=white)](https://hono.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com/)
[![D3.js](https://img.shields.io/badge/D3.js-F9A03C?style=for-the-badge&logo=d3.js&logoColor=white)](https://d3js.org/)
[![DeepL](https://img.shields.io/badge/DeepL_API-0F2B46?style=for-the-badge&logo=deepl&logoColor=white)](https://www.deepl.com/)
[![LLM Context](https://img.shields.io/badge/LLM--Ready-llm.txt_v2.1-8A2BE2?style=for-the-badge&logo=openai&logoColor=white)](https://kyvero.app/llm.txt)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Netlify Status](https://api.netlify.com/api/v1/badges/e51574ba-8863-4f1f-bc72-febeffd10498/deploy-status)](https://app.netlify.com/projects/kyvero/deploys)
[中文文档](./README_CN.md)

</div>

## 🎨 Design & Architecture Overview

Kyvero blends **Neo-Brutalist** visual aesthetics with a modern high-concurrency full-stack architecture. It features distinctive bold borders, high-contrast shadows, responsive layouts, and a sophisticated data analytics backend.

```mermaid
graph TD
    A[Visitors & Admin] -->|Visit / Switch Language| B(React 18 + Vite SPA Frontend)
    B -->|State Management & Dynamic Routing| C[AppContext State Engine]
    C -->|Real-time Access & Proxy API| D[Hono Edge API & Supabase PostgreSQL]
    C -->|Asset & Portfolio Hosting| E[Cloudinary CDN Media Library]
    D -->|D3.js Heatmap Matrix| F[Visitor Analytics Console]
    D -->|GeoHash Node Monitoring| G[Global Visitor Radar]
    D -->|Dynamic Context Engine| H[Dynamic llm.txt & Sitemap Generator]
```

## 🛠️ Technology Stack

| Domain | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18, Vite 6, TypeScript | High-performance single page application shell |
| **Styling & Motion** | Tailwind CSS v4, Motion (Framer Motion) | Neo-Brutalist aesthetic with reactive micro-interactions |
| **Backend API** | Hono Framework, Node.js, Express | Edge-ready server architecture with serverless adapters |
| **Database & Storage** | Supabase (PostgreSQL), Cloudinary CDN | Cloud-native persistent data and optimized media hosting |
| **Data Visualization** | D3.js, React Simple Maps | 181-day activity heatmap & interactive global traffic radar |
| **Internationalization** | I18N Dictionary + DeepL Translation API | 5-language native dictionary with automated translation |
| **SEO & LLM Context** | SSR Meta Injection, Dynamic `llm.txt` v2.1 | Context-aware AI indexing and multi-language sitemap |

## 🌟 Core Features

| Module | Description | Technical Highlights |
| :--- | :--- | :--- |
| **🎨 Neo-Brutalist UI** | Elegant personal cards, skill matrices, open-source project displays, and social grids. | High-contrast visuals, seamless animations (`Motion`). |
| **📊 Analytics Heatmap** | GitHub-style heatmap showing 181 days (26 weeks) of visitor activity. | D3.js rendering, real-time sync with `analytics` table. |
| **🌍 Visitor Radar** | Interactive geo-distribution radar and global node monitoring. | Real-time stats, node latency detection, GeoHash mapping. |
| **🔒 Admin Console** | Password-protected dashboard (`/admin`) for full-site CRUD operations. | Brand customization, data backup, and one-click reset. |
| **🌐 Multilingual Engine** | Built-in support for 5 professional languages with dictionary management. | Simplified Chinese, Traditional Chinese, English, Japanese, Korean. |
| **🤖 LLM Context & SEO** | Dynamic `llm.txt` generator and SSR Open Graph metadata. | Real-time DB content summary for AI agents & search engines. |

## 🌐 Multilingual Support

The system features an enterprise-grade I18N dictionary management mechanism, ensuring professional accuracy of technical terms:

* **🇨🇳 Simplified Chinese (`zh-CN`)** —— Default System Language
* **🇭🇰 Traditional Chinese (`zh-TW`)** —— For HK, TW, and overseas users
* **🇺🇸 English (`en`)** —— International Standard
* **🇯🇵 Japanese (`ja`)** —— Localized for Japan
* **🇰🇷 Korean (`ko`)** —— Localized for Korea

## 🤖 Dynamic LLM Context & SEO Engine

Kyvero includes native support for LLM-based web crawlers and search engine crawlers:

* **Dynamic `/llm.txt`**: Real-time markdown output summarizing site architecture, project collections, and skill entities directly from Supabase.
* **Open Graph SSR**: Server-side injection of `og:title`, `og:description`, `og:image`, and `canonical` tags with HTTPS protocol validation.
* **Multilingual Sitemap**: Automatic `sitemap.xml` generation with `xhtml:link` hreflang annotations across all 5 supported languages.

## 📦 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/your-username/kyvero-portfolio-console.git
cd kyvero-portfolio-console
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory (refer to `.env.example`):
```env
VITE_SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_or_service_key
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_cloudinary_preset
VITE_CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
DEEPL_API_KEY=your_deepl_api_key
```

### 3. Initialize Supabase
1. Create a project on [Supabase Console](https://supabase.com/).
2. Open **SQL Editor**, copy and run the `supabase_schema.sql` script.
3. Tables such as `profiles`, `projects`, `tech_skills`, `experiences`, `social_links`, `media_items`, and `analytics` will be created automatically.

### 4. Run Development Server
```bash
npm run dev
```
The app will be available at `http://localhost:3000`.

## 🚢 Deployment Guide

Kyvero's backend is built with the **Hono** framework, supporting various Serverless and Edge platforms.

### 1. Core Configuration
Ensure the following variables are configured in your deployment platform:
- `VITE_SUPABASE_URL`
- `SUPABASE_KEY` (Supabase **service_role** key is recommended for backend operations)
- `DEEPL_API_KEY` (Server-side secret)
- `CLOUDINARY_API_SECRET` (Server-side secret)

### 2. Platform Adapters
- **Cloudflare Workers**: Entry point at `src/api/adapters/cloudflare.ts`.
- **Vercel**: Entry point at `src/api/adapters/vercel.ts`.
- **AWS Lambda**: Entry point at `src/api/adapters/aws-lambda.ts`.
- **Node.js (Express)**: Standard entry point at `server.ts`.

### 3. Production Build
```bash
# Build both frontend and backend
npm run build

# Start production server
npm start
```

## 📄 License & Attribution

This project is licensed under a **Customized MIT License**:
* **Allowed**: Commercial use, modification, distribution, private use.
* **Mandatory**: Any website or application using this software **must** include a visible link back to the original GitHub repository in its user interface (e.g., in the footer).

See the [LICENSE](./LICENSE) file for the full text.

MIT License © 2026 Kyvero Portfolio Console.
