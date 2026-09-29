import { getModuleItems } from '@/lib/portfolioStore';
import PortfolioClient from './PortfolioClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  let portfolioData = {
    profile: null,
    services: [],
    projects: [],
    achievements: [],
    certifications: [],
    posts: [],
    skills: [],
    experiences: [],
    educations: [],
    socialLinks: [],
    siteSettings: null,
  };

  try {
    const [
      profile,
      services,
      projects,
      achievements,
      certifications,
      posts,
      skills,
      experiences,
      educations,
      socialLinks,
      siteSettings,
    ] = await Promise.all([
      getModuleItems('profile').catch(() => null),
      getModuleItems('services').catch(() => []),
      getModuleItems('projects').catch(() => []),
      getModuleItems('achievements').catch(() => []),
      getModuleItems('certifications').catch(() => []),
      getModuleItems('posts').catch(() => []),
      getModuleItems('skills').catch(() => []),
      getModuleItems('experiences').catch(() => []),
      getModuleItems('educations').catch(() => []),
      getModuleItems('social-links').catch(() => []),
      getModuleItems('site-settings').catch(() => null),
    ]);

    portfolioData = {
      profile,
      services,
      projects,
      achievements,
      certifications,
      posts,
      skills,
      experiences,
      educations,
      socialLinks,
      siteSettings,
    };
  } catch (e) {
    console.error('Data fetch warning:', e.message);
  }

  return <PortfolioClient data={portfolioData} />;
}

