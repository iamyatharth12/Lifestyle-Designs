/* ============================================================
   LIFESTYLE DESIGNS — interactions
   ============================================================ */

(function () {
  'use strict';

  /* -------- Nav scroll state -------- */
  const nav = document.querySelector('.nav');
  const setNavState = () => {
    if (!nav) return;
    if (window.scrollY > 24) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  };
  setNavState();
  window.addEventListener('scroll', setNavState, { passive: true });

  /* -------- Mobile drawer -------- */
  const menuBtn = document.querySelector('.nav__menu-btn');
  const drawer = document.querySelector('.drawer');
  const drawerClose = document.querySelector('.drawer__close');
  const openDrawer = () => {
    if (!drawer) return;
    drawer.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };
  const closeDrawer = () => {
    if (!drawer) return;
    drawer.classList.remove('is-open');
    document.body.style.overflow = '';
  };
  menuBtn && menuBtn.addEventListener('click', openDrawer);
  drawerClose && drawerClose.addEventListener('click', closeDrawer);
  drawer && drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));

  /* -------- Reveal on scroll -------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-in'));
  }

  /* -------- Magnetic buttons -------- */
  const magneticButtons = document.querySelectorAll('.btn.magnetic, .magnetic');
  magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });

  /* -------- Animated counters -------- */
  const counters = document.querySelectorAll('[data-counter]');
  const animateCounter = (el) => {
    const target = parseFloat(el.getAttribute('data-counter'));
    const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    const dur = 1600;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = (target * eased).toFixed(decimals);
      // preserve trailing plus if present
      const suffix = el.getAttribute('data-suffix') || '';
      const prefix = el.getAttribute('data-prefix') || '';
      el.textContent = prefix + Number(value).toLocaleString() + suffix;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window && counters.length) {
    const co = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCounter(e.target);
          co.unobserve(e.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(el => co.observe(el));
  } else {
    counters.forEach(animateCounter);
  }

  /* -------- Hero collage parallax (very subtle) -------- */
  const tiles = document.querySelectorAll('.hero__collage .tile');
  if (tiles.length && window.matchMedia('(pointer:fine)').matches) {
    const hero = document.querySelector('.hero__collage');
    hero.addEventListener('mousemove', (e) => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      tiles.forEach((tile, i) => {
        const depth = (i + 1) * 6;
        tile.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
      });
    });
    hero.addEventListener('mouseleave', () => {
      tiles.forEach(tile => { tile.style.transform = ''; });
    });
  }

  /* -------- Hero image fade rotation -------- */
  const rotators = document.querySelectorAll('[data-rotator]');
  rotators.forEach(group => {
    const slides = group.querySelectorAll('[data-slide]');
    if (slides.length < 2) return;
    let idx = 0;
    setInterval(() => {
      slides[idx].style.opacity = 0;
      idx = (idx + 1) % slides.length;
      slides[idx].style.opacity = 1;
    }, 4500);
  });

  /* -------- Portfolio filter -------- */
  const filters = document.querySelectorAll('.filter');
  const items = document.querySelectorAll('.masonry__item');
  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-filter');
      filters.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      items.forEach(it => {
        const c = it.getAttribute('data-cat');
        if (cat === 'all' || c === cat) {
          it.style.display = '';
          requestAnimationFrame(() => it.classList.add('is-in'));
        } else {
          it.classList.remove('is-in');
          it.style.display = 'none';
        }
      });
    });
  });

  /* -------- FAQ accordion -------- */
  document.querySelectorAll('[data-faq]').forEach(item => {
    const head = item.querySelector('.faq__head');
    head && head.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      document.querySelectorAll('[data-faq]').forEach(i => i.classList.remove('is-open'));
      if (!isOpen) item.classList.add('is-open');
    });
  });

  /* -------- Form fake submit -------- */
  const forms = document.querySelectorAll('form[data-form]');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const status = form.querySelector('[data-status]');
      const btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
      setTimeout(() => {
        if (status) status.textContent = 'Thank you — we\'ll be in touch within 24 hours.';
        if (btn) { btn.disabled = false; btn.textContent = 'Submit inquiry'; }
        form.reset();
      }, 900);
    });
  });

  /* -------- Year in footer -------- */
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  /* -------- Smooth in-page anchors respect fixed nav -------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          const top = target.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    });
  });
})();
