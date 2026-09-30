/**
 * STACKLY LOGISTICS - MAIN JAVASCRIPT
 * Handles general interactivity, animations, testimonials, FAQ, forms, and 404 redirects
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initTestimonialSlider();
  initFaqAccordion();
  initFormRedirections();
  initDeadLinkInterceptors();
  initMagneticButtons();
  updateNavUserStatus();
});

/* 1. Navbar Sticky & Mobile Drawer */
function initNavbar() {
  const navbar = document.querySelector('.navbar-logo-left');
  const menuBtn = document.querySelector('.menu-button');
  const navMenu = document.querySelector('.nav-menu-wrapper');

  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  if (menuBtn && navMenu) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      menuBtn.setAttribute('aria-expanded', isOpen);
      if (isOpen) {
        menuBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
      } else {
        menuBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
      }
    });

    // Close when clicking any nav link
    const navLinks = navMenu.querySelectorAll('.nav-link, a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 991) {
          navMenu.classList.remove('open');
          menuBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
        }
      });
    });

    // Close on resize to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 991 && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        menuBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
      }
    });
  }
}

/* 2. Testimonial Slider */
function initTestimonialSlider() {
  const slides = document.querySelectorAll('.testimonial-slider-item');
  const prevBtn = document.querySelector('.testimonial-arrow.left');
  const nextBtn = document.querySelector('.testimonial-arrow:not(.left)');
  const dotsContainer = document.querySelector('.slider-dots');

  if (!slides.length) return;

  let currentIndex = 0;
  let autoplayInterval;

  // Build dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('div');
      dot.className = `slider-dot ${idx === 0 ? 'active' : ''}`;
      dot.addEventListener('click', () => showSlide(idx));
      dotsContainer.appendChild(dot);
    });
  }

  function showSlide(index) {
    slides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === index);
    });

    const dots = document.querySelectorAll('.slider-dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === index);
    });

    currentIndex = index;
  }

  function nextSlide() {
    let nextIndex = (currentIndex + 1) % slides.length;
    showSlide(nextIndex);
  }

  function prevSlide() {
    let prevIndex = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(prevIndex);
  }

  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoplay(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoplay(); });

  function startAutoplay() {
    autoplayInterval = setInterval(nextSlide, 6000);
  }

  function resetAutoplay() {
    clearInterval(autoplayInterval);
    startAutoplay();
  }

  // Initialize first slide & autoplay
  showSlide(0);
  startAutoplay();
}

/* 3. FAQ Accordion */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (question && answer) {
      question.addEventListener('click', (e) => {
        e.preventDefault();
        const isOpen = item.classList.contains('active');

        // Close other FAQ items
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherAnswer = otherItem.querySelector('.faq-answer');
            if (otherAnswer) otherAnswer.style.maxHeight = null;
          }
        });

        // Toggle current item
        if (isOpen) {
          item.classList.remove('active');
          answer.style.maxHeight = null;
        } else {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 30 + 'px';
        }
      });
    }
  });
}

/* 4. Form Redirection to 404 (Per User Specification)
   "every form should redirect tto 404 page after getting valid credentials except login form and use forgert button and sign up page also"
*/
function initFormRedirections() {
  const formsToRedirect = document.querySelectorAll('form:not(#loginForm):not(#signupForm):not(#forgotForm)');

  formsToRedirect.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Basic validation
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      showToast('Processing request...', 'info');

      setTimeout(() => {
        // Redirect to 404 as requested
        window.location.href = '404.html';
      }, 700);
    });
  });
}

/* 5. Dead Links & Buttons Interceptor (Redirecting to 404.html)
   "all unrelated unwanted links should be redirected to 404 page even butons tht dosent have the page to redirect"
*/
function initDeadLinkInterceptors() {
  document.addEventListener('click', (e) => {
    // Explicitly handle all arrow buttons (.provide-icon)
    const provideIcon = e.target.closest('.provide-icon');
    if (provideIcon) {
      e.preventDefault();
      e.stopPropagation();
      window.location.href = '404.html';
      return;
    }

    const targetLink = e.target.closest('a');
    const targetBtn = e.target.closest('button');

    if (targetLink) {
      const href = targetLink.getAttribute('href');
      // If link is placeholder "#" or empty or javascript:void(0) and not an anchor with id or slider control
      if (href === '#' || href === '' || href === 'javascript:void(0)') {
        if (!targetLink.classList.contains('faq-question') && 
            !targetLink.classList.contains('testimonial-arrow') && 
            !targetLink.classList.contains('w-lightbox') &&
            !targetLink.dataset.toggle) {
          e.preventDefault();
          window.location.href = '404.html';
        }
      }
    }
  });
}

/* 6. Magnetic Button & Hover Effect */
function initMagneticButtons() {
  const magnets = document.querySelectorAll('.is-magnetic');

  magnets.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = `translate(0px, 0px)`;
    });
  });
}

/* 7. Update Navbar User Status if Logged In */
function updateNavUserStatus() {
  const user = JSON.parse(localStorage.getItem('stackly_user'));
  const desktopAuthSlots = document.querySelectorAll('.desktop-auth-slot');
  const mobileAuthSlots = document.querySelectorAll('.nav-auth-slot');

  if (user && user.username) {
    const dashboardLink = user.role === 'admin' ? 'admin-dashboard.html' : 'client-dashboard.html';

    // 1. Desktop Topbar View
    desktopAuthSlots.forEach(slot => {
      slot.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
          <a href="${dashboardLink}" class="nav-user-badge">
            <span class="avatar-dot"></span>
            <span>${user.username}</span>
          </a>
          <div class="btn-wrapper">
            <div class="button-hover-bg"></div>
            <a href="${dashboardLink}" class="primary-button reverse-color" style="padding: 10px 20px; font-size: 14px;">
              <div class="button-content">
                <div class="button-color color-white">Dashboard</div>
              </div>
            </a>
          </div>
        </div>
      `;
    });

    // 2. Mobile Drawer View
    mobileAuthSlots.forEach(slot => {
      slot.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 10px; width: 100%;">
          <div class="nav-user-badge" style="width: 100%; justify-content: center; padding: 10px 16px; font-size: 14px;">
            <span class="avatar-dot"></span>
            <span>Signed in as <strong>${user.username}</strong></span>
          </div>
          <div style="display: flex; gap: 10px; width: 100%;">
            <a href="${dashboardLink}" class="primary-button reverse-color" style="flex: 1; text-align: center; padding: 12px; font-size: 14px; box-shadow: none;">
              <div class="button-content">
                <div class="button-color color-white">Dashboard</div>
              </div>
            </a>
            <button class="primary-button outline btn-nav-logout" style="padding: 12px 18px; font-size: 14px; cursor: pointer;">
              Logout
            </button>
          </div>
        </div>
      `;
    });

    // Wire up nav logout buttons
    document.querySelectorAll('.btn-nav-logout').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('stackly_user');
        showToast('Signed out successfully', 'info');
        setTimeout(() => {
          window.location.reload();
        }, 400);
      });
    });

  } else {
    // Guest (Not Logged In)
    desktopAuthSlots.forEach(slot => {
      slot.innerHTML = `
        <div class="btn-wrapper">
          <div class="button-hover-bg"></div>
          <a href="login.html" class="primary-button reverse-color" style="padding: 10px 24px; font-size: 14px;">
            <div class="button-content">
              <div class="button-color color-white">Login</div>
            </div>
          </a>
        </div>
      `;
    });

    mobileAuthSlots.forEach(slot => {
      slot.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 10px; width: 100%;">
          <a href="login.html" class="primary-button reverse-color" style="width: 100%; text-align: center; padding: 12px 20px; box-shadow: none;">
            <div class="button-content">
              <div class="button-color color-white">Login to Account</div>
            </div>
          </a>
          <a href="signup.html" class="primary-button outline" style="width: 100%; text-align: center; padding: 12px 20px;">
            <div class="button-content">
              <div>Create Account</div>
            </div>
          </a>
        </div>
      `;
    });
  }
}

/* Toast Helper */
function showToast(message, type = 'success') {
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
