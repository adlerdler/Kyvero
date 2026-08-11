import { TechSkill } from '../types';

export const initialTechSkills: TechSkill[] = [
  {
    id: 'skill-1',
    name: 'React 19 & Next.js Ecosystem',
    level: 96,
    category: 'frontend',
    color: '#38BDF8',
    experience: '6 Yrs',
    tagline: {
      'zh-CN': '高并发组件架构 / Server Components / 状态流转',
      'zh-TW': '高併發組件架構 / Server Components / 狀態流轉',
      'en': 'High-Concurrency Component Architecture / Server Components / State Flow',
      'ja': '高同時実行コンポーネントアーキテクチャ / Server Components / 状態フロー',
      'ko': '고동시성 컴포넌트 아키텍처 / Server Components / 상태 흐름'
    }
  },
  {
    id: 'skill-2',
    name: 'TypeScript & Advanced Type System',
    level: 94,
    category: 'frontend',
    color: '#F59E0B',
    experience: '5 Yrs',
    tagline: {
      'zh-CN': '类型拓扑建模 / 严格断言 / 零运行时开销',
      'zh-TW': '類型拓撲建模 / 嚴格斷言 / 零運行時開銷',
      'en': 'Type Topology Modeling / Strict Assertions / Zero Runtime Overhead',
      'ja': '型トポロジーモデリング / 厳密なアサーション / ゼロランタイムオーバーヘッド',
      'ko': '타입 토폴로지 모델링 / 엄격한 단언 / 런타임 오버헤드 없음'
    }
  },
  {
    id: 'skill-3',
    name: 'Tailwind CSS & Cyber Line Art UI',
    level: 95,
    category: 'frontend',
    color: '#10B981',
    experience: '5 Yrs',
    tagline: {
      'zh-CN': '新暴力主义 (Neo-Brutalism) / 二次元高对比度线条视觉',
      'zh-TW': '新暴力主義 (Neo-Brutalism) / 二次元高對比度線條視覺',
      'en': 'Neo-Brutalism / High-Contrast Anime Line Art Aesthetics',
      'ja': 'ネオ・ブルータリズム / アニメ調高コントラストラインアート美学',
      'ko': '네오 브루탈리즘 / 고대비 애니메이션 라인 아트 미학'
    }
  },
  {
    id: 'skill-4',
    name: 'Node.js, Express & Distributed API',
    level: 90,
    category: 'backend',
    color: '#A855F7',
    experience: '6 Yrs',
    tagline: {
      'zh-CN': '高性能 REST Server / WebSocket / 代理路由转发',
      'zh-TW': '高效能 REST Server / WebSocket / 代理路由轉發',
      'en': 'High-Performance REST Server / WebSocket / Proxy Routing',
      'ja': '高性能 REST Server / WebSocket / プロキシルーティング転送',
      'ko': '고성능 REST Server / WebSocket / 프록시 라우팅 전달'
    }
  },
  {
    id: 'skill-5',
    name: 'Gemini AI SDK & AI Agents System',
    level: 88,
    category: 'ai',
    color: '#F43F5E',
    experience: '3 Yrs',
    tagline: {
      'zh-CN': '多模态推理 / Function Calling / 向量与结构化输出',
      'zh-TW': '多模態推理 / Function Calling / 向量與結構化輸出',
      'en': 'Multimodal Inference / Function Calling / Vector & Structured Outputs',
      'ja': 'マルチモーダル推論 / Function Calling / ベクトルと構造化出力',
      'ko': '멀티모달 추론 / Function Calling / 벡터 및 구조화된 출력'
    }
  },
  {
    id: 'skill-6',
    name: 'System Architecture & Performance',
    level: 87,
    category: 'architecture',
    color: '#0EA5E9',
    experience: '6 Yrs',
    tagline: {
      'zh-CN': '高可用容灾 / 模块解耦 / 极致首屏与渲染流优化',
      'zh-TW': '高可用容災 / 模組解耦 / 極致首屏與渲染流優化',
      'en': 'High Availability Disaster Recovery / Module Decoupling / Extreme FCP & Render Optimization',
      'ja': '高可用性災害復旧 / モジュール分離 / 究極のFCPとレンダリング最適化',
      'ko': '고가용성 재해 복구 / 모듈 디커플링 / 극대화된 FCP 및 렌더링 최적화'
    }
  }
];
