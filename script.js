(() => {
  'use strict';
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.getElementById('siteHeader');
  const menuBtn = document.getElementById('menuBtn');
  const navLinks = document.getElementById('navLinks');

  const onScroll = () => header?.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const closeMenu = () => { menuBtn?.setAttribute('aria-expanded', 'false'); navLinks?.classList.remove('open'); };
  menuBtn?.addEventListener('click', () => {
    const open = menuBtn.getAttribute('aria-expanded') === 'true';
    open ? closeMenu() : (menuBtn.setAttribute('aria-expanded', 'true'), navLinks?.classList.add('open'));
  });
  navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('click', (e) => {
    if (!navLinks?.classList.contains('open')) return;
    if (navLinks.contains(e.target) || menuBtn?.contains(e.target)) return;
    closeMenu();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const hh = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h'), 10) || 84;
      const top = target.getBoundingClientRect().top + window.scrollY - hh + 1;
      window.scrollTo({ top: Math.max(0, top), behavior: prefersReduced ? 'auto' : 'smooth' });
      history.pushState(null, '', href);
    });
  });

  const reveals = document.querySelectorAll('.reveal');
  if (!prefersReduced && 'IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('is-visible'); obs.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(el => obs.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    status.textContent = ''; status.className = 'form-status';
    const data = new FormData(form);
    const name = (data.get('name') || '').toString().trim();
    const email = (data.get('email') || '').toString().trim();
    const business = (data.get('business') || '').toString().trim();
    const message = (data.get('message') || '').toString().trim();
    if (!name || !email || !message) { status.textContent = 'Please fill in your name, email, and project details.'; status.classList.add('error'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { status.textContent = 'Please enter a valid email address.'; status.classList.add('error'); return; }
    const subject = encodeURIComponent(`New Project Inquiry from ${name}${business ? ' — ' + business : ''}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nBusiness: ${business || '—'}\n\nMessage:\n${message}`);
    window.location.href = `mailto:zioafricaagency@gmail.com?subject=${subject}&body=${body}`;
    status.textContent = 'Thank you — your email client should open with your inquiry.';
    form.reset();
  });
})();
