import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const DATA_FILE = path.join(process.cwd(), '.data', 'portfolio_fallback.json');

async function main() {
  console.log('Starting Supabase Database Seeding...');

  try {
    // 1. Seed Admin User
    const hashedPassword = bcrypt.hashSync('456654@Portfolio', 12);
    const admin = await prisma.admin.upsert({
      where: { username: 'majidalimoalim@gmail.com' },
      update: { password: hashedPassword },
      create: { username: 'majidalimoalim@gmail.com', password: hashedPassword },
    });
    console.log('✅ Admin user seeded:', admin.username);

    // Read initial data from fallback JSON if available
    let initialData = {};
    if (fs.existsSync(DATA_FILE)) {
      try {
        const raw = fs.readFileSync(DATA_FILE, 'utf8');
        initialData = JSON.parse(raw);
      } catch (err) {
        console.warn('Could not read portfolio_fallback.json:', err.message);
      }
    }

    // 2. Seed Profile
    const profData = initialData.profile || {
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
    };
    
    await prisma.profile.upsert({
      where: { id: 1 },
      update: {
        name: profData.name,
        title: profData.title,
        bio: profData.bio,
        email: profData.email,
        phone: profData.phone,
        location: profData.location,
        avatarUrl: profData.avatarUrl || '/images/myimage.png',
        cvUrl: profData.cvUrl || '/images/Abdimajid_Ali_Moalim_CV.pdf',
        yearsExperience: profData.yearsExperience || '4+',
        projectsCompleted: profData.projectsCompleted || '15+',
        happyClients: profData.happyClients || '20+',
      },
      create: {
        id: 1,
        name: profData.name,
        title: profData.title,
        bio: profData.bio,
        email: profData.email,
        phone: profData.phone,
        location: profData.location,
        avatarUrl: profData.avatarUrl || '/images/myimage.png',
        cvUrl: profData.cvUrl || '/images/Abdimajid_Ali_Moalim_CV.pdf',
        yearsExperience: profData.yearsExperience || '4+',
        projectsCompleted: profData.projectsCompleted || '15+',
        happyClients: profData.happyClients || '20+',
      },
    });
    console.log('✅ Profile seeded');

    // 3. Seed Site Settings
    const settingsData = initialData.siteSettings || {
      id: 1,
      siteTitle: 'Abdimajid Ali Moalim | Portfolio',
      contactEmail: 'majidalimoalim@gmail.com',
      contactPhone: '+252 61 9534042',
      footerText: '© 2026 Abdimajid Ali Moalim. All rights reserved.',
    };
    await prisma.siteSetting.upsert({
      where: { id: 1 },
      update: {
        siteTitle: settingsData.siteTitle,
        contactEmail: settingsData.contactEmail,
        contactPhone: settingsData.contactPhone,
        footerText: settingsData.footerText,
      },
      create: {
        id: 1,
        siteTitle: settingsData.siteTitle,
        contactEmail: settingsData.contactEmail,
        contactPhone: settingsData.contactPhone,
        footerText: settingsData.footerText,
      },
    });
    console.log('✅ Site settings seeded');

    // 4. Seed Services
    if (Array.isArray(initialData.services) && initialData.services.length > 0) {
      for (const srv of initialData.services) {
        await prisma.service.upsert({
          where: { id: srv.id },
          update: {
            title: srv.title,
            description: srv.description,
            icon: srv.icon || 'fas fa-code',
            bullets: srv.bullets || [],
            category: srv.category || 'Development',
            date: srv.date || null,
            additionalInfo: srv.additionalInfo || null,
            images: srv.images || [],
            percentage: srv.percentage != null ? parseInt(srv.percentage) : null,
          },
          create: {
            id: srv.id,
            title: srv.title,
            description: srv.description,
            icon: srv.icon || 'fas fa-code',
            bullets: srv.bullets || [],
            category: srv.category || 'Development',
            date: srv.date || null,
            additionalInfo: srv.additionalInfo || null,
            images: srv.images || [],
            percentage: srv.percentage != null ? parseInt(srv.percentage) : null,
          },
        });
      }
      console.log(`✅ ${initialData.services.length} Services seeded`);
    }

    // 5. Seed Projects
    if (Array.isArray(initialData.projects) && initialData.projects.length > 0) {
      for (const proj of initialData.projects) {
        await prisma.project.upsert({
          where: { id: proj.id },
          update: {
            title: proj.title,
            description: proj.description,
            bullets: proj.bullets || [],
            techStack: proj.techStack || [],
            imageUrl: proj.imageUrl || null,
            images: proj.images || [],
            githubUrl: proj.githubUrl || null,
            liveUrl: proj.liveUrl || null,
            category: proj.category || 'Full Stack',
            featured: proj.featured ?? true,
            date: proj.date || null,
            additionalInfo: proj.additionalInfo || null,
          },
          create: {
            id: proj.id,
            title: proj.title,
            description: proj.description,
            bullets: proj.bullets || [],
            techStack: proj.techStack || [],
            imageUrl: proj.imageUrl || null,
            images: proj.images || [],
            githubUrl: proj.githubUrl || null,
            liveUrl: proj.liveUrl || null,
            category: proj.category || 'Full Stack',
            featured: proj.featured ?? true,
            date: proj.date || null,
            additionalInfo: proj.additionalInfo || null,
          },
        });
      }
      console.log(`✅ ${initialData.projects.length} Projects seeded`);
    }

    // 6. Seed Achievements
    if (Array.isArray(initialData.achievements) && initialData.achievements.length > 0) {
      for (const ach of initialData.achievements) {
        await prisma.achievement.upsert({
          where: { id: ach.id },
          update: {
            title: ach.title,
            description: ach.description,
            bullets: ach.bullets || [],
            tags: ach.tags || [],
            category: ach.category || 'General',
            date: ach.date || null,
            imageUrl: ach.imageUrl || null,
            images: ach.images || [],
            additionalInfo: ach.additionalInfo || null,
          },
          create: {
            id: ach.id,
            title: ach.title,
            description: ach.description,
            bullets: ach.bullets || [],
            tags: ach.tags || [],
            category: ach.category || 'General',
            date: ach.date || null,
            imageUrl: ach.imageUrl || null,
            images: ach.images || [],
            additionalInfo: ach.additionalInfo || null,
          },
        });
      }
      console.log(`✅ ${initialData.achievements.length} Achievements seeded`);
    }

    // 7. Seed Certifications
    if (Array.isArray(initialData.certifications) && initialData.certifications.length > 0) {
      for (const cert of initialData.certifications) {
        await prisma.certification.upsert({
          where: { id: cert.id },
          update: {
            title: cert.title,
            description: cert.description,
            issuer: cert.issuer,
            issueDate: cert.issueDate,
            credentialId: cert.credentialId || null,
            credentialUrl: cert.credentialUrl || null,
            imageUrl: cert.imageUrl || null,
            images: cert.images || [],
            tags: cert.tags || [],
            date: cert.date || null,
            additionalInfo: cert.additionalInfo || null,
          },
          create: {
            id: cert.id,
            title: cert.title,
            description: cert.description,
            issuer: cert.issuer,
            issueDate: cert.issueDate,
            credentialId: cert.credentialId || null,
            credentialUrl: cert.credentialUrl || null,
            imageUrl: cert.imageUrl || null,
            images: cert.images || [],
            tags: cert.tags || [],
            date: cert.date || null,
            additionalInfo: cert.additionalInfo || null,
          },
        });
      }
      console.log(`✅ ${initialData.certifications.length} Certifications seeded`);
    }

    console.log('🎉 Supabase Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Database seeding error:', error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
