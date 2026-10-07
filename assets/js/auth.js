/* ==========================================================================
   NEO OCULAR - AUTHENTICATION & ROLE-BASED DASHBOARD SYSTEM
   Patient & Doctor Access, Role Switching, and Dashboard Redirection
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initRoleSelection();
  initFormToggle();
  initAuthSubmit();
  initPasswordReset();
});

/* Role Selection: Patient vs Doctor */
function initRoleSelection() {
  const roleBtns = document.querySelectorAll('.auth-role-btn');
  const roleInput = document.getElementById('authRoleInput');
  const emailInput = document.getElementById('loginEmail');
  const passInput = document.getElementById('loginPassword');
  const portalSubTitle = document.getElementById('portalSubTitle');
  const portalTypeTitle = document.getElementById('portalTypeTitle');
  const portalSubText = document.getElementById('portalSubText');

  roleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle button active styling
      roleBtns.forEach(b => {
        b.classList.remove('active');
        b.style.background = 'rgba(255, 255, 255, 0.75)';
        b.style.color = '#141619';
        b.style.border = '1px solid rgba(255, 255, 255, 0.95)';
        b.style.boxShadow = '0 4px 15px rgba(0,0,0,0.04)';
      });

      btn.classList.add('active');
      btn.style.background = '#141619';
      btn.style.color = '#FFFFFF';
      btn.style.border = 'none';
      btn.style.boxShadow = '0 6px 18px rgba(20,22,25,0.25)';

      const role = btn.getAttribute('data-role');
      if (roleInput) roleInput.value = role;

      if (role === 'doctor') {
        if (portalSubTitle) portalSubTitle.textContent = 'DOCTOR SIGN IN';
        if (portalTypeTitle) portalTypeTitle.textContent = 'Practitioner Access';
        if (portalSubText) portalSubText.textContent = 'Clinical records & diagnostic suite portal.';
        if (emailInput) { emailInput.value = ''; emailInput.placeholder = 'name@example.com'; }
        if (passInput) { passInput.value = ''; }
        if (typeof showToast === 'function') {
          showToast('Selected DOCTOR role.', 'info');
        }
      } else {
        if (portalSubTitle) portalSubTitle.textContent = 'PATIENT SIGN IN';
        if (portalTypeTitle) portalTypeTitle.textContent = 'Welcome Back';
        if (portalSubText) portalSubText.textContent = 'Your vision journey continues here.';
        if (emailInput) { emailInput.value = ''; emailInput.placeholder = 'name@example.com'; }
        if (passInput) { passInput.value = ''; }
        if (typeof showToast === 'function') {
          showToast('Selected PATIENT role.', 'info');
        }
      }
    });
  });
}

/* Switch between Sign In, Register, and Recovery views */
function initFormToggle() {
  const toggleLinks = document.querySelectorAll('[data-auth-toggle]');
  const loginFormView = document.getElementById('loginFormView');
  const registerFormView = document.getElementById('registerFormView');
  const recoveryFormView = document.getElementById('recoveryFormView');

  toggleLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const target = link.getAttribute('data-auth-toggle');
      if (!target) return;
      e.preventDefault();

      if (loginFormView) loginFormView.style.display = 'none';
      if (registerFormView) registerFormView.style.display = 'none';
      if (recoveryFormView) recoveryFormView.style.display = 'none';

      if (target === 'register') {
        if (registerFormView) registerFormView.style.display = 'block';
      } else if (target === 'recovery') {
        if (recoveryFormView) recoveryFormView.style.display = 'block';
      } else {
        if (loginFormView) loginFormView.style.display = 'block';
      }
    });
  });
}

/* Auth Submit & Redirection to Respective Dashboard */
function initAuthSubmit() {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail')?.value;
      const role = document.getElementById('authRoleInput')?.value || 'patient';

      const userName = role === 'doctor' ? 'Dr. Elena Rostova, MD' : 'Sarah Jenkins';
      const redirectPage = role === 'doctor' ? 'doctor_dashboard.html' : 'patient_dashboard.html';

      const userSession = {
        email: email || (role === 'doctor' ? 'dr.elena.rostova@neoocular.com' : 'patient.sarah@neoocular.com'),
        name: userName,
        role: role,
        loggedIn: true,
        loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      localStorage.setItem('neo_user', JSON.stringify(userSession));

      if (typeof showToast === 'function') {
        showToast(`Welcome back, ${userName}! Redirecting to ${role.toUpperCase()} Dashboard...`, 'success');
      }

      setTimeout(() => {
        window.location.href = redirectPage;
      }, 700);
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const regName = document.getElementById('regName')?.value || 'New User';
      const regEmail = document.getElementById('regEmail')?.value || '';

      if (typeof showToast === 'function') {
        showToast(`Account successfully created for ${regName}! Please sign in to continue.`, 'success');
      }

      setTimeout(() => {
        const loginFormView = document.getElementById('loginFormView');
        const registerFormView = document.getElementById('registerFormView');
        const recoveryFormView = document.getElementById('recoveryFormView');

        if (registerFormView) registerFormView.style.display = 'none';
        if (recoveryFormView) recoveryFormView.style.display = 'none';
        if (loginFormView) loginFormView.style.display = 'block';

        const loginEmail = document.getElementById('loginEmail');
        if (loginEmail && regEmail) {
          loginEmail.value = regEmail;
        }

        registerForm.reset();
      }, 600);
    });
  }
}

/* Password Reset Form Handling */
function initPasswordReset() {
  const recoveryForm = document.getElementById('recoveryForm');
  if (recoveryForm) {
    recoveryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('resetEmail')?.value;
      if (typeof showToast === 'function') {
        showToast(`Password reset link sent to ${email || 'your email address'}!`, 'success');
      }
      recoveryForm.reset();
    });
  }
}
