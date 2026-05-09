/* ═══════════════════════════════════════════════════════════════════════════
   LARP.PARIS — Interactions
   ═══════════════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── SCROLL REVEAL ────────────────────────────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -80px 0px', threshold: 0.06 });

  revealEls.forEach(el => revealObserver.observe(el));


  // ─── STAGGER TEAM CARDS ───────────────────────────────────────────────────
  document.querySelectorAll('.team-card.reveal').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.08}s`;
  });


  // ─── LOGO HANDOFF (hero logo → header logo) ───────────────────────────────
  const heroLogo = document.querySelector('.hero-logo');
  const headerLogo = document.getElementById('header-logo-img');

  if (heroLogo && headerLogo) {
    const logoObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        headerLogo.classList.toggle('visible', !entry.isIntersecting);
      });
    }, { threshold: 0 });
    logoObserver.observe(heroLogo);
  }


  // ─── HEADER COMPACT ON SCROLL ─────────────────────────────────────────────
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('is-compact', window.scrollY > 60);
  }, { passive: true });


  // ─── MOBILE NAV ───────────────────────────────────────────────────────────
  const navToggle = document.getElementById('nav-toggle');
  const mainNav = document.getElementById('main-nav');

  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.classList.toggle('active', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });


  // ─── SMOOTH SCROLL ────────────────────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - header.offsetHeight,
          behavior: 'smooth'
        });
      }
    });
  });


  // ─── FAQ ACCORDION ────────────────────────────────────────────────────────
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      const answer = btn.nextElementSibling;
      const icon = btn.querySelector('.faq-icon');

      // Close all others
      document.querySelectorAll('.faq-question[aria-expanded="true"]').forEach(other => {
        if (other !== btn) {
          other.setAttribute('aria-expanded', 'false');
          other.querySelector('.faq-icon').textContent = '+';
          other.nextElementSibling.style.maxHeight = null;
        }
      });

      btn.setAttribute('aria-expanded', !expanded);
      icon.textContent = expanded ? '+' : '−';
      answer.style.maxHeight = expanded ? null : answer.scrollHeight + 'px';
    });
  });

});
