import prisma from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

// Local backup file path for offline/fallback storage
const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'portfolio_fallback.json');

// Initial Default Data State
const DEFAULT_DATA = {
  profile: {
    id: 1,
    name: 'Abdimajid Ali Moalim',
    title: 'Full Stack Software Engineer, Data Analyst & Cybersecurity',
    bio: 'Tech professional with 4+ years of experience specialized in building scalable platforms, cybersecurity, and data-centric solutions.',
    email: 'majidalimoalim@gmail.com',
    phone: '+252 61 9534042',
    location: 'Mogadishu, Somalia',
    yearsExperience: '4+',
    projectsCompleted: '15+',
    happyClients: '20+',
  },
  services: [],
  projects: [],
  achievements: [],
  certifications: [],
  posts: [],
  skills: [],
  experiences: [],
  educations: [],
  messages: [],
  socialLinks: [],
  siteSettings: {
    id: 1,
    siteTitle: 'Abdimajid Ali Moalim | Portfolio',
    contactEmail: 'majidalimoalim@gmail.com',
    contactPhone: '+252 61 9534042',
    footerText: '© 2026 Abdimajid Ali Moalim. All rights reserved.',
  },
};

function ensureLocalData() {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_DATA, null, 2));
    }
  } catch (err) {
    console.warn('Local data directory check warning:', err.message);
  }
}

function getLocalData() {
  ensureLocalData();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return DEFAULT_DATA;
  }
}

function saveLocalData(data) {
  ensureLocalData();
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.warn('Local data save warning:', err.message);
  }
}

// Unified Get Module Items
export async function getModuleItems(module) {
  try {
    switch (module) {
      case 'profile':
        return await prisma.profile.findFirst();
      case 'services':
        return await prisma.service.findMany({ orderBy: { id: 'asc' } });
      case 'projects':
        return await prisma.project.findMany({ orderBy: { id: 'desc' } });
      case 'achievements':
        return await prisma.achievement.findMany({ orderBy: { createdAt: 'desc' } });
      case 'certifications':
        return await prisma.certification.findMany({ orderBy: { id: 'desc' } });
      case 'posts':
        return await prisma.post.findMany({ orderBy: { createdAt: 'desc' } });
      case 'skills':
        return await prisma.skill.findMany({ orderBy: { id: 'asc' } });
      case 'experiences':
        return await prisma.experience.findMany({ orderBy: { id: 'desc' } });
      case 'educations':
        return await prisma.education.findMany({ orderBy: { id: 'desc' } });
      case 'messages':
        return await prisma.message.findMany({ orderBy: { createdAt: 'desc' } });
      case 'social-links':
        return await prisma.socialLink.findMany({ orderBy: { id: 'asc' } });
      case 'site-settings':
        return await prisma.siteSetting.findFirst();
      default:
        return [];
    }
  } catch (err) {
    console.error(`Database query error for ${module}:`, err.message);
    const isServerless = process.env.VERCEL || process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NODE_ENV === 'production';
    if (isServerless) {
      return module === 'profile' || module === 'site-settings' ? null : [];
    }
    const local = getLocalData();
    if (module === 'profile') return local.profile;
    if (module === 'site-settings') return local.siteSettings;
    return local[module] || local[module.replace('-', '')] || [];
  }
}

// Unified Create / Update Single Module
export async function saveModuleItem(module, body, id = null) {
  let dbSuccess = false;
  let resultItem = null;
  let prismaError = null;

  try {
    if (module === 'profile') {
      resultItem = await prisma.profile.upsert({ where: { id: 1 }, update: body, create: { id: 1, ...body } });
      dbSuccess = true;
    } else if (module === 'site-settings') {
      resultItem = await prisma.siteSetting.upsert({ where: { id: 1 }, update: body, create: { id: 1, ...body } });
      dbSuccess = true;
    } else if (id) {
      const numId = parseInt(id);
      switch (module) {
        case 'services': resultItem = await prisma.service.update({ where: { id: numId }, data: body }); break;
        case 'projects': resultItem = await prisma.project.update({ where: { id: numId }, data: body }); break;
        case 'achievements': resultItem = await prisma.achievement.update({ where: { id: numId }, data: body }); break;
        case 'certifications': resultItem = await prisma.certification.update({ where: { id: numId }, data: body }); break;
        case 'posts': resultItem = await prisma.post.update({ where: { id: numId }, data: body }); break;
        case 'skills': resultItem = await prisma.skill.update({ where: { id: numId }, data: body }); break;
        case 'experiences': resultItem = await prisma.experience.update({ where: { id: numId }, data: body }); break;
        case 'educations': resultItem = await prisma.education.update({ where: { id: numId }, data: body }); break;
        case 'social-links': resultItem = await prisma.socialLink.update({ where: { id: numId }, data: body }); break;
      }
      dbSuccess = true;
    } else {
      switch (module) {
        case 'services': resultItem = await prisma.service.create({ data: body }); break;
        case 'projects': resultItem = await prisma.project.create({ data: body }); break;
        case 'achievements': resultItem = await prisma.achievement.create({ data: body }); break;
        case 'certifications': resultItem = await prisma.certification.create({ data: body }); break;
        case 'posts': resultItem = await prisma.post.create({ data: body }); break;
        case 'skills': resultItem = await prisma.skill.create({ data: body }); break;
        case 'experiences': resultItem = await prisma.experience.create({ data: body }); break;
        case 'educations': resultItem = await prisma.education.create({ data: body }); break;
        case 'messages': resultItem = await prisma.message.create({ data: body }); break;
        case 'social-links': resultItem = await prisma.socialLink.create({ data: body }); break;
      }
      dbSuccess = true;
    }
  } catch (err) {
    prismaError = err;
    console.error(`Prisma save failed for ${module}:`, err.message);
  }

  if (!dbSuccess) {
    const isServerless = process.env.VERCEL || process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NODE_ENV === 'production';
    if (isServerless) {
      throw new Error(`Database save failed (${prismaError?.message || 'Database disconnected'}). On serverless deployments, you must configure DATABASE_URL in your hosting environment variables.`);
    }

    const local = getLocalData();
    if (module === 'profile') {
      local.profile = { ...local.profile, ...body };
      resultItem = local.profile;
    } else if (module === 'site-settings') {
      local.siteSettings = { ...local.siteSettings, ...body };
      resultItem = local.siteSettings;
    } else {
      const key = module === 'social-links' ? 'socialLinks' : module;
      if (!Array.isArray(local[key])) local[key] = [];

      if (id) {
        const numId = parseInt(id);
        const idx = local[key].findIndex(i => i.id === numId);
        if (idx !== -1) {
          local[key][idx] = { ...local[key][idx], ...body };
          resultItem = local[key][idx];
        }
      } else {
        const newId = local[key].length ? Math.max(...local[key].map(i => i.id || 0)) + 1 : 1;
        resultItem = { id: newId, createdAt: new Date().toISOString(), ...body };
        local[key].unshift(resultItem);
      }
    }
    saveLocalData(local);
  }

  return resultItem;
}

// Unified Delete Module Item
export async function deleteModuleItem(module, id) {
  const numId = parseInt(id);
  let dbSuccess = false;
  let prismaError = null;

  try {
    switch (module) {
      case 'services': await prisma.service.delete({ where: { id: numId } }); break;
      case 'projects': await prisma.project.delete({ where: { id: numId } }); break;
      case 'achievements': await prisma.achievement.delete({ where: { id: numId } }); break;
      case 'certifications': await prisma.certification.delete({ where: { id: numId } }); break;
      case 'posts': await prisma.post.delete({ where: { id: numId } }); break;
      case 'skills': await prisma.skill.delete({ where: { id: numId } }); break;
      case 'experiences': await prisma.experience.delete({ where: { id: numId } }); break;
      case 'educations': await prisma.education.delete({ where: { id: numId } }); break;
      case 'messages': await prisma.message.delete({ where: { id: numId } }); break;
      case 'social-links': await prisma.socialLink.delete({ where: { id: numId } }); break;
    }
    dbSuccess = true;
  } catch (err) {
    prismaError = err;
    console.error(`Prisma delete failed for ${module}:`, err.message);
  }

  if (!dbSuccess) {
    const isServerless = process.env.VERCEL || process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NODE_ENV === 'production';
    if (isServerless) {
      throw new Error(`Database delete failed (${prismaError?.message || 'Database disconnected'}). On serverless deployments, you must configure DATABASE_URL in your hosting environment variables.`);
    }

    const local = getLocalData();
    const key = module === 'social-links' ? 'socialLinks' : module;
    if (Array.isArray(local[key])) {
      local[key] = local[key].filter(i => i.id !== numId);
      saveLocalData(local);
    }
  }
  return true;
}
