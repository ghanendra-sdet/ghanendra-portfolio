/**
 * ============================================================
 *  Ghanendra Yadav — Portfolio Script
 *  Pure vanilla ES6+ · No external dependencies
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* --------------------------------------------------------
   *  0. UTILITIES
   * ------------------------------------------------------ */

  /**
   * Debounce — limits the rate a function can fire.
   * @param {Function} fn  Callback
   * @param {number}   ms  Delay in milliseconds
   */
  const debounce = (fn, ms = 100) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), ms);
    };
  };

  /**
   * Ease-out quad — decelerating curve for counter animation.
   */
  const easeOutQuad = (t) => t * (2 - t);

  /* --------------------------------------------------------
   *  1. PARTICLE BACKGROUND (Hero)
   * ------------------------------------------------------ */

  const initParticles = () => {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);
    const PARTICLE_COUNT = 90; // 80-100 range
    const CONNECTION_DIST = 120;
    const particles = [];

    /** Create a single particle with random properties */
    const createParticle = () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.4 + 0.2, // 0.2 → 0.6
      hue: Math.random() > 0.5 ? 0 : 210, // white or blue tint
    });

    // Seed particles
    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(createParticle());

    /** Main render loop */
    let rafId = null;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Update & draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle =
          p.hue === 0
            ? `rgba(255, 255, 255, ${p.opacity})`
            : `rgba(100, 180, 255, ${p.opacity})`;
        ctx.fill();

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DIST) {
            const lineOpacity = (1 - dist / CONNECTION_DIST) * 0.25;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(150, 200, 255, ${lineOpacity})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      rafId = requestAnimationFrame(animate);
    };

    animate();

    // Pause when tab is hidden, resume when visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
      } else if (!rafId) {
        animate();
      }
    });

    // Resize handler
    window.addEventListener(
      'resize',
      debounce(() => {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
      }, 200)
    );
  };

  /* --------------------------------------------------------
   *  2. NAVBAR SCROLL EFFECT
   * ------------------------------------------------------ */

  const initNavbar = () => {
    const navbar = document.getElementById('navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelectorAll('#navbar a[href^="#"]');
    const sections = document.querySelectorAll('section[id]');
    if (!navbar) return;

    // --- Scroll class ---
    const handleScroll = () => {
      navbar.classList.toggle('nav-scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initial check

    // --- Active link via IntersectionObserver ---
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0,
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.classList.toggle(
              'active',
              link.getAttribute('href') === `#${id}`
            );
          });
        }
      });
    }, observerOptions);

    sections.forEach((section) => sectionObserver.observe(section));

    // --- Smooth scroll on link click ---
    navLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        // Close mobile menu after click
        navbar.classList.remove('nav-open');
      });
    });

    // --- Mobile menu toggle ---
    if (navToggle) {
      navToggle.addEventListener('click', () => {
        navbar.classList.toggle('nav-open');
      });
    }
  };

  /* --------------------------------------------------------
   *  3. TYPING ANIMATION
   * ------------------------------------------------------ */

  const initTypingAnimation = () => {
    const el = document.getElementById('typing-text');
    if (!el) return;

    const strings = [
      'Software Test Engineer',
      'QA Automation Expert',
      'AI-Driven Testing Specialist',
      'Playwright Automation Architect',
      'Performance Testing Engineer',
    ];

    const TYPE_SPEED = 80;
    const ERASE_SPEED = 40;
    const PAUSE_BETWEEN = 2000;

    let stringIndex = 0;
    let charIndex = 0;
    let isErasing = false;

    const tick = () => {
      const current = strings[stringIndex];

      if (!isErasing) {
        // Typing forward
        charIndex++;
        el.textContent = current.substring(0, charIndex);

        if (charIndex === current.length) {
          // Finished typing — pause, then erase
          isErasing = true;
          setTimeout(tick, PAUSE_BETWEEN);
          return;
        }
        setTimeout(tick, TYPE_SPEED);
      } else {
        // Erasing
        charIndex--;
        el.textContent = current.substring(0, charIndex);

        if (charIndex === 0) {
          isErasing = false;
          stringIndex = (stringIndex + 1) % strings.length;
          setTimeout(tick, TYPE_SPEED);
          return;
        }
        setTimeout(tick, ERASE_SPEED);
      }
    };

    // Kick off after a brief initial delay
    setTimeout(tick, 500);
  };

  /* --------------------------------------------------------
   *  4. COUNTER ANIMATION
   * ------------------------------------------------------ */

  const initCounters = () => {
    const counters = document.querySelectorAll('.stat-number');
    if (!counters.length) return;

    let hasAnimated = false;
    const DURATION = 2000; // ms

    const animateCounters = () => {
      if (hasAnimated) return;
      hasAnimated = true;

      counters.forEach((counter) => {
        const target = parseFloat(counter.getAttribute('data-target'));
        const suffix = counter.getAttribute('data-suffix') || '';
        const isDecimal = target % 1 !== 0;
        const start = performance.now();

        const step = (now) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / DURATION, 1);
          const raw = easeOutQuad(progress) * target;
          const value = isDecimal
            ? raw.toFixed(1)
            : Math.floor(raw);

          counter.textContent = `${value}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            counter.textContent = `${isDecimal ? target.toFixed(1) : target}${suffix}`;
          }
        };

        requestAnimationFrame(step);
      });
    };

    // Trigger when hero section enters viewport
    const heroSection =
      document.getElementById('hero') || document.querySelector('.hero');
    if (!heroSection) {
      // Fallback: animate immediately
      animateCounters();
      return;
    }

    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounters();
            counterObserver.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    counterObserver.observe(heroSection);
  };

  /* --------------------------------------------------------
   *  4b. PAYWIZE SPOTLIGHT COUNTERS
   * ------------------------------------------------------ */

  const initPaywizeCounters = () => {
    const paywizeNums = document.querySelectorAll('.paywize-num');
    if (!paywizeNums.length) return;

    const DURATION = 1800;

    const animateNum = (el) => {
      const target = parseFloat(el.getAttribute('data-target'));
      const suffix = el.getAttribute('data-suffix') || '';
      const isDecimal = target % 1 !== 0;
      const start = performance.now();

      const step = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / DURATION, 1);
        const raw = easeOutQuad(progress) * target;
        const value = isDecimal ? raw.toFixed(1) : Math.floor(raw);
        el.textContent = `${value}${suffix}`;
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = `${isDecimal ? target.toFixed(1) : target}${suffix}`;
        }
      };
      requestAnimationFrame(step);
    };

    const spotlightSection = document.querySelector('.paywize-spotlight-section');
    if (!spotlightSection) return;

    let animated = false;
    const spotlightObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animated) {
            animated = true;
            paywizeNums.forEach((el) => animateNum(el));
            spotlightObserver.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    spotlightObserver.observe(spotlightSection);
  };

  /* --------------------------------------------------------
   *  5. SCROLL REVEAL ANIMATIONS
   * ------------------------------------------------------ */

  const initScrollReveal = () => {
    const revealElements = document.querySelectorAll(
      '.reveal, .reveal-left, .reveal-right'
    );
    if (!revealElements.length) return;

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            el.classList.add('active');

            // Stagger children in grid/flex containers
            const parent = el.parentElement;
            if (parent) {
              const siblings = Array.from(
                parent.querySelectorAll('.reveal, .reveal-left, .reveal-right')
              );
              const idx = siblings.indexOf(el);
              if (idx > 0) {
                el.style.transitionDelay = `${idx * 0.1}s`;
              }
            }

            revealObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  };

  /* --------------------------------------------------------
   *  6. SKILL BAR ANIMATION
   * ------------------------------------------------------ */

  const initSkillBars = () => {
    const bars = document.querySelectorAll('.skill-progress');
    if (!bars.length) return;

    const skillObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const bar = entry.target;
            const progress =
              bar.getAttribute('data-progress') ||
              getComputedStyle(bar).getPropertyValue('--progress')?.trim();

            if (progress) {
              // Ensure width starts from 0, then transitions to target
              bar.style.width = '0%';
              // Force reflow so the browser registers the 0% state
              void bar.offsetWidth;
              bar.style.width = progress.includes('%')
                ? progress
                : `${progress}%`;
            }

            skillObserver.unobserve(bar);
          }
        });
      },
      { threshold: 0.2 }
    );

    bars.forEach((bar) => skillObserver.observe(bar));
  };

  /* --------------------------------------------------------
   *  7. TESTIMONIALS CAROUSEL
   * ------------------------------------------------------ */

  const initTestimonials = () => {
    const track = document.querySelector('.testimonials-track');
    if (!track) return;

    const dots = document.querySelectorAll('.testimonial-dot');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    const slides = track.children;
    const slideCount = slides.length;

    if (slideCount === 0) return;

    let currentIndex = 0;
    let autoPlayTimer = null;
    const AUTO_PLAY_INTERVAL = 5000;

    /** Move the track to show the slide at `index` */
    const goToSlide = (index) => {
      currentIndex = ((index % slideCount) + slideCount) % slideCount;
      track.style.transform = `translateX(-${currentIndex * 100}%)`;

      // Update active dot
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    };

    /** Start auto-play */
    const startAutoPlay = () => {
      stopAutoPlay();
      autoPlayTimer = setInterval(() => {
        goToSlide(currentIndex + 1);
      }, AUTO_PLAY_INTERVAL);
    };

    /** Stop auto-play */
    const stopAutoPlay = () => {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
      }
    };

    // Dot navigation
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        goToSlide(i);
        startAutoPlay(); // reset timer
      });
    });

    // Prev / Next buttons
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        goToSlide(currentIndex - 1);
        startAutoPlay();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        goToSlide(currentIndex + 1);
        startAutoPlay();
      });
    }

    // Pause on hover
    const carouselContainer =
      track.closest('.testimonials-carousel') ||
      track.closest('.testimonials') ||
      track.parentElement;
    if (carouselContainer) {
      carouselContainer.addEventListener('mouseenter', stopAutoPlay);
      carouselContainer.addEventListener('mouseleave', startAutoPlay);
    }

    // Initial state
    goToSlide(0);
    startAutoPlay();
  };

  /* --------------------------------------------------------
   *  8. CONTACT FORM (Visual Only)
   * ------------------------------------------------------ */

  const initContactForm = () => {
    const form = document.getElementById('contact-form');
    if (!form) return;

    // --- Floating label effect ---
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach((input) => {
      // Check if already has value (e.g. autofill)
      const toggle = () => {
        input.classList.toggle('has-value', input.value.trim().length > 0);
      };
      input.addEventListener('input', toggle);
      input.addEventListener('blur', toggle);
      toggle(); // initial
    });

    // --- Submit handler ---
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Disable submit button to prevent double-submit
      const submitBtn = form.querySelector('button[type="submit"], .submit-btn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.dataset.originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending…';
      }

      // Simulate send delay, then show success
      setTimeout(() => {
        // Create success message
        const successMsg = document.createElement('div');
        successMsg.className = 'form-success';
        successMsg.innerHTML = `
          <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M8 12l3 3 5-5"/>
          </svg>
          <p>Thank you! Your message has been sent successfully.</p>
        `;

        // Replace form content with success
        form.style.position = 'relative';
        successMsg.style.cssText = `
          position: absolute; inset: 0;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 1rem; color: #64ffda;
          background: inherit; border-radius: inherit;
          animation: fadeInScale 0.5s ease forwards;
          text-align: center; padding: 2rem;
        `;
        form.appendChild(successMsg);

        // Inject keyframes if not already present
        if (!document.getElementById('form-success-keyframes')) {
          const style = document.createElement('style');
          style.id = 'form-success-keyframes';
          style.textContent = `
            @keyframes fadeInScale {
              from { opacity: 0; transform: scale(0.8); }
              to   { opacity: 1; transform: scale(1); }
            }
          `;
          document.head.appendChild(style);
        }

        // Reset form after a delay
        setTimeout(() => {
          form.reset();
          inputs.forEach((input) => input.classList.remove('has-value'));
          if (successMsg.parentNode) successMsg.remove();
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = submitBtn.dataset.originalText || 'Send';
          }
        }, 4000);
      }, 1000);
    });
  };

  /* --------------------------------------------------------
   *  9. BACK TO TOP BUTTON
   * ------------------------------------------------------ */

  const initBackToTop = () => {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    const SHOW_THRESHOLD = 500;

    const toggleVisibility = () => {
      btn.classList.toggle('visible', window.scrollY > SHOW_THRESHOLD);
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    toggleVisibility(); // initial

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  /* --------------------------------------------------------
   *  10. THEME TOGGLE (LIGHT / DARK MODE)
   * ------------------------------------------------------ */

  const initThemeToggle = () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (!themeToggleBtn) return;

    // Check saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

    if (savedTheme === 'light' || (!savedTheme && systemPrefersLight)) {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }

    themeToggleBtn.addEventListener('click', () => {
      const isLight = document.body.classList.toggle('light-mode');
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
  };

  /* --------------------------------------------------------
   *  11. PAGE LOAD
   * ------------------------------------------------------ */

  const initPageLoad = () => {
    // Add `.loaded` class to trigger CSS entry animations
    document.body.classList.add('loaded');
  };

  /* --------------------------------------------------------
   *  BOOTSTRAP — fire everything
   * ------------------------------------------------------ */

  initPageLoad();
  initParticles();
  initNavbar();
  initThemeToggle();
  initTypingAnimation();
  initCounters();
  initPaywizeCounters();
  initScrollReveal();
  initSkillBars();
  initTestimonials();
  initContactForm();
  initBackToTop();
});

