import { Experience } from '../types';

export const initialExperiences: Experience[] = [
  {
    id: 'exp-1',
    company: {
      'zh-CN': '幻影科技',
      'zh-TW': '幻影科技',
      'en': 'Phantom Technologies',
      'ja': 'ファントムテクノロジーズ',
      'ko': '팬텀 테크놀로지스'
    },
    role: {
      'zh-CN': '高级全栈开发工程师',
      'zh-TW': '高級全棧開發工程師',
      'en': 'Senior Full Stack Developer',
      'ja': 'シニアフルスタックエンジニア',
      'ko': '시니어 풀스택 개발자'
    },
    startDate: '2021-06',
    endDate: '至今',
    description: {
      'zh-CN': '主导核心高并发微服务架构设计，并开发了基于 AI 的多模态数据处理平台，系统吞吐量提升了 300%。',
      'zh-TW': '主導核心高併發微服務架構設計，並開發了基於 AI 的多模態數據處理平台，系統吞吐量提升了 300%。',
      'en': 'Led the core high-concurrency microservices architecture design, and developed an AI-based multimodal data processing platform, increasing system throughput by 300%.',
      'ja': 'コアとなる高並行マイクロサービスアーキテクチャ設計を主導し、AIベースのマルチモーダルデータ処理プラットフォームを開発、システムスループットを300%向上させた。',
      'ko': '핵심 고동시성 마이크로서비스 아키텍처 설계를 주도하고 AI 기반 멀티모달 데이터 처리 플랫폼을 개발하여 시스템 처리량을 300% 늘렸습니다.'
    },
    technologies: ['React', 'TypeScript', 'Node.js', 'Go', 'Docker']
  },
  {
    id: 'exp-2',
    company: {
      'zh-CN': '星际数据',
      'zh-TW': '星際數據',
      'en': 'Interstellar Data',
      'ja': 'インターステラーデータ',
      'ko': '인터스텔라 데이터'
    },
    role: {
      'zh-CN': '前端架构师',
      'zh-TW': '前端架構師',
      'en': 'Frontend Architect',
      'ja': 'フロントエンドアーキテクト',
      'ko': '프론트엔드 아키텍트'
    },
    startDate: '2018-09',
    endDate: '2021-05',
    description: {
      'zh-CN': '构建了企业级大型中后台 UI 组件库，推动了公司内部项目的工程化与标准化，前端开发效率提升 40%。',
      'zh-TW': '構建了企業級大型中後台 UI 組件庫，推動了公司內部項目的工程化與標準化，前端開發效率提升 40%。',
      'en': 'Built an enterprise-grade large-scale back-office UI component library, promoting engineering and standardization for internal projects, increasing frontend development efficiency by 40%.',
      'ja': 'エンタープライズレベルの大規模バックオフィスUIコンポーネントライブラリを構築し、社内プロジェクトのエンジニアリングと標準化を推進、フロントエンド開発の効率を40%向上させた。',
      'ko': '엔터프라이즈급 대규모 백오피스 UI 컴포넌트 라이브러리를 구축하여 내부 프로젝트의 엔지니어링 및 표준화를 촉진하고 프론트엔드 개발 효율성을 40% 높였습니다.'
    },
    technologies: ['Vue', 'Webpack', 'Sass', 'ECharts', 'Jest']
  }
];
