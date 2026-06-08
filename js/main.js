/* ============================================
   Impact Guru Inc. — main.js
   ============================================ */

/* Mark JS as active immediately — reveals reveal-up guard in CSS */
document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', function () {
  initHeader();
  initMobileNav();
  initDropdownNav();
  initScrollReveal();
  initCounters();
});

/* ── Sticky header shadow ─────────────────── */
function initHeader() {
  var header = document.querySelector('.header');
  if (!header) return;
  window.addEventListener('scroll', function () {
    header.classList.toggle('header--scrolled', window.scrollY > 20);
  }, { passive: true });
}

/* ── Mobile nav toggle ────────────────────── */
function initMobileNav() {
  var toggle  = document.querySelector('.nav__toggle');
  var navList = document.querySelector('.nav__list');
  if (!toggle || !navList) return;

  function openNav() {
    navList.classList.add('nav__list--open');
    toggle.classList.add('nav__toggle--active');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-open');
  }
  function closeNav() {
    navList.classList.remove('nav__list--open');
    toggle.classList.remove('nav__toggle--active');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  }

  toggle.addEventListener('click', function (e) {
    e.stopPropagation();
    navList.classList.contains('nav__list--open') ? closeNav() : openNav();
  });
  navList.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
  document.addEventListener('click', function (e) {
    if (!toggle.contains(e.target) && !navList.contains(e.target)) closeNav();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeNav(); });
  window.addEventListener('resize', function () { if (window.innerWidth > 1024) closeNav(); });
}

/* ── Programs dropdown ────────────────────── */
function initDropdownNav() {
  document.querySelectorAll('.nav__item--dropdown').forEach(function (item) {
    var trigger  = item.querySelector('.nav__link');
    var dropdown = item.querySelector('.nav__dropdown');
    if (!trigger || !dropdown) return;

    trigger.addEventListener('click', function (e) {
      if (window.innerWidth <= 1024) {
        e.preventDefault();
        e.stopPropagation();
        var open = dropdown.classList.contains('nav__dropdown--open');
        document.querySelectorAll('.nav__dropdown--open').forEach(function (d) {
          d.classList.remove('nav__dropdown--open');
        });
        if (!open) dropdown.classList.add('nav__dropdown--open');
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

/* ── Scroll Reveal ────────────────────────── */
function initScrollReveal() {
  if (!('IntersectionObserver' in window)) {
    /* Fallback: make everything visible if IO not supported */
    document.querySelectorAll('.reveal-up, .animate-on-scroll').forEach(function (el) {
      el.classList.add('in-view');
    });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });

  document.querySelectorAll('.reveal-up, .animate-on-scroll').forEach(function (el) {
    observer.observe(el);
  });
}

/* ── Animated Counters ────────────────────── */
function initCounters() {
  var els = document.querySelectorAll('[data-counter]');
  if (!els.length || !('IntersectionObserver' in window)) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        runCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  els.forEach(function (el) { observer.observe(el); });
}

function runCounter(el) {
  var target   = parseInt(el.getAttribute('data-counter'), 10);
  var prefix   = el.getAttribute('data-prefix')  || '';
  var suffix   = el.getAttribute('data-suffix')  || '';
  var duration = 1500;
  var start    = null;

  function tick(ts) {
    if (!start) start = ts;
    var pct     = Math.min((ts - start) / duration, 1);
    var eased   = 1 - Math.pow(1 - pct, 3);
    var current = Math.floor(eased * target);
    el.textContent = prefix + current.toLocaleString() + suffix;
    if (pct < 1) requestAnimationFrame(tick);
    else el.textContent = prefix + target.toLocaleString() + suffix;
  }
  requestAnimationFrame(tick);
}
