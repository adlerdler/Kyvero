import { SiteData } from '../types';
import { initialProfile } from './profiles';
import { initialSocialLinks } from './social_links';
import { initialProjects } from './projects';
import { initialTechSkills } from './tech_skills';
import { initialMediaItems } from './media_items';
import { initialExperiences } from './experiences';
import { initialSystemConfig, initialFooterLinks } from './system';

export * from './svg_assets';
export * from './profiles';
export * from './social_links';
export * from './projects';
export * from './tech_skills';
export * from './media_items';
export * from './experiences';
export * from './system';

export const INITIAL_SITE_DATA: SiteData = {
  profile: initialProfile,
  socialLinks: initialSocialLinks,
  projects: initialProjects,
  techSkills: initialTechSkills,
  mediaItems: initialMediaItems,
  experiences: initialExperiences,
  systemConfig: initialSystemConfig
};

