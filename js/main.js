/* ============================================
   ImpactGuru Inc. - Main JavaScript
   Vanilla JavaScript for interactions and animations
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  initHeader();
  initMobileNav();
  initAltMobileNav();
  initAnimatedCounters();
  initScrollAnimations();
  initCharts();
  initContactForm();
});

/* ============================================
   Header Scroll Effect
   ============================================ */
function initHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  let lastScroll = 0;
  const scrollThreshold = 50;

  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;

    // Add shadow on scroll
    if (currentScroll > scrollThreshold) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }

    lastScroll = currentScroll;
  });
}

/* ============================================
   Mobile Navigation
   ============================================ */
function initMobileNav() {
  const toggle = document.querySelector('.nav__toggle');
  const navList = document.querySelector('.nav__list');
  
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

  toggle.addEventListener('click', function(e) {
    e.stopPropagation();
    const isOpen = navList.classList.contains('nav__list--open');
    if (isOpen) {
      closeNav();
    } else {
      openNav();
    }
  });

  // Close menu when clicking a link
  navList.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeNav);
  });

  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
    if (!toggle.contains(e.target) && !navList.contains(e.target)) {
      closeNav();
    }
  });

  // Close menu on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeNav();
  });

  // Close menu on window resize above breakpoint
  window.addEventListener('resize', function() {
    if (window.innerWidth > 1024) closeNav();
  });
}

/* ============================================
   Mobile Navigation — Alternate Pattern
   (donate.html, contact.html, get-involved.html)
   ============================================ */
function initAltMobileNav() {
  const toggle = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');

  if (!toggle || !navLinks) return;

  function openNav() {
    navLinks.classList.add('nav-open');
    toggle.classList.add('active');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-open');
  }

  function closeNav() {
    navLinks.classList.remove('nav-open');
    toggle.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  }

  toggle.addEventListener('click', function(e) {
    e.stopPropagation();
    const isOpen = navLinks.classList.contains('nav-open');
    if (isOpen) {
      closeNav();
    } else {
      openNav();
    }
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeNav);
  });

  document.addEventListener('click', function(e) {
    if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
      closeNav();
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeNav();
  });

  window.addEventListener('resize', function() {
    if (window.innerWidth > 1024) closeNav();
  });
}

/* ============================================
   Animated Counters
   ============================================ */
function initAnimatedCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-counter'), 10);
  const suffix = element.getAttribute('data-suffix') || '';
  const prefix = element.getAttribute('data-prefix') || '';
  const duration = 2000; // 2 seconds
  const start = 0;
  const startTime = performance.now();

  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function (ease-out-expo)
    const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const current = Math.floor(easeOutExpo * (target - start) + start);
    
    element.textContent = prefix + formatNumber(current) + suffix;

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    }
  }

  requestAnimationFrame(updateCounter);
}

function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(num >= 10000 ? 0 : 1) + 'K';
  }
  return num.toLocaleString();
}

/* ============================================
   Scroll Animations
   ============================================ */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  if (animatedElements.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -100px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => observer.observe(el));
}

/* ============================================
   Charts (Pure JavaScript Canvas)
   ============================================ */
function initCharts() {
  initBarChart();
  initDonutChart();
  initLineChart();
}

// Bar Chart
function initBarChart() {
  const canvas = document.getElementById('barChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  
  // Set canvas size
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const data = [
    { label: '2020', value: 12500 },
    { label: '2021', value: 28000 },
    { label: '2022', value: 45000 },
    { label: '2023', value: 72000 },
    { label: '2024', value: 95000 }
  ];

  const padding = { top: 30, right: 20, bottom: 40, left: 60 };
  const chartWidth = rect.width - padding.left - padding.right;
  const chartHeight = rect.height - padding.top - padding.bottom;
  const barWidth = (chartWidth / data.length) * 0.6;
  const barGap = (chartWidth / data.length) * 0.4;
  const maxValue = Math.max(...data.map(d => d.value));

  // Draw background grid
  ctx.strokeStyle = '#f1f5f9';
  ctx.lineWidth = 1;
  
  for (let i = 0; i <= 5; i++) {
    const y = padding.top + (chartHeight / 5) * i;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(rect.width - padding.right, y);
    ctx.stroke();
    
    // Y-axis labels
    const value = Math.round(maxValue - (maxValue / 5) * i);
    ctx.fillStyle = '#64748b';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(formatNumber(value), padding.left - 10, y + 4);
  }

  // Draw bars with animation
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateBars();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  observer.observe(canvas);

  function animateBars() {
    let progress = 0;
    const duration = 1000;
    const startTime = performance.now();

    function draw(currentTime) {
      progress = Math.min((currentTime - startTime) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3); // ease-out-cubic

      // Clear and redraw grid
      ctx.clearRect(padding.left, padding.top, chartWidth, chartHeight);
      
      // Redraw grid lines
      ctx.strokeStyle = '#f1f5f9';
      for (let i = 0; i <= 5; i++) {
        const y = padding.top + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(rect.width - padding.right, y);
        ctx.stroke();
      }

      // Draw bars
      data.forEach((item, index) => {
        const barHeight = (item.value / maxValue) * chartHeight * easeProgress;
        const x = padding.left + (chartWidth / data.length) * index + barGap / 2;
        const y = padding.top + chartHeight - barHeight;

        // Create gradient
        const gradient = ctx.createLinearGradient(x, y + barHeight, x, y);
        gradient.addColorStop(0, '#1a4b7c');
        gradient.addColorStop(1, '#2a6aad');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0]);
        ctx.fill();

        // X-axis labels
        ctx.fillStyle = '#64748b';
        ctx.font = '12px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(item.label, x + barWidth / 2, rect.height - 15);
      });

      if (progress < 1) {
        requestAnimationFrame(draw);
      }
    }

    requestAnimationFrame(draw);
  }
}

// Donut Chart
function initDonutChart() {
  const canvas = document.getElementById('donutChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const data = [
    { label: 'Critical Care', value: 40, color: '#1a4b7c' },
    { label: 'Cancer Care', value: 35, color: '#0d9488' },
    { label: 'Disaster Relief', value: 25, color: '#e85a24' }
  ];

  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  const radius = Math.min(rect.width, rect.height) / 2 - 40;
  const innerRadius = radius * 0.6;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateDonut();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  observer.observe(canvas);

  function animateDonut() {
    let progress = 0;
    const duration = 1500;
    const startTime = performance.now();

    function draw(currentTime) {
      progress = Math.min((currentTime - startTime) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      ctx.clearRect(0, 0, rect.width, rect.height);

      let currentAngle = -Math.PI / 2;
      const total = data.reduce((sum, item) => sum + item.value, 0);

      data.forEach((item, index) => {
        const sliceAngle = (item.value / total) * 2 * Math.PI * easeProgress;
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
        ctx.closePath();
        
        ctx.fillStyle = item.color;
        ctx.fill();

        currentAngle += sliceAngle;
      });

      // Center text
      if (progress === 1) {
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 24px Plus Jakarta Sans, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('100%', centerX, centerY - 10);
        
        ctx.fillStyle = '#64748b';
        ctx.font = '14px Inter, sans-serif';
        ctx.fillText('Program Allocation', centerX, centerY + 15);
      }

      if (progress < 1) {
        requestAnimationFrame(draw);
      }
    }

    requestAnimationFrame(draw);
  }

  // Draw legend
  const legend = canvas.parentElement.querySelector('.chart-legend');
  if (legend) {
    data.forEach(item => {
      const legendItem = document.createElement('div');
      legendItem.className = 'chart-legend__item';
      legendItem.innerHTML = `
        <span class="chart-legend__color" style="background-color: ${item.color}"></span>
        <span class="chart-legend__label">${item.label}</span>
        <span class="chart-legend__value">${item.value}%</span>
      `;
      legend.appendChild(legendItem);
    });
  }
}

// Line Chart
function initLineChart() {
  const canvas = document.getElementById('lineChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const data = [
    { label: 'Jan', value: 8500 },
    { label: 'Feb', value: 12000 },
    { label: 'Mar', value: 15000 },
    { label: 'Apr', value: 11000 },
    { label: 'May', value: 18000 },
    { label: 'Jun', value: 22000 },
    { label: 'Jul', value: 19000 },
    { label: 'Aug', value: 25000 },
    { label: 'Sep', value: 28000 },
    { label: 'Oct', value: 32000 },
    { label: 'Nov', value: 35000 },
    { label: 'Dec', value: 42000 }
  ];

  const padding = { top: 30, right: 20, bottom: 40, left: 60 };
  const chartWidth = rect.width - padding.left - padding.right;
  const chartHeight = rect.height - padding.top - padding.bottom;
  const maxValue = Math.max(...data.map(d => d.value));
  const stepX = chartWidth / (data.length - 1);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateLine();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  observer.observe(canvas);

  function animateLine() {
    let progress = 0;
    const duration = 2000;
    const startTime = performance.now();

    function draw(currentTime) {
      progress = Math.min((currentTime - startTime) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      ctx.clearRect(0, 0, rect.width, rect.height);

      // Draw grid
      ctx.strokeStyle = '#f1f5f9';
      ctx.lineWidth = 1;
      
      for (let i = 0; i <= 5; i++) {
        const y = padding.top + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(rect.width - padding.right, y);
        ctx.stroke();
        
        const value = Math.round(maxValue - (maxValue / 5) * i);
        ctx.fillStyle = '#64748b';
        ctx.font = '12px Inter, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(formatNumber(value), padding.left - 10, y + 4);
      }

      // Draw area fill
      const pointsToDraw = Math.floor(data.length * easeProgress);
      
      if (pointsToDraw > 0) {
        ctx.beginPath();
        ctx.moveTo(padding.left, padding.top + chartHeight);
        
        for (let i = 0; i <= pointsToDraw; i++) {
          const x = padding.left + stepX * i;
          const y = padding.top + chartHeight - (data[i].value / maxValue) * chartHeight;
          
          if (i === 0) {
            ctx.lineTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        const lastX = padding.left + stepX * pointsToDraw;
        ctx.lineTo(lastX, padding.top + chartHeight);
        ctx.closePath();
        
        const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartHeight);
        gradient.addColorStop(0, 'rgba(13, 148, 136, 0.3)');
        gradient.addColorStop(1, 'rgba(13, 148, 136, 0)');
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw line
        ctx.beginPath();
        for (let i = 0; i <= pointsToDraw; i++) {
          const x = padding.left + stepX * i;
          const y = padding.top + chartHeight - (data[i].value / maxValue) * chartHeight;
          
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.strokeStyle = '#0d9488';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        // Draw points
        for (let i = 0; i <= pointsToDraw; i++) {
          const x = padding.left + stepX * i;
          const y = padding.top + chartHeight - (data[i].value / maxValue) * chartHeight;
          
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, Math.PI * 2);
          ctx.fillStyle = '#0d9488';
          ctx.fill();
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }

      // X-axis labels
      data.forEach((item, index) => {
        const x = padding.left + stepX * index;
        ctx.fillStyle = '#64748b';
        ctx.font = '11px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(item.label, x, rect.height - 15);
      });

      if (progress < 1) {
        requestAnimationFrame(draw);
      }
    }

    requestAnimationFrame(draw);
  }
}

/* ============================================
   Contact Form
   ============================================ */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Simple validation
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
      const formGroup = field.closest('.form-group');
      const errorMsg = formGroup.querySelector('.form-error');
      
      if (!field.value.trim()) {
        isValid = false;
        field.classList.add('error');
        if (!errorMsg) {
          const error = document.createElement('span');
          error.className = 'form-error';
          error.textContent = 'This field is required';
          error.style.color = '#dc2626';
          error.style.fontSize = '0.8125rem';
          error.style.marginTop = '0.25rem';
          error.style.display = 'block';
          formGroup.appendChild(error);
        }
      } else {
        field.classList.remove('error');
        if (errorMsg) errorMsg.remove();
      }
    });

    // Email validation
    const emailField = form.querySelector('[type="email"]');
    if (emailField && emailField.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailField.value)) {
        isValid = false;
        emailField.classList.add('error');
        const formGroup = emailField.closest('.form-group');
        const existingError = formGroup.querySelector('.form-error');
        if (!existingError) {
          const error = document.createElement('span');
          error.className = 'form-error';
          error.textContent = 'Please enter a valid email address';
          error.style.color = '#dc2626';
          error.style.fontSize = '0.8125rem';
          error.style.marginTop = '0.25rem';
          error.style.display = 'block';
          formGroup.appendChild(error);
        }
      }
    }

    if (isValid) {
      // Show success message
      const submitBtn = form.querySelector('[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      // Simulate form submission
      setTimeout(() => {
        form.reset();
        submitBtn.textContent = 'Message Sent!';
        submitBtn.style.backgroundColor = '#0d9488';
        
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.style.backgroundColor = '';
          submitBtn.disabled = false;
        }, 3000);
      }, 1500);
    }
  });

  // Remove error on input
  form.querySelectorAll('input, textarea, select').forEach(field => {
    field.addEventListener('input', function() {
      this.classList.remove('error');
      const formGroup = this.closest('.form-group');
      const errorMsg = formGroup.querySelector('.form-error');
      if (errorMsg) errorMsg.remove();
    });
  });
}

/* ============================================
   Utility: Smooth Scroll for Anchor Links
   ============================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

/* ============================================
   Polyfill for roundRect (Safari < 16)
   ============================================ */
if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, radii) {
    const r = radii[0] || 0;
    this.moveTo(x + r, y);
    this.lineTo(x + w - r, y);
    this.quadraticCurveTo(x + w, y, x + w, y + r);
    this.lineTo(x + w, y + h - r);
    this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    this.lineTo(x + r, y + h);
    this.quadraticCurveTo(x, y + h, x, y + h - r);
    this.lineTo(x, y + r);
    this.quadraticCurveTo(x, y, x + r, y);
    return this;
  };
}
