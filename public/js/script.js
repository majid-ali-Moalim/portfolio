document.addEventListener('DOMContentLoaded', () => {
    // ===================== MOBILE MENU =====================
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    const closeMobileMenu = () => {
        if (navLinks) navLinks.classList.remove('active');
        if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
    };

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
        navLinks.querySelectorAll('a[href^="#"]').forEach((link) => {
            link.addEventListener('click', closeMobileMenu);
        });
    }

    // ===================== THEME TOGGLE (Light / Dark) =====================
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Apply theme from localStorage on load
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    if (savedTheme === 'light') {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        const icon = themeToggle ? themeToggle.querySelector('i') : null;
        if (icon) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    } else {
        body.classList.add('dark-theme');
        body.classList.remove('light-theme');
    }

    if (themeToggle) {
        const icon = themeToggle.querySelector('i');

        themeToggle.addEventListener('click', () => {
            if (body.classList.contains('light-theme')) {
                // Switch to Dark
                body.classList.remove('light-theme');
                body.classList.add('dark-theme');
                if (icon) {
                    icon.classList.remove('fa-sun');
                    icon.classList.add('fa-moon');
                }
                localStorage.setItem('portfolio-theme', 'dark');
            } else {
                // Switch to Light
                body.classList.remove('dark-theme');
                body.classList.add('light-theme');
                if (icon) {
                    icon.classList.remove('fa-moon');
                    icon.classList.add('fa-sun');
                }
                localStorage.setItem('portfolio-theme', 'light');
            }
        });
    }

    // ===================== NAVBAR SCROLL EFFECT =====================
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // ===================== FADE IN ANIMATIONS =====================
    const revealElement = (element) => {
        element.classList.add('fade-in-visible');
        element.classList.remove('fade-in-hidden');
    };

    const animatedElements = document.querySelectorAll('.section, .service-card, .project-card, .skill-group');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    revealElement(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08 });

        animatedElements.forEach((el) => {
            el.classList.add('fade-in-hidden');
            observer.observe(el);

            // Immediately reveal elements already in viewport
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                revealElement(el);
                observer.unobserve(el);
            }
        });
    } else {
        animatedElements.forEach(revealElement);
    }

    // Fallback: reveal all after 800ms
    setTimeout(() => {
        animatedElements.forEach((el) => {
            if (!el.classList.contains('fade-in-visible')) {
                revealElement(el);
            }
        });
    }, 800);

    // ===================== SMOOTH SCROLL =====================
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (event) => {
            const targetId = anchor.getAttribute('href');
            if (!targetId || targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            event.preventDefault();
            targetElement.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // ===================== YEAR SPAN =====================
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});
