/* =====================================================
   Daisy's Portfolio — script.js
   Handles: Nav, Typewriter, Scroll Animations,
            Skill Bars, Contact Form, Back-to-Top
   ===================================================== */

/* ---- DOM READY ---- */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHamburger();
  initTypewriter();
  initScrollReveal();
  initSkillBars();
  initActiveNav();
  initContactForm();
  initBackToTop();
  initFooterYear();
  initSmoothScroll();
});

/* =====================================================
   NAVBAR — scrolled state
   ===================================================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run on load
}

/* =====================================================
   HAMBURGER MENU
   ===================================================== */
function initHamburger() {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  const links = menu.querySelectorAll('.mobile-link');

  btn.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', isOpen);
  });

  // Close menu when a link is clicked
  links.forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', false);
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.remove('open');
      btn.classList.remove('open');
    }
  });
}

/* =====================================================
   TYPEWRITER EFFECT
   ===================================================== */
function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const phrases = [
    'UI/UX Enthusiast',
    'Web Developer',
    'QA Specialist',
    'Problem Solver',
    'Creative Thinker',
  ];

  let phraseIndex = 0;
  let charIndex   = 0;
  let isDeleting  = false;
  let isPaused    = false;

  const TYPE_SPEED   = 80;
  const DELETE_SPEED = 45;
  const PAUSE_AFTER  = 1800;
  const PAUSE_BEFORE = 300;

  function tick() {
    const current = phrases[phraseIndex];

    if (isPaused) {
      isPaused = false;
      setTimeout(tick, PAUSE_BEFORE);
      return;
    }

    if (isDeleting) {
      el.textContent = current.slice(0, charIndex - 1);
      charIndex--;
    } else {
      el.textContent = current.slice(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? DELETE_SPEED : TYPE_SPEED;

    if (!isDeleting && charIndex === current.length) {
      // Finished typing — pause then delete
      delay = PAUSE_AFTER;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      // Finished deleting — move to next phrase
      isDeleting = false;
      isPaused   = true;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }

    setTimeout(tick, delay);
  }

  setTimeout(tick, 800);
}

/* =====================================================
   SCROLL REVEAL ANIMATION
   ===================================================== */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Once visible, no need to keep observing
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  elements.forEach(el => observer.observe(el));
}

/* =====================================================
   SKILL BARS — animate width when visible
   ===================================================== */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar   = entry.target;
          const width = bar.getAttribute('data-width');
          // Small delay for visual polish
          setTimeout(() => {
            bar.style.width = width + '%';
          }, 200);
          observer.unobserve(bar);
        }
      });
    },
    { threshold: 0.3 }
  );

  bars.forEach(bar => observer.observe(bar));
}

/* =====================================================
   ACTIVE NAV LINK — highlight based on scroll position
   ===================================================== */
function initActiveNav() {
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  const OFFSET = 80; // navbar height

  function updateActive() {
    let current = '';
    const scrollY = window.scrollY;

    sections.forEach(section => {
      const top    = section.offsetTop - OFFSET - 40;
      const bottom = top + section.offsetHeight;
      if (scrollY >= top && scrollY < bottom) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();
}

/* =====================================================
   CONTACT FORM — simulate send with validation
   ===================================================== */
function initContactForm() {
  const form       = document.getElementById('contactForm');
  const submitBtn  = document.getElementById('submitBtn');
  const successMsg = document.getElementById('formSuccess');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic validation
    const inputs = form.querySelectorAll('[required]');
    let valid = true;

    inputs.forEach(input => {
      input.style.borderColor = '';
      if (!input.value.trim()) {
        input.style.borderColor = '#ef4444';
        valid = false;
      }
    });

    if (!valid) return;

    // Email format check
    const emailField = form.querySelector('#email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailField && !emailRegex.test(emailField.value)) {
      emailField.style.borderColor = '#ef4444';
      return;
    }

    // Simulate sending
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="ph ph-spinner" style="animation:spin 0.8s linear infinite"></i> <span>Sending…</span>';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="ph ph-paper-plane-tilt"></i> <span>Send Message</span>';
      successMsg.classList.add('show');
      form.reset();

      setTimeout(() => successMsg.classList.remove('show'), 5000);
    }, 1600);
  });

  // Remove red border on input
  form.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('input', () => {
      field.style.borderColor = '';
    });
  });
}

/* =====================================================
   BACK TO TOP BUTTON
   ===================================================== */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* =====================================================
   FOOTER COPYRIGHT YEAR
   ===================================================== */
function initFooterYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

/* =====================================================
   SMOOTH SCROLL — for nav links (fallback for older browsers)
   ===================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 64; // navbar height
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* =====================================================
   CSS KEYFRAME for spinner (injected via JS)
   ===================================================== */
const spinStyle = document.createElement('style');
spinStyle.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
document.head.appendChild(spinStyle);
