'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';

// Helper to format date nicely e.g. "Mon, Sep 29, 2026"
function formatCardDate(dateInput, createdAtInput) {
  const val = dateInput || createdAtInput;
  if (!val) return 'Date: N/A';
  const d = new Date(val);
  if (!isNaN(d.getTime())) {
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
  return val;
}

// Multi-Image Slider with Next / Prev Arrows
function ImageSlider({ mainImage, images = [], title }) {
  const allImages = [];
  if (mainImage) allImages.push(mainImage);
  if (Array.isArray(images)) {
    images.forEach((img) => {
      if (img && !allImages.includes(img)) allImages.push(img);
    });
  }

  const [currentIndex, setCurrentIndex] = useState(0);

  if (allImages.length === 0) return null;

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % allImages.length);
  };

  return (
    <div style={{ position: 'relative', marginBottom: '15px', borderRadius: '12px', overflow: 'hidden', background: '#000' }}>
      <img
        src={allImages[currentIndex]}
        alt={title}
        style={{ width: '100%', maxHeight: '360px', objectFit: 'contain', display: 'block', margin: '0 auto' }}
      />

      {allImages.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            style={{
              position: 'absolute',
              top: '50%',
              left: '10px',
              transform: 'translateY(-50%)',
              background: 'rgba(0,0,0,0.7)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              fontSize: '1.2rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
            }}
            title="Previous Image"
          >
            &#10094;
          </button>
          <button
            onClick={handleNext}
            style={{
              position: 'absolute',
              top: '50%',
              right: '10px',
              transform: 'translateY(-50%)',
              background: 'rgba(0,0,0,0.7)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              fontSize: '1.2rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
            }}
            title="Next Image"
          >
            &#10095;
          </button>
          <div style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            background: 'rgba(0,0,0,0.75)',
            color: '#fff',
            fontSize: '0.75rem',
            padding: '4px 10px',
            borderRadius: '12px',
            fontWeight: 600,
          }}>
            {currentIndex + 1} / {allImages.length}
          </div>
        </>
      )}

      {allImages.length > 1 && (
        <div style={{ display: 'flex', gap: '8px', padding: '8px', background: 'rgba(0,0,0,0.5)', overflowX: 'auto' }}>
          {allImages.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt=""
              onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
              style={{
                width: '54px',
                height: '54px',
                objectFit: 'cover',
                borderRadius: '6px',
                cursor: 'pointer',
                border: currentIndex === idx ? '2px solid #7c3aed' : '2px solid transparent',
                opacity: currentIndex === idx ? 1 : 0.6,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function PortfolioClient({ data = {} }) {
  const profile = data.profile || {
    name: 'Abdimajid Ali Moalim',
    title: 'Full Stack Software Engineer, Data Analyst & Cybersecurity',
    bio: '',
    email: '',
    phone: '',
    yearsExperience: '0',
    projectsCompleted: '0',
    happyClients: '0',
  };

  const services = data.services || [];
  const projects = data.projects || [];
  const achievements = data.achievements || [];
  const certifications = data.certifications || [];
  const posts = data.posts || [];
  const skills = data.skills || [];
  const socialLinks = data.socialLinks || [];
  const siteSettings = data.siteSettings || {
    siteTitle: 'Abdimajid Ali Moalim | Portfolio',
    contactEmail: profile.email,
    contactPhone: profile.phone,
    footerText: '© 2026 Abdimajid Ali Moalim. All rights reserved.',
  };

  // State for Modals (Services, Projects, Achievements, Certifications)
  const [selectedService, setSelectedService] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedAch, setSelectedAch] = useState(null);
  const [selectedCert, setSelectedCert] = useState(null);

  // Theme Detection for Modal Styling
  const [isLightTheme, setIsLightTheme] = useState(false);

  useEffect(() => {
    // Initialize theme from localStorage on mount
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    if (savedTheme === 'light') {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    }

    const checkTheme = () => {
      setIsLightTheme(document.body.classList.contains('light-theme'));
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Form Submission State
  const [formStatus, setFormStatus] = useState({ submitting: false, message: '', error: false });

  // Dynamic Typed Text Effect for Professional Title
  const [typedTitleIndex, setTypedTitleIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const titles = profile.title
    ? profile.title.split(/[,|&]/).map((t) => t.trim()).filter(Boolean)
    : ['Software Engineer'];

  useEffect(() => {
    if (titles.length === 0) return;
    const currentFullTitle = titles[typedTitleIndex % titles.length];
    let timeoutId;

    if (!isDeleting && typedText.length < currentFullTitle.length) {
      timeoutId = setTimeout(() => {
        setTypedText(currentFullTitle.substring(0, typedText.length + 1));
      }, 100);
    } else if (!isDeleting && typedText.length === currentFullTitle.length) {
      timeoutId = setTimeout(() => {
        setIsDeleting(true);
      }, 2000);
    } else if (isDeleting && typedText.length > 0) {
      timeoutId = setTimeout(() => {
        setTypedText(currentFullTitle.substring(0, typedText.length - 1));
      }, 50);
    } else if (isDeleting && typedText.length === 0) {
      setIsDeleting(false);
      setTypedTitleIndex((prev) => (prev + 1) % titles.length);
    }

    return () => clearTimeout(timeoutId);
  }, [typedText, isDeleting, typedTitleIndex, titles]);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ submitting: true, message: '', error: false });

    const formData = new FormData(e.target);
    const payload = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
      isPublicContact: true,
    };

    try {
      const res = await fetch('/api/admin/portfolio/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setFormStatus({ submitting: false, message: 'Thank you! Your message has been sent successfully.', error: false });
        e.target.reset();
      } else {
        setFormStatus({ submitting: false, message: 'Failed to send message. Please try again.', error: true });
      }
    } catch {
      setFormStatus({ submitting: false, message: 'Error sending message. Please try again.', error: true });
    }
  };

  // Dynamic Theme Colors for Modals
  const modalBg = isLightTheme ? '#ffffff' : '#121214';
  const modalTextColor = isLightTheme ? '#0f172a' : '#f4f4f5';
  const modalBorderColor = isLightTheme ? '#cbd5e1' : '#27272a';
  const modalSubTextColor = isLightTheme ? '#475569' : '#a1a1aa';

  return (
    <>
      {/* ===================== NAV (SINGLE LOGIN) ===================== */}
      <nav id="navbar">
        <div className="container nav-container">
          <div className="logo">MA<span>.</span></div>
          <ul className="nav-links">
            <li><a href="#hero">Home</a></li>
            <li><a href="#about">About</a></li>
            {services.length > 0 && <li><a href="#services">Services</a></li>}
            {projects.length > 0 && <li><a href="#projects">Projects</a></li>}
            {achievements.length > 0 && <li><a href="#achievements">Achievements</a></li>}
            {certifications.length > 0 && <li><a href="#certifications">Certifications</a></li>}
            <li><a href="#blog">Blog</a></li>
            {skills.length > 0 && <li><a href="#skills">Skills</a></li>}
            <li><a href="#contact">Contact</a></li>
          </ul>
          <div className="nav-controls">
            <button id="theme-toggle" aria-label="Toggle Dark/Light Mode">
              <i className="fas fa-moon"></i>
            </button>
            <div className="mobile-menu-btn">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {/* ===================== HERO ===================== */}
        <section id="hero" className="hero">
          <div className="container hero-container">
            <div className="hero-content">
              <h2 className="greeting">Hello, I&apos;m</h2>
              <h1 className="name">{profile.name}</h1>
              <h3 className="typed-text-container">
                <span className="typed-text">{typedText}</span><span className="cursor">&nbsp;</span>
              </h3>
              <p className="description">{profile.bio}</p>
              <div className="hero-cta">
                {projects.length > 0 && <a href="#projects" className="btn primary">View Projects</a>}
                {profile.cvUrl && (
                  <a href={profile.cvUrl} className="btn secondary" target="_blank" rel="noreferrer" download>
                    <i className="fas fa-download"></i> Download CV
                  </a>
                )}
                <a href="#contact" className="btn secondary">Contact Me</a>
              </div>
            </div>
            <div className="hero-image">
              <div className="image-wrapper">
                <img src={profile.avatarUrl || '/images/myimage.png'} alt={profile.name} />
              </div>
            </div>
          </div>
          <div className="scroll-indicator"><div className="mouse"></div></div>
        </section>

        {/* ===================== ABOUT ===================== */}
        <section id="about" className="about section">
          <div className="container">
            <div className="section-header">
              <span className="tag">Get To Know Me</span>
              <h2>About Me</h2>
            </div>
            <div className="about-grid">
              <div className="about-text">
                <p>{profile.bio}</p>
                <div className="about-stats">
                  <div className="stat-item">
                    <span className="number">{profile.yearsExperience}</span>
                    <span className="label">Years Experience</span>
                  </div>
                  <div className="stat-item">
                    <span className="number">{profile.projectsCompleted}</span>
                    <span className="label">Projects Completed</span>
                  </div>
                  <div className="stat-item">
                    <span className="number">{profile.happyClients}</span>
                    <span className="label">Happy Clients</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== SERVICES (CARD SHOWS IMAGE/ICON, TITLE, DATE ONLY) ===================== */}
        {services.length > 0 && (
          <section id="services" className="services section">
            <div className="container">
              <div className="section-header">
                <span className="tag">What I Offer</span>
                <h2>Services</h2>
              </div>
              <div className="services-grid">
                {services.map((srv) => {
                  const cardImg = (srv.images && srv.images.length > 0) ? srv.images[0] : null;
                  return (
                    <div
                      key={srv.id}
                      className="service-card glass"
                      style={{ cursor: 'pointer', textAlign: 'center' }}
                      onClick={() => setSelectedService(srv)}
                    >
                      {cardImg ? (
                        <img src={cardImg} alt={srv.title} style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '10px', marginBottom: '12px' }} />
                      ) : (
                        <i className={srv.icon || 'fas fa-code'} style={{ fontSize: '2.5rem', margin: '10px 0', color: '#7c3aed' }}></i>
                      )}
                      <h3 style={{ fontSize: '1.2rem', margin: '8px 0' }}>{srv.title}</h3>
                      <div style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '12px' }}>
                        <i className="far fa-calendar-alt" style={{ marginRight: '5px' }}></i>
                        {formatCardDate(srv.date, srv.createdAt)}
                      </div>
                      
                      {srv.percentage != null && (
                        <div style={{ marginBottom: '12px', textAlign: 'left' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.75rem', fontWeight: '600', color: isLightTheme ? '#0f172a' : '#f8f9fa' }}>
                            <span>Proficiency</span>
                            <span>{srv.percentage}%</span>
                          </div>
                          <div style={{ width: '100%', height: '5px', background: isLightTheme ? '#e2e8f0' : 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
                            <div style={{ width: `${Math.min(Math.max(srv.percentage, 0), 100)}%`, height: '100%', background: 'linear-gradient(90deg, #7c3aed, #007AFF)', borderRadius: '10px' }}></div>
                          </div>
                        </div>
                      )}
                      
                      <button className="btn secondary" style={{ padding: '6px 14px', fontSize: '0.8rem', width: '100%' }}>
                        Click for Details &rarr;
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ===================== FEATURED PROJECTS (CARD SHOWS IMAGE, TITLE, DATE ONLY) ===================== */}
        {projects.length > 0 && (
          <section id="projects" className="projects section">
            <div className="container">
              <div className="section-header">
                <span className="tag">My Work</span>
                <h2>Featured Projects</h2>
              </div>
              <div className="projects-grid">
                {projects.map((proj) => {
                  const cardImg = proj.imageUrl || (proj.images && proj.images.length > 0 ? proj.images[0] : null);
                  return (
                    <div
                      key={proj.id}
                      className="project-card"
                      style={{ cursor: 'pointer' }}
                      onClick={() => setSelectedProject(proj)}
                    >
                      {cardImg && (
                        <div className="project-img">
                          <img src={cardImg} alt={proj.title} />
                        </div>
                      )}
                      <div className="project-info">
                        <h3 style={{ margin: '8px 0', fontSize: '1.25rem' }}>{proj.title}</h3>
                        <div style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '14px' }}>
                          <i className="far fa-calendar-alt" style={{ marginRight: '6px' }}></i>
                          {formatCardDate(proj.date, proj.createdAt)}
                        </div>
                        <button className="btn primary" style={{ padding: '6px 14px', fontSize: '0.8rem', width: '100%' }}>
                          View Details &rarr;
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ===================== ACHIEVEMENTS (CARD SHOWS IMAGE, TITLE, DATE ONLY) ===================== */}
        {achievements.length > 0 && (
          <section id="achievements" className="projects section">
            <div className="container">
              <div className="section-header">
                <span className="tag">What I&apos;ve Accomplished</span>
                <h2>Achievements</h2>
              </div>
              <div className="projects-grid">
                {achievements.map((ach) => {
                  const cardImg = ach.imageUrl || (ach.images && ach.images.length > 0 ? ach.images[0] : null);
                  return (
                    <div
                      key={ach.id}
                      className="project-card"
                      style={{ cursor: 'pointer' }}
                      onClick={() => setSelectedAch(ach)}
                    >
                      {cardImg && (
                        <div className="project-img">
                          <img src={cardImg} alt={ach.title} />
                        </div>
                      )}
                      <div className="project-info">
                        <h3 style={{ margin: '8px 0', fontSize: '1.25rem' }}>{ach.title}</h3>
                        <div style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '14px' }}>
                          <i className="far fa-calendar-alt" style={{ marginRight: '6px' }}></i>
                          {formatCardDate(ach.date, ach.createdAt)}
                        </div>
                        <button className="btn secondary" style={{ padding: '6px 14px', fontSize: '0.8rem', width: '100%' }}>
                          View Achievement &rarr;
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ===================== CERTIFICATIONS (CARD SHOWS IMAGE, TITLE, DATE ONLY) ===================== */}
        {certifications.length > 0 && (
          <section id="certifications" className="projects section">
            <div className="container">
              <div className="section-header">
                <span className="tag">Credentials</span>
                <h2>Certifications</h2>
              </div>
              <div className="projects-grid">
                {certifications.map((cert) => {
                  const cardImg = cert.imageUrl || (cert.images && cert.images.length > 0 ? cert.images[0] : null);
                  return (
                    <div
                      key={cert.id}
                      className="project-card"
                      style={{ cursor: 'pointer' }}
                      onClick={() => setSelectedCert(cert)}
                    >
                      {cardImg && (
                        <div className="project-img">
                          <img src={cardImg} alt={cert.title} />
                        </div>
                      )}
                      <div className="project-info">
                        <h3 style={{ margin: '8px 0', fontSize: '1.2rem' }}>{cert.title}</h3>
                        <div style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '14px' }}>
                          <i className="far fa-calendar-alt" style={{ marginRight: '6px' }}></i>
                          {formatCardDate(cert.issueDate || cert.date, cert.createdAt)}
                        </div>
                        <button className="btn secondary" style={{ padding: '6px 14px', fontSize: '0.8rem', width: '100%' }}>
                          View Certificate &rarr;
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ===================== BLOG SECTION ===================== */}
        {posts.length > 0 && (
          <section id="blog" className="projects section">
            <div className="container">
              <div className="section-header">
                <span className="tag">Articles &amp; News</span>
                <h2>Blog &amp; Insights</h2>
              </div>
              <div className="projects-grid">
                {posts.map((post) => (
                  <div key={post.id} className="project-card">
                    <div className="project-info">
                      <div style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '8px' }}>
                        <i className="far fa-calendar-alt" style={{ marginRight: '6px' }}></i>
                        {formatCardDate(post.date, post.createdAt)}
                      </div>
                      <h3>{post.title}</h3>
                      <p>{post.snippet || post.content.substring(0, 120) + '...'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ===================== SKILLS ===================== */}
        {skills.length > 0 && (
          <section id="skills" className="skills section">
            <div className="container">
              <div className="section-header">
                <span className="tag">My Expertise</span>
                <h2>Skills &amp; Technologies</h2>
              </div>
              <div className="skills-container">
                <div className="skill-group">
                  <h3>Mastered Technologies</h3>
                  <div className="skill-tags">
                    {skills.map((sk) => (
                      <span key={sk.id || sk.name}>
                        {sk.name || sk.title} {sk.proficiency ? `(${sk.proficiency}%)` : ''}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ===================== CONTACT ===================== */}
        <section id="contact" className="contact section">
          <div className="container">
            <div className="section-header">
              <span className="tag">Get In Touch</span>
              <h2>Contact Me</h2>
            </div>
            <div className="contact-grid">
              <div className="contact-info">
                {profile.phone && (
                  <div className="contact-item">
                    <i className="fas fa-phone"></i>
                    <div><h4>Phone</h4><p>{profile.phone}</p></div>
                  </div>
                )}
                {profile.email && (
                  <div className="contact-item">
                    <i className="fas fa-envelope"></i>
                    <div><h4>Email</h4><p>{profile.email}</p></div>
                  </div>
                )}
                {socialLinks.length > 0 && (
                  <div className="social-links-large">
                    {socialLinks.map((s) => (
                      <a key={s.id} href={s.url} target="_blank" rel="noreferrer" title={s.platform}>
                        <i className={s.icon || 'fas fa-link'}></i>
                      </a>
                    ))}
                  </div>
                )}
              </div>
              <form id="contact-form" className="contact-form glass" onSubmit={handleContactSubmit}>
                {formStatus.message && (
                  <div style={{
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '15px',
                    background: formStatus.error ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                    border: formStatus.error ? '1px solid #ef4444' : '1px solid #22c55e',
                    color: formStatus.error ? '#fca5a5' : '#86efac',
                    fontSize: '0.9rem'
                  }}>
                    {formStatus.message}
                  </div>
                )}
                <div className="form-group">
                  <input type="text" id="name" name="name" placeholder="Your Name" />
                </div>
                <div className="form-group">
                  <input type="email" id="email" name="email" placeholder="Your Email" />
                </div>
                <div className="form-group">
                  <textarea id="message" name="message" rows="5" placeholder="Your Message"></textarea>
                </div>
                <button type="submit" className="btn primary full-width" disabled={formStatus.submitting}>
                  {formStatus.submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* ===================== FOOTER ===================== */}
      <footer className="premium-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col footer-brand-col">
              <a href="#" className="footer-logo">
                <span style={{ fontSize: '1.8rem', fontWeight: 800 }}>MA<span style={{ color: '#7c3aed' }}>.</span></span>
              </a>
              <h3 className="footer-name">{profile.name}</h3>
              <p className="footer-title">{profile.title}</p>
            </div>
            <div className="footer-col">
              <h4 className="footer-heading">Quick Links</h4>
              <ul className="footer-links">
                <li><a href="#hero">Home</a></li>
                <li><a href="#about">About</a></li>
                {services.length > 0 && <li><a href="#services">Services</a></li>}
                {projects.length > 0 && <li><a href="#projects">Projects</a></li>}
                {achievements.length > 0 && <li><a href="#achievements">Achievements</a></li>}
                {certifications.length > 0 && <li><a href="#certifications">Certifications</a></li>}
                {posts.length > 0 && <li><a href="#blog">Blog</a></li>}
                <li><a href="#contact">Contact</a></li>
                <li><a href="/admin/login" style={{ color: '#a78bfa', fontWeight: 600 }}><i className="fas fa-lock" style={{ marginRight: '6px' }}></i>Admin Login</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4 className="footer-heading">Contact Info</h4>
              <div className="footer-contact-info">
                {profile.phone && <p><i className="fas fa-phone-alt"></i> {profile.phone}</p>}
                {profile.email && <p><i className="fas fa-envelope"></i> {profile.email}</p>}
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-bottom-content">
              <p>{siteSettings.footerText}</p>
            </div>
          </div>
        </div>
      </footer>

      {/* ===================== SERVICE DETAIL MODAL ===================== */}
      {selectedService && (
        <div style={modalOverlayStyle} onClick={() => setSelectedService(null)}>
          <div style={{ ...modalBoxStyle, background: modalBg, color: modalTextColor, borderColor: modalBorderColor }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <i className={selectedService.icon || 'fas fa-code'} style={{ fontSize: '1.8rem', color: '#7c3aed' }}></i>
                <h3 style={{ margin: 0, fontSize: '1.4rem', color: modalTextColor }}>{selectedService.title}</h3>
              </div>
              <button style={{ ...closeBtnStyle, color: modalSubTextColor }} onClick={() => setSelectedService(null)}>&times;</button>
            </div>

            <ImageSlider mainImage={selectedService.images && selectedService.images.length > 0 ? selectedService.images[0] : null} images={selectedService.images} title={selectedService.title} />

            {selectedService.percentage != null && (
              <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.95rem', fontWeight: '600', color: modalTextColor }}>
                  <span>Knowledge Level</span>
                  <span>{selectedService.percentage}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: isLightTheme ? '#e2e8f0' : 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(Math.max(selectedService.percentage, 0), 100)}%`, height: '100%', background: 'linear-gradient(90deg, #7c3aed, #007AFF)', borderRadius: '10px' }}></div>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '12px' }}>
              {selectedService.category && (
                <span style={{ background: '#7c3aed30', color: '#a78bfa', fontSize: '0.75rem', padding: '3px 10px', borderRadius: '15px', fontWeight: 600 }}>
                  {selectedService.category}
                </span>
              )}
              <span style={{ fontSize: '0.8rem', color: modalSubTextColor }}>
                {formatCardDate(selectedService.date, selectedService.createdAt)}
              </span>
            </div>
            <p style={{ marginTop: '15px', lineHeight: 1.6 }}>{selectedService.description}</p>
            {selectedService.bullets && selectedService.bullets.length > 0 && (
              <ul style={{ marginTop: '15px', marginLeft: '20px' }}>
                {selectedService.bullets.map((b, idx) => (
                  <li key={idx} style={{ marginBottom: '6px' }}>{b}</li>
                ))}
              </ul>
            )}
            {selectedService.additionalInfo && (
              <div style={{ marginTop: '15px', padding: '12px', borderRadius: '8px', background: isLightTheme ? '#f1f5f9' : 'rgba(255,255,255,0.05)', fontSize: '0.85rem' }}>
                <strong>Additional Info:</strong> {selectedService.additionalInfo}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================== PROJECT DETAIL MODAL ===================== */}
      {selectedProject && (
        <div style={modalOverlayStyle} onClick={() => setSelectedProject(null)}>
          <div style={{ ...modalBoxStyle, maxWidth: '720px', background: modalBg, color: modalTextColor, borderColor: modalBorderColor }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ margin: 0, fontSize: '1.5rem', color: modalTextColor }}>{selectedProject.title}</h3>
              <button style={{ ...closeBtnStyle, color: modalSubTextColor }} onClick={() => setSelectedProject(null)}>&times;</button>
            </div>

            <ImageSlider mainImage={selectedProject.imageUrl} images={selectedProject.images} title={selectedProject.title} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              {selectedProject.category && (
                <span style={{ background: '#7c3aed', color: '#fff', fontSize: '0.75rem', padding: '4px 12px', borderRadius: '15px', fontWeight: 600 }}>
                  {selectedProject.category}
                </span>
              )}
              <span style={{ fontSize: '0.85rem', color: modalSubTextColor }}>
                Date: {formatCardDate(selectedProject.date, selectedProject.createdAt)}
              </span>
            </div>
            <p style={{ lineHeight: 1.7 }}>{selectedProject.description}</p>
            {selectedProject.bullets && selectedProject.bullets.length > 0 && (
              <div style={{ marginTop: '15px' }}>
                <h4 style={{ fontSize: '1rem', marginBottom: '8px', color: modalTextColor }}>Key Features &amp; Highlights:</h4>
                <ul style={{ marginLeft: '20px' }}>
                  {selectedProject.bullets.map((b, idx) => (
                    <li key={idx} style={{ marginBottom: '6px' }}>{b}</li>
                  ))}
                </ul>
              </div>
            )}
            {selectedProject.additionalInfo && (
              <div style={{ marginTop: '15px', padding: '12px', borderRadius: '8px', background: isLightTheme ? '#f1f5f9' : 'rgba(255,255,255,0.05)', fontSize: '0.85rem' }}>
                <strong>Additional Notes:</strong> {selectedProject.additionalInfo}
              </div>
            )}
            {selectedProject.techStack && selectedProject.techStack.length > 0 && (
              <div className="tech-stack" style={{ marginTop: '15px' }}>
                {selectedProject.techStack.map((t, idx) => (
                  <span key={idx}>{t}</span>
                ))}
              </div>
            )}
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              {selectedProject.liveUrl && (
                <a href={selectedProject.liveUrl} target="_blank" rel="noreferrer" className="btn primary" style={{ textDecoration: 'none' }}>
                  <i className="fas fa-external-link-alt"></i> Live Demo
                </a>
              )}
              {selectedProject.githubUrl && (
                <a href={selectedProject.githubUrl} target="_blank" rel="noreferrer" className="btn secondary" style={{ textDecoration: 'none' }}>
                  <i className="fab fa-github"></i> GitHub Code
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===================== ACHIEVEMENT DETAIL MODAL ===================== */}
      {selectedAch && (
        <div style={modalOverlayStyle} onClick={() => setSelectedAch(null)}>
          <div style={{ ...modalBoxStyle, maxWidth: '650px', background: modalBg, color: modalTextColor, borderColor: modalBorderColor }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <i className="fas fa-trophy" style={{ fontSize: '1.8rem', color: '#f59e0b' }}></i>
                <h3 style={{ margin: 0, fontSize: '1.4rem', color: modalTextColor }}>{selectedAch.title}</h3>
              </div>
              <button style={{ ...closeBtnStyle, color: modalSubTextColor }} onClick={() => setSelectedAch(null)}>&times;</button>
            </div>

            <ImageSlider mainImage={selectedAch.imageUrl} images={selectedAch.images} title={selectedAch.title} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              {selectedAch.category && (
                <span style={{ background: '#7c3aed', color: '#fff', fontSize: '0.75rem', padding: '4px 12px', borderRadius: '15px', fontWeight: 600 }}>
                  {selectedAch.category}
                </span>
              )}
              <span style={{ fontSize: '0.85rem', color: modalSubTextColor }}>
                Date: {formatCardDate(selectedAch.date, selectedAch.createdAt)}
              </span>
            </div>
            <p style={{ lineHeight: 1.6 }}>{selectedAch.description}</p>
            {selectedAch.bullets && selectedAch.bullets.length > 0 && (
              <ul style={{ marginTop: '15px', marginLeft: '20px' }}>
                {selectedAch.bullets.map((b, idx) => (
                  <li key={idx} style={{ marginBottom: '6px' }}>{b}</li>
                ))}
              </ul>
            )}
            {selectedAch.additionalInfo && (
              <div style={{ marginTop: '15px', padding: '12px', borderRadius: '8px', background: isLightTheme ? '#f1f5f9' : 'rgba(255,255,255,0.05)', fontSize: '0.85rem' }}>
                <strong>Additional Notes:</strong> {selectedAch.additionalInfo}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================== CERTIFICATION DETAIL MODAL ===================== */}
      {selectedCert && (
        <div style={modalOverlayStyle} onClick={() => setSelectedCert(null)}>
          <div style={{ ...modalBoxStyle, maxWidth: '680px', background: modalBg, color: modalTextColor, borderColor: modalBorderColor }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <i className="fas fa-certificate" style={{ fontSize: '1.8rem', color: '#7c3aed' }}></i>
                <h3 style={{ margin: 0, fontSize: '1.4rem', color: modalTextColor }}>{selectedCert.title}</h3>
              </div>
              <button style={{ ...closeBtnStyle, color: modalSubTextColor }} onClick={() => setSelectedCert(null)}>&times;</button>
            </div>

            <ImageSlider mainImage={selectedCert.imageUrl} images={selectedCert.images} title={selectedCert.title} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <span style={{ fontSize: '0.9rem', color: '#a78bfa', fontWeight: 600 }}>Issuer: {selectedCert.issuer || 'N/A'}</span>
              <span style={{ fontSize: '0.85rem', color: modalSubTextColor }}>
                Date: {formatCardDate(selectedCert.issueDate || selectedCert.date, selectedCert.createdAt)}
              </span>
            </div>

            {selectedCert.description && (
              <p style={{ lineHeight: 1.6, marginTop: '10px' }}>{selectedCert.description}</p>
            )}

            {selectedCert.additionalInfo && (
              <div style={{ marginTop: '15px', padding: '12px', borderRadius: '8px', background: isLightTheme ? '#f1f5f9' : 'rgba(255,255,255,0.05)', fontSize: '0.85rem' }}>
                <strong>Additional Notes / Details:</strong> {selectedCert.additionalInfo}
              </div>
            )}

            {selectedCert.tags && selectedCert.tags.length > 0 && (
              <div className="tech-stack" style={{ marginTop: '15px' }}>
                {selectedCert.tags.map((t, idx) => (
                  <span key={idx}>{t}</span>
                ))}
              </div>
            )}

            {selectedCert.credentialUrl && (
              <div style={{ marginTop: '20px' }}>
                <a href={selectedCert.credentialUrl} target="_blank" rel="noreferrer" className="btn primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <i className="fas fa-external-link-alt"></i> Verify Credential Online
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      <Script src="/js/script.js" strategy="afterInteractive" />
    </>
  );
}

// Inline Base Styles for Modal Overlays
const modalOverlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.85)',
  backdropFilter: 'blur(8px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
  padding: '20px',
};

const modalBoxStyle = {
  borderRadius: '16px',
  padding: '28px',
  width: '100%',
  maxWidth: '550px',
  maxHeight: '90vh',
  overflowY: 'auto',
  boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
  transition: 'background 0.3s, color 0.3s',
};

const closeBtnStyle = {
  background: 'none',
  border: 'none',
  fontSize: '1.8rem',
  cursor: 'pointer',
};
