/* ════════════════════════════════════════════════════════════════════════════════
   LARP.PARIS — Interactions
   Scroll reveal, subtle parallax, mobile nav, smooth scroll
   ════════════════════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    // ─── SCROLL-TRIGGERED REVEAL ──────────────────────────────────────────────
    const revealElements = document.querySelectorAll('.reveal, .fade-in');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.08
    });

    revealElements.forEach(el => revealObserver.observe(el));


    // ─── STAGGER CHILDREN INSIDE TEAM GRID ───────────────────────────────────
    const teamCards = document.querySelectorAll('.team-card.reveal');
    teamCards.forEach((card, i) => {
        card.style.transitionDelay = `${i * 0.1}s`;
    });


    // ─── GALLERY AUTO-SCROLL ─────────────────────────────────────────────────
    const autoScrollGalleries = document.querySelectorAll('[data-autoscroll]');

    autoScrollGalleries.forEach(gallery => {
        let isUserInteracting = false;
        let resumeTimeout = null;
        let isVisible = false;
        let scrollPos = gallery.scrollLeft; // Use internal variable for subpixel precision
        const speed = 0.5; // px per frame (~30px/sec at 60fps)

        // Observe visibility to save performance
        const visObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                isVisible = entry.isIntersecting;
            });
        }, { threshold: 0.1 });
        visObserver.observe(gallery);

        // Auto-scroll loop
        function tick() {
            if (isVisible && !isUserInteracting) {
                // Tell CSS to disable scroll-snap while we are autoscrolling
                gallery.setAttribute('data-scrolling', 'true');

                scrollPos += speed;
                gallery.scrollLeft = scrollPos;

                // Loop logic
                const maxScroll = gallery.scrollWidth - gallery.clientWidth;
                if (scrollPos >= maxScroll) {
                    scrollPos = 0;
                    gallery.scrollLeft = 0;
                }
            } else {
                // Re-enable scroll-snap when not autoscrolling
                gallery.removeAttribute('data-scrolling');
                scrollPos = gallery.scrollLeft; // Sync internal pos with manual scroll
            }
            requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);

        // Pause on user interaction
        function pauseAutoScroll() {
            isUserInteracting = true;
            gallery.removeAttribute('data-scrolling');
            clearTimeout(resumeTimeout);
            resumeTimeout = setTimeout(() => {
                isUserInteracting = false;
                scrollPos = gallery.scrollLeft; // Resync before resuming
            }, 3000);
        }

        gallery.addEventListener('pointerdown', pauseAutoScroll, { passive: true });
        gallery.addEventListener('wheel', pauseAutoScroll, { passive: true });
        gallery.addEventListener('touchstart', pauseAutoScroll, { passive: true });
        // Handle scroll events to detect manual dragging/swiping
        gallery.addEventListener('scroll', () => {
            if (isUserInteracting) {
                scrollPos = gallery.scrollLeft;
            }
        }, { passive: true });
    });


    // ─── MOBILE NAV TOGGLE ────────────────────────────────────────────────────
    const navToggle = document.getElementById('nav-toggle');
    const mainNav = document.getElementById('main-nav');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        mainNav.classList.toggle('open');
        document.body.style.overflow = mainNav.classList.contains('open') ? 'hidden' : '';
    });

    // Close mobile nav on link click
    mainNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            mainNav.classList.remove('open');
            document.body.style.overflow = '';
        });
    });


    // ─── SMOOTH SCROLL FOR NAV LINKS ──────────────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.getElementById('site-header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });


    // ─── LOGO HANDOFF ─────────────────────────────────────────────────────────
    const heroLogo = document.querySelector('.hero-logo');
    const headerLogo = document.getElementById('header-logo-img');

    if (heroLogo && headerLogo) {
        const logoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    headerLogo.classList.remove('is-visible');
                } else {
                    headerLogo.classList.add('is-visible');
                }
            });
        }, {
            root: null,
            threshold: 0 // Trigger as soon as the first pixel leaves/enters
        });

        logoObserver.observe(heroLogo);
    }


    // ─── HEADER BACKGROUND ON SCROLL ──────────────────────────────────────────
    const header = document.getElementById('site-header');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.style.background = 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 65%)';
        } else {
            header.style.background = 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 50%)';
        }
    }, { passive: true });

});
