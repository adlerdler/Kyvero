import { Project } from '../types';
import { PROJECT_1_SVG, PROJECT_2_SVG, PROJECT_3_SVG } from './svg_assets';

export const initialProjects: Project[] = [
  {
    id: 'proj-1',
    title: {
      'zh-CN': 'NeoGenAI Studio - 动漫线条 AI 创意工作站',
      'zh-TW': 'NeoGenAI Studio - 動漫線條 AI 創意工作站',
      'en': 'NeoGenAI Studio - Anime Line Art Creative Hub',
      'ja': 'NeoGenAI Studio - アニメ線画 AI クリエイティブワークステーション',
      'ko': 'NeoGenAI Studio - 애니메이션 라인 아트 AI 크리에이티브 워크스테이션'
    },
    summary: {
      'zh-CN': '基于 Gemini AI 原生 API 的突破性创意生成平台，支持线条画提示词生成与实时交互。',
      'zh-TW': '基於 Gemini AI 原生 API 的突破性創意生成平台，支援線條畫提示詞生成與即時互動。',
      'en': 'A breakthrough creative generation platform based on Gemini AI native API, supporting line-art prompt generation and real-time interaction.',
      'ja': 'Gemini AIのネイティブAPIを基盤とした画期的な生成プラットフォーム。線画プロンプト生成とリアルタイム対話をサポートします。',
      'ko': 'Gemini AI 네이티브 API 기반의 획기적인 생성 플랫폼으로, 라인 아트 프롬프트 생성 및 실시간 상호작용 지원.'
    },
    description: {
      'zh-CN': '结合 Gemini 2.5/Flash 大模型与极简线条 canvas 渲染器，帮助创作者通过自然语言生成漫画面板、线条连环画与矢量素材。全栈集成 Vite + Express 服务端。',
      'zh-TW': '結合 Gemini 2.5/Flash 大模型與極簡線條 canvas 渲染器，幫助創作者透過自然語言生成漫畫面版、線條連環畫與向量素材。全棧整合 Vite + Express 伺服端。',
      'en': 'Combines Gemini 2.5/Flash LLM with a minimalist line canvas renderer, helping creators generate comic panels, storyboards, and vector assets via natural language. Full-stack integration with Vite + Express backend.',
      'ja': 'Gemini 2.5/Flash大規模モデルとミニマルな線画キャンバスレンダラーを統合。自然言語でコミックパネル、絵コンテ、ベクター素材の生成を支援します。Vite + Expressフルスタック。',
      'ko': 'Gemini 2.5/Flash 대형 모델과 미니멀 라인 canvas 렌더러를 통합하여 자연어로 만화 패널, 스토리보드, 벡터 소재 생성을 지원. Vite + Express 풀스택 백엔드 포함.'
    },
    category: {
      'zh-CN': 'AI 工具',
      'zh-TW': 'AI 工具',
      'en': 'AI Tool',
      'ja': 'AIツール',
      'ko': 'AI 도구'
    },
    imageUrl: PROJECT_1_SVG,
    demoUrl: 'https://ai.studio',
    githubUrl: 'https://github.com',
    tags: ['Gemini API', 'React 19', 'Tailwind', 'Express'],
    featured: true,
    createdAt: '2026-06-15'
  },
  {
    id: 'proj-2',
    title: {
      'zh-CN': 'AgentCanvas - 多 Agent 协作线条画板',
      'zh-TW': 'AgentCanvas - 多 Agent 協作線條畫板',
      'en': 'AgentCanvas - Multi-Agent Collaborative Canvas',
      'ja': 'AgentCanvas - 複数エージェント協調線画キャンバス',
      'ko': 'AgentCanvas - 멀티 에이전트 협업 라인 보드'
    },
    summary: {
      'zh-CN': '多智能体自组织画布系统，在动漫分割面板中实时展现 Agent 推理流与交互结果。',
      'zh-TW': '多智能體自組織畫布系統，在動漫分割面板中即時展現 Agent 推理流與互動結果。',
      'en': 'A self-organizing multi-agent canvas system visualizing agent reasoning streams and interaction results in comic panels.',
      'ja': '自律型マルチエージェントキャンバスシステム。コミック分割パネルにエージェントの推論プロセスとインタラクションをリアルタイム表示。',
      'ko': '만화 패널에서 에이전트의 추론 흐름과 상호작용 결과를 실시간으로 보여주는 다중 에이전트 자율 구성 캔버스 시스템.'
    },
    description: {
      'zh-CN': '打破常规 Dashboard 视觉，引入分层分镜漫画面板 (Comic Grid Panel)。每一个 Panel 容纳一个专门的 Agent 操作流，具备手绘风格线框图与动态提示气泡。',
      'zh-TW': '打破常規 Dashboard 視覺，引入分層分鏡漫畫面板 (Comic Grid Panel)。每一個 Panel 容納一個專門的 Agent 操作流，具備手繪風格線框圖與動態提示氣泡。',
      'en': 'Reimagines traditional dashboards with a Comic Grid Panel layout. Each panel runs a specialized Agent workflow with hand-drawn style wireframes and dynamic dialogue bubbles.',
      'ja': '従来のダッシュボードを覆し、コマ割りコミックパネル（Comic Grid Panel）を導入。各パネルに専用エージェントを割り当て、手書き風ワイヤーフレームと吹き出しで可視化。',
      'ko': '일반 대시보드를 탈피하여 컷 분할 만화 패널(Comic Grid Panel) 레이아웃을 도입. 각 패널은 수채화 스타일 와이어프레임과 말풍선으로 에이전트 워크플로우를 시각화.'
    },
    category: {
      'zh-CN': '网络应用',
      'zh-TW': '網路應用',
      'en': 'Web App',
      'ja': 'Webアプリ',
      'ko': '웹 앱'
    },
    imageUrl: PROJECT_2_SVG,
    demoUrl: 'https://example.com/agent-canvas',
    githubUrl: 'https://github.com',
    tags: ['TypeScript', 'WebSocket', 'Canvas API', 'Motion'],
    featured: true,
    createdAt: '2026-04-20'
  },
  {
    id: 'proj-3',
    title: {
      'zh-CN': 'LineCraft CLI - 极简命令行工匠工具包',
      'zh-TW': 'LineCraft CLI - 極簡命令行工匠工具包',
      'en': 'LineCraft CLI - Minimalist Command Line Toolkit',
      'ja': 'LineCraft CLI - ミニマルコマンドライン・クラフトツールキット',
      'ko': 'LineCraft CLI - 미니멀 커맨드 라인 크래프트 툴킷'
    },
    summary: {
      'zh-CN': '针对开发者设计的终端线条高亮与文档自动化工具，一键生成二次元线条文档。',
      'zh-TW': '針對開發者設計的終端線條高亮與文件自動化工具，一鍵生成二次元線條文件。',
      'en': 'Terminal line highlighter and document automation tool designed for developers to generate anime-style line documents.',
      'ja': '開発者向けに設計された、ターミナル線画強調表示およびドキュメント自動化ツール。二次元風ドキュメントをワンクリック生成。',
      'ko': '개발자를 위해 설계된 터미널 라인 하이라이팅 및 문서 자동화 도구로, 서브컬처 라인 아트를 원클릭 생성.'
    },
    description: {
      'zh-CN': '轻量高效的终端 Rust/Node.js 工具，可为 API 接口生成干净的 Line-Art SVG 架构图，并在 Markdown 中无缝嵌入漫画风流程图。',
      'zh-TW': '輕量高效的終端 Rust/Node.js 工具，可為 API 接口生成乾淨的 Line-Art SVG 架構圖，並在 Markdown 中無縫嵌入漫畫風流程圖。',
      'en': 'A lightweight and efficient CLI tool in Rust/Node.js to generate clean line-art SVG architecture diagrams for APIs and embed comic-style flowcharts in Markdown seamlessly.',
      'ja': 'Rust/Node.jsで書かれた軽量・高速CLIツール。APIのクリーンなラインアートSVG構成図を生成し、Markdownにコミック風フローチャートをシームレスに埋め込みます。',
      'ko': 'Rust/Node.js로 작성된 가볍고 효율적인 CLI 도구로, API를 위한 깔끔한 라인 아트 SVG 아키텍처 다이어그램을 생성하고 Markdown에 만화풍 흐름도를 매끄럽게 포함.'
    },
    category: {
      'zh-CN': '开源工具',
      'zh-TW': '開源工具',
      'en': 'CLI / OSS',
      'ja': '開発ツール',
      'ko': 'CLI / 오픈소스'
    },
    imageUrl: PROJECT_3_SVG,
    githubUrl: 'https://github.com',
    tags: ['Node.js', 'CLI', 'SVG Engine', 'Markdown'],
    featured: false,
    createdAt: '2026-02-10'
  }
];
