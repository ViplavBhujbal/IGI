/* ============================================
   Impact Guru Inc. — main.js
   Scroll reveal · Counters · Nav · Dropdown
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── Sticky header shadow ──────────────────── */
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('header--scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  /* ── Mobile nav toggle ─────────────────────── */
  initMobileNav();

  /* ── Programs dropdown ─────────────────────── */
  initDropdownNav();

  /* ── Scroll reveal (Intersection Observer) ─── */
  initScrollReveal();

  /* ── Animated counters ─────────────────────── */
  initCounters();
});

/* ─────────────────────────────────────────────
   Mobile Navigation
───────────────────────────────────────────── */
function initMobileNav () {
  const toggle = document.querySelector('.nav__toggle');
  const navList = document.querySelector('.nav__list');
  if (!toggle || !navList) return;

  function openNav () {
    navList.classList.add('nav__list--open');
    toggle.classList.add('nav__toggle--active');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-open');
  }
  function closeNav () {
    navList.classList.remove('nav__list--open');
    toggle.classList.remove('nav__toggle--active');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  }

  toggle.addEventListener('click', function (e) {
    e.stopPropagation();
    navList.classList.contains('nav__list--open') ? closeNav() : openNav();
  });

  navList.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeNav);
  });

  document.addEventListener('click', function (e) {
    if (!toggle.contains(e.target) && !navList.contains(e.target)) closeNav();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeNav();
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 1024) closeNav();
  });
}

/* ─────────────────────────────────────────────
   Programs Dropdown
───────────────────────────────────────────── */
function initDropdownNav () {
  document.querySelectorAll('.nav__item--dropdown').forEach(function (item) {
    const trigger  = item.querySelector('.nav__link');
    const dropdown = item.querySelector('.nav__dropdown');
    if (!trigger || !dropdown) return;

    trigger.addEventListener('click', function (e) {
      if (window.innerWidth <= 1024) {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = dropdown.classList.contains('nav__dropdown--open');
        document.querySelectorAll('.nav__dropdown--open').forEach(function (d) {
          d.classList.remove('nav__dropdown--open');
        });
        if (!isOpen) dropdown.classList.add('nav__dropdown--open');
      }
    });
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav__item--dropdown')) {
      document.querySelectorAll('.nav__dropdown--open').forEach(function (d) {
        d.classList.remove('nav__dropdown--open');
      });
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.nav__dropdown--open').forEach(function (d) {
        d.classList.remove('nav__dropdown--open');
      });
    }
  });
}

/* ─────────────────────────────────────────────
   Scroll Reveal — fade up on enter viewport
───────────────────────────────────────────── */
function initScrollReveal () {
  /* Support legacy .animate-on-scroll class AND new .reveal-up */
  var els = document.querySelectorAll('.reveal-up, .animate-on-scroll');
  if (!els.length) return;

  /* Add reveal-up to animate-on-scroll for consistent behaviour */
  els.forEach(function (el) {
    if (!el.classList.contains('reveal-up')) {
      el.classList.add('reveal-up');
    }
  });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal-up').forEach(function (el) {
    observer.observe(el);
  });
}

/* ─────────────────────────────────────────────
   Animated Counters
───────────────────────────────────────────── */
function initCounters () {
  var counterEls = document.querySelectorAll('[data-counter]');
  if (!counterEls.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  counterEls.forEach(function (el) { observer.observe(el); });
}

function animateCounter (el) {
  var target   = parseInt(el.getAttribute('data-counter'), 10);
  var prefix   = el.getAttribute('data-prefix')  || '';
  var suffix   = el.getAttribute('data-suffix')  || '';
  var duration = 1600;
  var startTime = null;

  function step (timestamp) {
    if (!startTime) startTime = timestamp;
    var progress = Math.min((timestamp - startTime) / duration, 1);
    var eased    = 1 - Math.pow(1 - progress, 3);   /* ease-out cubic */
    var current  = Math.floor(eased * target);

    el.textContent = prefix + current.toLocaleString() + suffix;

    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = prefix + target.toLocaleString() + suffix;
  }

  requestAnimationFrame(step);
}
