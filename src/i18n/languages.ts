import { LanguageCode } from '../types';
import { zhCN } from './zh-CN';
import { zhTW } from './zh-TW';
import { en } from './en';
import { ja } from './ja';
import { ko } from './ko';

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
  adminPortalSubtitle: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  usernameLabel: string;
  usernamePlaceholder: string;
  loginButton: string;
  logoutButton: string;
  demoKeyButton: string;
  invalidPassword: string;
  invalidUsernameOrPassword: string;
  changePassword: string;
  changePasswordTitle: string;
  currentPassword: string;
  currentPasswordPlaceholder: string;
  newPassword: string;
  newPasswordPlaceholder: string;
  confirmPassword: string;
  confirmPasswordPlaceholder: string;
  passwordChangedSuccess: string;
  currentPasswordIncorrect: string;
  passwordsDoNotMatch: string;
  userAvatarMenu: string;
  
  // Admin Tabs
  tabProfile: string;
  tabProjects: string;
  tabLinks: string;
  tabSystem: string;
  tabAnalytics: string;
  tabI18n: string;
  tabMedia: string;
  
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
  
  // Experiences Management
  experienceSection: string;
  addExperienceBtn: string;
  editExperienceBtn: string;
  companyLabel: string;
  roleLabel: string;
  startDateLabel: string;
  endDateLabel: string;
  descriptionLabel: string;
  technologiesLabel: string;

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

  // Admin Dashboard
  mediaTitle: string;
  mediaStatusSigned: string;
  mediaStatusUnsigned: string;
  mediaStatusNone: string;
  mediaDragPrompt: string;
  mediaUploading: string;
  mediaFormatHint: string;
  mediaSelectBtn: string;
  mediaUploadingBtn: string;
  mediaListTitle: string;
  mediaEmpty: string;
  mediaBtnCopy: string;
  mediaBtnAvatar: string;
  mediaDeletedToast: string;
  mediaDeleteConfirm: string;
  systemBrandingTitle: string;
  systemCopyrightTitle: string;
  systemBackupTitle: string;
  systemExportBtn: string;
  systemResetBtn: string;
  logoutTitle: string;
  logoutSubtitle: string;
  cancelBtn: string;
  logoutConfirmBtn: string;
  avatarSelectFromMedia: string;
  avatarSelectTitle: string;
  avatarSelectSubtitle: string;
  selectLogoTitle: string;
  selectLogoSubtitle: string;
  selectIconTitle: string;
  selectIconSubtitle: string;
  avatarDefaultSvg: string;
  avatarSelectedToast: string;
  avatarChooseImage: string;
  avatarEmptyLibrary: string;
  avatarEmptyLibraryHint: string;
  avatarTotalAssets: string;
  pdfExportTitle: string;
  pdfExportBtn: string;
  pdfExportingBtn: string;
  avatarInputPlaceholder: string;
  avatarUploadBtn: string;
  avatarUploadingBtn: string;
  avatarDefaultLoadToast: string;
  mediaUploadError: string;
  mediaCopiedToast: string;
  mediaAvatarChangeToast: string;
  mediaSizeUnknown: string;
  mediaUrlCopiedToast: string;
  mediaDeletingBtn: string;
  mediaDeleteBtn: string;
  systemBrandingPlaceholder: string;
  systemSecondaryFooterPlaceholder: string;

  // Additional Admin/Login Strings
  selectProjectCoverTitle: string;
  selectProjectCoverSubtitle: string;
  uploadFailed: string;
  exportSuccessToast: string;
  switchToLightMode: string;
  switchToDarkMode: string;
  returnToSite: string;
  returnToHome: string;
  exportPortfolioPdfTitle: string;

  // Geo Map
  allRegions: string;
  domesticRegions: string;
  overseasNodes: string;
  totalScopeVisits: string;
  cdnStatusLabel: string;
  cdnStatusValue: string;
  deepDiagnosisTitle: string;
  latencyLabel: string;
  primaryCitiesLabel: string;
  growthLabel7d: string;
  totalVisitorsLabel: string;
  closeBtn: string;
  realtimeVisitsLabel: string;
  globalShareLabel: string;
  edgeLatencyLabel: string;
  activeCitiesLabel: string;
  regionNamesEastChina: string;
  regionNamesSouthChina: string;
  regionNamesNorthChina: string;
  regionNamesUsWest: string;
  regionNamesEuCentral: string;
  regionNamesSingapore: string;
  regionNamesTokyo: string;
  citiesCnEast: string;
  citiesCnSouth: string;
  citiesCnNorth: string;

  // Heatmap
  totalVisitsTitle: string;
  comparePeriod: string;
  peakVisitsTitle: string;
  peakTrafficLabel: string;
  avgVisitsTitle: string;
  highActiveDaysLabel: string;
  sampleSpanTitle: string;
  sampleSpanSubtitle: string;
  chartHeading: string;
  less: string;
  more: string;
  tooltipVisitsLabel: string;
  selectedDetailHeading: string;
  highTrafficDesc: string;
  aboveAverageDesc: string;
  stableTrafficDesc: string;
  visitsUnit: string;
  daysUnit: string;
  heatmapDetailPrefix: string;
  heatmapDetailSuffix: string;
  heatmapDetailEnd: string;
  monthsList: string;
  daysList: string;

  // Language Manager
  langTitle: string;
  langResetAll: string;
  langSearchPlaceholder: string;
  langNoResults: string;
  langModified: string;
  langOverridden: string;
  langFilterResult: string;
  langTotalKeys: string;
  langCurrentKey: string;
  langResetDefault: string;
  langDefaultValue: string;
  langSaveChanges: string;
  langSelectKeyPrompt: string;
  langCatAll: string;
  langCatGeneral: string;
  langCatSections: string;
  langCatActions: string;
  langCatAdmin: string;
  langCatFeatures: string;
  langToastSaved: string;
  langToastReset: string;

  // AppContext Toasts
  toastAdminLoginSuccess: string;
  toastAdminLogout: string;
  toastProfileUpdated: string;
  toastProjectAdded: string;
  toastProjectUpdated: string;
  toastProjectDeleted: string;
  toastLinkAdded: string;
  toastLinkUpdated: string;
  toastLinkDeleted: string;
  toastFooterLinkAdded: string;
  toastFooterLinkUpdated: string;
  toastFooterLinkDeleted: string;
  toastExperienceAdded: string;
  toastExperienceUpdated: string;
  toastExperienceDeleted: string;
  toastSkillAdded: string;
  toastSkillUpdated: string;
  toastSkillDeleted: string;
  toastMediaAdded: string;
  toastMediaDeleted: string;
  toastDataReset: string;
  toastTranslationsReset: string;
  toastThemeDark: string;
  toastThemeLight: string;
  loaderSystemInitializing: string;
  loaderLoadingStatus: string;

  // Newly Refactored Toast & Tag Keys
  pdfExportSuccessToast: string;
  pdfExportFailedToast: string;
  cloudinaryNotConfigured: string;
  cloudinaryUploadSuccessToast: string;
  demoSimulationTag: string;
  demoImageLoadedToast: string;
  mediaDestroyRequestToast: string;
  mediaCloudReleasedToast: string;
  mediaCloudPartialReleasedToast: string;
  mediaLocalDemoRemovedToast: string;
  mediaPhysicalDeleteFailedToast: string;
  avatarCloudinaryUploadSuccessToast: string;
  uploadFailedPrefix: string;
  skillsFilterFrontendTag: string;
  skillsFilterBackendTag: string;
  skillsFilterAITag: string;
  skillsFilterArchTag: string;
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
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  'en': en,
  'ja': ja,
  'ko': ko,
};
