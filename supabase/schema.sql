-- ====================================================================
-- A1L Mecha Cyber Portfolio & System Console - Supabase SQL Schema & Data
-- ====================================================================
-- Description: Complete SQL schema and seed data for Supabase database.
-- Run this script in the Supabase SQL Editor to provision tables & initial data.

-- Drop existing tables if re-initializing (Clean setup)
DROP TABLE IF EXISTS public.analytics CASCADE;
DROP TABLE IF EXISTS public.footer_links CASCADE;
DROP TABLE IF EXISTS public.system_config CASCADE;
DROP TABLE IF EXISTS public.media_items CASCADE;
DROP TABLE IF EXISTS public.social_links CASCADE;
DROP TABLE IF EXISTS public.experiences CASCADE;
DROP TABLE IF EXISTS public.tech_skills CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- --------------------------------------------------------------------
-- 1. Users Table (管理员与账号角色)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  avatar TEXT,
  role TEXT DEFAULT 'Administrator',
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed Default Admin User
INSERT INTO public.users (id, username, password, name, avatar, role, email)
VALUES (
  'usr_admin_001',
  'admin',
  'admin123',
  '超级管理员',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  'Administrator',
  'admin@example.com'
)
ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  password = EXCLUDED.password,
  name = EXCLUDED.name,
  avatar = EXCLUDED.avatar,
  role = EXCLUDED.role,
  email = EXCLUDED.email;

-- --------------------------------------------------------------------
-- 2. Profiles Table (个人资料 & 多语言 Bio)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  alias TEXT,
  title JSONB DEFAULT '{}'::jsonb,
  subtitle JSONB DEFAULT '{}'::jsonb,
  avatar_url TEXT,
  speech_bubble_text JSONB DEFAULT '{}'::jsonb,
  bio_lines JSONB DEFAULT '{}'::jsonb,
  location JSONB DEFAULT '{}'::jsonb,
  status_text TEXT,
  skills TEXT[] DEFAULT '{}',
  blog_url TEXT,
  github_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed Default Profile
INSERT INTO public.profiles (
  id, name, alias, title, subtitle, avatar_url, speech_bubble_text, bio_lines, location, status_text, skills, blog_url, github_url
) VALUES (
  'profile_default',
  'A1L',
  'A1L / MECHA_GEEK',
  $$
  {
    "zh-CN": "全栈架构师 & 机甲动漫科技极客",
    "zh-TW": "全棧架構師 & 機甲動漫科技極客",
    "en": "Full-stack Architect & Mecha Tech Geek",
    "ja": "フルスタックアーキテクト＆メカテックギーク",
    "ko": "풀스택 아키텍트 & 메카 테크 긱"
  }
  $$::jsonb,
  $$
  {
    "zh-CN": "专注于 AI 原生应用、高并发 Web 架构与硬派动漫线条 UI 视觉系统",
    "zh-TW": "專注於 AI 原生應用、高併發 Web 架構與硬派動漫線條 UI 視覺系統",
    "en": "Focusing on AI-native applications, high-concurrency web architecture, and hard-edged mecha line UI visual systems",
    "ja": "AIネイティブアプリケーション、高並行Webアーキテクチャ、ハードエッジメカラインUIビジュアルシステムに注力",
    "ko": "AI 네이티브 애플리케이션, 고동시성 웹 아키텍처 및 하드에지 메카 라인 UI 시각 시스템에 집중"
  }
  $$::jsonb,
  'https://res.cloudinary.com/ggdsxmwu/image/upload/v1786301776/copy_of_chatgpt_image_202688_15_43_43.png',
  $$
  {
    "zh-CN": "「 代码如精密构件，唯有严丝合缝才能迸发极限性能！」",
    "zh-TW": "「 程式碼如精密構件，唯有嚴絲合縫才能迸發極限效能！」",
    "en": "\"Code is like precision components, only perfect fits can unleash extreme performance!\"",
    "ja": "「コードは精密部品のようなもの、完璧にフィットしてこそ極限の性能を発揮する！」",
    "ko": "\"코드는 정밀 부품과 같아, 완벽하게 맞아야 극한의 성능을 발휘한다!\""
  }
  $$::jsonb,
  $$
  {
    "zh-CN": [
      "6+ 年硬核全栈工程实践，擅长分布式系统设计与高性能前端架构。",
      "熟练运用 React 19, TypeScript, Tailwind CSS, Node.js 及 Gemini AI SDK 原生构建。",
      "热衷机甲动漫、Cyberpunk 美学与开源极客创作，将硬核工装线条融入现代产品。"
    ],
    "zh-TW": [
      "6+ 年硬核全棧工程實踐，擅長分佈式系統設計與高效能前端架構。",
      "熟練運用 React 19, TypeScript, Tailwind CSS, Node.js 及 Gemini AI SDK 原生構建。",
      "熱衷機甲動漫、Cyberpunk 美學與開源極客創作，將硬核工裝線條融入現代產品。"
    ],
    "en": [
      "6+ years of hardcore full-stack engineering experience, specializing in distributed system design and high-performance frontend architecture.",
      "Proficient in React 19, TypeScript, Tailwind CSS, Node.js, and native Gemini AI SDK development.",
      "Passionate about mecha anime, Cyberpunk aesthetics, and open-source geek creation, integrating hard-edge mecha lines into modern products."
    ],
    "ja": [
      "6年以上のハードコアフルスタックエンジニアリングの経験があり、分散システム設計と高性能フロントエンドアーキテクチャを専門としています。",
      "React 19、TypeScript、Tailwind CSS、Node.js、およびネイティブGemini AI SDKの開発に熟練しています。",
      "メカアニメ、サイバーパンプの美学、オープンソースのギーク創作に情熱を注ぎ、ハードエッジなメカのラインを現代の製品に統合しています。"
    ],
    "ko": [
      "6년 이상의 하드코어 풀스택 엔지니어링 경험을 보유하고 있으며, 분산 시스템 설계 및 고성능 프론트엔드 아키텍처를 전문으로 합니다.",
      "React 19, TypeScript, Tailwind CSS, Node.js 및 네이티브 Gemini AI SDK 개발에 능숙합니다.",
      "메카 애니메이션, 사이버펑크 미학, 오픈소스 긱 창작에 열정적이며, 하드엣지 메카 라인을 현대 제품에 통합합니다."
    ]
  }
  $$::jsonb,
  $$
  {
    "zh-CN": "中国 · 深圳 / 远程 Remote",
    "zh-TW": "中國 · 深圳 / 遠程 Remote",
    "en": "Shenzhen, China / Remote",
    "ja": "中国・深セン / リモート",
    "ko": "중국 선전 / 원격"
  }
  $$::jsonb,
  '⚡ A1L ',
  ARRAY['A1L Core', 'React 19', 'TypeScript', 'Tailwind CSS', 'Node.js / Express', 'Gemini AI SDK', 'Cyber Line UI', 'System Arch'],
  'https://dev.to',
  'https://github.com'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  alias = EXCLUDED.alias,
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  avatar_url = EXCLUDED.avatar_url,
  speech_bubble_text = EXCLUDED.speech_bubble_text,
  bio_lines = EXCLUDED.bio_lines,
  location = EXCLUDED.location,
  status_text = EXCLUDED.status_text,
  skills = EXCLUDED.skills,
  blog_url = EXCLUDED.blog_url,
  github_url = EXCLUDED.github_url;

-- --------------------------------------------------------------------
-- 3. Projects Table (代表作品与展示项目)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  title JSONB DEFAULT '{}'::jsonb,
  summary JSONB DEFAULT '{}'::jsonb,
  description JSONB DEFAULT '{}'::jsonb,
  category JSONB DEFAULT '{}'::jsonb,
  image_url TEXT,
  demo_url TEXT,
  github_url TEXT,
  tags TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  created_at TEXT NOT NULL
);

-- Seed Default Projects
INSERT INTO public.projects (id, title, summary, description, category, image_url, demo_url, github_url, tags, featured, created_at)
VALUES 
(
  'proj-1',
  $$
  {
    "zh-CN": "NeoGenAI Studio - 动漫线条 AI 创意工作站",
    "zh-TW": "NeoGenAI Studio - 動漫線條 AI 創意工作站",
    "en": "NeoGenAI Studio - Anime Line Art Creative Hub",
    "ja": "NeoGenAI Studio - アニメ線画 AI クリエイティブワークステーション",
    "ko": "NeoGenAI Studio - 애니메이션 라인 아트 AI 크리에이티브 워크스테이션"
  }
  $$::jsonb,
  $$
  {
    "zh-CN": "基于 Gemini AI 原生 API 的突破性创意生成平台，支持线条画提示词生成与实时交互。",
    "zh-TW": "基於 Gemini AI 原生 API 的突破性創意生成平台，支援線條畫提示詞生成與即時互動。",
    "en": "A breakthrough creative generation platform based on Gemini AI native API, supporting line-art prompt generation and real-time interaction.",
    "ja": "Gemini AIのネイティブAPIを基盤とした画期的な生成プラットフォーム。線画プロンプト生成とリアルタイム対話をサポートします。",
    "ko": "Gemini AI 네이티브 API 기반의 획기적인 생성 플랫폼으로, 라인 아트 프롬프트 생성 및 실시간 상호작용 지원."
  }
  $$::jsonb,
  $$
  {
    "zh-CN": "结合 Gemini 2.5/Flash 大模型与极简线条 canvas 渲染器，帮助创作者通过自然语言生成漫画面板、线条连环画与矢量素材。全栈集成 Vite + Express 服务端。",
    "zh-TW": "結合 Gemini 2.5/Flash 大模型與極簡線條 canvas 渲染器，幫助創作者透過自然語言生成漫畫面版、線條連環畫與向量素材。全棧整合 Vite + Express 伺服端。",
    "en": "Combines Gemini 2.5/Flash LLM with a minimalist line canvas renderer, helping creators generate comic panels, storyboards, and vector assets via natural language. Full-stack integration with Vite + Express backend.",
    "ja": "Gemini 2.5/Flash大規模モデルとミニマルな線画キャンバスレンダラーを統合。自然言語でコミックパネル、絵コンテ、ベクター素材の生成を支援します。Vite + Expressフルスタック。",
    "ko": "Gemini 2.5/Flash 대형 모델과 미니멀 라인 canvas 렌더러를 통합하여 자연어로 만화 패널, 스토리보드, 벡터 소재 생성을 지원. Vite + Express 풀스택 백엔드 포함."
  }
  $$::jsonb,
  $$
  {
    "zh-CN": "AI 工具",
    "zh-TW": "AI 工具",
    "en": "AI Tool",
    "ja": "AIツール",
    "ko": "AI 도구"
  }
  $$::jsonb,
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60',
  'https://ai.studio',
  'https://github.com',
  ARRAY['Gemini API', 'React 19', 'Tailwind', 'Express'],
  true,
  '2026-06-15'
),
(
  'proj-2',
  $$
  {
    "zh-CN": "AgentCanvas - 多 Agent 协作线条画板",
    "zh-TW": "AgentCanvas - 多 Agent 協作線條畫板",
    "en": "AgentCanvas - Multi-Agent Collaborative Canvas",
    "ja": "AgentCanvas - 複数エージェント協調線画キャンバス",
    "ko": "AgentCanvas - 멀티 에이전트 협업 라인 보드"
  }
  $$::jsonb,
  $$
  {
    "zh-CN": "多智能体自组织画布系统，在动漫分割面板中实时展现 Agent 推理流与交互结果。",
    "zh-TW": "多智能體自組織畫布系統，在動漫分割面板中即時展現 Agent 推理流與互動結果。",
    "en": "A self-organizing multi-agent canvas system visualizing agent reasoning streams and interaction results in comic panels.",
    "ja": "自律型マルチエージェントキャンバスシステム。コミック分割パネルにエージェントの推論プロセスとインタラクションをリアルタイム表示。",
    "ko": "만화 패널에서 에이전트의 추론 흐름과 상호작용 결과를 실시간으로 보여주는 다중 에이전트 자율 구성 캔버스 시스템."
  }
  $$::jsonb,
  $$
  {
    "zh-CN": "打破常规 Dashboard 视觉，引入分层分镜漫画面板 (Comic Grid Panel)。每一个 Panel 容纳一个专门的 Agent 操作流，具备手绘风格线框图与动态提示气泡。",
    "zh-TW": "打破常規 Dashboard 視覺，引入分層分鏡漫畫面板 (Comic Grid Panel)。每一個 Panel 容納一個專門的 Agent 操作流，具備手繪風格線框圖與動態提示氣泡。",
    "en": "Reimagines traditional dashboards with a Comic Grid Panel layout. Each panel runs a specialized Agent workflow with hand-drawn style wireframes and dynamic dialogue bubbles.",
    "ja": "従来のダッシュボードを覆し、コマ割りコミックパネル（Comic Grid Panel）を導入。各パネルに専用エージェントを割り当て、手書き風ワイヤーフレームと吹き出しで可視化。",
    "ko": "일반 대시보드를 탈피하여 컷 분할 만화 패널(Comic Grid Panel) 레이아웃을 도입. 각 패널은 수채화 스타일 와이어프레임과 말풍선으로 에이전트 워크플로우를 시각화."
  }
  $$::jsonb,
  $$
  {
    "zh-CN": "网络应用",
    "zh-TW": "網路應用",
    "en": "Web App",
    "ja": "Webアプリ",
    "ko": "웹 앱"
  }
  $$::jsonb,
  'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&auto=format&fit=crop&q=60',
  'https://example.com/agent-canvas',
  'https://github.com',
  ARRAY['TypeScript', 'WebSocket', 'Canvas API', 'Motion'],
  true,
  '2026-04-20'
),
(
  'proj-3',
  $$
  {
    "zh-CN": "LineCraft CLI - 极简命令行工匠工具包",
    "zh-TW": "LineCraft CLI - 極簡命令行工匠工具包",
    "en": "LineCraft CLI - Minimalist Command Line Toolkit",
    "ja": "LineCraft CLI - ミニマルコマンドライン・クラフトツールキット",
    "ko": "LineCraft CLI - 미니멀 커맨드 라인 크래프트 툴킷"
  }
  $$::jsonb,
  $$
  {
    "zh-CN": "针对开发者设计的终端线条高亮与文档自动化工具，一键生成二次元线条文档。",
    "zh-TW": "針對開發者設計的終端線條高亮與文件自動化工具，一鍵生成二次元線條文件。",
    "en": "Terminal line highlighter and document automation tool designed for developers to generate anime-style line documents.",
    "ja": "開発者向けに設計された、ターミナル線画強調表示およびドキュメント自動化ツール。二次元風ドキュメントをワンクリック生成。",
    "ko": "개발자를 위해 설계된 터미널 라인 하이라이팅 및 문서 자동화 도구로, 서브컬처 라인 아트를 원클릭 생성."
  }
  $$::jsonb,
  $$
  {
    "zh-CN": "轻量高效的终端 Rust/Node.js 工具，可为 API 接口生成干净的 Line-Art SVG 架构图，并在 Markdown 中无缝嵌入漫画风流程图。",
    "zh-TW": "輕量高效的終端 Rust/Node.js 工具，可為 API 接口生成乾淨的 Line-Art SVG 架構圖，並在 Markdown 中無縫嵌入漫畫風流程圖。",
    "en": "A lightweight and efficient CLI tool in Rust/Node.js to generate clean line-art SVG architecture diagrams for APIs and embed comic-style flowcharts in Markdown seamlessly.",
    "ja": "Rust/Node.jsで書かれた軽量・高速CLIツール。APIのクリーンなラインアートSVG構成図を生成し、Markdownにコミック風フローチャートをシームレスに埋め込みます。",
    "ko": "Rust/Node.js로 작성된 가볍고 효율적인 CLI 도구로, API를 위한 깔끔한 라인 아트 SVG 아키텍처 다이어그램을 생성하고 Markdown에 만화풍 흐름도를 매끄럽게 포함."
  }
  $$::jsonb,
  $$
  {
    "zh-CN": "开源工具",
    "zh-TW": "開源工具",
    "en": "CLI / OSS",
    "ja": "開発ツール",
    "ko": "CLI / 오픈소스"
  }
  $$::jsonb,
  'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&auto=format&fit=crop&q=60',
  NULL,
  'https://github.com',
  ARRAY['Node.js', 'CLI', 'SVG Engine', 'Markdown'],
  false,
  '2026-02-10'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  image_url = EXCLUDED.image_url,
  demo_url = EXCLUDED.demo_url,
  github_url = EXCLUDED.github_url,
  tags = EXCLUDED.tags,
  featured = EXCLUDED.featured,
  created_at = EXCLUDED.created_at;

-- --------------------------------------------------------------------
-- 4. Tech Skills Table (技术技能表)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tech_skills (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  level INTEGER NOT NULL,
  category TEXT NOT NULL,
  color TEXT NOT NULL,
  experience TEXT NOT NULL,
  tagline JSONB DEFAULT '{}'::jsonb
);

-- Seed Default Tech Skills
INSERT INTO public.tech_skills (id, name, level, category, color, experience, tagline)
VALUES
(
  'skill-1',
  'React 19 & Next.js Ecosystem',
  96,
  'frontend',
  '#38BDF8',
  '6 Yrs',
  $$
  {
    "zh-CN": "高并发组件架构 / Server Components / 状态流转",
    "zh-TW": "高併發組件架構 / Server Components / 狀態流轉",
    "en": "High-Concurrency Component Architecture / Server Components / State Flow",
    "ja": "高同時実行コンポーネントアーキテクチャ / Server Components / 状態フロー",
    "ko": "고동시성 컴포넌트 아키텍처 / Server Components / 상태 흐름"
  }
  $$::jsonb
),
(
  'skill-2',
  'TypeScript & Advanced Type System',
  94,
  'frontend',
  '#F59E0B',
  '5 Yrs',
  $$
  {
    "zh-CN": "类型拓扑建模 / 严格断言 / 零运行时开销",
    "zh-TW": "類型拓撲建模 / 嚴格斷言 / 零運行時開銷",
    "en": "Type Topology Modeling / Strict Assertions / Zero Runtime Overhead",
    "ja": "型トポロジーモデリング / 厳密なアサーション / ゼロランタイムオーバーヘッド",
    "ko": "타입 토폴로지 모델링 / 엄격한 단언 / 런타임 오버헤드 없음"
  }
  $$::jsonb
),
(
  'skill-3',
  'Tailwind CSS & Cyber Line Art UI',
  95,
  'frontend',
  '#10B981',
  '5 Yrs',
  $$
  {
    "zh-CN": "新暴力主义 (Neo-Brutalism) / 二次元高对比度线条视觉",
    "zh-TW": "新暴力主義 (Neo-Brutalism) / 二次元高對比度線條視覺",
    "en": "Neo-Brutalism / High-Contrast Anime Line Art Aesthetics",
    "ja": "ネオ・ブルータリズム / アニメ調高コントラストラインアート美学",
    "ko": "네오 브루탈리즘 / 고대비 애니메이션 라인 아트 미학"
  }
  $$::jsonb
),
(
  'skill-4',
  'Node.js, Express & Distributed API',
  90,
  'backend',
  '#A855F7',
  '6 Yrs',
  $$
  {
    "zh-CN": "高性能 REST Server / WebSocket / 代理路由转发",
    "zh-TW": "高效能 REST Server / WebSocket / 代理路由轉發",
    "en": "High-Performance REST Server / WebSocket / Proxy Routing",
    "ja": "高性能 REST Server / WebSocket / プロキシルーティング転送",
    "ko": "고성능 REST Server / WebSocket / 프록시 라우팅 전달"
  }
  $$::jsonb
),
(
  'skill-5',
  'Gemini AI SDK & AI Agents System',
  88,
  'ai',
  '#F43F5E',
  '3 Yrs',
  $$
  {
    "zh-CN": "多模态推理 / Function Calling / 向量与结构化输出",
    "zh-TW": "多模態推理 / Function Calling / 向量與結構化輸出",
    "en": "Multimodal Inference / Function Calling / Vector & Structured Outputs",
    "ja": "マルチモーダル推論 / Function Calling / ベクトルと構造化出力",
    "ko": "멀티모달 추론 / Function Calling / 벡터 및 구조화된 출력"
  }
  $$::jsonb
),
(
  'skill-6',
  'System Architecture & Performance',
  87,
  'architecture',
  '#0EA5E9',
  '6 Yrs',
  $$
  {
    "zh-CN": "高可用容灾 / 模块解耦 / 极致首屏与渲染流优化",
    "zh-TW": "高可用容災 / 模組解耦 / 極致首屏與渲染流優化",
    "en": "High Availability Disaster Recovery / Module Decoupling / Extreme FCP & Render Optimization",
    "ja": "高可用性災害復旧 / モジュール分離 / 究極のFCPとレンダリング最適化",
    "ko": "고가용성 재해 복구 / 모듈 디커플링 / 극대화된 FCP 및 렌더링 최적화"
  }
  $$::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  level = EXCLUDED.level,
  category = EXCLUDED.category,
  color = EXCLUDED.color,
  experience = EXCLUDED.experience,
  tagline = EXCLUDED.tagline;

-- --------------------------------------------------------------------
-- 5. Experiences Table (工作与履历表)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.experiences (
  id TEXT PRIMARY KEY,
  company JSONB DEFAULT '{}'::jsonb,
  role JSONB DEFAULT '{}'::jsonb,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  description JSONB DEFAULT '{}'::jsonb,
  technologies TEXT[] DEFAULT '{}'
);

-- Seed Default Experiences
INSERT INTO public.experiences (id, company, role, start_date, end_date, description, technologies)
VALUES
(
  'exp-1',
  $$
  {
    "zh-CN": "幻影科技",
    "zh-TW": "幻影科技",
    "en": "Phantom Technologies",
    "ja": "ファントムテクノロジーズ",
    "ko": "팬텀 테크놀로지스"
  }
  $$::jsonb,
  $$
  {
    "zh-CN": "高级全栈开发工程师",
    "zh-TW": "高級全棧開發工程師",
    "en": "Senior Full Stack Developer",
    "ja": "シニアフルスタックエンジニア",
    "ko": "시니어 풀스택 개발자"
  }
  $$::jsonb,
  '2021-06',
  '至今',
  $$
  {
    "zh-CN": "主导核心高并发微服务架构设计，并开发了基于 AI 的多模态数据处理平台，系统吞吐量提升了 300%。",
    "zh-TW": "主導核心高併發微服務架構設計，並開發了基於 AI 的多模態數據處理平台，系統吞吐量提升了 300%。",
    "en": "Led the core high-concurrency microservices architecture design, and developed an AI-based multimodal data processing platform, increasing system throughput by 300%.",
    "ja": "コアとなる高並行マイクロサービスアーキテクチャ設計を主導し、AIベースのマルチモーダルデータ処理プラットフォームを開発、システムスループットを300%向上させた。",
    "ko": "핵심 고동시성 마이크로서비스 아키텍처 설계를 주도하고 AI 기반 멀티모달 데이터 처리 플랫폼을 개발하여 시스템 처리량을 300% 늘렸습니다."
  }
  $$::jsonb,
  ARRAY['React', 'TypeScript', 'Node.js', 'Go', 'Docker']
),
(
  'exp-2',
  $$
  {
    "zh-CN": "星际数据",
    "zh-TW": "星際數據",
    "en": "Interstellar Data",
    "ja": "インターステラーデータ",
    "ko": "인터스텔라 데이터"
  }
  $$::jsonb,
  $$
  {
    "zh-CN": "前端架构师",
    "zh-TW": "前端架構師",
    "en": "Frontend Architect",
    "ja": "フロントエンドアーキテクト",
    "ko": "프론트엔드 아키텍트"
  }
  $$::jsonb,
  '2018-09',
  '2021-05',
  $$
  {
    "zh-CN": "构建了企业级大型中后台 UI 组件库，推动了公司内部项目的工程化与标准化，前端开发效率提升 40%。",
    "zh-TW": "構建了企業級大型中後台 UI 組件庫，推動了公司內部項目的工程化與標準化，前端開發效率提升 40%。",
    "en": "Built an enterprise-grade large-scale back-office UI component library, promoting engineering and standardization for internal projects, increasing frontend development efficiency by 40%.",
    "ja": "エンタープライズレベルの大規模バックオフィスUIコンポーネントライブラリを構築し、社内プロジェクトのエンジニアリングと標準化を推進、フロントエンド開発の効率を40%向上させた。",
    "ko": "엔터프라이즈급 대규모 백오피스 UI 컴포넌트 라이브러리를 구축하여 내부 프로젝트의 엔지니어링 및 표준화를 촉진하고 프론트엔드 개발 효율성을 40% 높였습니다."
  }
  $$::jsonb,
  ARRAY['Vue', 'Webpack', 'Sass', 'ECharts', 'Jest']
)
ON CONFLICT (id) DO UPDATE SET
  company = EXCLUDED.company,
  role = EXCLUDED.role,
  start_date = EXCLUDED.start_date,
  end_date = EXCLUDED.end_date,
  description = EXCLUDED.description,
  technologies = EXCLUDED.technologies;

-- --------------------------------------------------------------------
-- 6. Social Links Table (社交媒体链接表)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.social_links (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  badge_text TEXT,
  is_primary BOOLEAN DEFAULT false
);

-- Seed Default Social Links
INSERT INTO public.social_links (id, name, url, type, icon_name, badge_text, is_primary)
VALUES
('link-1', 'GitHub', 'https://github.com', 'github', 'Github', '100+ Repos', true),
('link-2', 'Weekly Blog', 'https://dev.to', 'blog', 'BookOpen', 'Weekly Blog', true),
('link-3', 'Twitter', 'https://x.com', 'twitter', 'Twitter', 'Tech & Art', false),
('link-4', 'Bilibili', 'https://bilibili.com', 'bilibili', 'Tv', '动画 & 编程视频', false),
('link-5', 'LinkedIn', 'https://linkedin.com', 'other', 'Linkedin', 'Professional', false),
('link-6', 'ResearchGate', 'https://researchgate.net', 'other', 'FileText', 'Academic', false)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  url = EXCLUDED.url,
  type = EXCLUDED.type,
  icon_name = EXCLUDED.icon_name,
  badge_text = EXCLUDED.badge_text,
  is_primary = EXCLUDED.is_primary;

-- --------------------------------------------------------------------
-- 7. Media Items Table (媒体库资源表)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.media_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TEXT NOT NULL,
  size TEXT NOT NULL
);

-- Seed Default Media Items
INSERT INTO public.media_items (id, name, url, created_at, size)
VALUES
('media-1', 'Default Mecha Avatar', 'https://res.cloudinary.com/ggdsxmwu/image/upload/v1786301776/copy_of_chatgpt_image_202688_15_43_43.png', '2026-08-01', '124 KB'),
('media-2', 'Tech Stack Diagram', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60', '2026-08-05', '482 KB'),
('media-3', 'Kyvero Cover Art', 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&auto=format&fit=crop&q=60', '2026-08-10', '256 KB')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  url = EXCLUDED.url,
  created_at = EXCLUDED.created_at,
  size = EXCLUDED.size;

-- --------------------------------------------------------------------
-- 8. System Config Table (系统基础配置)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.system_config (
  id TEXT PRIMARY KEY DEFAULT 'default',
  site_title TEXT NOT NULL,
  logo_url TEXT,
  icon_url TEXT,
  copyright_text TEXT,
  copyright_subtext TEXT,
  version TEXT,
  build_channel TEXT
);

-- Seed System Config
INSERT INTO public.system_config (id, site_title, logo_url, icon_url, copyright_text, copyright_subtext, version, build_channel)
VALUES (
  'default',
  'A1L MECHA CYBER PORTFOLIO',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
  '/favicon.ico',
  '© 2026 A1L MECHA SYSTEM. ALL RIGHTS RESERVED.',
  'A1L GEEK ENGINEERING // HARDCORE LINE ART ARCHITECTURE',
  'v2.5.0-RELEASE',
  'PRODUCTION-STABLE-CHANNEL'
)
ON CONFLICT (id) DO UPDATE SET
  site_title = EXCLUDED.site_title,
  logo_url = EXCLUDED.logo_url,
  icon_url = EXCLUDED.icon_url,
  copyright_text = EXCLUDED.copyright_text,
  copyright_subtext = EXCLUDED.copyright_subtext,
  version = EXCLUDED.version,
  build_channel = EXCLUDED.build_channel;

-- --------------------------------------------------------------------
-- 9. Footer Links Table (页脚导航链接表)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.footer_links (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  icon_type TEXT NOT NULL
);

-- Seed Default Footer Links
INSERT INTO public.footer_links (id, name, url, icon_type)
VALUES
('fl-1', 'GitHub Profile', 'https://github.com', 'github'),
('fl-2', 'X / Twitter', 'https://x.com', 'twitter'),
('fl-3', 'Contact Email', 'mailto:kaito.lin.dev@example.com', 'email'),
('fl-4', 'Dev Blog', 'https://dev.to', 'blog')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  url = EXCLUDED.url,
  icon_type = EXCLUDED.icon_type;

-- --------------------------------------------------------------------
-- 10. Analytics Table (访客日志与行为追踪表)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.analytics (
  id TEXT PRIMARY KEY,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  path TEXT NOT NULL,
  user_agent TEXT,
  referrer TEXT,
  ip_hash TEXT
);

-- Seed Default Analytics Data
INSERT INTO public.analytics (id, timestamp, path, user_agent, referrer, ip_hash)
VALUES
(
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  '2026-08-11T08:00:00Z',
  '/',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  NULL,
  'hash_839210475'
),
(
  'f9e8d7c6-b5a4-3210-9876-543210fedcba',
  '2026-08-11T09:30:00Z',
  '/admin',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'https://google.com',
  'hash_129384756'
)
ON CONFLICT (id) DO UPDATE SET
  timestamp = EXCLUDED.timestamp,
  path = EXCLUDED.path,
  user_agent = EXCLUDED.user_agent,
  referrer = EXCLUDED.referrer,
  ip_hash = EXCLUDED.ip_hash;

-- ====================================================================
-- Enable Row Level Security (RLS) & Define Security Policies
-- ====================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tech_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.footer_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- 1. Public Read Access Policies
CREATE POLICY "Allow public read access on users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow public read access on profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow public read access on projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Allow public read access on tech_skills" ON public.tech_skills FOR SELECT USING (true);
CREATE POLICY "Allow public read access on experiences" ON public.experiences FOR SELECT USING (true);
CREATE POLICY "Allow public read access on social_links" ON public.social_links FOR SELECT USING (true);
CREATE POLICY "Allow public read access on media_items" ON public.media_items FOR SELECT USING (true);
CREATE POLICY "Allow public read access on system_config" ON public.system_config FOR SELECT USING (true);
CREATE POLICY "Allow public read access on footer_links" ON public.footer_links FOR SELECT USING (true);
CREATE POLICY "Allow public read access on analytics" ON public.analytics FOR SELECT USING (true);

-- 2. Public / Anon Write Access Policies (允许 Anon/Public 进行写入更新)
DROP POLICY IF EXISTS "Allow authenticated write access on users" ON public.users;
DROP POLICY IF EXISTS "Allow authenticated write access on profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow authenticated write access on projects" ON public.projects;
DROP POLICY IF EXISTS "Allow authenticated write access on tech_skills" ON public.tech_skills;
DROP POLICY IF EXISTS "Allow authenticated write access on experiences" ON public.experiences;
DROP POLICY IF EXISTS "Allow authenticated write access on social_links" ON public.social_links;
DROP POLICY IF EXISTS "Allow authenticated write access on media_items" ON public.media_items;
DROP POLICY IF EXISTS "Allow authenticated write access on system_config" ON public.system_config;
DROP POLICY IF EXISTS "Allow authenticated write access on footer_links" ON public.footer_links;
DROP POLICY IF EXISTS "Allow authenticated write access on analytics" ON public.analytics;

CREATE POLICY "Allow public write access on users" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public write access on profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public write access on projects" ON public.projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public write access on tech_skills" ON public.tech_skills FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public write access on experiences" ON public.experiences FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public write access on social_links" ON public.social_links FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public write access on media_items" ON public.media_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public write access on system_config" ON public.system_config FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public write access on footer_links" ON public.footer_links FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public write access on analytics" ON public.analytics FOR ALL USING (true) WITH CHECK (true);
