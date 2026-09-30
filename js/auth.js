/**
 * STACKLY LOGISTICS - AUTHENTICATION & USER MANAGEMENT
 * Extracts user name from Gmail/Email and routes to appropriate dashboard
 */

document.addEventListener('DOMContentLoaded', () => {
  initAuthTabs();
  initLoginForm();
  initSignupForm();
  initForgotForm();
  initDemoCredentials();
});

/* Helper: Extract username from Gmail / Email address */
function extractUsernameFromEmail(email) {
  if (!email || !email.includes('@')) return 'User';
  const localPart = email.split('@')[0];
  // Clean dots, dashes or underscores for display if needed, or keep clean handle
  return localPart;
}

/* 1. Login Tabs (Admin vs Client) */
function initAuthTabs() {
  const tabs = document.querySelectorAll('.auth-tab');
  const roleInput = document.getElementById('userRole');

  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      const role = tab.dataset.role;
      if (roleInput) roleInput.value = role;

      const titleEl = document.getElementById('loginTitle');
      const badgeEl = document.getElementById('loginRoleBadge');

      if (role === 'admin') {
        if (titleEl) titleEl.textContent = 'Admin Portal Login';
        if (badgeEl) badgeEl.textContent = 'System Administration';
      } else {
        if (titleEl) titleEl.textContent = 'Client Freight Portal';
        if (badgeEl) badgeEl.textContent = 'Shipper & Customer Portal';
      }
    });
  });
}

/* 2. Login Form Submission */
function initLoginForm() {
  const loginForm = document.getElementById('loginForm');
  if (!loginForm) return;

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    const roleInput = document.getElementById('userRole');

    const email = emailInput ? emailInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value.trim() : '';
    const role = roleInput ? roleInput.value : 'client';

    if (!email || !password) {
      showToast('Please fill in both email and password', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters long', 'error');
      return;
    }

    // Extract user name directly from email (Gmail address)
    const username = extractUsernameFromEmail(email);

    // Save user session in localStorage
    const userSession = {
      email: email,
      username: username,
      role: role,
      loginAt: new Date().toISOString()
    };

    localStorage.setItem('stackly_user', JSON.stringify(userSession));

    showToast(`Welcome, ${username}! Logging in to ${role === 'admin' ? 'Admin' : 'Client'} Dashboard...`, 'success');

    setTimeout(() => {
      if (role === 'admin') {
        window.location.href = 'admin-dashboard.html';
      } else {
        window.location.href = 'client-dashboard.html';
      }
    }, 800);
  });
}

/* 3. Signup Form Submission */
function initSignupForm() {
  const signupForm = document.getElementById('signupForm');
  if (!signupForm) return;

  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('signupName');
    const emailInput = document.getElementById('signupEmail');
    const companyInput = document.getElementById('signupCompany');
    const passwordInput = document.getElementById('signupPassword');
    const termsCheck = document.getElementById('signupTerms');

    if (passwordInput && passwordInput.value.trim().length < 6) {
      showToast('Password must be at least 6 characters long', 'error');
      return;
    }

    if (termsCheck && !termsCheck.checked) {
      showToast('Please agree to the Terms & Privacy Policy', 'error');
      return;
    }

    const email = emailInput ? emailInput.value.trim() : '';
    const name = nameInput ? nameInput.value.trim() : '';
    const username = extractUsernameFromEmail(email) || name;

    const userSession = {
      email: email,
      username: username,
      name: name,
      company: companyInput ? companyInput.value.trim() : 'Stackly Partner',
      role: 'client',
      loginAt: new Date().toISOString()
    };

    localStorage.setItem('stackly_user', JSON.stringify(userSession));

    showToast(`Account created successfully for ${username}! Redirecting...`, 'success');

    setTimeout(() => {
      window.location.href = 'client-dashboard.html';
    }, 900);
  });
}

/* 4. Forgot Password Form */
function initForgotForm() {
  const forgotForm = document.getElementById('forgotForm');
  if (!forgotForm) return;

  forgotForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const emailInput = document.getElementById('forgotEmail');
    const email = emailInput ? emailInput.value.trim() : '';

    if (!email) {
      showToast('Please enter your registered Gmail address', 'error');
      return;
    }

    const successBox = document.getElementById('forgotSuccess');
    if (successBox) {
      forgotForm.style.display = 'none';
      successBox.style.display = 'block';
    } else {
      showToast(`Password reset link sent to ${email}`, 'success');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 2000);
    }
  });
}

/* 5. Demo Autofill Helpers for Easy Testing */
function initDemoCredentials() {
  const btnAdmin = document.getElementById('demoAdminBtn');
  const btnClient = document.getElementById('demoClientBtn');

  if (btnAdmin) {
    btnAdmin.addEventListener('click', () => {
      const emailInput = document.getElementById('loginEmail');
      const passInput = document.getElementById('loginPassword');
      const roleInput = document.getElementById('userRole');
      const adminTab = document.querySelector('.auth-tab[data-role="admin"]');

      if (adminTab) adminTab.click();
      if (emailInput) emailInput.value = 'admin.stackly@gmail.com';
      if (passInput) passInput.value = 'StacklyAdmin2026!';
      if (roleInput) roleInput.value = 'admin';

      showToast('Autofilled Admin Credentials', 'info');
    });
  }

  if (btnClient) {
    btnClient.addEventListener('click', () => {
      const emailInput = document.getElementById('loginEmail');
      const passInput = document.getElementById('loginPassword');
      const roleInput = document.getElementById('userRole');
      const clientTab = document.querySelector('.auth-tab[data-role="client"]');

      if (clientTab) clientTab.click();
      if (emailInput) emailInput.value = 'john.walker@gmail.com';
      if (passInput) passInput.value = 'FreightClient99!';
      if (roleInput) roleInput.value = 'client';

      showToast('Autofilled Client Credentials', 'info');
    });
  }
}
