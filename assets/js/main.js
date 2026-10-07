/* ==========================================================================
   NEO OCULAR - MAIN JAVASCRIPT ENGINE
   GSAP Motion, AOS Initialization, Interactive Tools & UI State
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize AOS (Animate On Scroll)
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60
    });
  }

  // 2. GSAP Animations Setup
  initGSAP();

  // 3. Navbar Sticky & Mobile Menu Toggle
  initNavbar();

  // 4. Custom Cursor Effect
  initCustomCursor();

  // 5. Interactive Vision Simulator (Eye Test Snippet)
  initVisionSimulator();

  // 6. Service & Blog Filter System
  initFilterTabs();

  // 7. Counter Animation for Stats Section
  initStatCounters();

  // 8. Modal Handlers
  initModals();

  // 9. Hero Section Interactive Slider
  initHeroSlider();
});

/* GSAP Animations */
function initGSAP() {
  if (typeof gsap === 'undefined') return;

  // Hero Floating Card Entrance
  gsap.from('.hero-floating-card', {
    duration: 1,
    y: 40,
    opacity: 0,
    ease: 'power3.out',
    delay: 0.1,
    clearProps: 'transform,opacity'
  });

  // Floating Card Mouse Parallax / Tilt Physics
  const card = document.querySelector('.hero-floating-card');
  const heroSection = document.querySelector('.hero-section');

  if (card && heroSection) {
    heroSection.addEventListener('mousemove', (e) => {
      const { left, top, width, height } = heroSection.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;

      gsap.to(card, {
        duration: 0.5,
        rotationY: x * 12,
        rotationX: -y * 12,
        ease: 'power1.out',
        transformPerspective: 1000
      });
    });

    heroSection.addEventListener('mouseleave', () => {
      gsap.to(card, {
        duration: 0.8,
        rotationY: 0,
        rotationX: 0,
        ease: 'power2.out'
      });
    });
  }
}

/* Navbar Logic */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  if (mobileToggle && navMenu) {
    const icon = mobileToggle.querySelector('i');

    const closeMenu = () => {
      navMenu.classList.remove('active');
      if (icon) {
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-xmark');
      }
    };

    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('active');
      if (icon) {
        if (navMenu.classList.contains('active')) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-xmark');
        } else {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
      }
    });

    // Close menu when clicking any nav item
    const navLinks = navMenu.querySelectorAll('.nav-link, a');
    navLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        closeMenu();
      }
    });
  }
}

/* Custom Luxury Cursor */
function initCustomCursor() {
  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  document.body.appendChild(cursor);

  document.addEventListener('mousemove', (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
  });

  const hoverElements = document.querySelectorAll('a, button, .service-card, .doctor-card, .frame-card');
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('active'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
  });
}

/* Interactive Eye Test Snippet */
function initVisionSimulator() {
  const snellenLines = [
    { text: 'E', size: '20/200' },
    { text: 'F P', size: '20/100' },
    { text: 'T O Z', size: '20/70' },
    { text: 'L P E D', size: '20/50' },
    { text: 'P E C F D', size: '20/40' },
    { text: 'E D F C Z P', size: '20/30' },
    { text: 'F E L O P Z D', size: '20/20 (Optimal)' }
  ];

  let currentIndex = 0;
  const snellenBox = document.getElementById('snellenDisplay');
  const sizeBadge = document.getElementById('snellenBadge');
  const nextBtn = document.getElementById('btnNextLine');

  if (snellenBox && nextBtn && sizeBadge) {
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % snellenLines.length;
      
      // GSAP text swap transition
      if (typeof gsap !== 'undefined') {
        gsap.to(snellenBox, {
          duration: 0.15,
          opacity: 0,
          scale: 0.9,
          onComplete: () => {
            snellenBox.textContent = snellenLines[currentIndex].text;
            sizeBadge.textContent = `Acuity: ${snellenLines[currentIndex].size}`;
            gsap.to(snellenBox, { duration: 0.25, opacity: 1, scale: 1 });
          }
        });
      } else {
        snellenBox.textContent = snellenLines[currentIndex].text;
        sizeBadge.textContent = `Acuity: ${snellenLines[currentIndex].size}`;
      }
    });
  }
}

/* Filter Tabs System */
function initFilterTabs() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const filterItems = document.querySelectorAll('[data-category]');

  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.getAttribute('data-filter');

        filterItems.forEach(item => {
          const itemCat = item.getAttribute('data-category');
          if (category === 'all' || itemCat === category) {
            item.style.display = 'flex';
            if (typeof gsap !== 'undefined') {
              gsap.fromTo(item, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4 });
            }
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }
}

/* Stat Counter Animation */
function initStatCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (statNumbers.length === 0) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const targetVal = parseInt(el.getAttribute('data-target') || '0', 10);
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';

        let start = 0;
        const duration = 2000;
        const stepTime = 30;
        const steps = duration / stepTime;
        const increment = targetVal / steps;

        const timer = setInterval(() => {
          start += increment;
          if (start >= targetVal) {
            el.textContent = `${prefix}${targetVal}${suffix}`;
            clearInterval(timer);
          } else {
            el.textContent = `${prefix}${Math.floor(start)}${suffix}`;
          }
        }, stepTime);

        obs.unobserve(el);
      }
    });
  }, { threshold: 0.4 });

  statNumbers.forEach(stat => observer.observe(stat));
}

/* Modal System */
function initModals() {
  const modalTriggers = document.querySelectorAll('[data-modal-target]');
  const modalCloses = document.querySelectorAll('.modal-close, [data-modal-close]');

  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = trigger.getAttribute('data-modal-target');
      const targetModal = document.getElementById(targetId);
      if (targetModal) {
        targetModal.classList.add('active');
      }
    });
  });

  modalCloses.forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
      const activeModal = closeBtn.closest('.modal-overlay');
      if (activeModal) {
        activeModal.classList.remove('active');
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      e.target.classList.remove('active');
    }
  });
}

/* Global Toast Notification System */
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  const iconClass = type === 'success' ? 'fa-circle-check' : 'fa-circle-info';
  toast.innerHTML = `<i class="fa-solid ${iconClass}"></i> <span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.4s ease';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

/* Hero Section Slider Logic */
function initHeroSlider() {
  const bgSlides = document.querySelectorAll('.hero-slide-bg');
  const contentSlides = document.querySelectorAll('.hero-slide-content');
  const dots = document.querySelectorAll('.hero-slider-dots .dot');
  const prevBtn = document.querySelector('.slider-arrow.prev');
  const nextBtn = document.querySelector('.slider-arrow.next');
  const currentCounter = document.querySelector('.hero-slider-counter .current-slide');
  const heroSection = document.getElementById('heroSliderSection');

  if (bgSlides.length === 0) return;

  let currentSlide = 0;
  const totalSlides = bgSlides.length;
  let autoplayTimer = null;

  function goToSlide(index) {
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;

    currentSlide = index;

    // Update Background Slides
    bgSlides.forEach((slide, i) => {
      if (i === currentSlide) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    // Update Content Slides
    contentSlides.forEach((content, i) => {
      if (i === currentSlide) {
        content.classList.add('active');
        if (typeof gsap !== 'undefined') {
          gsap.fromTo(content, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
        }
      } else {
        content.classList.remove('active');
      }
    });

    // Update Navigation Dots
    dots.forEach((dot, i) => {
      if (i === currentSlide) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    // Update Slide Counter
    if (currentCounter) {
      currentCounter.textContent = `0${currentSlide + 1}`;
    }
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(() => {
      goToSlide(currentSlide + 1);
    }, 6000);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      goToSlide(currentSlide + 1);
      startAutoplay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      goToSlide(currentSlide - 1);
      startAutoplay();
    });
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goToSlide(i);
      startAutoplay();
    });
  });

  if (heroSection) {
    heroSection.addEventListener('mouseenter', stopAutoplay);
    heroSection.addEventListener('mouseleave', startAutoplay);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        goToSlide(currentSlide + 1);
        startAutoplay();
      } else if (e.key === 'ArrowLeft') {
        goToSlide(currentSlide - 1);
        startAutoplay();
      }
    });
  }

  // Start automatic rotation
  startAutoplay();
}
