document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    const closeMobileMenu = () => {
        if (navLinks) {
            navLinks.classList.remove('active');
        }
        if (mobileMenuBtn) {
            mobileMenuBtn.classList.remove('active');
        }
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

    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    if (themeToggle) {
        const icon = themeToggle.querySelector('i');

        const toggleTheme = () => {
            if (!icon) {
                return;
            }

            if (body.classList.contains('dark-theme')) {
                body.classList.remove('dark-theme');
                body.classList.add('light-theme');
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
                localStorage.setItem('theme', 'light');
            } else {
                body.classList.remove('light-theme');
                body.classList.add('dark-theme');
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
                localStorage.setItem('theme', 'dark');
            }
        };

        themeToggle.addEventListener('click', toggleTheme);

        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light' && icon) {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }

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

    const typedTextElement = document.querySelector('.typed-text');
    const titles = [
        'Full Stack Software Engineer',
        'Data Analyst'
    ];
    let titleIndex = 0;
    let charIndex = typedTextElement ? typedTextElement.textContent.length : 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        if (!typedTextElement) {
            return;
        }

        const currentTitle = titles[titleIndex];

        if (isDeleting) {
            typedTextElement.textContent = currentTitle.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typedTextElement.textContent = currentTitle.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentTitle.length) {
            isDeleting = true;
            typingSpeed = 2000;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            titleIndex = (titleIndex + 1) % titles.length;
            typingSpeed = 500;
        }

        setTimeout(type, typingSpeed);
    }

    if (typedTextElement) {
        setTimeout(type, 1500);
    }

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

            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                revealElement(el);
                observer.unobserve(el);
            }
        });
    } else {
        animatedElements.forEach(revealElement);
    }

    setTimeout(() => {
        animatedElements.forEach((el) => {
            if (!el.classList.contains('fade-in-visible')) {
                revealElement(el);
            }
        });
    }, 800);

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (event) => {
            const targetId = anchor.getAttribute('href');
            if (!targetId || targetId === '#') {
                return;
            }

            const targetElement = document.querySelector(targetId);
            if (!targetElement) {
                return;
            }

            event.preventDefault();
            targetElement.scrollIntoView({ behavior: 'smooth' });
        });
    });

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const btn = contactForm.querySelector('button');
            const originalText = btn.textContent;

            btn.textContent = 'Sending...';
            btn.disabled = true;

            setTimeout(() => {
                alert('Thank you! Your message has been sent successfully.');
                contactForm.reset();
                btn.textContent = originalText;
                btn.disabled = false;
            }, 1500);
        });
    }

    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});
