'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();

  // Navigation & Theme State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [themeMode, setThemeMode] = useState('dark'); // 'dark' or 'light'
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Data State for All Modules
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  const [profile, setProfile] = useState({
    name: 'Abdimajid Ali Moalim',
    title: 'Full Stack Software Engineer, Data Analyst & Cybersecurity',
    bio: 'Tech professional with 4+ years of experience specialized in building scalable platforms, cybersecurity, and data-centric solutions.',
    email: 'majidalimoalim@gmail.com',
    phone: '+252 61 9534042',
    location: 'Mogadishu, Somalia',
    yearsExperience: '4+',
    projectsCompleted: '15+',
    happyClients: '20+',
    avatarUrl: '',
    cvUrl: '',
  });

  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [posts, setPosts] = useState([]);
  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [educations, setEducations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);
  const [siteSettings, setSiteSettings] = useState({
    siteTitle: 'Abdimajid Ali Moalim | Portfolio',
    contactEmail: 'majidalimoalim@gmail.com',
    contactPhone: '+252 61 9534042',
    footerText: '© 2026 Abdimajid Ali Moalim. All rights reserved.',
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [modalData, setModalData] = useState({});

  // Toast Helper
  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ visible: false, message: '', type: 'success' }), 3000);
  };

  // Fetch All Modules Data
  const fetchModuleData = async (module) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/portfolio/${module}`);
      if (!res.ok) return;
      const data = await res.json();
      
      switch (module) {
        case 'profile': setProfile(data || profile); break;
        case 'services': setServices(Array.isArray(data) ? data : []); break;
        case 'projects': setProjects(Array.isArray(data) ? data : []); break;
        case 'achievements': setAchievements(Array.isArray(data) ? data : []); break;
        case 'certifications': setCertifications(Array.isArray(data) ? data : []); break;
        case 'posts': setPosts(Array.isArray(data) ? data : []); break;
        case 'skills': setSkills(Array.isArray(data) ? data : []); break;
        case 'experiences': setExperiences(Array.isArray(data) ? data : []); break;
        case 'educations': setEducations(Array.isArray(data) ? data : []); break;
        case 'messages': setMessages(Array.isArray(data) ? data : []); break;
        case 'social-links': setSocialLinks(Array.isArray(data) ? data : []); break;
        case 'site-settings': setSiteSettings(data || siteSettings); break;
      }
    } catch (err) {
      console.warn(`Error fetching ${module}:`, err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllData = () => {
    ['profile', 'services', 'projects', 'achievements', 'certifications', 'posts', 'skills', 'experiences', 'educations', 'messages', 'social-links', 'site-settings'].forEach(fetchModuleData);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Theme Toggle Effect
  const toggleTheme = () => {
    const nextTheme = themeMode === 'dark' ? 'light' : 'dark';
    setThemeMode(nextTheme);
  };

  // Logout Handler
  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      window.location.href = '/admin/login';
    } catch (err) {
      showToast('Logout error', 'error');
    }
  };

  // Generic Save Handler for Single Form Modules (Profile & Site Settings)
  const handleSaveSingleModule = async (module, dataToSave) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/portfolio/${module}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave),
      });
      if (!res.ok) {
        let errMsg = 'Save failed';
        try {
          const errData = await res.json();
          errMsg = errData?.error || errData?.message || errMsg;
        } catch {}
        throw new Error(errMsg);
      }
      showToast(`${module.replace('-', ' ')} updated successfully!`);
      fetchModuleData(module);
      router.refresh();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Generic Create / Edit Handler for List Items
  const handleOpenModal = (item = null) => {
    setEditingId(item ? item.id : null);
    
    // Set initial form defaults based on activeTab
    if (item) {
      const copy = { ...item };
      if (Array.isArray(copy.bullets)) copy.bullets = copy.bullets.join('\n');
      if (Array.isArray(copy.tags)) copy.tags = copy.tags.join(', ');
      if (Array.isArray(copy.techStack)) copy.techStack = copy.techStack.join(', ');
      if (activeTab === 'posts') {
        if (!copy.postType) copy.postType = 'BLOG';
        if (!copy.category) copy.category = 'Software Engineering';
        if (!copy.status) copy.status = copy.published === false ? 'Draft' : 'Published';
        if (!copy.author) copy.author = profile?.name || 'Abdimajid Ali Moalim';
        if (copy.featured === undefined || copy.featured === null) copy.featured = false;
        if (!copy.readingTime) copy.readingTime = '3 min read';
      }
      setModalData(copy);
    } else {
      switch (activeTab) {
        case 'services': setModalData({ title: '', description: '', icon: 'fas fa-code', bullets: '', category: 'Development', images: [], date: '', percentage: '' }); break;
        case 'projects': setModalData({ title: '', description: '', bullets: '', techStack: '', imageUrl: '', githubUrl: '', liveUrl: '', category: 'Full Stack', featured: true }); break;
        case 'achievements': setModalData({ title: '', description: '', bullets: '', tags: '', imageUrl: '', category: 'General', date: '' }); break;
        case 'certifications': setModalData({ title: '', issuer: '', issueDate: '', description: '', imageUrl: '', tags: '', credentialId: '', credentialUrl: '' }); break;
        case 'posts': setModalData({
          title: '',
          slug: '',
          postType: 'BLOG',
          category: 'Software Engineering',
          author: profile?.name || 'Abdimajid Ali Moalim',
          tags: '',
          imageUrl: '',
          images: [],
          snippet: '',
          content: '',
          status: 'Published',
          published: true,
          featured: false,
          date: new Date().toISOString().split('T')[0],
          readingTime: '3 min read',
          seoTitle: '',
          seoDescription: '',
          additionalInfo: '',
        }); break;
        case 'skills': setModalData({ name: '', category: 'Development', proficiency: 90, icon: 'fas fa-check' }); break;
        case 'experiences': setModalData({ company: '', role: '', location: '', startDate: '', endDate: 'Present', description: '', bullets: '' }); break;
        case 'educations': setModalData({ institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', description: '' }); break;
        case 'social-links': setModalData({ platform: 'LinkedIn', url: '', icon: 'fab fa-linkedin' }); break;
        default: setModalData({});
      }
    }
    setIsModalOpen(true);
  };

  const handleSaveModalItem = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = { ...modalData };
      if (typeof payload.bullets === 'string') payload.bullets = payload.bullets.split('\n').map(b => b.trim()).filter(Boolean);
      if (typeof payload.tags === 'string') payload.tags = payload.tags.split(',').map(t => t.trim()).filter(Boolean);
      if (typeof payload.techStack === 'string') payload.techStack = payload.techStack.split(',').map(t => t.trim()).filter(Boolean);
      if (activeTab === 'posts') {
        if (payload.status === 'Published') payload.published = true;
        else if (payload.status === 'Draft' || payload.status === 'Archived') payload.published = false;
        payload.featured = payload.featured === true || payload.featured === 'true' || payload.featured === 'Yes';
        if (!payload.slug && payload.title) {
          payload.slug = slugify(payload.title);
        }
      }

      const url = editingId 
        ? `/api/admin/portfolio/${activeTab}/${editingId}` 
        : `/api/admin/portfolio/${activeTab}`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let errMsg = 'Action failed';
        try {
          const errData = await res.json();
          errMsg = errData?.error || errData?.message || errMsg;
        } catch {}
        throw new Error(errMsg);
      }
      showToast(`Item ${editingId ? 'updated' : 'created'} successfully!`);
      setIsModalOpen(false);
      fetchModuleData(activeTab);
      router.refresh();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (module, id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/portfolio/${module}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      showToast('Item deleted successfully');
      fetchModuleData(module);
      router.refresh();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Color Constants for Dark / Light Modes
  const isDark = themeMode === 'dark';
  const styles = getStyles(isDark);

  return (
    <div style={styles.appWrapper}>
      {/* Toast Notification */}
      {toast.visible && (
        <div style={{
          ...styles.toast,
          background: toast.type === 'error' ? '#ef4444' : '#10b981',
        }}>
          <i className={`fas ${toast.type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}`}></i>
          {toast.message}
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <div style={styles.brandLogo}>MA<span style={{ color: '#7c3aed' }}>.</span></div>
          <div style={styles.brandTitle}>Admin Portal</div>
        </div>

        <nav style={styles.navMenu}>
          <SidebarItem active={activeTab === 'dashboard'} icon="fas fa-chart-pie" label="Dashboard" onClick={() => setActiveTab('dashboard')} isDark={isDark} />
          <SidebarItem active={activeTab === 'profile'} icon="fas fa-user-circle" label="Profile" onClick={() => setActiveTab('profile')} isDark={isDark} />
          <SidebarItem active={activeTab === 'services'} icon="fas fa-concierge-bell" label="Services" onClick={() => setActiveTab('services')} isDark={isDark} />
          <SidebarItem active={activeTab === 'projects'} icon="fas fa-project-diagram" label="Projects" onClick={() => setActiveTab('projects')} isDark={isDark} />
          <SidebarItem active={activeTab === 'achievements'} icon="fas fa-trophy" label="Achievements" onClick={() => setActiveTab('achievements')} isDark={isDark} />
          <SidebarItem active={activeTab === 'certifications'} icon="fas fa-certificate" label="Certifications" onClick={() => setActiveTab('certifications')} isDark={isDark} />
          <SidebarItem active={activeTab === 'posts'} icon="fas fa-newspaper" label="Posts / Blog" onClick={() => setActiveTab('posts')} isDark={isDark} />
          <SidebarItem active={activeTab === 'skills'} icon="fas fa-code" label="Skills" onClick={() => setActiveTab('skills')} isDark={isDark} />
          <SidebarItem active={activeTab === 'experiences'} icon="fas fa-briefcase" label="Experience" onClick={() => setActiveTab('experiences')} isDark={isDark} />
          <SidebarItem active={activeTab === 'educations'} icon="fas fa-graduation-cap" label="Education" onClick={() => setActiveTab('educations')} isDark={isDark} />
          <SidebarItem active={activeTab === 'messages'} icon="fas fa-envelope" label="Messages" badge={messages.filter(m => !m.read).length} onClick={() => setActiveTab('messages')} isDark={isDark} />
          <SidebarItem active={activeTab === 'social-links'} icon="fas fa-share-alt" label="Social Links" onClick={() => setActiveTab('social-links')} isDark={isDark} />
          <SidebarItem active={activeTab === 'site-settings'} icon="fas fa-cog" label="Site Settings" onClick={() => setActiveTab('site-settings')} isDark={isDark} />
        </nav>

        <div style={styles.sidebarFooter}>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={styles.mainContainer}>
        {/* Top Navigation Bar */}
        <header style={styles.topHeader}>
          <div style={styles.headerLeft}>
            <h1 style={styles.pageHeading}>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ')}</h1>
            <p style={styles.pageSubheading}>Manage and publish your portfolio content</p>
          </div>

          <div style={styles.headerRight}>
            {/* Light / Dark Mode Toggle */}
            <button style={styles.themeToggleBtn} onClick={toggleTheme} title="Toggle Light / Dark Mode">
              <i className={`fas ${isDark ? 'fa-sun' : 'fa-moon'}`} style={{ color: isDark ? '#f59e0b' : '#7c3aed' }}></i>
              <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
            </button>

            <a href="/" target="_blank" style={styles.viewSiteBtn}>
              <i className="fas fa-external-link-alt"></i> View Website
            </a>
          </div>
        </header>

        {/* Content Body */}
        <main style={styles.contentBody}>
          {/* DASHBOARD TAB OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div>
              <div style={styles.statsGrid}>
                <StatCard icon="fas fa-project-diagram" title="Projects" count={projects.length} color="#3b82f6" isDark={isDark} />
                <StatCard icon="fas fa-trophy" title="Achievements" count={achievements.length} color="#f59e0b" isDark={isDark} />
                <StatCard icon="fas fa-certificate" title="Certifications" count={certifications.length} color="#10b981" isDark={isDark} />
                <StatCard icon="fas fa-newspaper" title="Blog Posts" count={posts.length} color="#ec4899" isDark={isDark} />
                <StatCard icon="fas fa-code" title="Skills" count={skills.length} color="#8b5cf6" isDark={isDark} />
                <StatCard icon="fas fa-envelope" title="Messages" count={messages.length} color="#06b6d4" isDark={isDark} />
              </div>

              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Quick Profile Overview</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '16px' }}>
                  <div><strong>Name:</strong> {profile.name}</div>
                  <div><strong>Title:</strong> {profile.title}</div>
                  <div><strong>Email:</strong> {profile.email}</div>
                  <div><strong>Experience:</strong> {profile.yearsExperience} Years</div>
                </div>
              </div>
            </div>
          )}

          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Edit Personal Profile</h3>

              {/* Live Avatar Preview */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px', padding: '16px', borderRadius: '14px', background: isDark ? '#1c1c1f' : '#f8fafc', border: `1px solid ${isDark ? '#3f3f46' : '#e2e8f0'}` }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <img
                    src={profile.avatarUrl || '/images/myimage.png'}
                    alt="Avatar Preview"
                    style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #7c3aed', boxShadow: '0 0 20px rgba(124,58,237,0.4)' }}
                  />
                  <span style={{ position: 'absolute', bottom: 0, right: 0, background: '#7c3aed', color: '#fff', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>
                    <i className="fas fa-camera"></i>
                  </span>
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', color: isDark ? '#f4f4f5' : '#0f172a' }}>{profile.name}</div>
                  <div style={{ fontSize: '0.85rem', color: isDark ? '#a1a1aa' : '#64748b', marginTop: '4px' }}>{profile.title?.split(/[,|&]/)[0]?.trim()}</div>
                  <div style={{ fontSize: '0.78rem', color: '#7c3aed', marginTop: '4px' }}>{profile.email}</div>
                </div>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSaveSingleModule('profile', profile); }}>
                <div style={styles.formGrid}>
                  <FormField label="Full Name" value={profile.name} onChange={(v) => setProfile({ ...profile, name: v })} isDark={isDark} />
                  <FormField label="Professional Title" value={profile.title} onChange={(v) => setProfile({ ...profile, title: v })} isDark={isDark} />
                  <ImageUploadField label="Profile Picture / Avatar" value={profile.avatarUrl || ''} onChange={(v) => setProfile({ ...profile, avatarUrl: v })} isDark={isDark} />
                  <ImageUploadField label="CV File / Resume" value={profile.cvUrl || ''} onChange={(v) => setProfile({ ...profile, cvUrl: v })} isDark={isDark} />
                  <FormField label="Email Address" value={profile.email} onChange={(v) => setProfile({ ...profile, email: v })} isDark={isDark} />
                  <FormField label="Phone Number" value={profile.phone} onChange={(v) => setProfile({ ...profile, phone: v })} isDark={isDark} />
                  <FormField label="Location" value={profile.location} onChange={(v) => setProfile({ ...profile, location: v })} isDark={isDark} />
                  <FormField label="Years Experience" value={profile.yearsExperience} onChange={(v) => setProfile({ ...profile, yearsExperience: v })} isDark={isDark} />
                  <FormField label="Completed Projects" value={profile.projectsCompleted} onChange={(v) => setProfile({ ...profile, projectsCompleted: v })} isDark={isDark} />
                  <FormField label="Happy Clients" value={profile.happyClients} onChange={(v) => setProfile({ ...profile, happyClients: v })} isDark={isDark} />
                </div>
                <FormTextarea label="Bio / Summary" value={profile.bio} onChange={(v) => setProfile({ ...profile, bio: v })} isDark={isDark} />
                <button type="submit" style={styles.primaryBtn} disabled={loading}>
                  <i className="fas fa-save"></i> Save Profile Settings
                </button>
              </form>
            </div>
          )}

          {/* SITE SETTINGS TAB */}
          {activeTab === 'site-settings' && (
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Website & SEO Settings</h3>
              <form onSubmit={(e) => { e.preventDefault(); handleSaveSingleModule('site-settings', siteSettings); }}>
                <div style={styles.formGrid}>
                  <FormField label="Website Title" value={siteSettings.siteTitle} onChange={(v) => setSiteSettings({ ...siteSettings, siteTitle: v })} isDark={isDark} />
                  <FormField label="Contact Email" value={siteSettings.contactEmail} onChange={(v) => setSiteSettings({ ...siteSettings, contactEmail: v })} isDark={isDark} />
                  <FormField label="Contact Phone" value={siteSettings.contactPhone} onChange={(v) => setSiteSettings({ ...siteSettings, contactPhone: v })} isDark={isDark} />
                </div>
                <FormTextarea label="Footer Copyright Text" value={siteSettings.footerText} onChange={(v) => setSiteSettings({ ...siteSettings, footerText: v })} isDark={isDark} />
                <button type="submit" style={styles.primaryBtn} disabled={loading}>
                  <i className="fas fa-save"></i> Save Settings
                </button>
              </form>
            </div>
          )}

          {/* LIST MODULES (Services, Projects, Achievements, Certifications, Posts, Skills, Experiences, Educations, Messages, Social Links) */}
          {['services', 'projects', 'achievements', 'certifications', 'posts', 'skills', 'experiences', 'educations', 'messages', 'social-links'].includes(activeTab) && (
            <div style={styles.card}>
              <div style={styles.cardHeaderRow}>
                <h3 style={styles.cardTitle}>Manage {activeTab.replace('-', ' ')}</h3>
                {activeTab !== 'messages' && (
                  <button style={styles.primaryBtn} onClick={() => handleOpenModal(null)}>
                    <i className="fas fa-plus"></i> Add New
                  </button>
                )}
              </div>

              <ListTable
                activeTab={activeTab}
                items={
                  activeTab === 'services' ? services :
                  activeTab === 'projects' ? projects :
                  activeTab === 'achievements' ? achievements :
                  activeTab === 'certifications' ? certifications :
                  activeTab === 'posts' ? posts :
                  activeTab === 'skills' ? skills :
                  activeTab === 'experiences' ? experiences :
                  activeTab === 'educations' ? educations :
                  activeTab === 'messages' ? messages : socialLinks
                }
                onEdit={(item) => handleOpenModal(item)}
                onDelete={(id) => handleDeleteItem(activeTab, id)}
                isDark={isDark}
              />
            </div>
          )}
        </main>
      </div>

      {/* ITEM FORM MODAL */}
      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={{ ...styles.modalContent, maxWidth: activeTab === 'posts' ? '760px' : '600px' }}>
            <div style={styles.modalHeader}>
              <h3>{editingId ? 'Edit Item' : 'Add New Item'} ({activeTab})</h3>
              <button style={styles.closeBtn} onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleSaveModalItem} style={styles.modalBody}>
              {/* Dynamic Modal Fields Based on activeTab */}
              {activeTab === 'services' && (
                <>
                  <FormField label="Service Title (Optional)" value={modalData.title || ''} onChange={(v) => setModalData({ ...modalData, title: v })} isDark={isDark} />
                  <FormSelect
                    label="Category"
                    value={modalData.category || ''}
                    onChange={(v) => setModalData({ ...modalData, category: v })}
                    options={['Development', 'Design & UI/UX', 'Cybersecurity', 'Data Analytics & AI', 'Mobile Apps', 'SaaS & Cloud', 'Tech Consulting', 'Other']}
                    isDark={isDark}
                  />
                  <FormField label="FontAwesome Icon (e.g. fas fa-code)" value={modalData.icon || ''} onChange={(v) => setModalData({ ...modalData, icon: v })} isDark={isDark} />
                  <MultipleImageUploadField label="Upload Service Images (Optional - first image shown as cover)" value={modalData.images || []} onChange={(v) => setModalData({ ...modalData, images: v })} isDark={isDark} />
                  <FormField label="Percentage / Proficiency (0-100, Optional)" type="number" value={modalData.percentage || ''} onChange={(v) => setModalData({ ...modalData, percentage: v ? parseInt(v) : null })} isDark={isDark} />
                  <FormField label="Posted Date / Date (Optional)" type="date" value={modalData.date || ''} onChange={(v) => setModalData({ ...modalData, date: v })} isDark={isDark} />
                  <FormTextarea label="Description (Optional)" value={modalData.description || ''} onChange={(v) => setModalData({ ...modalData, description: v })} isDark={isDark} />
                  <FormTextarea label="Bullet Points (One per line)" value={modalData.bullets || ''} onChange={(v) => setModalData({ ...modalData, bullets: v })} isDark={isDark} />
                  <FormTextarea label="Additional Information / Notes (Optional)" value={modalData.additionalInfo || ''} onChange={(v) => setModalData({ ...modalData, additionalInfo: v })} isDark={isDark} />
                </>
              )}

              {activeTab === 'projects' && (
                <>
                  <FormField label="Project Title (Optional)" value={modalData.title || ''} onChange={(v) => setModalData({ ...modalData, title: v })} isDark={isDark} />
                  <FormSelect
                    label="Category"
                    value={modalData.category || ''}
                    onChange={(v) => setModalData({ ...modalData, category: v })}
                    options={['Full Stack', 'Frontend', 'Backend', 'Mobile App', 'Data Science & AI', 'Cybersecurity', 'Cloud & DevOps', 'SaaS', 'Other']}
                    isDark={isDark}
                  />
                  <ImageUploadField label="Main Cover Image (Optional)" value={modalData.imageUrl || ''} onChange={(v) => setModalData({ ...modalData, imageUrl: v })} isDark={isDark} />
                  <MultipleImageUploadField label="Upload More Images / Gallery Screenshots (Optional)" value={modalData.images || []} onChange={(v) => setModalData({ ...modalData, images: v })} isDark={isDark} />
                  <FormField label="Tech Stack (Comma-separated)" value={modalData.techStack || ''} onChange={(v) => setModalData({ ...modalData, techStack: v })} isDark={isDark} />
                  <FormField label="Posted Date / Date (Optional)" type="date" value={modalData.date || ''} onChange={(v) => setModalData({ ...modalData, date: v })} isDark={isDark} />
                  <FormField label="GitHub Repository URL (Optional)" value={modalData.githubUrl || ''} onChange={(v) => setModalData({ ...modalData, githubUrl: v })} isDark={isDark} />
                  <FormField label="Live Demo URL (Optional)" value={modalData.liveUrl || ''} onChange={(v) => setModalData({ ...modalData, liveUrl: v })} isDark={isDark} />
                  <FormTextarea label="Description (Optional)" value={modalData.description || ''} onChange={(v) => setModalData({ ...modalData, description: v })} isDark={isDark} />
                  <FormTextarea label="Highlights / Bullets (One per line)" value={modalData.bullets || ''} onChange={(v) => setModalData({ ...modalData, bullets: v })} isDark={isDark} />
                  <FormTextarea label="Additional Information / Notes (Optional)" value={modalData.additionalInfo || ''} onChange={(v) => setModalData({ ...modalData, additionalInfo: v })} isDark={isDark} />
                </>
              )}

              {activeTab === 'achievements' && (
                <>
                  <FormField label="Achievement Title (Optional)" value={modalData.title || ''} onChange={(v) => setModalData({ ...modalData, title: v })} isDark={isDark} />
                  <FormSelect
                    label="Category"
                    value={modalData.category || ''}
                    onChange={(v) => setModalData({ ...modalData, category: v })}
                    options={['General', 'Development', 'Security', 'Data', 'Cloud', 'Awards & Recognition', 'Certifications', 'Other']}
                    isDark={isDark}
                  />
                  <ImageUploadField label="Main Image File (Optional)" value={modalData.imageUrl || ''} onChange={(v) => setModalData({ ...modalData, imageUrl: v })} isDark={isDark} />
                  <MultipleImageUploadField label="Upload More Images (Optional)" value={modalData.images || []} onChange={(v) => setModalData({ ...modalData, images: v })} isDark={isDark} />
                  <FormField label="Tags (Comma-separated)" value={modalData.tags || ''} onChange={(v) => setModalData({ ...modalData, tags: v })} isDark={isDark} />
                  <FormField label="Posted Date / Date (Optional)" type="date" value={modalData.date || ''} onChange={(v) => setModalData({ ...modalData, date: v })} isDark={isDark} />
                  <FormTextarea label="Description (Optional)" value={modalData.description || ''} onChange={(v) => setModalData({ ...modalData, description: v })} isDark={isDark} />
                  <FormTextarea label="Bullet Points (One per line)" value={modalData.bullets || ''} onChange={(v) => setModalData({ ...modalData, bullets: v })} isDark={isDark} />
                  <FormTextarea label="Additional Information / Notes (Optional)" value={modalData.additionalInfo || ''} onChange={(v) => setModalData({ ...modalData, additionalInfo: v })} isDark={isDark} />
                </>
              )}

              {activeTab === 'certifications' && (
                <>
                  <FormField label="Certificate Title (Optional)" value={modalData.title || ''} onChange={(v) => setModalData({ ...modalData, title: v })} isDark={isDark} />
                  <FormField label="Issuing Organization (Optional)" value={modalData.issuer || ''} onChange={(v) => setModalData({ ...modalData, issuer: v })} isDark={isDark} />
                  <FormField label="Issue Date / Posted Date (Optional)" type="date" value={modalData.issueDate || modalData.date || ''} onChange={(v) => setModalData({ ...modalData, issueDate: v, date: v })} isDark={isDark} />
                  <ImageUploadField label="Main Certificate Image (Optional)" value={modalData.imageUrl || ''} onChange={(v) => setModalData({ ...modalData, imageUrl: v })} isDark={isDark} />
                  <MultipleImageUploadField label="Upload More Images / Certificate Pages (Optional)" value={modalData.images || []} onChange={(v) => setModalData({ ...modalData, images: v })} isDark={isDark} />
                  <FormField label="Tags / Skills (Comma-separated)" value={modalData.tags || ''} onChange={(v) => setModalData({ ...modalData, tags: v })} isDark={isDark} />
                  <FormField label="Credential ID / Verification Link (Optional)" value={modalData.credentialUrl || ''} onChange={(v) => setModalData({ ...modalData, credentialUrl: v })} isDark={isDark} />
                  <FormTextarea label="Description (Optional)" value={modalData.description || ''} onChange={(v) => setModalData({ ...modalData, description: v })} isDark={isDark} />
                  <FormTextarea label="Additional Information / Notes (Optional)" value={modalData.additionalInfo || ''} onChange={(v) => setModalData({ ...modalData, additionalInfo: v })} isDark={isDark} />
                </>
              )}

              {activeTab === 'posts' && (
                <>
                  {/* BASIC INFORMATION */}
                  <FormSectionHeader title="Basic Information" icon="fas fa-info-circle" isDark={isDark} />
                  
                  <FormField
                    label="Post Title *"
                    value={modalData.title || ''}
                    onChange={(v) => {
                      const updates = { title: v };
                      if (!modalData.slug || modalData.slug === slugify(modalData.title || '')) {
                        updates.slug = slugify(v);
                      }
                      setModalData({ ...modalData, ...updates });
                    }}
                    isDark={isDark}
                  />

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                    <div>
                      <FormField
                        label="Slug (e.g. why-people-fear-ai) *"
                        value={modalData.slug || ''}
                        onChange={(v) => setModalData({ ...modalData, slug: slugify(v) })}
                        isDark={isDark}
                      />
                    </div>
                    <div>
                      <FormSelect
                        label="Post Type"
                        value={modalData.postType || 'BLOG'}
                        onChange={(v) => setModalData({ ...modalData, postType: v })}
                        options={[
                          { value: 'BLOG', label: 'BLOG - Standard Blog Post' },
                          { value: 'OPINION', label: 'OPINION - Thought Leadership / Op-Ed' },
                          { value: 'ARTICLE', label: 'ARTICLE - In-depth Technical Article' },
                          { value: 'NEWS', label: 'NEWS - Industry News & Updates' },
                          { value: 'TUTORIAL', label: 'TUTORIAL - Practical Guide / How-To' },
                          { value: 'ANNOUNCEMENT', label: 'ANNOUNCEMENT - Official Update' },
                        ]}
                        isDark={isDark}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                    <div>
                      <FormSelect
                        label="Category"
                        value={modalData.category || 'Software Engineering'}
                        onChange={(v) => setModalData({ ...modalData, category: v })}
                        options={[
                          'Artificial Intelligence',
                          'Cybersecurity',
                          'Data Analytics & AI',
                          'Software Engineering',
                          'Web Development',
                          'Cloud & DevOps',
                          'Career & Growth',
                          'Technology Trends',
                          'Other',
                        ]}
                        isDark={isDark}
                      />
                    </div>
                    <div>
                      <FormField
                        label="Author (Person publishing article)"
                        value={modalData.author || ''}
                        onChange={(v) => setModalData({ ...modalData, author: v })}
                        isDark={isDark}
                      />
                    </div>
                  </div>

                  <FormField
                    label="Tags (Comma-separated, e.g. AI, Future of Work, Career)"
                    value={modalData.tags || ''}
                    onChange={(v) => setModalData({ ...modalData, tags: v })}
                    isDark={isDark}
                  />

                  {/* CONTENT */}
                  <FormSectionHeader title="Content & Media" icon="fas fa-file-alt" isDark={isDark} />

                  <ImageUploadField
                    label="Featured Cover Image (Upload or enter URL)"
                    value={modalData.imageUrl || ''}
                    onChange={(v) => setModalData({ ...modalData, imageUrl: v })}
                    isDark={isDark}
                  />

                  <MultipleImageUploadField
                    label="Upload Article Images / Diagrams (Optional)"
                    value={modalData.images || []}
                    onChange={(v) => setModalData({ ...modalData, images: v })}
                    isDark={isDark}
                  />

                  <FormTextarea
                    label="Excerpt / Snippet (Short summary shown on cards)"
                    value={modalData.snippet || ''}
                    onChange={(v) => setModalData({ ...modalData, snippet: v })}
                    isDark={isDark}
                  />

                  <FormTextarea
                    label="Content / Body (Full article content / Markdown / HTML)"
                    value={modalData.content || ''}
                    onChange={(v) => {
                      const words = v.trim().split(/\s+/).filter(Boolean).length;
                      const calculated = `${Math.max(1, Math.ceil(words / 200))} min read`;
                      setModalData({
                        ...modalData,
                        content: v,
                        readingTime: modalData.readingTime && modalData.readingTime !== '3 min read' && modalData.readingTime !== '1 min read' ? modalData.readingTime : calculated,
                      });
                    }}
                    isDark={isDark}
                  />

                  {/* PUBLISHING */}
                  <FormSectionHeader title="Publishing & Visibility" icon="fas fa-globe" isDark={isDark} />

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                    <div>
                      <FormSelect
                        label="Publishing Status"
                        value={modalData.status || 'Published'}
                        onChange={(v) => setModalData({
                          ...modalData,
                          status: v,
                          published: v === 'Published',
                        })}
                        options={[
                          { value: 'Published', label: '🟢 Published (Visible on website)' },
                          { value: 'Draft', label: '🟡 Draft (Hidden / Unpublished)' },
                          { value: 'Archived', label: '⚪ Archived' },
                        ]}
                        isDark={isDark}
                      />
                    </div>
                    <div>
                      <FormField
                        label="Posted Date"
                        type="date"
                        value={modalData.date || ''}
                        onChange={(v) => setModalData({ ...modalData, date: v })}
                        isDark={isDark}
                      />
                    </div>
                    <div>
                      <FormSelect
                        label="Featured Post"
                        value={modalData.featured ? 'Yes' : 'No'}
                        onChange={(v) => setModalData({ ...modalData, featured: v === 'Yes' })}
                        options={['No', 'Yes']}
                        isDark={isDark}
                      />
                    </div>
                    <div>
                      <FormField
                        label="Reading Time (e.g. 5 min read)"
                        value={modalData.readingTime || ''}
                        onChange={(v) => setModalData({ ...modalData, readingTime: v })}
                        isDark={isDark}
                      />
                    </div>
                  </div>

                  {/* SEO */}
                  <FormSectionHeader title="SEO & Search Engines" icon="fas fa-search" isDark={isDark} />

                  <FormField
                    label="SEO Title (Optional - search engine & social sharing title)"
                    value={modalData.seoTitle || ''}
                    onChange={(v) => setModalData({ ...modalData, seoTitle: v })}
                    isDark={isDark}
                  />

                  <FormTextarea
                    label="SEO Description (Optional - concise 150-160 characters summary)"
                    value={modalData.seoDescription || ''}
                    onChange={(v) => setModalData({ ...modalData, seoDescription: v })}
                    isDark={isDark}
                  />

                  {/* ADMIN */}
                  <FormSectionHeader title="Admin Notes" icon="fas fa-user-shield" isDark={isDark} />

                  <FormTextarea
                    label="Additional Information / Notes (Internal admin notes)"
                    value={modalData.additionalInfo || ''}
                    onChange={(v) => setModalData({ ...modalData, additionalInfo: v })}
                    isDark={isDark}
                  />
                </>
              )}

              {activeTab === 'skills' && (
                <>
                  <FormField label="Skill Name (Optional)" value={modalData.name || ''} onChange={(v) => setModalData({ ...modalData, name: v })} isDark={isDark} />
                  <FormSelect
                    label="Category"
                    value={modalData.category || ''}
                    onChange={(v) => setModalData({ ...modalData, category: v })}
                    options={['Programming & Backend', 'Frontend', 'Mobile Development', 'Data Analytics & AI', 'Cybersecurity & Security', 'Cloud & DevOps', 'Tools & Design', 'Other']}
                    isDark={isDark}
                  />
                  <FormField label="Proficiency (%)" type="number" value={modalData.proficiency || 90} onChange={(v) => setModalData({ ...modalData, proficiency: parseInt(v) || 90 })} isDark={isDark} />
                  <FormField label="Posted Date / Date (Optional)" type="date" value={modalData.date || ''} onChange={(v) => setModalData({ ...modalData, date: v })} isDark={isDark} />
                  <FormTextarea label="Additional Information / Notes (Optional)" value={modalData.additionalInfo || ''} onChange={(v) => setModalData({ ...modalData, additionalInfo: v })} isDark={isDark} />
                </>
              )}

              {activeTab === 'experiences' && (
                <>
                  <FormField label="Company Name (Optional)" value={modalData.company || ''} onChange={(v) => setModalData({ ...modalData, company: v })} isDark={isDark} />
                  <FormField label="Job Role / Position (Optional)" value={modalData.role || ''} onChange={(v) => setModalData({ ...modalData, role: v })} isDark={isDark} />
                  <FormField label="Start Date (Optional)" value={modalData.startDate || ''} onChange={(v) => setModalData({ ...modalData, startDate: v })} isDark={isDark} />
                  <FormField label="End Date (Optional)" value={modalData.endDate || ''} onChange={(v) => setModalData({ ...modalData, endDate: v })} isDark={isDark} />
                  <FormField label="Posted Date / Date (Optional)" type="date" value={modalData.date || ''} onChange={(v) => setModalData({ ...modalData, date: v })} isDark={isDark} />
                  <FormTextarea label="Responsibilities (Optional)" value={modalData.description || ''} onChange={(v) => setModalData({ ...modalData, description: v })} isDark={isDark} />
                  <FormTextarea label="Additional Information / Notes (Optional)" value={modalData.additionalInfo || ''} onChange={(v) => setModalData({ ...modalData, additionalInfo: v })} isDark={isDark} />
                </>
              )}

              {activeTab === 'educations' && (
                <>
                  <FormField label="Institution Name (Optional)" value={modalData.institution || ''} onChange={(v) => setModalData({ ...modalData, institution: v })} isDark={isDark} />
                  <FormField label="Degree / Certificate (Optional)" value={modalData.degree || ''} onChange={(v) => setModalData({ ...modalData, degree: v })} isDark={isDark} />
                  <FormField label="Dates (Optional)" value={modalData.startDate || ''} onChange={(v) => setModalData({ ...modalData, startDate: v })} isDark={isDark} />
                  <FormField label="Posted Date / Date (Optional)" type="date" value={modalData.date || ''} onChange={(v) => setModalData({ ...modalData, date: v })} isDark={isDark} />
                  <FormTextarea label="Description (Optional)" value={modalData.description || ''} onChange={(v) => setModalData({ ...modalData, description: v })} isDark={isDark} />
                  <FormTextarea label="Additional Information / Notes (Optional)" value={modalData.additionalInfo || ''} onChange={(v) => setModalData({ ...modalData, additionalInfo: v })} isDark={isDark} />
                </>
              )}

              {activeTab === 'social-links' && (
                <>
                  <FormSelect
                    label="Platform Name"
                    value={modalData.platform || ''}
                    onChange={(v) => setModalData({ ...modalData, platform: v })}
                    options={['LinkedIn', 'GitHub', 'X / Twitter', 'Blog', 'YouTube', 'Facebook', 'Instagram', 'Portfolio / Website', 'Other']}
                    isDark={isDark}
                  />
                  <FormField label="Profile URL (Optional)" value={modalData.url || ''} onChange={(v) => setModalData({ ...modalData, url: v })} isDark={isDark} />
                  <FormField label="Icon Class (e.g. fab fa-linkedin)" value={modalData.icon || ''} onChange={(v) => setModalData({ ...modalData, icon: v })} isDark={isDark} />
                  <FormField label="Posted Date / Date (Optional)" type="date" value={modalData.date || ''} onChange={(v) => setModalData({ ...modalData, date: v })} isDark={isDark} />
                  <FormTextarea label="Additional Information / Notes (Optional)" value={modalData.additionalInfo || ''} onChange={(v) => setModalData({ ...modalData, additionalInfo: v })} isDark={isDark} />
                </>
              )}

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="button" style={styles.secondaryBtn} onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" style={styles.primaryBtn} disabled={loading}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper Functions & Subcomponents
function slugify(text) {
  return (text || '')
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

function FormSectionHeader({ title, icon, isDark }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      margin: '22px 0 14px 0',
      paddingBottom: '8px',
      borderBottom: `1px solid ${isDark ? '#3f3f46' : '#e2e8f0'}`,
    }}>
      {icon && <i className={icon} style={{ color: '#8b5cf6', fontSize: '0.95rem' }}></i>}
      <h4 style={{
        margin: 0,
        fontSize: '0.85rem',
        fontWeight: 700,
        color: isDark ? '#e4e4e7' : '#1e293b',
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
      }}>
        {title}
      </h4>
    </div>
  );
}

function SidebarItem({ active, icon, label, badge, onClick, isDark }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      width: '100%',
      padding: '12px 16px',
      border: 'none',
      borderRadius: '10px',
      fontSize: '0.9rem',
      fontWeight: active ? 600 : 400,
      cursor: 'pointer',
      background: active ? (isDark ? '#7c3aed' : '#e0e7ff') : 'transparent',
      color: active ? (isDark ? '#ffffff' : '#4338ca') : (isDark ? '#a1a1aa' : '#64748b'),
      transition: 'all 0.2s',
      marginBottom: '4px',
    }}>
      <i className={icon} style={{ width: '20px', textAlign: 'center' }}></i>
      <span style={{ flex: 1, textAlign: 'left' }}>{label}</span>
      {badge > 0 && (
        <span style={{
          background: '#ef4444',
          color: '#fff',
          fontSize: '0.75rem',
          borderRadius: '20px',
          padding: '2px 8px',
          fontWeight: 700,
        }}>{badge}</span>
      )}
    </button>
  );
}

function StatCard({ icon, title, count, color, isDark }) {
  return (
    <div style={{
      background: isDark ? '#18181b' : '#ffffff',
      border: `1px solid ${isDark ? '#27272a' : '#e2e8f0'}`,
      borderRadius: '16px',
      padding: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.05)',
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        background: `${color}20`,
        color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.25rem',
      }}>
        <i className={icon}></i>
      </div>
      <div>
        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: isDark ? '#f4f4f5' : '#0f172a' }}>{count}</div>
        <div style={{ fontSize: '0.85rem', color: isDark ? '#a1a1aa' : '#64748b' }}>{title}</div>
      </div>
    </div>
  );
}

function FormField({ label, value, onChange, type = 'text', isDark }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: isDark ? '#d4d4d8' : '#334155', marginBottom: '6px' }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '10px 14px',
          borderRadius: '8px',
          border: `1px solid ${isDark ? '#3f3f46' : '#cbd5e1'}`,
          background: isDark ? '#27272a' : '#f8fafc',
          color: isDark ? '#f4f4f5' : '#0f172a',
          outline: 'none',
          fontSize: '0.9rem',
        }}
      />
    </div>
  );
}

function ImageUploadField({ label, value, onChange, isDark }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        onChange(data.url);
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const inputId = `file-input-${label.replace(/[^a-zA-Z0-9]/g, '-')}`;

  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: isDark ? '#d4d4d8' : '#334155', marginBottom: '6px' }}>
        {label}
      </label>
      
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          id={inputId}
        />
        
        <label
          htmlFor={inputId}
          style={{
            padding: '10px 18px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
            color: '#ffffff',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: uploading ? 'wait' : 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            opacity: uploading ? 0.7 : 1,
            boxShadow: '0 2px 8px rgba(124, 58, 237, 0.3)',
          }}
        >
          <i className={`fas ${uploading ? 'fa-spinner fa-spin' : 'fa-cloud-upload-alt'}`}></i>
          {uploading ? 'Uploading...' : 'Upload Image File'}
        </label>

        {value && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: isDark ? '#27272a' : '#f1f5f9', padding: '6px 12px', borderRadius: '8px' }}>
            <img
              src={value}
              alt="Uploaded Preview"
              style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #7c3aed' }}
            />
            <span style={{ fontSize: '0.78rem', color: isDark ? '#a1a1aa' : '#475569', wordBreak: 'break-all', maxWidth: '200px' }}>
              {value}
            </span>
            <button
              type="button"
              onClick={() => onChange('')}
              style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.9rem' }}
              title="Remove image"
            >
              <i className="fas fa-trash-alt"></i>
            </button>
          </div>
        )}
      </div>

      {error && <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px' }}>{error}</div>}

      <input
        type="text"
        placeholder="Or enter Image URL / path (optional)"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          marginTop: '8px',
          padding: '8px 12px',
          borderRadius: '6px',
          border: `1px solid ${isDark ? '#3f3f46' : '#cbd5e1'}`,
          background: isDark ? '#27272a' : '#f8fafc',
          color: isDark ? '#f4f4f5' : '#0f172a',
          outline: 'none',
          fontSize: '0.8rem',
        }}
      />
    </div>
  );
}

function MultipleImageUploadField({ label, value = [], onChange, isDark }) {
  const [uploading, setUploading] = useState(false);

  const imageList = Array.isArray(value) ? value : (value ? [value] : []);

  const handleFilesChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    const uploadedUrls = [...imageList];

    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (res.ok && data.url) {
          uploadedUrls.push(data.url);
        }
      } catch (err) {
        console.error('File upload error:', err);
      }
    }

    onChange(uploadedUrls);
    setUploading(false);
  };

  const handleRemoveImage = (indexToRemove) => {
    const updated = imageList.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
  };

  const inputId = `file-input-multi-${label.replace(/[^a-zA-Z0-9]/g, '-')}`;

  return (
    <div style={{ marginBottom: '18px' }}>
      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: isDark ? '#d4d4d8' : '#334155', marginBottom: '6px' }}>
        {label}
      </label>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFilesChange}
          style={{ display: 'none' }}
          id={inputId}
        />

        <label
          htmlFor={inputId}
          style={{
            padding: '10px 18px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
            color: '#ffffff',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: uploading ? 'wait' : 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            opacity: uploading ? 0.7 : 1,
            boxShadow: '0 2px 8px rgba(124, 58, 237, 0.3)',
          }}
        >
          <i className={`fas ${uploading ? 'fa-spinner fa-spin' : 'fa-images'}`}></i>
          {uploading ? 'Uploading Images...' : 'Upload Multiple Image Files'}
        </label>
      </div>

      {imageList.length > 0 && (
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px', padding: '10px', background: isDark ? '#27272a' : '#f1f5f9', borderRadius: '10px' }}>
          {imageList.map((url, idx) => (
            <div key={idx} style={{ position: 'relative', width: '70px', height: '70px' }}>
              <img
                src={url}
                alt={`Uploaded ${idx + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', border: '2px solid #7c3aed' }}
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(idx)}
                style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  background: '#ef4444',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Remove image"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FormTextarea({ label, value, onChange, isDark }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: isDark ? '#d4d4d8' : '#334155', marginBottom: '6px' }}>{label}</label>
      <textarea
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '10px 14px',
          borderRadius: '8px',
          border: `1px solid ${isDark ? '#3f3f46' : '#cbd5e1'}`,
          background: isDark ? '#27272a' : '#f8fafc',
          color: isDark ? '#f4f4f5' : '#0f172a',
          outline: 'none',
          fontSize: '0.9rem',
          resize: 'vertical',
        }}
      />
    </div>
  );
}

function FormSelect({ label, value, onChange, options = [], isDark }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: isDark ? '#d4d4d8' : '#334155', marginBottom: '6px' }}>
        {label}
      </label>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '10px 14px',
          borderRadius: '8px',
          border: `1px solid ${isDark ? '#3f3f46' : '#cbd5e1'}`,
          background: isDark ? '#27272a' : '#f8fafc',
          color: isDark ? '#f4f4f5' : '#0f172a',
          outline: 'none',
          fontSize: '0.9rem',
          cursor: 'pointer',
        }}
      >
        <option value="">-- Select {label} (Optional) --</option>
        {options.map((opt) => (
          <option key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
            {typeof opt === 'string' ? opt : opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function ListTable({ activeTab, items, onEdit, onDelete, isDark }) {
  if (items.length === 0) {
    return <p style={{ padding: '20px 0', opacity: 0.6 }}>No {activeTab} added yet. Click &quot;Add New&quot; to create one.</p>;
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${isDark ? '#27272a' : '#e2e8f0'}`, textAlign: 'left', fontSize: '0.85rem', color: isDark ? '#a1a1aa' : '#64748b' }}>
            <th style={{ padding: '12px' }}>TITLE / ITEM</th>
            <th style={{ padding: '12px' }}>DETAILS</th>
            <th style={{ padding: '12px', textAlign: 'right' }}>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            if (activeTab === 'posts') {
              const statusColor = item.status === 'Draft' ? '#f59e0b' : item.status === 'Archived' ? '#94a3b8' : '#10b981';
              return (
                <tr key={item.id} style={{ borderBottom: `1px solid ${isDark ? '#27272a' : '#f1f5f9'}` }}>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.title || 'Post'}
                          style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', border: `1px solid ${isDark ? '#3f3f46' : '#e2e8f0'}` }}
                        />
                      )}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{item.title || 'Untitled Post'}</span>
                          {item.featured && (
                            <span style={{ fontSize: '0.7rem', padding: '2px 7px', borderRadius: '12px', background: '#fef3c7', color: '#b45309', fontWeight: 700 }}>
                              ⭐ Featured
                            </span>
                          )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                          {item.postType && (
                            <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '6px', background: '#7c3aed25', color: '#a78bfa', fontWeight: 600 }}>
                              {item.postType}
                            </span>
                          )}
                          {item.category && (
                            <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '6px', background: isDark ? '#27272a' : '#f1f5f9', color: isDark ? '#d4d4d8' : '#475569', fontWeight: 500 }}>
                              {item.category}
                            </span>
                          )}
                          {item.slug && (
                            <span style={{ fontSize: '0.75rem', opacity: 0.6, fontFamily: 'monospace' }}>
                              /{item.slug}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '0.75rem',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        background: `${statusColor}20`,
                        color: statusColor,
                        fontWeight: 600,
                      }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusColor }}></span>
                        {item.status || (item.published ? 'Published' : 'Draft')}
                      </span>
                      {item.readingTime && <span style={{ opacity: 0.7, fontSize: '0.75rem' }}><i className="far fa-clock" style={{ marginRight: '4px' }}></i>{item.readingTime}</span>}
                      {item.date && <span style={{ opacity: 0.7, fontSize: '0.75rem' }}><i className="far fa-calendar-alt" style={{ marginRight: '4px' }}></i>{item.date}</span>}
                      {item.author && <span style={{ opacity: 0.7, fontSize: '0.75rem' }}><i className="far fa-user" style={{ marginRight: '4px' }}></i>{item.author}</span>}
                    </div>
                    <div style={{ opacity: 0.8, fontSize: '0.8rem', maxWidth: '380px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.snippet || item.content || 'No excerpt'}
                    </div>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <button onClick={() => onEdit(item)} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', marginRight: '12px' }}>
                      <i className="fas fa-edit"></i> Edit
                    </button>
                    <button onClick={() => onDelete(item.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                      <i className="fas fa-trash"></i> Delete
                    </button>
                  </td>
                </tr>
              );
            }

            return (
              <tr key={item.id} style={{ borderBottom: `1px solid ${isDark ? '#27272a' : '#f1f5f9'}` }}>
                <td style={{ padding: '12px', fontWeight: 600 }}>{item.title || item.name || item.company || item.institution || item.platform}</td>
                <td style={{ padding: '12px', fontSize: '0.85rem', opacity: 0.8 }}>
                  {item.description || item.snippet || item.issuer || item.email || item.url || ''}
                </td>
                <td style={{ padding: '12px', textAlign: 'right' }}>
                  {activeTab !== 'messages' && (
                    <button onClick={() => onEdit(item)} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', marginRight: '12px' }}>
                      <i className="fas fa-edit"></i> Edit
                    </button>
                  )}
                  <button onClick={() => onDelete(item.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                    <i className="fas fa-trash"></i> Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// Styling Object Factory based on Theme
function getStyles(isDark) {
  return {
    appWrapper: {
      display: 'flex',
      minHeight: '100vh',
      background: isDark ? '#09090b' : '#f8fafc',
      color: isDark ? '#f4f4f5' : '#0f172a',
      fontFamily: "'Inter', sans-serif",
      transition: 'background 0.3s, color 0.3s',
    },
    sidebar: {
      width: '260px',
      background: isDark ? '#121214' : '#ffffff',
      borderRight: `1px solid ${isDark ? '#27272a' : '#e2e8f0'}`,
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 16px',
    },
    sidebarHeader: {
      marginBottom: '32px',
      paddingLeft: '8px',
    },
    brandLogo: {
      fontSize: '2rem',
      fontWeight: 700,
      fontFamily: "'Outfit', sans-serif",
    },
    brandTitle: {
      fontSize: '0.8rem',
      fontWeight: 600,
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
      opacity: 0.6,
    },
    navMenu: {
      flex: 1,
      overflowY: 'auto',
    },
    sidebarFooter: {
      paddingTop: '16px',
      borderTop: `1px solid ${isDark ? '#27272a' : '#e2e8f0'}`,
    },
    logoutBtn: {
      width: '100%',
      padding: '12px',
      borderRadius: '10px',
      border: 'none',
      background: '#ef444420',
      color: '#ef4444',
      fontWeight: 600,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
    },
    mainContainer: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflowX: 'hidden',
    },
    topHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '20px 32px',
      background: isDark ? '#121214' : '#ffffff',
      borderBottom: `1px solid ${isDark ? '#27272a' : '#e2e8f0'}`,
    },
    headerLeft: {},
    pageHeading: {
      fontSize: '1.5rem',
      fontWeight: 700,
      margin: 0,
    },
    pageSubheading: {
      fontSize: '0.85rem',
      opacity: 0.6,
      margin: 0,
    },
    headerRight: {
      display: 'flex',
      gap: '12px',
    },
    themeToggleBtn: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 16px',
      borderRadius: '10px',
      border: `1px solid ${isDark ? '#3f3f46' : '#cbd5e1'}`,
      background: isDark ? '#18181b' : '#f1f5f9',
      color: isDark ? '#f4f4f5' : '#0f172a',
      fontWeight: 600,
      fontSize: '0.85rem',
      cursor: 'pointer',
    },
    viewSiteBtn: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 16px',
      borderRadius: '10px',
      background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
      color: '#ffffff',
      fontWeight: 600,
      fontSize: '0.85rem',
      textDecoration: 'none',
    },
    contentBody: {
      padding: '32px',
      flex: 1,
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '20px',
      marginBottom: '32px',
    },
    card: {
      background: isDark ? '#121214' : '#ffffff',
      border: `1px solid ${isDark ? '#27272a' : '#e2e8f0'}`,
      borderRadius: '16px',
      padding: '28px',
      boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.05)',
      marginBottom: '24px',
    },
    cardHeaderRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px',
    },
    cardTitle: {
      fontSize: '1.2rem',
      fontWeight: 700,
      margin: 0,
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '16px',
    },
    primaryBtn: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 20px',
      borderRadius: '8px',
      border: 'none',
      background: '#7c3aed',
      color: '#fff',
      fontWeight: 600,
      cursor: 'pointer',
      fontSize: '0.9rem',
    },
    secondaryBtn: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 20px',
      borderRadius: '8px',
      border: `1px solid ${isDark ? '#3f3f46' : '#cbd5e1'}`,
      background: 'transparent',
      color: isDark ? '#f4f4f5' : '#0f172a',
      fontWeight: 600,
      cursor: 'pointer',
      fontSize: '0.9rem',
    },
    modalOverlay: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
    },
    modalContent: {
      width: '100%',
      maxWidth: '600px',
      background: isDark ? '#18181b' : '#ffffff',
      border: `1px solid ${isDark ? '#3f3f46' : '#e2e8f0'}`,
      borderRadius: '16px',
      padding: '24px',
      maxHeight: '90vh',
      overflowY: 'auto',
    },
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
    },
    closeBtn: {
      background: 'none',
      border: 'none',
      fontSize: '1.5rem',
      color: isDark ? '#a1a1aa' : '#64748b',
      cursor: 'pointer',
    },
    toast: {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '12px 20px',
      borderRadius: '10px',
      color: '#fff',
      fontWeight: 600,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      zIndex: 2000,
      boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
    },
  };
}
