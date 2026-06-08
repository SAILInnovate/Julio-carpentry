/* ============================================================
   JULIO CARPENTER — Interactive Scripts
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------
     NAV — Scroll shrink + mobile toggle
     --------------------------------------------------------- */
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  const whatsappFloat = document.getElementById('whatsapp-float');

  let lastScroll = 0;

  function onScroll() {
    const y = window.scrollY;

    // Nav background
    if (y > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    // WhatsApp float visibility
    if (y > 500) {
      whatsappFloat.classList.add('visible');
    } else {
      whatsappFloat.classList.remove('visible');
    }

    lastScroll = y;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  // Mobile nav toggle
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  // Close mobile nav on link click
  navLinks.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });


  /* ---------------------------------------------------------
     SCROLL REVEAL — IntersectionObserver
     --------------------------------------------------------- */
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => revealObserver.observe(el));


  /* ---------------------------------------------------------
     PORTFOLIO — Filter
     --------------------------------------------------------- */
  const filterBtns = document.querySelectorAll('.portfolio__filter');
  const portfolioItems = document.querySelectorAll('.portfolio__item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      portfolioItems.forEach((item, i) => {
        const cat = item.dataset.category;
        if (filter === 'all' || cat === filter) {
          item.style.transitionDelay = `${i * 0.05}s`;
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
          item.style.pointerEvents = 'auto';
          // Reset grid spans for mobile
          item.style.display = '';
        } else {
          item.style.transitionDelay = '0s';
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          item.style.pointerEvents = 'none';
          // On mobile, hide completely
          setTimeout(() => {
            if (!item.style.opacity || item.style.opacity === '0') {
              item.style.display = 'none';
            }
          }, 350);
        }
      });
    });
  });


  /* ---------------------------------------------------------
     LIGHTBOX
     --------------------------------------------------------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');

  portfolioItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  lightboxClose.addEventListener('click', (e) => {
    e.stopPropagation();
    closeLightbox();
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) {
      closeLightbox();
    }
  });


  /* ---------------------------------------------------------
     SMOOTH SCROLL — for anchor links
     --------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = nav.offsetHeight + 20;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* ---------------------------------------------------------
     TOUCH ENHANCEMENTS — Portfolio items on mobile
     --------------------------------------------------------- */
  if ('ontouchstart' in window) {
    portfolioItems.forEach(item => {
      item.addEventListener('touchstart', function() {
        // Remove active from siblings
        portfolioItems.forEach(other => {
          if (other !== this) other.classList.remove('touch-active');
        });
        this.classList.toggle('touch-active');
      }, { passive: true });
    });
  }

});
