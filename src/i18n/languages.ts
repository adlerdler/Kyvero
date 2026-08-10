import { LanguageCode } from '../types';
export type { LanguageCode };

export interface TranslationDictionary {
  // Navigation & General
  siteTitle: string;
  subTitle: string;
  adminLogin: string;
  adminDashboard: string;
  typeAdminHint: string;
  languageSelect: string;
  close: string;
  save: string;
  cancel: string;
  delete: string;
  edit: string;
  add: string;
  confirm: string;
  preview: string;
  resetDefault: string;
  
  // Sections
  profileSection: string;
  projectsSection: string;
  blogAndLinksSection: string;
  techStack: string;
  allProjects: string;
  featuredProjects: string;
  
  // Actions & Links
  viewDemo: string;
  viewGithub: string;
  readArticle: string;
  contactMe: string;
  copyLink: string;
  copied: string;
  
  // Admin Login & Console
  adminLoginTitle: string;
  adminLoginSubtitle: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  loginButton: string;
  logoutButton: string;
  demoKeyButton: string;
  invalidPassword: string;
  
  // Admin Tabs
  tabProfile: string;
  tabProjects: string;
  tabLinks: string;
  tabSystem: string;
  tabAnalytics?: string;
  
  // Form Labels
  nameLabel: string;
  aliasLabel: string;
  titleLabel: string;
  siteTitleLabel: string;
  avatarLabel: string;
  logoUrlLabel: string;
  iconUrlLabel: string;
  speechBubbleLabel: string;
  bioLabel: string;
  locationLabel: string;
  statusLabel: string;
  skillsLabel: string;
  copyrightLabel: string;
  copyrightSubtextLabel: string;
  footerLinksTabTitle: string;
  addFooterLinkBtn: string;
  editFooterLinkBtn: string;
  footerLinkName: string;
  footerLinkUrl: string;
  footerLinkIconType: string;
  
  // Skills Management
  tabSkills: string;
  addSkillBtn: string;
  editSkillBtn: string;
  skillName: string;
  skillLevel: string;
  skillCategory: string;
  skillColor: string;
  skillExperience: string;
  skillTagline: string;
  
  // Project Form
  projectTitle: string;
  projectSummary: string;
  projectCategory: string;
  projectTags: string;
  projectImageUrl: string;
  projectDemoUrl: string;
  projectGithubUrl: string;
  projectFeatured: string;
  projectActions: string;
  
  // Manga FX
  mangaTagline: string;
  statusActive: string;
  modeLineArt: string;
  easterEggToast: string;
  
  // Skill Proficiency Matrix
  skillsProficiencyTitle: string;
  skillsProficiencySubtitle: string;
  skillsFilterAll: string;
  skillsFilterFrontend: string;
  skillsFilterBackend: string;
  skillsFilterAI: string;
  skillsFilterArch: string;
  skillsProficiencyLevel: string;

  // Weather Widget
  weatherTitle: string;
  weatherAutoLocate: string;
  weatherConditionSunny: string;
  weatherConditionCloudy: string;
  weatherConditionRainy: string;
  weatherConditionSnowy: string;
  weatherConditionThunder: string;

  // Visitor Counter
  visitorTotal: string;
  visitorOnline: string;
  visitorToday: string;
}

export const DEFAULT_LANGUAGE: LanguageCode = 'zh-CN';

export const LANGUAGES: { code: LanguageCode; name: string; flag: string }[] = [
  { code: 'zh-CN', name: '简体中文', flag: '🇨🇳' },
  { code: 'zh-TW', name: '繁體中文', flag: '🇭🇰' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
];

export const TRANSLATIONS: Record<LanguageCode, TranslationDictionary> = {
  'zh-CN': {
    siteTitle: 'A1L 极客工程作品集',
    subTitle: '硬核线条 | 机甲美学 | 全栈架构',
    adminLogin: '管理后台',
    adminDashboard: '控制台',
    typeAdminHint: '键盘输入 "admin" 快速进入控制台',
    languageSelect: '切换语言',
    close: '关闭',
    save: '保存变更',
    cancel: '取消',
    delete: '删除',
    edit: '编辑',
    add: '新增',
    confirm: '确认',
    preview: '实时预览',
    resetDefault: '恢复初始数据',
    
    profileSection: '个人概览',
    projectsSection: '项目作品集',
    blogAndLinksSection: '专栏与社交矩阵',
    techStack: '核心技术栈',
    allProjects: '全部项目',
    featuredProjects: '精选项目',
    
    viewDemo: '在线演示',
    viewGithub: '源代码',
    readArticle: '阅读文章',
    contactMe: '联系我',
    copyLink: '复制链接',
    copied: '已复制',
    
    adminLoginTitle: '控制台身份验证',
    adminLoginSubtitle: '请输入管理员密钥进入后台管理界面',
    passwordLabel: '访问密钥',
    passwordPlaceholder: '请输入密码 (默认: admin123)',
    loginButton: '验证并进入',
    logoutButton: '退出控制台',
    demoKeyButton: '一键填充体验密钥',
    invalidPassword: '密钥验证失败，请重试',
    
    tabProfile: '基础资料',
    tabProjects: '项目管理',
    tabLinks: '外链与专栏',
    tabSystem: '系统设置',
    
    nameLabel: '姓名 / 昵称',
    aliasLabel: '代号 / 极客名',
    titleLabel: '专业头衔',
    siteTitleLabel: '网站标题 (Site Title)',
    avatarLabel: '头像图片 URL',
    logoUrlLabel: '网站 Logo 图片 URL',
    iconUrlLabel: '网站 Icon / Favicon URL',
    speechBubbleLabel: '台词标语',
    bioLabel: '个人简介 (多行)',
    locationLabel: '常驻常态/地区',
    statusLabel: '当前状态',
    skillsLabel: '技术标签 (逗号分隔)',
    copyrightLabel: '版权声明 (Copyright)',
    copyrightSubtextLabel: '页脚次要/备案信息 (Subtext/ICP)',
    footerLinksTabTitle: '页脚独立外链管理',
    addFooterLinkBtn: '新增页脚链接',
    editFooterLinkBtn: '编辑页脚链接',
    footerLinkName: '链接名称/提示',
    footerLinkUrl: '跳转 URL',
    footerLinkIconType: '图标类型',
    
    tabSkills: '核心技术栈与熟练度',
    addSkillBtn: '新增核心技能',
    editSkillBtn: '编辑技能',
    skillName: '技能名称',
    skillLevel: '熟练度百分比 (0-100%)',
    skillCategory: '技能分类',
    skillColor: '主题代表色',
    skillExperience: '实战年限 (如 5 Yrs)',
    skillTagline: '亮点/实战描述标语',
    
    projectTitle: '项目名称',
    projectSummary: '简要概述',
    projectCategory: '分类领域',
    projectTags: '技术标签',
    projectImageUrl: '封面效果图 URL',
    projectDemoUrl: '演示地址',
    projectGithubUrl: '开源仓库',
    projectFeatured: '设为精选推荐',
    projectActions: '操作',
    
    mangaTagline: '极简线条 · 突破视觉常规',
    statusActive: '在线研制中',
    modeLineArt: '动漫线条模式',
    easterEggToast: '🎯 已侦测到快捷指令 "admin"！准备跳转登录...',
    
    skillsProficiencyTitle: '核心技术栈熟练度',
    skillsProficiencySubtitle: 'A1L MECHA SYSTEM · 技能算法矩阵与实战能力映射',
    skillsFilterAll: '全量矩阵',
    skillsFilterFrontend: '前端核心',
    skillsFilterBackend: '后端与接口',
    skillsFilterAI: 'AI 与智能体',
    skillsFilterArch: '架构与性能',
    skillsProficiencyLevel: '熟练度',
    
    weatherTitle: '都市实时气象',
    weatherAutoLocate: '自动定位',
    weatherConditionSunny: '晴朗',
    weatherConditionCloudy: '多云',
    weatherConditionRainy: '阵雨',
    weatherConditionSnowy: '降雪',
    weatherConditionThunder: '雷暴',
    
    visitorTotal: '累计访客',
    visitorOnline: '当前在线',
    visitorToday: '今日浏览',
  },
  'zh-TW': {
    siteTitle: '個人精選作品集',
    subTitle: '極簡線條 | 動漫美學 | 全棧工程',
    adminLogin: '管理後台',
    adminDashboard: '控制台',
    typeAdminHint: '鍵盤輸入 "admin" 快速進入控制台',
    languageSelect: '切換語言',
    close: '關閉',
    save: '儲存變更',
    cancel: '取消',
    delete: '刪除',
    edit: '編輯',
    add: '新增',
    confirm: '確認',
    preview: '即時預覽',
    resetDefault: '恢復初始數據',
    
    profileSection: '個人概覽',
    projectsSection: '項目作品集',
    blogAndLinksSection: '專欄與社交矩陣',
    techStack: '核心技術棧',
    allProjects: '全部項目',
    featuredProjects: '精選項目',
    
    viewDemo: '線上演示',
    viewGithub: '原始碼',
    readArticle: '閱讀文章',
    contactMe: '聯繫我',
    copyLink: '複製連結',
    copied: '已複製',
    
    adminLoginTitle: '控制台身份驗證',
    adminLoginSubtitle: '請輸入管理員金鑰進入後台管理介面',
    passwordLabel: '訪問金鑰',
    passwordPlaceholder: '請輸入密碼 (預設: admin123)',
    loginButton: '驗證並進入',
    logoutButton: '退出控制台',
    demoKeyButton: '一鍵填充體驗金鑰',
    invalidPassword: '金鑰驗證失敗，請重試',
    
    tabProfile: '基礎資料',
    tabProjects: '項目管理',
    tabLinks: '外鏈與專欄',
    tabSystem: '系統設定',
    
    nameLabel: '姓名 / 暱稱',
    aliasLabel: '代號 / 極客名',
    titleLabel: '專業頭銜',
    siteTitleLabel: '網站標題 (Site Title)',
    avatarLabel: '頭像圖片 URL',
    logoUrlLabel: '網站 Logo 圖片 URL',
    iconUrlLabel: '網站 Icon / Favicon URL',
    speechBubbleLabel: '台詞標語',
    bioLabel: '個人簡介 (多行)',
    locationLabel: '常駐常態/地區',
    statusLabel: '當前狀態',
    skillsLabel: '技術標籤 (逗號分隔)',
    copyrightLabel: '版權聲明 (Copyright)',
    copyrightSubtextLabel: '頁腳次要/備案資訊 (Subtext/ICP)',
    footerLinksTabTitle: '頁腳獨立外鏈管理',
    addFooterLinkBtn: '新增頁腳鏈接',
    editFooterLinkBtn: '編輯頁腳鏈接',
    footerLinkName: '鏈接名稱/提示',
    footerLinkUrl: '跳轉 URL',
    footerLinkIconType: '圖標類型',
    
    tabSkills: '核心技術棧與熟練度',
    addSkillBtn: '新增核心技能',
    editSkillBtn: '編輯技能',
    skillName: '技能名稱',
    skillLevel: '熟練度百分比 (0-100%)',
    skillCategory: '技能分類',
    skillColor: '主題代表色',
    skillExperience: '實戰年限 (如 5 Yrs)',
    skillTagline: '亮點/實戰描述標語',
    
    projectTitle: '項目名稱',
    projectSummary: '簡要概述',
    projectCategory: '分類領域',
    projectTags: '技術標籤',
    projectImageUrl: '封面效果圖 URL',
    projectDemoUrl: '演示地址',
    projectGithubUrl: '開源倉庫',
    projectFeatured: '設為精選推薦',
    projectActions: '操作',
    
    mangaTagline: '極簡線條 · 突破視覺常規',
    statusActive: '線上研製中',
    modeLineArt: '動漫線條模式',
    easterEggToast: '🎯 已偵測到快捷指令 "admin"！準備跳轉登入...',
    
    skillsProficiencyTitle: '核心技術棧熟練度',
    skillsProficiencySubtitle: 'A1L MECHA SYSTEM · 技能演算法矩陣與實戰能力映射',
    skillsFilterAll: '全量矩陣',
    skillsFilterFrontend: '前端核心',
    skillsFilterBackend: '後端與介面',
    skillsFilterAI: 'AI 與智慧體',
    skillsFilterArch: '架構與效能',
    skillsProficiencyLevel: '熟練度',
    
    weatherTitle: '都市實時氣象',
    weatherAutoLocate: '自動定位',
    weatherConditionSunny: '晴朗',
    weatherConditionCloudy: '多雲',
    weatherConditionRainy: '陣雨',
    weatherConditionSnowy: '降雪',
    weatherConditionThunder: '雷暴',
    
    visitorTotal: '累計訪客',
    visitorOnline: '當前線上',
    visitorToday: '今日瀏覽',
  },
  'en': {
    siteTitle: 'Personal Portfolio',
    subTitle: 'Minimalist Line Art | Anime Aesthetic | Full-Stack Engineering',
    adminLogin: 'Admin Panel',
    adminDashboard: 'Console',
    typeAdminHint: 'Type "admin" anywhere on keyboard to open admin console',
    languageSelect: 'Language',
    close: 'Close',
    save: 'Save Changes',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add New',
    confirm: 'Confirm',
    preview: 'Live Preview',
    resetDefault: 'Reset Defaults',
    
    profileSection: 'Overview',
    projectsSection: 'Project Showcase',
    blogAndLinksSection: 'Publications & Networks',
    techStack: 'Tech Stack',
    allProjects: 'All Projects',
    featuredProjects: 'Featured',
    
    viewDemo: 'Live Demo',
    viewGithub: 'Source Code',
    readArticle: 'Read Post',
    contactMe: 'Contact',
    copyLink: 'Copy Link',
    copied: 'Copied!',
    
    adminLoginTitle: 'Console Authentication',
    adminLoginSubtitle: 'Enter your authorization secret to access management settings',
    passwordLabel: 'Access Key',
    passwordPlaceholder: 'Enter key (default: admin123)',
    loginButton: 'Authenticate & Enter',
    logoutButton: 'Sign Out',
    demoKeyButton: 'Fill Demo Access Key',
    invalidPassword: 'Authentication failed. Please verify credentials.',
    
    tabProfile: 'Profile Info',
    tabProjects: 'Projects',
    tabLinks: 'Links & Blogs',
    tabSystem: 'System',
    
    nameLabel: 'Name / Handle',
    aliasLabel: 'Codename',
    titleLabel: 'Professional Title',
    siteTitleLabel: 'Site Title',
    avatarLabel: 'Avatar Image URL',
    logoUrlLabel: 'Site Logo Image URL',
    iconUrlLabel: 'Site Favicon / Icon URL',
    speechBubbleLabel: 'Speech Bubble Motto',
    bioLabel: 'Biography (Multi-line)',
    locationLabel: 'Location',
    statusLabel: 'Current Status',
    skillsLabel: 'Skill Badges (Comma-separated)',
    copyrightLabel: 'Copyright Notice',
    copyrightSubtextLabel: 'Footer Subtext / ICP',
    footerLinksTabTitle: 'Footer Links Management',
    addFooterLinkBtn: 'Add Footer Link',
    editFooterLinkBtn: 'Edit Footer Link',
    footerLinkName: 'Link Name / Tooltip',
    footerLinkUrl: 'Destination URL',
    footerLinkIconType: 'Icon Type',
    
    tabSkills: 'Tech Stack & Proficiency',
    addSkillBtn: 'Add Tech Skill',
    editSkillBtn: 'Edit Skill',
    skillName: 'Skill Name',
    skillLevel: 'Proficiency Level (0-100%)',
    skillCategory: 'Category',
    skillColor: 'Theme Accent Color',
    skillExperience: 'Experience (e.g. 5 Yrs)',
    skillTagline: 'Tagline / Highlights',
    
    projectTitle: 'Project Name',
    projectSummary: 'Summary',
    projectCategory: 'Category',
    projectTags: 'Tech Tags',
    projectImageUrl: 'Cover Image URL',
    projectDemoUrl: 'Live Demo URL',
    projectGithubUrl: 'Repository URL',
    projectFeatured: 'Feature on Homepage',
    projectActions: 'Actions',
    
    mangaTagline: 'Minimalist Line Art · Expressive Layout',
    statusActive: 'Active & Building',
    modeLineArt: 'Anime Line Art Mode',
    easterEggToast: '🎯 Shortcut "admin" detected! Opening login modal...',
    
    skillsProficiencyTitle: 'Tech Stack Proficiency',
    skillsProficiencySubtitle: 'A1L MECHA SYSTEM · Engineering Skill Matrix & Mastery Ratings',
    skillsFilterAll: 'All Tech',
    skillsFilterFrontend: 'Frontend',
    skillsFilterBackend: 'Backend',
    skillsFilterAI: 'AI & Agents',
    skillsFilterArch: 'Architecture',
    skillsProficiencyLevel: 'Mastery Level',
    
    weatherTitle: 'Metropolis Live Weather',
    weatherAutoLocate: 'Auto Locate',
    weatherConditionSunny: 'Sunny',
    weatherConditionCloudy: 'Cloudy',
    weatherConditionRainy: 'Showers',
    weatherConditionSnowy: 'Snow',
    weatherConditionThunder: 'Storm',

    visitorTotal: 'TOTAL VISITS',
    visitorOnline: 'ONLINE NOW',
    visitorToday: 'TODAY',
  },
  'ja': {
    siteTitle: 'ポートフォリオ',
    subTitle: 'ミニマルラインアート | アニメ美学 | フルスタック開発',
    adminLogin: '管理パネル',
    adminDashboard: 'コンソール',
    typeAdminHint: 'キーボードで "admin" と入力して管理画面へ',
    languageSelect: '言語切り替え',
    close: '閉じる',
    save: '変更を保存',
    cancel: 'キャンセル',
    delete: '削除',
    edit: '編集',
    add: '新規追加',
    confirm: '確認',
    preview: 'リアルタイムプレビュー',
    resetDefault: '初期データに復元',
    
    profileSection: 'プロファイル概要',
    projectsSection: '制作実績・プロジェクト',
    blogAndLinksSection: 'ブログ・ソーシャルメディア',
    techStack: 'コア技術スタック',
    allProjects: 'すべての実績',
    featuredProjects: '注目実績',
    
    viewDemo: 'デモを見る',
    viewGithub: 'ソースコード',
    readArticle: '記事を読む',
    contactMe: 'お問い合わせ',
    copyLink: 'リンクをコピー',
    copied: 'コピー完了',
    
    adminLoginTitle: 'コンソール認証',
    adminLoginSubtitle: '管理画面にアクセスするためのセキュリティキーを入力してください',
    passwordLabel: 'アクセスキー',
    passwordPlaceholder: 'パスワードを入力 (初期値: admin123)',
    loginButton: '認証してログイン',
    logoutButton: 'ログアウト',
    demoKeyButton: 'デモキーを自動入力',
    invalidPassword: '認証に失敗しました。パスワードをご確認ください。',
    
    tabProfile: '基本情報',
    tabProjects: 'プロジェクト管理',
    tabLinks: '外部リンク・ブログ',
    tabSystem: 'システム設定',
    
    nameLabel: '氏名 / ハンドル名',
    aliasLabel: 'コードネーム',
    titleLabel: '職種 / タイトル',
    siteTitleLabel: 'Webサイトのタイトル (Site Title)',
    avatarLabel: 'アバター画像 URL',
    logoUrlLabel: 'WebサイトLogo画像URL',
    iconUrlLabel: 'WebサイトIcon / Favicon URL',
    speechBubbleLabel: 'セリフ・吹き出し',
    bioLabel: '自己紹介 (複数行)',
    locationLabel: '活動拠点',
    statusLabel: '現在のステータス',
    skillsLabel: 'スキルタグ (カンマ区切り)',
    copyrightLabel: '著作権表示 (Copyright)',
    copyrightSubtextLabel: 'フッター補助情報 / ICP',
    footerLinksTabTitle: '独立フッターリンク管理',
    addFooterLinkBtn: 'フッターリンク追加',
    editFooterLinkBtn: 'フッターリンク編集',
    footerLinkName: 'リンク名 / ツールチップ',
    footerLinkUrl: '遷移先 URL',
    footerLinkIconType: 'アイコンタイプ',
    
    tabSkills: 'スキルスタック熟練度',
    addSkillBtn: 'スキルを追加',
    editSkillBtn: 'スキルを編集',
    skillName: 'スキル名',
    skillLevel: '熟練度 (0-100%)',
    skillCategory: 'カテゴリ',
    skillColor: 'テーマカラー',
    skillExperience: '経験年数 (例: 5 Yrs)',
    skillTagline: 'ハイライト / 概要',
    
    projectTitle: 'プロジェクト名',
    projectSummary: '概要',
    projectCategory: 'カテゴリー',
    projectTags: '使用技術',
    projectImageUrl: 'カバー画像 URL',
    projectDemoUrl: 'デモ URL',
    projectGithubUrl: 'リポジトリ URL',
    projectFeatured: 'おすすめに設定',
    projectActions: '操作',
    
    mangaTagline: 'ミニマルラインアート · 新感覚デザイン',
    statusActive: 'アクティブ開発中',
    modeLineArt: 'アニメラインアートモード',
    easterEggToast: '🎯 コマンド "admin" を検出！ログイン画面を開きます...',
    
    skillsProficiencyTitle: 'コア技術熟練度マトリクス',
    skillsProficiencySubtitle: 'A1L MECHA SYSTEM · スキル熟練度と実操能力マッピング',
    skillsFilterAll: 'すべて',
    skillsFilterFrontend: 'フロントエンド',
    skillsFilterBackend: 'バックエンド',
    skillsFilterAI: 'AI・エージェント',
    skillsFilterArch: 'アーキテクチャ',
    skillsProficiencyLevel: '熟練度',
    
    weatherTitle: '都市リアルタイム天候',
    weatherAutoLocate: '自動位置',
    weatherConditionSunny: '快晴',
    weatherConditionCloudy: '多雲',
    weatherConditionRainy: '雨',
    weatherConditionSnowy: '雪',
    weatherConditionThunder: '雷雨',

    visitorTotal: '累計訪問',
    visitorOnline: 'オンライン',
    visitorToday: '本日閲覧',
  },
  'ko': {
    siteTitle: '개인 포트폴리오',
    subTitle: '미니멀 라인 아트 | 애니메이션 미학 | 풀스택 엔지니어링',
    adminLogin: '관리자 패널',
    adminDashboard: '콘솔',
    typeAdminHint: '키보드로 "admin" 입력 시 관리자 콘솔 진입',
    languageSelect: '언어 변경',
    close: '닫기',
    save: '변경사항 저장',
    cancel: '취소',
    delete: '삭제',
    edit: '편집',
    add: '새로 추가',
    confirm: '확인',
    preview: '실시간 미리보기',
    resetDefault: '초기 데이터 복원',
    
    profileSection: '개인 개요',
    projectsSection: '프로젝트 쇼케이스',
    blogAndLinksSection: '블로그 및 소셜 네트워크',
    techStack: '핵심 기술 스택',
    allProjects: '전체 프로젝트',
    featuredProjects: '주요 프로젝트',
    
    viewDemo: '라이브 데모',
    viewGithub: '소스 코드',
    readArticle: '아티클 읽기',
    contactMe: '문의하기',
    copyLink: '링크 복사',
    copied: '복사됨',
    
    adminLoginTitle: '콘솔 인증',
    adminLoginSubtitle: '관리 화면에 접근하기 위해 보안 키를 입력하세요',
    passwordLabel: '액세스 키',
    passwordPlaceholder: '비밀번호 입력 (기본값: admin123)',
    loginButton: '인증 및 진입',
    logoutButton: '로그아웃',
    demoKeyButton: '체험용 키 자동 입력',
    invalidPassword: '인증에 실패했습니다. 비밀번호를 확인하세요.',
    
    tabProfile: '프로필 정보',
    tabProjects: '프로젝트 관리',
    tabLinks: '외부 링크 및 블로그',
    tabSystem: '시스템 설정',
    
    nameLabel: '이름 / 닉네임',
    aliasLabel: '코드네임',
    titleLabel: '직함 / 타이틀',
    siteTitleLabel: '웹사이트 제목 (Site Title)',
    avatarLabel: '아바타 이미지 URL',
    logoUrlLabel: '웹사이트 로고 이미지 URL',
    iconUrlLabel: '웹사이트 아이콘 / 파비콘 URL',
    speechBubbleLabel: '말풍선 대사',
    bioLabel: '자기소개 (다중 행)',
    locationLabel: '활동 지역',
    statusLabel: '현재 상태',
    skillsLabel: '기술 태그 (쉼표 구분)',
    copyrightLabel: '저작권 표시 (Copyright)',
    copyrightSubtextLabel: '푸터 보조 정보 / ICP',
    footerLinksTabTitle: '푸터 전용 링크 관리',
    addFooterLinkBtn: '푸터 링크 추가',
    editFooterLinkBtn: '푸터 링크 수정',
    footerLinkName: '링크 이름 / 툴팁',
    footerLinkUrl: '이동 URL',
    footerLinkIconType: '아이콘 유형',
    
    tabSkills: '기술 스택 & 숙련도',
    addSkillBtn: '기술 스택 추가',
    editSkillBtn: '기술 수정',
    skillName: '기술명',
    skillLevel: '숙련도 (0-100%)',
    skillCategory: '카테고리',
    skillColor: '테마 컬러',
    skillExperience: '경력 (예: 5 Yrs)',
    skillTagline: '하이라이트 / 설명',
    
    projectTitle: '프로젝트명',
    projectSummary: '요약 설명',
    projectCategory: '카테고리',
    projectTags: '사용 기술',
    projectImageUrl: '커버 이미지 URL',
    projectDemoUrl: '데모 URL',
    projectGithubUrl: '저장소 URL',
    projectFeatured: '추천 프로젝트로 설정',
    projectActions: '작업',
    
    mangaTagline: '미니멀 라인 아트 · 파격적인 레이아웃',
    statusActive: '개발 진행 중',
    modeLineArt: '애니메이션 라인아트 모드',
    easterEggToast: '🎯 단축 명령어 "admin" 감지! 로그인 모달을 엽니다...',
    
    skillsProficiencyTitle: '핵심 기술 숙련도 마트릭스',
    skillsProficiencySubtitle: 'A1L MECHA SYSTEM · 엔지니어링 숙련도 및 실전 역량',
    skillsFilterAll: '전체',
    skillsFilterFrontend: '프론트엔드',
    skillsFilterBackend: '백엔드',
    skillsFilterAI: 'AI 및 에이전트',
    skillsFilterArch: '아키텍처',
    skillsProficiencyLevel: '숙련도',
    
    weatherTitle: '도시 실시간 날씨',
    weatherAutoLocate: '자동 위치',
    weatherConditionSunny: '맑음',
    weatherConditionCloudy: '구름조금',
    weatherConditionRainy: '소나기',
    weatherConditionSnowy: '눈',
    weatherConditionThunder: '뇌우',

    visitorTotal: '누적 방문',
    visitorOnline: '실시간 접속',
    visitorToday: '오늘 방문',
  }
};
